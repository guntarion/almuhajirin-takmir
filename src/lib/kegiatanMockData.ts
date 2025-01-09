export interface Kegiatan {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  manpowerRequired: number;
  registeredParticipants: number;
  registeredOrganizers: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export const kegiatanMockData: Kegiatan[] = [
  {
    id: '1',
    title: 'Buka Puasa Bersama Remaja Masjid',
    description: 'Acara buka puasa bersama remaja masjid dengan tausiyah dari Ust. Ahmad',
    date: '2023-10-15T17:00:00',
    location: 'Masjid Al-Muhajirin',
    imageUrl: '/images/buka-puasa.jpg',
    manpowerRequired: 10,
    registeredParticipants: 50,
    registeredOrganizers: 5,
    status: 'UPCOMING',
  },
  {
    id: '2',
    title: 'Kajian Rutin Remaja Masjid',
    description: 'Kajian rutin remaja masjid dengan tema "Menjadi Pemuda Islam yang Tangguh"',
    date: '2023-10-20T19:00:00',
    location: 'Masjid Al-Muhajirin',
    imageUrl: '/images/kajian-remaja.jpg',
    manpowerRequired: 5,
    registeredParticipants: 30,
    registeredOrganizers: 3,
    status: 'UPCOMING',
  },
];
