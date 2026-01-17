'use client';

import { cn } from '@/lib/utils';

export type EvaluationBarProps = {
  whitePercentage: number;
  label: string;
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

// Clamp number between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Lichess win percentage formula
// Source: https://github.com/lichess-org/lila/blob/master/modules/analyse/src/main/WinPercent.scala
export function getWinPercentageFromCp(cp: number): number {
  const cpClamped = clamp(cp, -1000, 1000);
  const MULTIPLIER = -0.00368208;
  const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpClamped)) - 1;
  return 50 + 50 * winChances;
}

export function getWinPercentageFromMate(mate: number): number {
  return mate > 0 ? 100 : 0;
}

export function getWinPercentage(
  cp: number | null,
  mate: number | null
): number {
  if (mate !== null) {
    return getWinPercentageFromMate(mate);
  }
  if (cp !== null) {
    return getWinPercentageFromCp(cp);
  }
  return 50;
}

export function formatEvalLabel(
  cp: number | null,
  mate: number | null
): string {
  if (mate !== null) {
    return `M${Math.abs(mate)}`;
  }
  if (cp !== null) {
    const pEval = Math.abs(cp) / 100;
    const label = pEval.toFixed(1);
    return label.length > 3 ? pEval.toFixed(0) : label;
  }
  return '0.0';
}

export function EvaluationBar({
  whitePercentage,
  label,
  isActive = true,
  className,
  size = 'lg'
}: EvaluationBarProps) {
  const sizeClasses = {
    sm: 'h-[200px] w-5',
    md: 'h-[400px] w-6',
    lg: 'h-[calc(100vw-2rem)] w-5 sm:h-[400px] sm:w-7 lg:h-[560px]'
  };

  if (!isActive) {
    return null;
  }

  const whiteHeight = whitePercentage;
  const blackHeight = 100 - whitePercentage;
  const isBlackBetter = whitePercentage < 50;

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-sm',
        sizeClasses[size],
        className
      )}
    >
      {/* Black section (top) */}
      <div
        className='relative transition-all duration-500 ease-out'
        style={{
          height: `${blackHeight}%`,
          backgroundColor: 'var(--eval-black)'
        }}
      >
        {isBlackBetter && (
          <span
            className='absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold'
            style={{ color: 'var(--eval-white)' }}
          >
            {label}
          </span>
        )}
      </div>

      {/* White section (bottom) */}
      <div
        className='relative transition-all duration-500 ease-out'
        style={{
          height: `${whiteHeight}%`,
          backgroundColor: 'var(--eval-white)'
        }}
      >
        {!isBlackBetter && (
          <span
            className='absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold'
            style={{ color: 'var(--eval-black)' }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
