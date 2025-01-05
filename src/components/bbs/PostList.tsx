'use client';

/**
 * File: src/components/bbs/PostList.tsx
 * Description: Component for displaying a list of posts with filtering, sorting, and pagination.
 * Uses PostItem component to render individual posts.
 */

import { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { Pagination } from '../../components/ui/pagination';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import SortingOptions from './SortingOptions';
import { Post } from '../../lib/types/bbs';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts: initialPosts }: PostListProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Filter and sort posts when search, category, or sort option changes
  useEffect(() => {
    let result = [...initialPosts];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

      switch (sortOption) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'most_comments':
          return b.commentCount - a.commentCount;
        case 'most_views':
          return b.viewCount - a.viewCount;
        default:
          return 0;
      }
    });

    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, sortOption, initialPosts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <div className='flex-1'>
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className='flex gap-4'>
          <CategoryFilter onCategoryChange={setSelectedCategory} />
          <SortingOptions onSortChange={setSortOption} />
        </div>
      </div>

      {/* Posts */}
      {currentPosts.length > 0 ? (
        <div className='space-y-6'>
          {currentPosts.map((post) => (
            <div key={post.id} className={post.isPinned ? 'relative' : ''}>
              <PostItem
                id={post.id}
                title={post.title}
                excerpt={post.excerpt || ''}
                author={post.author}
                date={post.date}
                category={post.category}
                commentCount={post.commentCount}
                viewCount={post.viewCount}
                isPinned={post.isPinned}
                status={post.status as 'DRAFT' | 'PUBLISHED'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-8 text-gray-500'>Tidak ada pengumuman yang ditemukan.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-8'>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
