'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Advantage } from '@/types';

// Calculate bar percentage using sigmoid function for smooth transitions
function calcBarPercentage(
  advantage: Advantage,
  cp: number | null,
  mate: number | null
): number {
  if (advantage === 'equal') {
    return 50;
  }

  if (mate !== null) {
    return advantage === 'white' ? 98 : 2;
  }

  if (cp === null) {
    return 50;
  }

  const coefficient = 0.2;
  const adjustedCp = advantage === 'white' ? cp : -cp;
  const percentage =
    (1 / (1 + Math.exp(-(adjustedCp / 100) * coefficient))) * 100;

  return Math.min(Math.max(percentage, 2), 98);
}

// Format score for display
function formatScore(cp: number | null, mate: number | null): string {
  if (mate !== null) {
    return `M${mate}`;
  }
  if (cp !== null) {
    return (cp / 100).toFixed(1);
  }
  return '0.0';
}

export type EvaluationBarProps = {
  /** Who has the advantage */
  advantage: Advantage;
  /** Centipawn advantage (absolute value) */
  cp: number | null;
  /** Mate in N moves (null if no forced mate) */
  mate: number | null;
  /** Whether to show the bar */
  isActive?: boolean;
  /** Additional class name */
  className?: string;
  /** Height variant */
  size?: 'sm' | 'md' | 'lg';
};

/**
 * A modular evaluation bar component that displays position advantage.
 * Can be used in both analysis and play modes.
 */
export function EvaluationBar({
  advantage,
  cp,
  mate,
  isActive = true,
  className,
  size = 'lg'
}: EvaluationBarProps) {
  const barPercentage = useMemo(
    () => calcBarPercentage(advantage, cp, mate),
    [advantage, cp, mate]
  );

  const whiteHeight = barPercentage;
  const blackHeight = 100 - barPercentage;
  const displayScore = formatScore(cp, mate);

  const sizeClasses = {
    sm: 'h-[200px] w-5',
    md: 'h-[400px] w-6',
    lg: 'h-[calc(100vw-2rem)] max-h-[380px] w-7 sm:h-[400px] sm:max-h-none lg:h-[560px]'
  };

  if (!isActive) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-sm',
        sizeClasses[size],
        className
      )}
    >
      {/* Black's side (top) */}
      <div
        className='relative transition-all duration-300 ease-out'
        style={{
          height: `${blackHeight}%`,
          backgroundColor: 'var(--eval-black)'
        }}
      >
        {advantage === 'black' && (
          <span
            className='absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold'
            style={{ color: 'var(--eval-white)' }}
          >
            {displayScore}
          </span>
        )}
      </div>
      {/* White's side (bottom) */}
      <div
        className='relative transition-all duration-300 ease-out'
        style={{
          height: `${whiteHeight}%`,
          backgroundColor: 'var(--eval-white)'
        }}
      >
        {advantage !== 'black' && (
          <span
            className='absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold'
            style={{ color: 'var(--eval-black)' }}
          >
            {displayScore}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * A connected version that pulls data from the analysis store.
 * Use this when you want automatic connection to the analysis engine.
 */
export { EvaluationBarConnected } from './EvaluationBarConnected';
