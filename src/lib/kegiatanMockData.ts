export interface Kegiatan {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  imageUrl: string;
  manpowerRequired: number;
  registeredParticipants: number;
  confirmedParticipants: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export const kegiatanMockData: Kegiatan[] = [
  {
    id: '1',
    title: 'Pembagian Takjil Buka Puasa',
    description: 'Membagikan takjil kepada jamaah yang berbuka puasa',
    date: '2023-10-15T17:00:00',
    location: 'Pelataran Masjid Al-Muhajirin',
    duration: '30 menit',
    imageUrl: '/images/buka-puasa.jpg',
    manpowerRequired: 10,
    registeredParticipants: 4,
    confirmedParticipants: 5,
    status: 'UPCOMING',
  },
  {
    id: '2',
    title: 'Pembaca Pengumuman Shalat Tarawih',
    description: 'Membaca pengumuman sebelum shalat tarawih dimulai',
    date: '2023-10-20T19:00:00',
    location: 'Dalam Ruangan Masjid Al-Muhajirin',
    duration: '5 menit',
    imageUrl: '/images/kajian-remaja.jpg',
    manpowerRequired: 5,
    registeredParticipants: 2,
    confirmedParticipants: 3,
    status: 'UPCOMING',
  },
];
