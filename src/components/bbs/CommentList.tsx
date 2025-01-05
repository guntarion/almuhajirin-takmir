'use client';

/**
 * File: src/components/bbs/CommentList.tsx
 * Description: Component for displaying a list of comments for a post.
 * Includes nested comments (replies), comment actions, and comment form integration.
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  status: 'PENDING' | 'PUBLISHED';
  author: Author;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface CommentListProps {
  postId: string;
}

function CommentItem({ comment, postId, onCommentAdded }: { comment: Comment; postId: string; onCommentAdded: () => void }) {
  const [isReplying, setIsReplying] = useState(false);
  const { data: session } = useSession();

  const handleReplySubmit = async (content: string) => {
    try {
      const response = await fetch(`/api/bbs/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          parentId: comment.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit reply');
      }

      setIsReplying(false);
      onCommentAdded(); // Refresh comments after reply
    } catch (error) {
      console.error('Error submitting reply:', error);
      throw error; // Let CommentForm handle the error
    }
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white p-4 rounded-lg border border-gray-100'>
        {/* Comment Header */}
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
              {comment.author.avatar ? (
                <img src={comment.author.avatar} alt={comment.author.name} className='h-full w-full object-cover' />
              ) : (
                <span className='text-sm font-medium text-gray-600'>{comment.author.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h4 className='font-medium text-gray-900'>{comment.author.name}</h4>
              <span className='text-sm text-gray-500'>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: id })}</span>
            </div>
          </div>

          {/* Comment Status */}
          {comment.status === 'PENDING' && <span className='text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full'>Menunggu Moderasi</span>}
        </div>

        {/* Comment Content */}
        <div className='text-gray-600 pl-10'>{comment.content}</div>

        {/* Comment Footer */}
        {session && (
          <div className='mt-2 pl-10'>
            <button onClick={() => setIsReplying(!isReplying)} className='text-sm text-blue-600 hover:text-blue-700'>
              {isReplying ? 'Batal' : 'Balas'}
            </button>
          </div>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className='pl-8'>
          <CommentForm postId={postId} onSubmit={handleReplySubmit} onCancel={() => setIsReplying(false)} />
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className='pl-8 space-y-4'>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} onCommentAdded={onCommentAdded} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/bbs/posts/${postId}/comments`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Gagal memuat komentar. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (content: string) => {
    try {
      const response = await fetch(`/api/bbs/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit comment');
      }

      fetchComments(); // Refresh comments after submission
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error; // Let CommentForm handle the error
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3].map((n) => (
          <div key={n} className='animate-pulse'>
            <div className='bg-white p-4 rounded-lg border border-gray-100'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-10 w-10 bg-gray-200 rounded-full'></div>
                <div className='space-y-2'>
                  <div className='h-4 w-24 bg-gray-200 rounded'></div>
                  <div className='h-3 w-32 bg-gray-100 rounded'></div>
                </div>
              </div>
              <div className='space-y-2 pl-10'>
                <div className='h-4 w-3/4 bg-gray-100 rounded'></div>
                <div className='h-4 w-1/2 bg-gray-100 rounded'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-red-500 p-4 bg-red-50 rounded-lg border border-red-100'>
        <p className='font-medium'>Error</p>
        <p className='text-sm'>{error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* New Comment Form */}
      {session && (
        <div className='mb-8'>
          <CommentForm postId={postId} onSubmit={handleCommentSubmit} />
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        comments.map((comment) => <CommentItem key={comment.id} comment={comment} postId={postId} onCommentAdded={fetchComments} />)
      ) : (
        <p className='text-gray-500 text-center py-8'>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
      )}
    </div>
  );
}
