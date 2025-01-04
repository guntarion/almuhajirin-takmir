// src/components/ui/table.tsx
import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function Table({ headers, children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className='w-full text-sm text-left'>
        <thead className='bg-gray-50'>
          <tr>
            {headers.map((header) => (
              <th key={header} scope='col' className='px-6 py-3'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>{children}</tbody>
      </table>
    </div>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}
