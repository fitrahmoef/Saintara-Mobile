// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verifikasi Email Anda - SAINTARA',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">SAINTARA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Halo ${name}!</h2>
          <p>Terima kasih telah mendaftar di SAINTARA. Silakan verifikasi email Anda dengan klik tombol di bawah:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Verifikasi Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Atau copy link berikut ke browser:</p>
          <p style="color: #4facfe; word-break: break-all;">${verifyUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Link ini akan kadaluarsa dalam 24 jam.</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Password - SAINTARA',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">SAINTARA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Halo ${name}!</h2>
          <p>Kami menerima permintaan untuk mereset password Anda. Klik tombol di bawah untuk membuat password baru:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Atau copy link berikut ke browser:</p>
          <p style="color: #f5576c; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Link ini akan kadaluarsa dalam 1 jam.</p>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string, role: string) {
  let dashboardUrl = `${process.env.APP_URL}/customer/dashboard`;
  
  if (role === 'SUPER_ADMIN') {
    dashboardUrl = `${process.env.APP_URL}/super-admin/dashboard`;
  } else if (role === 'ADMIN_INSTANSI') {
    dashboardUrl = `${process.env.APP_URL}/admin-instansi/dashboard`;
  }
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Selamat Datang di SAINTARA!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">SAINTARA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Selamat Datang, ${name}!</h2>
          <p>Akun Anda telah berhasil diverifikasi. Anda sekarang dapat mengakses dashboard.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Buka Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  });
}