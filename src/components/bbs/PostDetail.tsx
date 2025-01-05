'use client';

/**
 * File: src/components/bbs/PostDetail.tsx
 * Description: Component for displaying a single post's full content and details.
 * Includes interactive elements, status management, and accessibility improvements.
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { convertFromRaw, ContentBlock } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useRouter } from 'next/navigation';
import EditPostForm from './EditPostForm';

type PostCategory = 'Pengumuman' | 'Kajian' | 'Kegiatan' | 'Rapat' | 'Lainnya';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: string;
  date: string;
  category: string;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  status: string;
}

interface PostDetailProps {
  post: Post;
  canManagePost: boolean;
  currentUserRole: string;
}

// Roles that need approval for publishing
const NEEDS_APPROVAL_ROLES = ['KOORDINATOR_ANAKREMAS', 'ANAK_REMAS'];

export default function PostDetail({ post, canManagePost }: PostDetailProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(post.status);
  const [isEditing, setIsEditing] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Format date to be more readable
  const formattedDate = new Date(post.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleStatusChange = async (newStatus: string) => {
    if (!canManagePost) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/bbs/posts/${post.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post status');
      }

      setCurrentStatus(newStatus);
      toast.success(`Status berhasil diubah ke ${newStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update post status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePinToggle = async () => {
    if (!canManagePost) return;

    setIsPinning(true);
    try {
      const response = await fetch(`/api/bbs/posts/${post.id}/pin`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update pin status');
      }

      const updatedPost = await response.json();
      toast.success(updatedPost.isPinned ? 'Post berhasil dipin' : 'Pin post berhasil dihapus');
      // Refresh the page to show updated content
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update pin status');
    } finally {
      setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    if (!canManagePost) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/bbs/posts/${post.id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      toast.success('Post berhasil dihapus');
      router.push('/bbs'); // Redirect to BBS page
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete post');
      setIsDeleting(false);
    }
  };

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
        toast.success('Link telah disalin ke clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <article className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
      {/* Header */}
      <header className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
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

          {/* Status Badge */}
          {currentStatus === 'DRAFT' && <span className='px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800'>Draft</span>}
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

        {/* Status Management */}
        {canManagePost && currentStatus === 'DRAFT' && (
          <div className='mt-4 flex items-center gap-4'>
            <button
              onClick={() => handleStatusChange('PUBLISHED')}
              disabled={isUpdating}
              className='px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50'
            >
              {isUpdating ? 'Memproses...' : 'Terbitkan'}
            </button>
            <p className='text-sm text-gray-500'>
              {NEEDS_APPROVAL_ROLES.includes(post.authorRole)
                ? 'Post ini memerlukan persetujuan admin untuk diterbitkan'
                : 'Post akan langsung diterbitkan'}
            </p>
          </div>
        )}
      </header>

      {/* Content */}
      <div
        className='prose max-w-none'
        dangerouslySetInnerHTML={{
          __html: (() => {
            try {
              const rawContent = JSON.parse(post.content);
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
            } catch (error) {
              console.error('Error parsing content:', error);
              return 'Error displaying content';
            }
          })(),
        }}
      />

      {/* Footer */}
      <footer className='mt-8 pt-8 border-t border-gray-100'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            {/* Admin Actions */}
            {canManagePost && (
              <>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className='text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50'
                  title='Hapus'
                  aria-label='Hapus pengumuman ini'
                >
                  <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
                <button
                  onClick={handlePinToggle}
                  disabled={isPinning}
                  className={`transition-colors p-2 rounded-full hover:bg-gray-100 ${
                    post.isPinned ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-600'
                  }`}
                  title={post.isPinned ? 'Hapus pin' : 'Pin ke atas'}
                  aria-label={post.isPinned ? 'Hapus pin dari pengumuman ini' : 'Pin pengumuman ini ke atas'}
                >
                  <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
                  </svg>
                </button>
              </>
            )}
            {canManagePost && (
              <button
                onClick={() => setIsEditing(true)}
                className='text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100'
                title='Edit'
                aria-label='Edit pengumuman ini'
              >
                <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </button>
            )}
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
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Konfirmasi Hapus</h3>
            <p className='text-sm text-gray-500 mb-6'>Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                disabled={isDeleting}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {isEditing && (
        <EditPostForm
          postId={post.id}
          initialData={{
            title: post.title,
            content: post.content,
            category: post.category as PostCategory,
          }}
          onClose={() => setIsEditing(false)}
          onUpdate={() => {
            // Refresh the page to show updated content
            window.location.reload();
          }}
        />
      )}
    </article>
  );
}
