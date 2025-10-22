import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TestOrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from token
    const authUser = await getUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total test orders count
    const totalTests = await prisma.testOrder.count({
      where: { userId: authUser.userId }
    });

    // Get completed tests count (status = COMPLETED)
    const completedTests = await prisma.testOrder.count({
      where: {
        userId: authUser.userId,
        status: TestOrderStatus.COMPLETED
      }
    });

    // Get pending payments count (status = PENDING_PAYMENT)
    const pendingPayments = await prisma.testOrder.count({
      where: {
        userId: authUser.userId,
        status: TestOrderStatus.PENDING_PAYMENT
      }
    });

    // Get recent test results
    const recentResults = await prisma.testResult.findMany({
      where: {
        testParticipant: {
          testOrder: {
            userId: authUser.userId
          }
        }
      },
      take: 5,
      orderBy: { completedAt: 'desc' },
      include: {
        testParticipant: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    // Get total participants
    const totalParticipants = await prisma.testParticipant.count({
      where: {
        testOrder: {
          userId: authUser.userId
        }
      }
    });

    // Get active test orders (PAID or PROCESSING)
    const activeOrders = await prisma.testOrder.count({
      where: {
        userId: authUser.userId,
        status: {
          in: [TestOrderStatus.PAID, TestOrderStatus.PROCESSING]
        }
      }
    });

    const statistics = {
      totalTests,
      completedTests,
      pendingPayments,
      totalParticipants,
      activeOrders,
      recentResults: recentResults.map(result => ({
        id: result.id,
        participantName: result.testParticipant.name,
        participantEmail: result.testParticipant.email,
        characterType: result.characterType,
        completedAt: result.completedAt,
      }))
    };

    return NextResponse.json({ statistics });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
