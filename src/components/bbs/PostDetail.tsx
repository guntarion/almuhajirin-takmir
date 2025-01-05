'use client';

/**
 * File: src/components/bbs/PostDetail.tsx
 * Description: Component for displaying a single post's full content and details.
 * Includes interactive elements and accessibility improvements.
 */

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
}

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  // Format date to be more readable
  const formattedDate = new Date(post.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `Baca pengumuman: ${post.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link telah disalin ke clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <article className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
      {/* Header */}
      <header className='mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          {post.isPinned && (
            <svg
              className='h-5 w-5 text-blue-500'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
            </svg>
          )}
          <h1 className='text-2xl font-bold text-gray-900'>
            {post.isPinned && <span className='sr-only'>Dipin: </span>}
            {post.title}
          </h1>
        </div>

        <div className='flex flex-wrap items-center gap-4 text-sm'>
          <span className='text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>{post.category}</span>
          <span className='text-gray-500'>oleh {post.author}</span>
          <time dateTime={post.date} className='text-gray-400'>
            {formattedDate}
          </time>
          <div className='flex items-center gap-1 text-gray-500' title={`${post.viewCount} kali dilihat`}>
            <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            <span>{post.viewCount}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Footer */}
      <footer className='mt-8 pt-8 border-t border-gray-100'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={handleShare}
              className='text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100'
              title='Bagikan'
              aria-label='Bagikan pengumuman ini'
            >
              <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                />
              </svg>
            </button>
            <button
              className='text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100'
              title='Simpan'
              aria-label='Simpan pengumuman ini'
            >
              <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
