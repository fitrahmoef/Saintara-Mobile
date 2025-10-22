import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createMidtransTransaction, MIDTRANS_CONFIG } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, paymentMethod } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch the test order
    const testOrder = await prisma.testOrder.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        payment: true,
      },
    });

    if (!testOrder) {
      return NextResponse.json(
        { error: 'Test order not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (testOrder.userId !== authUser.userId && authUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this order' },
        { status: 403 }
      );
    }

    // Check if order is already paid
    if (testOrder.status === 'PAID' || testOrder.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      );
    }

    // Check if order is cancelled
    if (testOrder.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot pay for a cancelled order' },
        { status: 400 }
      );
    }

    // Check if payment already exists and is pending
    if (testOrder.payment && testOrder.payment.status === 'PENDING') {
      return NextResponse.json(
        { error: 'Payment is already pending for this order' },
        { status: 400 }
      );
    }

    // Generate unique payment number
    const paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create or update payment record
    let payment;
    if (testOrder.payment) {
      // Update existing payment
      payment = await prisma.payment.update({
        where: { id: testOrder.payment.id },
        data: {
          status: 'PENDING',
          method: paymentMethod || null,
        },
      });
    } else {
      // Create new payment
      payment = await prisma.payment.create({
        data: {
          paymentNumber,
          testOrderId: testOrder.id,
          userId: authUser.userId,
          amount: testOrder.totalAmount,
          status: 'PENDING',
          method: paymentMethod || null,
        },
      });
    }

    // Prepare Midtrans transaction data
    const transactionData = {
      transaction_details: {
        order_id: payment.id,
        gross_amount: Math.round(Number(testOrder.totalAmount)),
      },
      customer_details: {
        first_name: testOrder.user.fullName,
        email: testOrder.user.email,
        phone: testOrder.user.phone || undefined,
      },
      item_details: [
        {
          id: testOrder.id,
          price: Math.round(Number(testOrder.totalAmount)),
          quantity: 1,
          name: `SAINTARA Test Order ${testOrder.orderNumber}`,
        },
      ],
      callbacks: {
        finish: `${process.env.APP_URL || 'http://localhost:3000'}/customer/payments/success?orderId=${testOrder.id}`,
        error: `${process.env.APP_URL || 'http://localhost:3000'}/customer/payments/failed?orderId=${testOrder.id}`,
        pending: `${process.env.APP_URL || 'http://localhost:3000'}/customer/payments/pending?orderId=${testOrder.id}`,
      },
    };

    // Create Midtrans Snap transaction
    let snapResponse;
    try {
      snapResponse = await createMidtransTransaction(transactionData);
    } catch (midtransError: any) {
      console.error('Midtrans error:', midtransError);

      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      return NextResponse.json(
        { error: 'Failed to initialize payment: ' + midtransError.message },
        { status: 500 }
      );
    }

    // Update payment with Midtrans transaction ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: payment.id, // Using our payment ID as Midtrans order_id
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: authUser.userId,
        action: 'Initiated payment',
        description: `Initiated payment for order ${testOrder.orderNumber}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        snapToken: snapResponse.token,
        redirectUrl: snapResponse.redirect_url,
        clientKey: MIDTRANS_CONFIG.clientKey,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
