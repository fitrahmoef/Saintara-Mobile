import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMidtransTransactionStatus, mapMidtransStatusToPaymentStatus } from '@/lib/payment';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch payment
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        testOrder: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (payment.userId !== authUser.userId && authUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this payment' },
        { status: 403 }
      );
    }

    // If payment is not finalized, check status from Midtrans
    if (payment.status === 'PENDING' && payment.transactionId) {
      try {
        const midtransStatus = await getMidtransTransactionStatus(payment.transactionId);
        const newStatus = mapMidtransStatusToPaymentStatus(
          midtransStatus.transaction_status,
          midtransStatus.fraud_status
        );

        // Update payment status if changed
        if (newStatus !== payment.status) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: newStatus,
              paidAt: newStatus === 'PAID' ? new Date() : null,
            },
          });

          // Update order status if payment is successful
          if (newStatus === 'PAID') {
            await prisma.testOrder.update({
              where: { id: payment.testOrderId },
              data: { status: 'PAID' },
            });

            // Log activity
            await prisma.activity.create({
              data: {
                userId: authUser.userId,
                action: 'Payment completed',
                description: `Payment completed for order ${payment.testOrder.orderNumber}`,
              },
            });
          }

          payment.status = newStatus;
          if (newStatus === 'PAID') {
            payment.paidAt = new Date();
          }
        }
      } catch (midtransError) {
        console.error('Error checking Midtrans status:', midtransError);
        // Continue with current payment status
      }
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
