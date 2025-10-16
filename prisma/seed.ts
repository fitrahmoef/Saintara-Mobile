import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@saintara.com' },
    update: {},
    create: {
      email: 'superadmin@saintara.com',
      username: 'superadmin',
      password: hashedPassword,
      fullName: 'Super Admin',
      nickName: 'Admin',
      phone: '+6281234567890',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      username: 'customer_demo',
      password: hashedPassword,
      fullName: 'Customer Demo',
      nickName: 'Demo',
      phone: '+6281234567891',
      dateOfBirth: new Date('1995-05-15'),
      gender: 'MALE',
      bloodType: 'A',
      country: 'Indonesia',
      city: 'Jakarta',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const settings = [
    { key: 'SITE_NAME', value: 'SAINTARA', category: 'general' },
    { key: 'PRICE_LAPORAN_UMUM_10', value: '99000', category: 'pricing' },
    { key: 'PRICE_LAPORAN_LENGKAP_25', value: '249000', category: 'pricing' },
    { key: 'PRICE_LENGKAP_35', value: '499000', category: 'pricing' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('Seeding completed!');
  console.log('Login credentials:');
  console.log('  Super Admin: superadmin@saintara.com / password123');
  console.log('  Customer: customer@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
