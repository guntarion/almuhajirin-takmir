// src/components/ui/gradient-progress-bar.tsx
import { useMemo } from 'react';

interface ProgressBarProps {
  value: number;
  maxValue: number;
  className?: string;
}

const GradientProgressBar = ({ value, maxValue, className = '' }: ProgressBarProps) => {
  const percentage = useMemo(() => Math.min((value / maxValue) * 100, 100), [value, maxValue]);

  const gradientStyle = useMemo(
    () => ({
      width: `${percentage}%`,
      background:
        percentage === 100
          ? 'linear-gradient(to right, #60a5fa, #93c5fd)' // blue gradient
          : percentage >= 61
          ? 'linear-gradient(to right, #22c55e, #4ade80)' // green gradient
          : percentage >= 21
          ? 'linear-gradient(to right, #eab308, #facc15)' // yellow gradient
          : 'linear-gradient(to right, #ef4444, #f87171)', // red gradient
      transition: 'all 0.3s ease-in-out',
    }),
    [percentage]
  );

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div className='h-full rounded-full' style={gradientStyle}>
        {/* Optional: Add shine effect */}
        <div className='h-full w-full rounded-full bg-gradient-to-b from-white/10 to-transparent' />
      </div>
    </div>
  );
};

export default GradientProgressBar;
