import { Suspense } from 'react';
import KegiatanList from '@/components/kegiatan/KegiatanList';
import { kegiatanMockData } from '@/lib/kegiatanMockData';

export default function KegiatanPage() {
  return (
    <div>
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mb-8 rounded-lg shadow-lg'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Ramadhan Menjelang!</h1>
          <p className='text-lg'>Ayo bersiap hadapi ramadhan. Banyak kegiatan asyik, dengan reward yang menarik!</p>
        </div>
      </div>
      <h1 className='text-2xl font-bold mb-6'>Daftar Kegiatan</h1>
      <Suspense fallback={<div className='text-center py-8 text-gray-500'>Memuat kegiatan...</div>}>
        <KegiatanList kegiatanList={kegiatanMockData} />
      </Suspense>
    </div>
  );
}
