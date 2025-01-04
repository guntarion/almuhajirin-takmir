// src/components/ui/pagination.tsx
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Button variant='outline' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>

      <div className='flex gap-2'>
        {getPageNumbers().map((page) => (
          <Button key={page} variant={page === currentPage ? 'default' : 'outline'} onClick={() => onPageChange(page)}>
            {page}
          </Button>
        ))}
      </div>

      <Button variant='outline' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
}
