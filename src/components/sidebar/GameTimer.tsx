'use client';

import { memo } from 'react';
import { useGameTimer, formatTime } from '@/hooks/useGameTimer';
import { cn } from '@/lib/utils';

type ClockProps = {
  time: number | null;
  isActive: boolean;
  isPlayer: boolean;
  label: string;
};

const Clock = memo(function Clock({
  time,
  isActive,
  isPlayer,
  label
}: ClockProps) {
  const isLow = time !== null && time <= 30;
  const isCritical = time !== null && time <= 10;

  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-md px-3 py-2 transition-colors',
        isActive && 'bg-primary/10',
        !isActive && 'opacity-60'
      )}
    >
      <span className='text-muted-foreground text-xs'>{label}</span>
      <span
        className={cn(
          'font-mono text-xl font-bold tabular-nums',
          isActive && 'text-primary',
          isLow && isPlayer && 'text-yellow-500',
          isCritical && isPlayer && 'animate-pulse text-red-500'
        )}
      >
        {formatTime(time)}
      </span>
    </div>
  );
});

export const GameTimer = memo(function GameTimer() {
  const { timeControl, whiteTime, blackTime, activeTimer, hasTimer } =
    useGameTimer();

  if (!hasTimer) {
    return null;
  }

  return (
    <div className='flex justify-center gap-4 border-b px-4 py-2'>
      <Clock
        time={whiteTime}
        isActive={activeTimer === 'white'}
        isPlayer={true}
        label='White'
      />
      <Clock
        time={blackTime}
        isActive={activeTimer === 'black'}
        isPlayer={true}
        label='Black'
      />
    </div>
  );
});
