import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await request.json();
    
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.testOrder.create({
      data: {
        orderNumber,
        type: data.type,
        userId: payload.userId,
        instansiId: data.instansiId,
        packages: data.packages,
        totalParticipants: data.participants?.length || 1,
        pricePerPerson: data.pricePerPerson,
        totalAmount: data.totalAmount,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        notes: data.notes,
        testParticipants: {
          create: data.participants?.map((p: any) => ({
            fullName: p.fullName,
            nickName: p.nickName,
            email: p.email,
            dateOfBirth: new Date(p.dateOfBirth),
            gender: p.gender,
            bloodType: p.bloodType,
            studentNumber: p.studentNumber,
            className: p.className,
          })) || [],
        },
      },
      include: {
        testParticipants: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
