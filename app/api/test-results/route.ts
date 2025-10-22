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
    const characterType = searchParams.get('characterType');
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      testParticipant: {
        testOrder: {
          userId: authUser.userId
        }
      }
    };

    if (characterType) {
      whereClause.characterType = characterType;
    }

    // Fetch test results with pagination
    const [testResults, totalCount] = await Promise.all([
      prisma.testResult.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { completedAt: 'desc' },
        include: {
          testParticipant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              testOrder: {
                select: {
                  id: true,
                  orderNumber: true,
                  type: true,
                  packageType: true,
                }
              }
            }
          },
          certificate: {
            select: {
              id: true,
              certificateNumber: true,
              issuedAt: true,
            }
          }
        }
      }),
      prisma.testResult.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      testResults,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
