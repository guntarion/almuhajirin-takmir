/**
 * File: src/lib/types/bbs.ts
 * Description: Type definitions for the BBS (Bulletin Board System) feature
 */

export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  author: Author;
  authorId: string;
  date: string;
  category: string;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  isApproved: boolean;
  status: string;
  tags: string[];
}

export interface PostCreateInput {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface PostFilters {
  search?: string;
  category?: string;
  sort: 'newest' | 'oldest' | 'most_comments' | 'most_views';
  page: number;
  limit: number;
}
