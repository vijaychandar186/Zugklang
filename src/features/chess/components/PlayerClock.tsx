'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/features/game/utils/formatting';

type PlayerClockProps = {
  time: number | null;
  isActive: boolean;
  isPlayer: boolean;
};

export const PlayerClock = memo(function PlayerClock({
  time,
  isActive,
  isPlayer
}: PlayerClockProps) {
  if (time === null) return null;

  const isLow = time <= 30;
  const isCritical = time <= 10;

  return (
    <div
      className={cn(
        'rounded-md px-3 py-1 font-mono text-lg font-bold tabular-nums transition-colors',
        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted',
        !isActive && 'opacity-70',
        isLow &&
          isPlayer &&
          isActive &&
          'text-background bg-[color:var(--classification-inaccuracy)]',
        isCritical &&
          isPlayer &&
          isActive &&
          'bg-destructive text-destructive-foreground animate-pulse'
      )}
    >
      {formatTime(time)}
    </div>
  );
});
