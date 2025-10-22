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

    // Fetch test result with full details
    const testResult = await prisma.testResult.findUnique({
      where: { id },
      include: {
        testParticipant: {
          include: {
            testOrder: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  }
                }
              }
            }
          }
        },
        certificate: true,
      }
    });

    if (!testResult) {
      return NextResponse.json(
        { error: 'Test result not found' },
        { status: 404 }
      );
    }

    // Check if user owns this test result or is admin
    if (
      testResult.testParticipant.testOrder.userId !== authUser.userId &&
      authUser.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this test result' },
        { status: 403 }
      );
    }

    return NextResponse.json({ testResult });
  } catch (error) {
    console.error('Error fetching test result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
