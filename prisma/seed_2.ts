// prisma/seed_2.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.activity.deleteMany({});

  // Positive activities (isNegative = false)
  const positiveActivities = [
    {
      name: 'Sholat Shubuh berjamaah',
      category: 'IBADAH',
      description: 'Sholat Shubuh berjamaah di masjid',
    },
    {
      name: 'Sholat Dzuhur berjamaah',
      category: 'IBADAH',
      description: 'Sholat Dzuhur berjamaah di masjid',
    },
    {
      name: 'Sholat Ashar berjamaah',
      category: 'IBADAH',
      description: 'Sholat Ashar berjamaah di masjid',
    },
    {
      name: 'Sholat Maghrib berjamaah',
      category: 'IBADAH',
      description: 'Sholat Maghrib berjamaah di masjid',
    },
    {
      name: 'Sholat Isya berjamaah',
      category: 'IBADAH',
      description: 'Sholat Isya berjamaah di masjid',
    },
    {
      name: 'Sholat Rawatib',
      category: 'IBADAH',
      description: 'Sholat sunnah rawatib sebelum atau sesudah sholat fardhu',
    },
    {
      name: 'Sholat Dhuha',
      category: 'IBADAH',
      description: 'Sholat Dhuha minimal 2 rakaat',
    },
    {
      name: 'Dzikir Doa bada sholat',
      category: 'IBADAH',
      description: 'Melakukan dzikir dan doa setelah sholat',
    },
    {
      name: 'Sedekah',
      category: 'SOSIAL',
      description: 'Bersedekah minimal Rp 10.000',
    },
    {
      name: 'Menjadi petugas Iqomah',
      category: 'AKHLAK',
      description: 'Menjadi petugas iqomah di masjid',
    },
    {
      name: 'Membersihkan masjid',
      category: 'AKHLAK',
      description: 'Membersihkan area masjid',
    },
    {
      name: 'Cepat masuk dan merapikan shaf',
      category: 'AKHLAK',
      description: 'Cepat masuk ke masjid dan merapikan shaf sholat',
    },
    {
      name: 'Membantu mengarahkan rapikan shaf',
      category: 'AKHLAK',
      description: 'Membantu mengarahkan jamaah untuk merapikan shaf',
    },
    {
      name: 'Membuang sampah pada tempatnya',
      category: 'AKHLAK',
      description: 'Membuang sampah pada tempat yang disediakan',
    },
    {
      name: 'Merapikan sandal',
      category: 'AKHLAK',
      description: 'Merapikan sandal di rak sandal masjid',
    },
    {
      name: 'Belajar di Masjid',
      category: 'PEMBELAJARAN',
      description: 'Belajar atau mengikuti kajian di masjid',
    },
    {
      name: 'Mengajari teman',
      category: 'PEMBELAJARAN',
      description: 'Mengajari teman tentang materi keislaman',
    },
    {
      name: 'Berbagi makanan',
      category: 'SOSIAL',
      description: 'Berbagi makanan dengan jamaah atau teman',
    },
    {
      name: 'Mengucap salam dan bersalaman',
      category: 'AKHLAK',
      description: 'Mengucap salam dan bersalaman dengan jamaah',
    },
    {
      name: 'Menyapa jamaah',
      category: 'AKHLAK',
      description: 'Menyapa jamaah dengan ramah',
    },
    {
      name: 'Membantu di kepanitiaan insidentil',
      category: 'SOSIAL',
      description: 'Membantu dalam kepanitiaan acara insidentil di masjid',
    },
    {
      name: 'Membantu di kajian rutin',
      category: 'KAJIAN',
      description: 'Membantu dalam kajian rutin di masjid',
    },
    {
      name: 'Membacakan pengumuman',
      category: 'DAKWAH',
      description: 'Membacakan pengumuman di masjid',
    },
    {
      name: 'Membuat konten islami',
      category: 'DAKWAH',
      description: 'Membuat konten islami untuk media sosial',
    },
    {
      name: 'Memberi membacakan kultum',
      category: 'DAKWAH',
      description: 'Memberikan atau membacakan kultum di masjid',
    },
  ];

  // Negative activities (isNegative = true)
  const negativeActivities = [
    {
      name: 'Terlambat sholat',
      category: 'AKHLAK',
      description: 'Terlambat mengikuti sholat berjamaah',
    },
    {
      name: 'Berbicara kasar',
      category: 'AKHLAK',
      description: 'Berbicara kasar kepada teman atau jamaah',
    },
    {
      name: 'Bertengkar',
      category: 'AKHLAK',
      description: 'Terlibat dalam pertengkaran',
    },
    {
      name: 'Merusakkan barang',
      category: 'AKHLAK',
      description: 'Merusakkan barang milik masjid atau orang lain',
    },
    {
      name: 'Membuat keramaian',
      category: 'AKHLAK',
      description: 'Membuat keramaian yang mengganggu ketenangan masjid',
    },
    {
      name: 'Baju tidak menutup aurat',
      category: 'AKHLAK',
      description: 'Memakai baju yang tidak menutup aurat di masjid',
    },
    {
      name: 'Mengotori masjid',
      category: 'AKHLAK',
      description: 'Mengotori area masjid',
    },
    {
      name: 'Buang sampah sembarangan',
      category: 'AKHLAK',
      description: 'Membuang sampah sembarangan di area masjid',
    },
    {
      name: 'Membully teman',
      category: 'AKHLAK',
      description: 'Melakukan bullying terhadap teman',
    },
    {
      name: 'Berbohong',
      category: 'AKHLAK',
      description: 'Berbohong kepada teman atau jamaah',
    },
    {
      name: 'Mencuri',
      category: 'AKHLAK',
      description: 'Mencuri barang milik orang lain',
    },
    {
      name: 'Vandalisme',
      category: 'AKHLAK',
      description: 'Melakukan vandalisme di area masjid',
    },
  ];

  // Create positive activities
  for (const activity of positiveActivities) {
    await prisma.activity.create({
      data: {
        ...activity,
        type: 'TAMBAHAN',
        userCategories: 'mkidz',
        validationRoles: 'KOORDINATOR_ANAKREMAS,MARBOT,TAKMIR',
        icon: '',
        needsProof: false,
        isNegative: false,
        minFrequency: 1,
        maxFrequency: 1,
        basePoints: 10, // Adjust basePoints as needed
      },
    });
  }

  // Create negative activities
  for (const activity of negativeActivities) {
    await prisma.activity.create({
      data: {
        ...activity,
        type: 'TAMBAHAN',
        userCategories: 'mkidz',
        validationRoles: 'KOORDINATOR_ANAKREMAS,MARBOT,TAKMIR',
        icon: '',
        needsProof: false,
        isNegative: true,
        minFrequency: 1,
        maxFrequency: 1,
        basePoints: -10, // Negative points for negative activities
      },
    });
  }

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
