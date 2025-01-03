// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete existing users
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Create sample takmir user
  const takmirPassword = await bcrypt.hash('takmir123', 10);
  await prisma.user.create({
    data: {
      name: 'Takmir User',
      username: 'takmir',
      email: 'takmir@example.com',
      password: takmirPassword,
      role: 'takmir',
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
