import 'dotenv/config';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function main() {
  console.log('🌱 Seeding admin user...');

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@mercerfitness.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123456';
  const adminName = process.env.ADMIN_NAME ?? 'Mercer Admin';

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`⚠️  Admin user already exists: ${adminEmail}`);
    return;
  }

  // Use Better Auth server-side API to create the user (handles password hashing)
  const response = await auth.api.signUpEmail({
    body: {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    },
  });

  if (!response) {
    throw new Error('Failed to create admin user via Better Auth');
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: { role: 'ADMIN' },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`   Email   : ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role    : ADMIN`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
