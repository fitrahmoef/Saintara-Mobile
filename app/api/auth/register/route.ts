import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        nickName: data.nickName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        role: 'CUSTOMER',
        status: 'PENDING_VERIFICATION',
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'REGISTER',
        description: 'User registered successfully',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: { userId: user.id },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
