// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    });

    await sendWelcomeEmail(user.email, user.fullName, user.role);

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'PROFILE_UPDATE',
        description: 'Email verified successfully',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email berhasil diverifikasi! Silakan login.',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Verifikasi gagal' }, { status: 500 });
  }
}