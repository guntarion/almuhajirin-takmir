'use client';

import { Kegiatan } from '@/lib/kegiatanMockData';
import KegiatanRegistrationForm from './KegiatanRegistrationForm';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaUserPlus, FaClock } from 'react-icons/fa';

interface KegiatanDetailProps {
  kegiatan: Kegiatan;
}

export default function KegiatanDetail({ kegiatan }: KegiatanDetailProps) {
  return (
    <div className='bg-white p-8 rounded-lg shadow-lg'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-3xl font-bold text-gray-900'>{kegiatan.title}</h1>
        {kegiatan.status === 'UPCOMING' && <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>UPCOMING</span>}
      </div>

      <p className='text-gray-600 text-lg mb-6'>{kegiatan.description}</p>

      {/* Tanggal, Durasi, Lokasi in one row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='flex items-center bg-gray-50 p-4 rounded-lg'>
          <FaCalendar className='text-gray-500 mr-3' />
          <p className='text-gray-700'>Tanggal: {new Date(kegiatan.date).toLocaleDateString('id-ID')}</p>
        </div>

        <div className='flex items-center bg-gray-50 p-4 rounded-lg'>
          <FaClock className='text-gray-500 mr-3' />
          <p className='text-gray-700'>Durasi: {kegiatan.duration}</p>
        </div>

        <div className='flex items-center bg-gray-50 p-4 rounded-lg'>
          <FaMapMarkerAlt className='text-gray-500 mr-3' />
          <p className='text-gray-700'>Lokasi: {kegiatan.location}</p>
        </div>
      </div>

      {/* Kebutuhan Panitia, Yang Mendaftar, Riil Berpartisipasi in one row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='flex items-center bg-gray-50 p-4 rounded-lg'>
          <FaUsers className='text-gray-500 mr-3' />
          <p className='text-gray-700'>Kebutuhan Panitia: {kegiatan.manpowerRequired}</p>
        </div>

        <div className='flex items-center bg-gray-50 p-4 rounded-lg'>
          <FaUserPlus className='text-gray-500 mr-3' />
          <p className='text-gray-700'>Yang Mendaftar: {kegiatan.registeredParticipants}</p>
        </div>

        <div className='flex items-center bg-gray-50 p-4 rounded-lg'>
          <FaCheckCircle className='text-gray-500 mr-3' />
          <p className='text-gray-700'>Riil Berpartisipasi: {kegiatan.confirmedParticipants}</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className='mt-8'>
        <KegiatanRegistrationForm kegiatanId={kegiatan.id} />
      </div>
    </div>
  );
}
