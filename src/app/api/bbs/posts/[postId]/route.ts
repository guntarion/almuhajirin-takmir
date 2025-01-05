import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth-config';
import { prisma } from '../../../../../lib/prisma';

// PATCH /api/bbs/posts/[postId] - Update post
export async function PATCH(request: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the post to check ownership
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Only allow the author to edit their own posts
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own posts' }, { status: 403 });
    }

    const { title, content, excerpt, category } = await request.json();

    // Parse the content to get plain text for excerpt if not provided
    let finalExcerpt = excerpt;
    if (!finalExcerpt) {
      try {
        const contentObj = JSON.parse(content);
        if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
          finalExcerpt = contentObj.blocks[0].text.slice(0, 200);
        }
      } catch {
        // If parsing fails, use raw content
        finalExcerpt = content.slice(0, 200);
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.postId },
      data: {
        title,
        content,
        excerpt: finalExcerpt,
        category,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
