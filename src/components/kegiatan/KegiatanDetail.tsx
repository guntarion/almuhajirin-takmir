'use client';

import { Kegiatan } from '@/lib/kegiatanMockData';
import KegiatanRegistrationForm from './KegiatanRegistrationForm';

interface KegiatanDetailProps {
  kegiatan: Kegiatan;
}

export default function KegiatanDetail({ kegiatan }: KegiatanDetailProps) {
  return (
    <div className='bg-white p-8 rounded-lg shadow-sm'>
      <h1 className='text-2xl font-bold text-gray-900'>{kegiatan.title}</h1>
      <p className='text-gray-600 mt-2'>{kegiatan.description}</p>
      <div className='mt-4 text-sm text-gray-500'>
        <p>Tanggal: {new Date(kegiatan.date).toLocaleDateString('id-ID')}</p>
        <p>Lokasi: {kegiatan.location}</p>
        <p>Status: {kegiatan.status}</p>
        <p>Kebutuhan Panitia: {kegiatan.manpowerRequired}</p>
        <p>Peserta Terdaftar: {kegiatan.registeredParticipants}</p>
        <p>Panitia Terdaftar: {kegiatan.registeredOrganizers}</p>
      </div>
      <div className='mt-6'>
        <KegiatanRegistrationForm kegiatanId={kegiatan.id} />
      </div>
    </div>
  );
}
