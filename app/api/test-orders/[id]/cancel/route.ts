import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user from token
    const authUser = await getUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Fetch the test order to verify ownership and status
    const testOrder = await prisma.testOrder.findUnique({
      where: { id },
      include: {
        payment: true,
      }
    });

    if (!testOrder) {
      return NextResponse.json(
        { error: 'Test order not found' },
        { status: 404 }
      );
    }

    // Check if user owns this test order or is admin
    if (testOrder.userId !== authUser.userId && authUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to cancel this test order' },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    if (testOrder.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Order is already cancelled' },
        { status: 400 }
      );
    }

    if (testOrder.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel a completed order' },
        { status: 400 }
      );
    }

    if (testOrder.status === 'PROCESSING') {
      return NextResponse.json(
        { error: 'Cannot cancel an order that is already being processed. Please contact support.' },
        { status: 400 }
      );
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.testOrder.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      }
    });

    // If there's a payment, update it to CANCELLED as well
    if (testOrder.payment) {
      await prisma.payment.update({
        where: { id: testOrder.payment.id },
        data: {
          status: 'CANCELLED',
        }
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: authUser.userId,
        action: 'Cancelled test order',
        description: `Cancelled test order ${testOrder.orderNumber}`,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error cancelling test order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
