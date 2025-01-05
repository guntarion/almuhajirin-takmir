/**
 * File: src/lib/types/bbs.ts
 * Description: Type definitions for the bulletin board system.
 * Includes types for posts, comments, and related data structures.
 */

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  isApproved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  date: string;
  isApproved: boolean;
  parentId?: string; // For nested replies
  replies?: Comment[];
}

export type PostCategory = 'Pengumuman' | 'Kajian' | 'Kegiatan' | 'Rapat' | 'Lainnya';

export type SortOption = 'newest' | 'oldest' | 'most_comments' | 'most_views';

export interface CreatePostData {
  title: string;
  content: string;
  category: PostCategory;
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string; // For replies
}
