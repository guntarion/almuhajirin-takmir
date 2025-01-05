'use client';

/**
 * File: src/app/bbs/page.tsx
 * Description: Main page component for the BBS section.
 * This page displays the list of posts with search, filter, and sorting capabilities.
 * Includes functionality to create new posts through a modal form for authorized users.
 */

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import PostList from '../../components/bbs/PostList';
import CreatePostForm from '../../components/bbs/CreatePostForm';
import { Button } from '../../components/ui/button';

// Roles authorized to create posts
const AUTHORIZED_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT', 'KOORDINATOR_ANAKREMAS'];

export default function BBSPage() {
  const { data: session } = useSession();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCreatePost = session?.user && AUTHORIZED_ROLES.includes(session.user.role);

  const handleCreatePost = async (post: { title: string; content: string; category: string }) => {
    if (!session?.user) {
      toast.error('You must be logged in to create posts');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bbs/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      toast.success('Post created successfully');
      setShowCreatePost(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-6'>
      {/* Create Post Button - Only shown to authorized users */}
      {canCreatePost && (
        <div className='mb-6'>
          <Button
            onClick={() => setShowCreatePost(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white flex items-center'
            disabled={isSubmitting}
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <span>{isSubmitting ? 'Membuat...' : 'Buat Baru'}</span>
          </Button>
        </div>
      )}

      {/* Post List */}
      <PostList />

      {/* Create Post Modal */}
      {showCreatePost && <CreatePostForm onClose={() => !isSubmitting && setShowCreatePost(false)} onSubmit={handleCreatePost} />}
    </div>
  );
}
