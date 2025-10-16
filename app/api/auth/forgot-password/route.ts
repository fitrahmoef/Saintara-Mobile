// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email wajib diisi' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Jangan beritahu user bahwa email tidak terdaftar (security)
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken, user.fullName);

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_CHANGE',
        description: 'Password reset requested',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Jika email terdaftar, link reset password akan dikirim.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses permintaan' },
      { status: 500 }
    );
  }
}
