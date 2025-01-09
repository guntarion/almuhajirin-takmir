'use client';

import Link from 'next/link';
import { Kegiatan } from '@/lib/kegiatanMockData';

interface KegiatanListProps {
  kegiatanList: Kegiatan[];
}

export default function KegiatanList({ kegiatanList }: KegiatanListProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {kegiatanList.map((kegiatan) => (
        <div key={kegiatan.id} className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden'>
          <Link href={`/kegiatan/${kegiatan.id}`}>
            {/* <img src={kegiatan.imageUrl} alt={kegiatan.title} className='w-full h-48 object-cover' /> */}
            <div className='p-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900'>{kegiatan.title}</h2>
                {kegiatan.status === 'UPCOMING' && (
                  <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold'>UPCOMING</span>
                )}
              </div>
              <p className='text-gray-600 mt-2'>{kegiatan.description}</p>
              <div className='mt-4 text-sm text-gray-500'>
                <p>Tanggal: {new Date(kegiatan.date).toLocaleDateString('id-ID')}</p>
                <p>Lokasi: {kegiatan.location}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
