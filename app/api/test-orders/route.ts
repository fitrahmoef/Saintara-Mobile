import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      userId: authUser.userId
    };

    if (status) {
      whereClause.status = status;
    }

    // Fetch test orders with pagination
    const [testOrders, totalCount] = await Promise.all([
      prisma.testOrder.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              paymentMethod: true,
              paidAt: true,
            }
          },
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            }
          },
          _count: {
            select: {
              participants: true,
            }
          }
        }
      }),
      prisma.testOrder.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      testOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching test orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
