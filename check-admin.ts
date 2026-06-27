import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking admin users...');

  const admins = await prisma.adminUser.findMany();
  console.log(`Found ${admins.length} admin user(s)`);

  if (admins.length === 0) {
    console.log('⚠️ No admin found! Creating default admin...');

    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.adminUser.create({
      data: {
        email: 'admin@explorepenida.com',
        password: hashedPassword,
        nama: 'Administrator',
        role: 'admin',
      },
    });

    console.log('✅ Admin created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
  } else {
    console.log('✅ Admin user(s) already exist:');
    admins.forEach(a => console.log(`   - ${a.email} (${a.nama})`));
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });