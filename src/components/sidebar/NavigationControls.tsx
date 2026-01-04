'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';

type NavigationControlsProps = {
  viewingIndex: number;
  totalPositions: number;
  canGoBack: boolean;
  canGoForward: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;
};

export function NavigationControls({
  viewingIndex,
  totalPositions,
  canGoBack,
  canGoForward,
  isPlaying,
  onTogglePlay,
  onGoToStart,
  onGoToEnd,
  onGoToPrev,
  onGoToNext
}: NavigationControlsProps) {
  return (
    <div className='flex flex-col gap-2 border-t px-2 py-2'>
      {/* Move Counter */}
      <div className='flex justify-center'>
        <span className='text-muted-foreground text-xs font-medium'>
          Move {viewingIndex} / {totalPositions - 1}
        </span>
      </div>

      {/* Controls Row */}
      <div className='flex items-center justify-center gap-1'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onGoToStart}
          disabled={!canGoBack}
          title='Go to start'
        >
          <Icons.chevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={onGoToPrev}
          disabled={!canGoBack}
          title='Previous move'
        >
          <Icons.chevronLeft className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon'
          className='text-primary h-8 w-8'
          onClick={onTogglePlay}
          disabled={!canGoForward && !isPlaying}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Icons.pause className='h-4 w-4' />
          ) : (
            <Icons.play className='h-4 w-4' />
          )}
        </Button>

        <Button
          variant='ghost'
          size='icon'
          onClick={onGoToNext}
          disabled={!canGoForward}
          title='Next move'
        >
          <Icons.chevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={onGoToEnd}
          disabled={!canGoForward}
          title='Go to end'
        >
          <Icons.chevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
