'use client';

/**
 * File: src/components/bbs/PostItem.tsx
 * Description: Component for displaying a single post item in the bulletin board.
 * Shows post title, excerpt, metadata, and action buttons.
 * Includes accessibility improvements and date formatting.
 */

import Link from 'next/link';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface PostItemProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  commentCount: number;
  viewCount: number;
  isPinned?: boolean;
  id: string;
}

export default function PostItem({ title, excerpt, author, date, category, commentCount, viewCount, isPinned = false, id }: PostItemProps) {
  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/bbs/${id}`} className='block' aria-label={`Baca pengumuman: ${title}`}>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
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
              <h3 className='text-lg font-semibold text-gray-900'>
                {isPinned && <span className='sr-only'>Dipin: </span>}
                {title}
              </h3>
            </div>
            <p
              className='text-gray-600 line-clamp-2'
              dangerouslySetInnerHTML={{
                __html: (() => {
                  try {
                    const rawContent = JSON.parse(excerpt);
                    // Validate that this is actually Draft.js content
                    if (!rawContent.blocks || !Array.isArray(rawContent.blocks)) {
                      return excerpt;
                    }
                    const contentState = convertFromRaw(rawContent);
                    const options = {
                      inlineStyles: {
                        BOLD: { element: 'strong' },
                        ITALIC: { element: 'em' },
                        UNDERLINE: { element: 'u' },
                      },
                      blockStyleFn: (block: ContentBlock) => {
                        const type = block.getType();
                        if (type === 'header-one') {
                          return {
                            element: 'h1',
                            attributes: {
                              class: 'text-2xl font-bold my-4',
                            },
                          };
                        }
                        if (type === 'unordered-list-item') {
                          return {
                            element: 'li',
                            wrapper: 'ul',
                            attributes: {
                              class: 'list-disc ml-4',
                            },
                          };
                        }
                      },
                    };
                    return stateToHTML(contentState, options);
                  } catch {
                    // If excerpt is not valid JSON or Draft.js content, display as plain text
                    return excerpt;
                  }
                })(),
              }}
            />
          </div>
        </div>

        <div className='mt-4 flex items-center justify-between text-sm'>
          <div className='flex items-center gap-4'>
            <span className='text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>{category}</span>
            <span className='text-gray-500'>oleh {author}</span>
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
