import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    // Fetch test order with full details
    const testOrder = await prisma.testOrder.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        payment: true,
        testParticipants: {
          include: {
            testResult: {
              include: {
                certificate: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
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
        { error: 'Forbidden - You do not have access to this test order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ testOrder });
  } catch (error) {
    console.error('Error fetching test order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
