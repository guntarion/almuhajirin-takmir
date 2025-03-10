// src/app/admin/achievement/page.tsx
'use client'; // Pastikan komponen ini dijalankan di sisi klien

import {
  FaPray,
  FaHands,
  FaSun,
  FaMoon,
  FaStar,
  FaClock,
  FaRegSun,
  FaCloudSun,
  FaPrayingHands,
  FaHandHoldingHeart,
  FaMicrophone,
  FaBookOpen,
  FaQuran,
  FaBroom,
  FaAlignJustify,
  FaPeopleArrows,
  FaTrashAlt,
  FaShoePrints,
  FaTint,
  FaBookReader,
  FaChalkboardTeacher,
  FaShareAlt,
  FaFistRaised,
  FaHandshake,
  FaSmile,
  FaUsersCog,
  FaCalendarCheck,
  FaBullhorn,
  FaVideo,
  FaGamepad,
  FaMicrophoneAlt,
  FaBatteryFull,
  FaUserGraduate,
  FaPaintBrush,
  FaPenAlt,
  FaUserTimes,
  FaFrown,
  FaAngry,
  FaCommentSlash,
  FaHandRock,
  FaCommentDots,
  FaRunning,
  // FaTools,
  FaVolumeUp,
  FaTshirt,
  FaTrash,
  FaBan,
  FaGrinTears,
  FaCommentAlt,
  FaHandPaper,
  FaSprayCan,
  FaTimesCircle,
  FaMobileAlt,
  FaStopwatch,
  FaGrinTongueSquint,
  FaUserLock,
  FaLightbulb,
  FaHammer,
  FaHeart,
} from 'react-icons/fa';

const positiveActions = [
  // IBADAH
  {
    icon: FaPray,
    category: 'IBADAH',
    point: 25,
    achievement: 'Pejuang Shubuh',
    requirement: 5,
    unit: 'hari',
    name: 'Shubuh Berjamaah',
    description: 'Sholat Shubuh berjamaah di masjid.',
  },
  {
    icon: FaHands,
    category: 'IBADAH',
    point: 25,
    achievement: 'Istiqomah Dzuhur',
    requirement: 10,
    unit: 'hari',
    name: 'Dzuhur Berjamaah',
    description: 'Sholat Dzuhur berjamaah di masjid.',
  },
  {
    icon: FaSun,
    category: 'IBADAH',
    point: 25,
    achievement: 'Penjaga Ashar',
    requirement: 10,
    unit: 'hari',
    name: 'Ashar Berjamaah',
    description: 'Sholat Ashar berjamaah di masjid.',
  },
  {
    icon: FaCloudSun,
    category: 'IBADAH',
    point: 25,
    achievement: 'Pengawal Maghrib',
    requirement: 10,
    unit: 'hari',
    name: 'Maghrib Berjamaah',
    description: 'Sholat Maghrib berjamaah di masjid.',
  },
  {
    icon: FaStar,
    category: 'IBADAH',
    point: 25,
    achievement: 'Peneguh Isya',
    requirement: 10,
    unit: 'hari',
    name: 'Isya Berjamaah',
    description: 'Sholat Isya berjamaah di masjid.',
  },
  {
    icon: FaMoon,
    category: 'IBADAH',
    point: 20,
    achievement: 'Night Warrior',
    requirement: 5,
    unit: 'hari',
    name: 'Tahajud',
    description: 'Sholat Tahajud di malam hari.',
  },
  {
    icon: FaClock,
    category: 'IBADAH',
    point: 15,
    achievement: 'Rajin Rawatib',
    requirement: 20,
    unit: 'kali',
    name: 'Rawatib',
    description: 'Sholat sunnah sebelum/sesudah sholat wajib.',
  },
  {
    icon: FaRegSun,
    category: 'IBADAH',
    point: 15,
    achievement: 'Dhuha Warrior',
    requirement: 7,
    unit: 'hari',
    name: 'Dhuha',
    description: 'Sholat sunnah Dhuha di pagi hari.',
  },
  {
    icon: FaPrayingHands,
    category: 'IBADAH',
    point: 10,
    achievement: 'Ahli Dzikir',
    requirement: 15,
    unit: 'kali',
    name: 'Dzikir/Doa',
    description: 'Berdoa atau berdzikir setelah sholat.',
  },
  {
    icon: FaMicrophone,
    category: 'IBADAH',
    point: 10,
    achievement: 'Muadzin Teladan',
    requirement: 5,
    unit: 'kali',
    name: 'Adzan/Iqomah',
    description: 'Mengumandangkan adzan atau iqomah.',
  },
  {
    icon: FaTint,
    category: 'IBADAH',
    point: 5,
    achievement: 'Wudhu Guardian',
    requirement: 7,
    unit: 'hari',
    name: 'Jaga Wudhu',
    description: 'Selalu siap dengan wudhu.',
  },
  {
    icon: FaAlignJustify,
    category: 'IBADAH',
    point: 5,
    achievement: 'Shaf Manager',
    requirement: 15,
    unit: 'kali',
    name: 'Rapikan Shaf',
    description: 'Merapikan barisan sholat.',
  },
  {
    icon: FaPeopleArrows,
    category: 'IBADAH',
    point: 5,
    achievement: 'Shaf Guide',
    requirement: 15,
    unit: 'kali',
    name: 'Arahkan Shaf',
    description: 'Membantu mengatur barisan sholat.',
  },

  // PEMBELAJARAN
  {
    icon: FaUserGraduate,
    category: 'PEMBELAJARAN',
    point: 15,
    achievement: 'Mentor Hebat',
    requirement: 5,
    unit: 'kali',
    name: 'Mentor Mengaji',
    description: 'Membimbing adik-adik mengaji.',
  },
  {
    icon: FaQuran,
    category: 'PEMBELAJARAN',
    point: 15,
    achievement: 'Hafiz Junior',
    requirement: 10,
    unit: 'ayat',
    name: 'Hafalan Quran',
    description: 'Menghafal Al-Quran di masjid.',
  },
  {
    icon: FaChalkboardTeacher,
    category: 'PEMBELAJARAN',
    point: 15,
    achievement: 'Guru Muda',
    requirement: 5,
    unit: 'kali',
    name: 'Mengajari Teman',
    description: 'Membantu teman belajar.',
  },
  {
    icon: FaBookOpen,
    category: 'PEMBELAJARAN',
    point: 10,
    achievement: 'Tilawah Master',
    requirement: 7,
    unit: 'hari',
    name: 'Tilawah',
    description: 'Membaca Al-Quran di masjid.',
  },
  {
    icon: FaBookReader,
    category: 'PEMBELAJARAN',
    point: 10,
    achievement: 'Knowledge Seeker',
    requirement: 5,
    unit: 'hari',
    name: 'Belajar di Masjid',
    description: 'Belajar atau mengaji di masjid.',
  },
  {
    icon: FaLightbulb,
    category: 'PEMBELAJARAN',
    point: 10,
    achievement: 'Knowledge Sharer',
    requirement: 5,
    unit: 'kali',
    name: 'Learn and Share',
    description: 'Belajar dan berbagi ilmu baru.',
  },

  // SOSIAL
  {
    icon: FaHandHoldingHeart,
    category: 'SOSIAL',
    point: 10,
    achievement: 'Tangan Dermawan',
    requirement: 10,
    unit: 'kali',
    name: 'Bersedekah',
    description: 'Memberi sedekah untuk masjid.',
  },
  {
    icon: FaBroom,
    category: 'SOSIAL',
    point: 10,
    achievement: 'Cleaning Champion',
    requirement: 5,
    unit: 'kali',
    name: 'Bersihkan Masjid',
    description: 'Membersihkan area masjid.',
  },
  {
    icon: FaShareAlt,
    category: 'SOSIAL',
    point: 10,
    achievement: 'Food Sharer',
    requirement: 5,
    unit: 'kali',
    name: 'Berbagi Makanan',
    description: 'Berbagi makanan dengan orang lain.',
  },
  {
    icon: FaUsersCog,
    category: 'SOSIAL',
    point: 10,
    achievement: 'Event Organizer',
    requirement: 3,
    unit: 'kali',
    name: 'Bantu Kepanitiaan',
    description: 'Terlibat dalam kepanitiaan masjid.',
  },
  {
    icon: FaHeart,
    category: 'SOSIAL',
    point: 10,
    achievement: 'Family Hero',
    requirement: 7,
    unit: 'hari',
    name: 'Bantu Keluarga',
    description: 'Membantu keluarga di rumah.',
  },
  {
    icon: FaTrashAlt,
    category: 'SOSIAL',
    point: 5,
    achievement: 'Clean Activist',
    requirement: 20,
    unit: 'kali',
    name: 'Buang Sampah',
    description: 'Membuang sampah di tempat yang disediakan.',
  },
  {
    icon: FaShoePrints,
    category: 'SOSIAL',
    point: 5,
    achievement: 'Sandal Manager',
    requirement: 20,
    unit: 'kali',
    name: 'Rapikan Sandal',
    description: 'Merapikan sandal di area masjid.',
  },

  // DAKWAH
  {
    icon: FaVideo,
    category: 'DAKWAH',
    point: 15,
    achievement: 'Content Creator',
    requirement: 3,
    unit: 'konten',
    name: 'Buat Konten Islami',
    description: 'Membuat konten edukasi islami.',
  },
  {
    icon: FaBullhorn,
    category: 'DAKWAH',
    point: 10,
    achievement: 'Info Master',
    requirement: 5,
    unit: 'kali',
    name: 'Bacakan Pengumuman',
    description: 'Membacakan pengumuman di masjid.',
  },
  {
    icon: FaMicrophoneAlt,
    category: 'DAKWAH',
    point: 10,
    achievement: 'Young Preacher',
    requirement: 3,
    unit: 'kali',
    name: 'Berikan Kultum',
    description: 'Menyampaikan kultum di masjid.',
  },
  {
    icon: FaPaintBrush,
    category: 'DAKWAH',
    point: 10,
    achievement: 'Creative Designer',
    requirement: 3,
    unit: 'poster',
    name: 'Buat Poster',
    description: 'Membuat desain untuk kegiatan masjid.',
  },
  {
    icon: FaPenAlt,
    category: 'DAKWAH',
    point: 10,
    achievement: 'Islamic Writer',
    requirement: 3,
    unit: 'artikel',
    name: 'Tulis Artikel',
    description: 'Menulis artikel untuk majalah masjid.',
  },

  // KAJIAN
  {
    icon: FaCalendarCheck,
    category: 'KAJIAN',
    point: 10,
    achievement: 'Kajian Volunteer',
    requirement: 3,
    unit: 'kali',
    name: 'Bantu Kajian',
    description: 'Menjadi petugas kajian rutin.',
  },
  {
    icon: FaBatteryFull,
    category: 'KAJIAN',
    point: 10,
    achievement: 'Knowledge Battery',
    requirement: 5,
    unit: 'kali',
    name: 'Hadiri Kajian',
    description: "Mengisi 'baterai' ilmu dengan kajian.",
  },

  // AKHLAK
  {
    icon: FaHandshake,
    category: 'AKHLAK',
    point: 5,
    achievement: 'Friendly Muslim',
    requirement: 30,
    unit: 'kali',
    name: 'Salam & Salaman',
    description: 'Menyapa dan bersalaman dengan sopan.',
  },
  {
    icon: FaSmile,
    category: 'AKHLAK',
    point: 5,
    achievement: 'Cheerful Muslim',
    requirement: 30,
    unit: 'kali',
    name: 'Menyapa Orang',
    description: 'Menyapa terutama yang lebih tua.',
  },

  // LAINNYA
  {
    icon: FaGamepad,
    category: 'LAINNYA',
    point: 5,
    achievement: 'Digital Detox',
    requirement: 7,
    unit: 'hari',
    name: 'Gadget <1 Jam',
    description: 'Menggunakan gadget kurang dari 1 jam.',
  },
];

const negativeActions = [
  { icon: FaClock, category: 'IBADAH', point: -5, name: 'Terlambat Sholat', description: 'Datang terlambat untuk sholat berjamaah.' },
  { icon: FaUserTimes, category: 'AKHLAK', point: -10, name: 'Tidak Hormat', description: 'Bersikap tidak sopan kepada orang tua.' },
  { icon: FaFrown, category: 'AKHLAK', point: -5, name: 'Bersikap Buruk', description: 'Bersikap tidak ramah kepada orang lain.' },
  { icon: FaAngry, category: 'AKHLAK', point: -10, name: 'Bicara Kasar', description: 'Membentak atau menghardik orang lain.' },
  { icon: FaCommentSlash, category: 'AKHLAK', point: -15, name: 'Memfitnah', description: 'Menyebarkan berita tidak benar.' },
  { icon: FaHandRock, category: 'AKHLAK', point: -15, name: 'Sikap Kasar', description: 'Menyakiti fisik atau perasaan orang lain.' },
  { icon: FaCommentDots, category: 'AKHLAK', point: -10, name: 'Kata Kotor', description: 'Menggunakan kata-kata tidak pantas.' },
  { icon: FaRunning, category: 'AKHLAK', point: -5, name: 'Lari di Masjid', description: 'Membuat keributan di dalam masjid.' },
  { icon: FaPeopleArrows, category: 'AKHLAK', point: -10, name: 'Bertengkar', description: 'Terlibat dalam pertengkaran.' },
  { icon: FaFistRaised, category: 'AKHLAK', point: -15, name: 'Aksi Berbahaya', description: 'Melakukan aktivitas yang membahayakan.' },
  { icon: FaVolumeUp, category: 'AKHLAK', point: -5, name: 'Buat Keramaian', description: 'Membuat suara keras atau keributan di dalam masjid.' },
  { icon: FaTshirt, category: 'AKHLAK', point: -10, name: 'Aurat Terbuka', description: 'Memakai pakaian yang tidak sesuai dengan syariat.' },
  { icon: FaTrash, category: 'SOSIAL', point: -5, name: 'Kotori Masjid', description: 'Membuat area masjid menjadi kotor.' },
  { icon: FaBan, category: 'SOSIAL', point: -5, name: 'Buang Sampah', description: 'Membuang sampah tidak pada tempatnya.' },
  { icon: FaGrinTears, category: 'AKHLAK', point: -10, name: 'Bully Teman', description: 'Mengejek atau mengintimidasi teman.' },
  { icon: FaCommentAlt, category: 'AKHLAK', point: -10, name: 'Berbohong', description: 'Mengucapkan kata-kata yang tidak benar.' },
  { icon: FaHandPaper, category: 'AKHLAK', point: -15, name: 'Mencuri', description: 'Mengambil barang yang bukan haknya.' },
  { icon: FaSprayCan, category: 'SOSIAL', point: -15, name: 'Vandalisme', description: 'Merusak fasilitas atau properti masjid.' },
  { icon: FaTimesCircle, category: 'IBADAH', point: -10, name: 'Tinggalkan Sholat', description: 'Tidak melaksanakan sholat wajib.' },
  { icon: FaMobileAlt, category: 'LAINNYA', point: -5, name: 'Gadget Saat Kajian', description: 'Tidak fokus karena bermain gadget.' },
  { icon: FaStopwatch, category: 'IBADAH', point: -5, name: 'Abaikan Adzan', description: 'Tidak segera memenuhi panggilan adzan atau iqomah.' },
  { icon: FaGrinTongueSquint, category: 'AKHLAK', point: -10, name: 'Ejek Teman', description: 'Mengejek teman yang sedang belajar.' },
  { icon: FaUserLock, category: 'AKHLAK', point: -10, name: 'Tidak Hormati Petugas', description: 'Bersikap tidak sopan kepada petugas masjid.' },
  { icon: FaHammer, category: 'SOSIAL', point: -15, name: 'Rusak Properti', description: 'Merusak fasilitas atau barang di masjid.' },
];

export default function AchievementPage() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-6'>Daftar Tindakan Positif dan Negatif</h1>

      {/* Tindakan Positif */}
      <section className='mb-8'>
        <h1 className='text-xl font-semibold mb-4'>Tindakan Positif (36)</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {positiveActions.map((action, index) => (
            <div key={index} className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
              <action.icon className='w-12 h-12 mb-2 text-blue-500' />
              <h3 className='font-semibold text-lg text-center'>
                {action.name} ({action.point})
              </h3>
              <p className='text-sm text-center text-gray-600'>{action.description}</p>
              <p className='text-sm text-center text-gray-600'>
                ({action.achievement} : {action.requirement} {action.unit} )
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tindakan Negatif */}
      <section>
        <h1 className='text-xl font-semibold mb-4'>Tindakan Negatif (24)</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {negativeActions.map((action, index) => (
            <div key={index} className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
              <action.icon className='w-12 h-12 mb-2 text-red-500' />
              <h3 className='font-semibold text-lg text-center'>
                {action.name} ({action.point})
              </h3>
              <p className='text-sm text-center text-gray-600'>{action.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
