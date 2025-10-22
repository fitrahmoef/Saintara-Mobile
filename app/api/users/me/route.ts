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

    // Fetch user from database with related data
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        instansiId: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        instansi: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        _count: {
          select: {
            testOrders: true,
            testResults: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'Viewed profile',
        description: 'User accessed their profile information',
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
