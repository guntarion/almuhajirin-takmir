'use client';

/**
 * File: src/app/bbs/page.tsx
 * Description: Main page component for the BBS section.
 * This page displays the list of posts with search, filter, and sorting capabilities.
 * Includes functionality to create new posts through a modal form.
 */

import { useState } from 'react';
import PostList from '../../components/bbs/PostList';
import CreatePostForm from '../../components/bbs/CreatePostForm';
import { Button } from '../../components/ui/button';

export default function BBSPage() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = (post: { title: string; content: string; category: string }) => {
    // TODO: Implement post creation with database
    console.log('Creating post:', post);
    setShowCreatePost(false);
  };

  return (
    <div className='p-6'>
      {/* Create Post Button */}
      <div className='mb-6'>
        <Button onClick={() => setShowCreatePost(true)} className='bg-blue-600 hover:bg-blue-700 text-white flex items-center'>
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          <span>Buat Baru</span>
        </Button>
      </div>

      {/* Post List */}
      <PostList />

      {/* Create Post Modal */}
      {showCreatePost && <CreatePostForm onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />}
    </div>
  );
}
