/**
 * File: src/components/bbs/CommentList.tsx
 * Description: Component for displaying a list of comments for a post.
 * Includes nested comments (replies) and comment actions.
 */

interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
  isApproved: boolean;
  replies?: Comment[];
}

interface CommentListProps {
  postId: string; // Used to fetch comments for a specific post from the API
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className='space-y-4'>
      <div className='bg-white p-4 rounded-lg border border-gray-100'>
        {/* Comment Header */}
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
              <span className='text-sm font-medium text-gray-600'>{comment.author.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h4 className='font-medium text-gray-900'>{comment.author}</h4>
              <span className='text-sm text-gray-500'>{comment.date}</span>
            </div>
          </div>

          {/* Comment Actions */}
          <div className='flex items-center gap-2'>
            <button className='text-gray-400 hover:text-blue-600'>
              <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
              </svg>
            </button>
          </div>
        </div>

        {/* Comment Content */}
        <div className='text-gray-600 pl-10'>{comment.content}</div>

        {/* Comment Footer */}
        <div className='mt-2 pl-10'>
          <button className='text-sm text-blue-600 hover:text-blue-700'>Balas</button>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className='pl-8 space-y-4'>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentList({ postId }: CommentListProps) {
  // TODO: Fetch comments from API using postId
  // For now using sample data
  console.log('Fetching comments for post:', postId);

  const comments: Comment[] = [
    {
      id: '1',
      content: 'Jazakumullah khairan atas informasinya. Mohon info untuk jadwal kajian akhwat.',
      author: 'Sarah',
      date: '2024-03-11',
      isApproved: true,
      replies: [
        {
          id: '1-1',
          content: 'Untuk jadwal kajian akhwat akan diumumkan segera.',
          author: 'Admin',
          date: '2024-03-11',
          isApproved: true,
        },
      ],
    },
    {
      id: '2',
      content: 'Apakah ada siaran langsung untuk kajian-kajian tersebut?',
      author: 'Ahmad',
      date: '2024-03-10',
      isApproved: true,
    },
  ];

  return (
    <div className='space-y-6'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
