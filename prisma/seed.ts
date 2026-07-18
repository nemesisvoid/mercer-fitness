import 'dotenv/config';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function main() {
  console.log('🌱 Seeding admin user...');

  // const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@mercerfitness.com';
  // const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123456';
  // const adminName = process.env.ADMIN_NAME ?? 'Mercer Admin';

  // // Check if admin already exists
  // const existing = await prisma.user.findUnique({
  //   where: { email: adminEmail },
  // });

  // if (existing) {
  //   console.log(`⚠️  Admin user already exists: ${adminEmail}`);
  //   return;
  // }

  // // Use Better Auth server-side API to create the user (handles password hashing)
  // const response = await auth.api.signUpEmail({
  //   body: {
  //     name: adminName,
  //     email: adminEmail,
  //     password: adminPassword,
  //   },
  // });

  // if (!response) {
  //   throw new Error('Failed to create admin user via Better Auth');
  // }

  // await prisma.user.update({
  //   where: { email: adminEmail },
  //   data: { role: 'ADMIN' },
  // });

  // console.log('✅ Admin user created successfully!');
  // console.log(`   Email   : ${adminEmail}`);
  // console.log(`   Password: ${adminPassword}`);
  // console.log(`   Role    : ADMIN`);

  // --- Seed Locations ---
  console.log('🌱 Fetching locations...');
  let loc1 = await prisma.location.findFirst({ where: { name: { contains: 'Downtown' } } });
  let loc2 = await prisma.location.findFirst({ where: { name: { contains: 'Westside' } } });

  if (!loc1) loc1 = await prisma.location.create({ data: { name: 'Downtown Studio' } });
  if (!loc2) loc2 = await prisma.location.create({ data: { name: 'Westside Studio' } });

  // Helper to generate a valid date (skips Sundays, ensures specific hours)
  function getValidDate(daysFromNow: number, hour: number) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 0, 0, 0);
    // If it's Sunday (0), move to Monday (1)
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  // --- Seed Classes ---
  console.log('🌱 Seeding classes...');
  
  await prisma.class.createMany({
    data: [
      {
        name: 'Sunset Yoga',
        description: 'Wind down your day with a relaxing sunset yoga session.',
        capacity: 15,
        instructor: 'Noah Brooks',
        startsAt: getValidDate(7, 18), // 1 week from now 6pm
        endsAt: getValidDate(7, 19),
        type: 'YOGA',
        status: 'SCHEDULED',
        locationId: loc1.id,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=3199&auto=format&fit=crop',
      },
      {
        name: 'Weekend Warrior HIIT',
        description: 'Push your limits and kickstart your weekend with intense intervals.',
        capacity: 20,
        instructor: 'Jordan Lee',
        startsAt: getValidDate(8, 9), // 1 week + 1 day 9am
        endsAt: getValidDate(8, 10),
        type: 'HIIT',
        status: 'SCHEDULED',
        locationId: loc2.id,
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=3270&auto=format&fit=crop',
      },
      {
        name: 'Reformer Pilates Basics',
        description: 'Learn the fundamentals of reformer pilates for total body alignment.',
        capacity: 8,
        instructor: 'Avery Kim',
        startsAt: getValidDate(10, 10), // ~1.5 weeks from now 10am
        endsAt: getValidDate(10, 11),
        type: 'PILATES',
        status: 'SCHEDULED',
        locationId: loc1.id,
        image: 'https://images.unsplash.com/photo-1599901860904-17e08c4ea78e?q=80&w=3270&auto=format&fit=crop',
      },
      {
        name: 'Endurance Ride',
        description: 'A 90-minute steady state ride to build your cardiovascular base.',
        capacity: 25,
        instructor: 'Mina Patel',
        startsAt: getValidDate(14, 7), // 2 weeks from now 7am
        endsAt: getValidDate(14, 8),
        type: 'CYCLING',
        status: 'SCHEDULED',
        locationId: loc2.id,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=3270&auto=format&fit=crop',
      },
      {
        name: 'Lunchtime Flow',
        description: 'A quick 45-minute flow to reset your mind and body midday.',
        capacity: 12,
        instructor: 'Noah Brooks',
        startsAt: getValidDate(15, 12), // 2 weeks + 1 day 12pm
        endsAt: getValidDate(15, 13),
        type: 'YOGA',
        status: 'SCHEDULED',
        locationId: loc1.id,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2920&auto=format&fit=crop',
      },
      {
        name: 'Advanced Pilates Flow',
        description: 'Challenge your core with advanced continuous movements.',
        capacity: 10,
        instructor: 'Avery Kim',
        startsAt: getValidDate(18, 17), // ~2.5 weeks from now 5pm
        endsAt: getValidDate(18, 18),
        type: 'PILATES',
        status: 'SCHEDULED',
        locationId: loc1.id,
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=3270&auto=format&fit=crop',
      },
      {
        name: 'Full Body Burn',
        description: 'Combine weights and cardio for a complete metabolic workout.',
        capacity: 18,
        instructor: 'Jordan Lee',
        startsAt: getValidDate(21, 18), // 3 weeks from now 6pm
        endsAt: getValidDate(21, 19),
        type: 'HIIT',
        status: 'SCHEDULED',
        locationId: loc2.id,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=3270&auto=format&fit=crop',
      }
    ]
  });

  console.log('✅ Classes seeded successfully!');
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
