// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function main() {
  // Clear existing data in correct order to respect foreign key constraints
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users with unique emails
  const user1 = await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: await hashPassword('password123'),
      role: 'ADMIN',
      avatar: '/avatars/avatar-01.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Regular User',
      username: 'user',
      email: 'user@example.com',
      password: await hashPassword('password123'),
      role: 'ANAK_REMAS',
      avatar: '/avatars/avatar-02.jpg',
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'This is the first post content',
      category: 'PENGUMUMAN',
      tags: '["announcement", "general"]',
      status: 'PUBLISHED',
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Second Post',
      content: 'This is the second post content',
      category: 'INFORMASI',
      tags: '["info", "update"]',
      status: 'PUBLISHED',
      authorId: user2.id,
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Great post!',
      postId: post1.id,
      authorId: user2.id,
      status: 'APPROVED',
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thanks for sharing!',
      postId: post2.id,
      authorId: user1.id,
      status: 'APPROVED',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
