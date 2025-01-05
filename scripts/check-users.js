const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
    console.log('Users:', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
