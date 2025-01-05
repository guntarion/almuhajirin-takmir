/**
 * File: src/app/bbs/[postId]/page.tsx
 * Description: Dynamic route page component for displaying a single post with its comments.
 */

import PostDetail from '../../../components/bbs/PostDetail';
import CommentList from '../../../components/bbs/CommentList';
import CommentForm from '../../../components/bbs/CommentForm';

export default async function PostPage({ params }: { params: { postId: string } }) {
  // Sample post data - this would typically come from an API/database
  const post = {
    id: await params.postId,
    title: 'Jadwal Kajian Rutin Bulan Ramadhan',
    content: `
      <p>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
      <p>Berikut adalah jadwal kajian rutin selama bulan Ramadhan 1445 H:</p>
      <ul>
        <li>Setiap Ba'da Subuh: Kajian Tafsir Al-Qur'an</li>
        <li>Setiap Ba'da Ashar: Kajian Hadits Arbain</li>
        <li>Setiap Ba'da Tarawih: Kajian Fiqih Puasa</li>
      </ul>
      <p>Kajian akan dilaksanakan setiap hari selama bulan Ramadhan dengan pemateri yang berbeda setiap harinya.</p>
      <p>Diharapkan kehadiran dan partisipasi dari seluruh jamaah untuk mengikuti kajian-kajian tersebut.</p>
      <p>Jazakumullahu Khairan</p>
    `,
    author: 'Ust. Ahmad',
    date: '2024-03-10',
    category: 'Kajian',
    commentCount: 5,
    viewCount: 120,
    isPinned: true,
  };

  return (
    <div className='space-y-8'>
      {/* Post Detail */}
      <PostDetail post={post} />

      {/* Comments Section */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <h2 className='text-xl font-semibold mb-6'>Komentar ({post.commentCount})</h2>

        {/* Comment Form */}
        <div className='mb-8'>
          <CommentForm postId={post.id} />
        </div>

        {/* Comment List */}
        <CommentList postId={post.id} />
      </div>
    </div>
  );
}
