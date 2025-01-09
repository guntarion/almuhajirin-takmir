import { notFound } from 'next/navigation';
import KegiatanDetail from '@/components/kegiatan/KegiatanDetail';
import { kegiatanMockData } from '@/lib/kegiatanMockData';

export default async function KegiatanDetailPage({ params }: { params: { eventId: string } }) {
  // Await the params object (even though it's synchronous in this case)
  const { eventId } = params;

  // Find the event in the mock data
  const kegiatan = kegiatanMockData.find((k) => k.id === eventId);

  // If the event is not found, return a 404 page
  if (!kegiatan) notFound();

  return (
    <div className='p-6'>
      <KegiatanDetail kegiatan={kegiatan} />
    </div>
  );
}
