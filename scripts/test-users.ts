// scripts/test-users.ts
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    console.log('Testing database connection...');

    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful!');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log('Users in database:');
      console.table(users);
    }
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma connection closed');
  });
