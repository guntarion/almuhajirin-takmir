// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      username: 'admin',
      email: 'guntarion@gmail.com',
      password: await hashPassword('Admin@123'), // Using a secure default password
      role: 'ADMIN',
      avatar: '/avatars/avatar-01.jpg',
      active: true,
      kategori: 'mkidz'
    },
  });

  console.log('Admin user created successfully:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
