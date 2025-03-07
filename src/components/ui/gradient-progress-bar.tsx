// src/components/ui/gradient-progress-bar.tsx
'use client';

interface GradientProgressBarProps {
  value: number;
  maxValue: number;
  className?: string;
}

export default function GradientProgressBar({ value, maxValue, className = '' }: GradientProgressBarProps) {
  const progress = (value / maxValue) * 100;

  return (
    <div className={`w-full h-4 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div className='h-full bg-gradient-to-r from-blue-500 to-purple-500' style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
    </div>
  );
}
