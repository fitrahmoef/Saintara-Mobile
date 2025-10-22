import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyMidtransSignature,
  mapMidtransStatusToPaymentStatus,
  MidtransNotification,
} from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const notification: MidtransNotification = await request.json();

    console.log('Received Midtrans notification:', notification);

    // Verify signature
    if (!verifyMidtransSignature(notification)) {
      console.error('Invalid Midtrans signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { order_id, transaction_status, fraud_status, payment_type } = notification;

    // Find payment by transaction ID (which is our payment ID)
    const payment = await prisma.payment.findFirst({
      where: { transactionId: order_id },
      include: {
        testOrder: true,
        user: true,
      },
    });

    if (!payment) {
      console.error('Payment not found for order_id:', order_id);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Map Midtrans status to our payment status
    const newStatus = mapMidtransStatusToPaymentStatus(transaction_status, fraud_status);

    console.log(`Updating payment ${payment.id} from ${payment.status} to ${newStatus}`);

    // Update payment
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        method: payment_type,
        paidAt: newStatus === 'PAID' ? new Date() : payment.paidAt,
      },
    });

    // Update test order status if payment is successful
    if (newStatus === 'PAID' && payment.testOrder.status === 'PENDING_PAYMENT') {
      await prisma.testOrder.update({
        where: { id: payment.testOrderId },
        data: { status: 'PAID' },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: payment.userId,
          action: 'Payment completed',
          description: `Payment completed for order ${payment.testOrder.orderNumber} via ${payment_type}`,
        },
      });

      // TODO: Send email notification to user
      console.log(`Payment successful for order ${payment.testOrder.orderNumber}`);
    } else if (newStatus === 'FAILED' || newStatus === 'CANCELLED') {
      // Log activity for failed/cancelled payments
      await prisma.activity.create({
        data: {
          userId: payment.userId,
          action: 'Payment failed',
          description: `Payment ${newStatus.toLowerCase()} for order ${payment.testOrder.orderNumber}`,
        },
      });

      console.log(`Payment ${newStatus.toLowerCase()} for order ${payment.testOrder.orderNumber}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Notification processed',
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
