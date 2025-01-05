// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
const { hash } = bcrypt;

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const roles = [UserRole.ANAK_REMAS, UserRole.KOORDINATOR_ANAK_REMAS, UserRole.ORANG_TUA_WALI, UserRole.MARBOT, UserRole.TAKMIR, UserRole.ADMIN];

  for (const role of roles) {
    await prisma.user.upsert({
      where: { username: role },
      update: {},
      create: {
        name: role.toUpperCase(),
        username: role,
        email: `${role}@example.com`,
        password: await hash('password123', 12),
        role: role,
        active: true,
      },
    });
  }

  // Create sample posts
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });

  if (admin) {
    await prisma.post.createMany({
      data: [
        {
          title: 'Selamat Datang di BBS Remas',
          content: 'Ini adalah posting pertama di BBS Remas',
          category: 'PENGUMUMAN',
          tags: ['pengumuman', 'remas'],
          status: 'PUBLISHED',
          isPinned: true,
          authorId: admin.id,
        },
        {
          title: 'Jadwal Kajian Rutin',
          content: 'Berikut jadwal kajian rutin bulan ini',
          category: 'KAJIAN',
          tags: ['kajian', 'jadwal'],
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      ],
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
