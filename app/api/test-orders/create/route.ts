import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.type || !data.packages || !data.participants || data.participants.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: type, packages, and participants' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with participants
    const order = await prisma.testOrder.create({
      data: {
        orderNumber,
        type: data.type,
        userId: authUser.userId,
        instansiId: data.instansiId || null,
        packages: data.packages,
        totalParticipants: data.participants.length,
        pricePerPerson: parseFloat(data.pricePerPerson.toString()),
        totalAmount: parseFloat(data.totalAmount.toString()),
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        notes: data.notes || null,
        testParticipants: {
          create: data.participants.map((p: any) => ({
            fullName: p.fullName,
            nickName: p.nickName || null,
            email: p.email,
            dateOfBirth: new Date(p.dateOfBirth),
            gender: p.gender,
            bloodType: p.bloodType || null,
            studentNumber: p.studentNumber || null,
            className: p.className || null,
          })),
        },
      },
      include: {
        testParticipants: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        }
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: authUser.userId,
        action: 'Created test order',
        description: `Created test order ${orderNumber} with ${data.participants.length} participants`,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
