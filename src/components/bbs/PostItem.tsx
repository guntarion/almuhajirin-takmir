'use client';

/**
 * File: src/components/bbs/PostItem.tsx
 * Description: Component for displaying a single post item in the bulletin board.
 * Shows post title, excerpt, metadata, and action buttons.
 * Includes accessibility improvements and date formatting.
 */

import Link from 'next/link';

import { Author } from '../../lib/types/bbs';

interface PostItemProps {
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  category: string;
  commentCount: number;
  viewCount: number;
  isPinned?: boolean;
  id: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export default function PostItem({ title, excerpt, author, date, category, commentCount, viewCount, isPinned = false, id, status }: PostItemProps) {
  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/bbs/${id}`} className='block' aria-label={`Baca pengumuman: ${title}`}>
      <div
        className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
          status === 'DRAFT' ? 'border-2 border-red-200' : 'border-2 border-blue-100'
        }`}
      >
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 flex-wrap'>
              {isPinned && (
                <svg
                  className='h-4 w-4 text-blue-500'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
                </svg>
              )}
              {status === 'DRAFT' && <span className='bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-medium'>Draft</span>}
              <h3 className='text-lg font-semibold text-gray-900'>
                {isPinned && <span className='sr-only'>Dipin: </span>}
                {title}
              </h3>
            </div>
            <p className='text-gray-600 line-clamp-2'>
              {(() => {
                try {
                  // Try to parse as JSON first (for existing data)
                  const parsedExcerpt = JSON.parse(excerpt);
                  // If it's Draft.js format, get text from first block
                  if (parsedExcerpt.blocks && Array.isArray(parsedExcerpt.blocks)) {
                    return parsedExcerpt.blocks[0].text;
                  }
                  return excerpt;
                } catch {
                  // If not valid JSON, display as plain text (for new data)
                  return excerpt;
                }
              })()}
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-center justify-between text-sm'>
          <div className='flex items-center gap-4'>
            <span className='text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>{category}</span>
            <div className='flex items-center gap-2'>
              <div className='h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} className='h-full w-full object-cover' />
                ) : (
                  <span className='text-xs font-medium text-gray-600'>{author.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className='text-gray-500'>oleh {author.name}</span>
            </div>
            <time dateTime={date} className='text-gray-400'>
              {formattedDate}
            </time>
          </div>

          <div className='flex items-center gap-4 text-gray-500'>
            <div className='flex items-center gap-1' aria-label={`${commentCount} komentar`}>
              <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
                />
              </svg>
              <span>{commentCount}</span>
            </div>
            <div className='flex items-center gap-1' aria-label={`${viewCount} kali dilihat`}>
              <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
              <span>{viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
