'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';

type NavigationControlsProps = {
  viewingIndex: number;
  totalPositions: number;
  canGoBack: boolean;
  canGoForward: boolean;
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
  onGoToStart,
  onGoToEnd,
  onGoToPrev,
  onGoToNext
}: NavigationControlsProps) {
  return (
    <div className='flex items-center justify-center gap-1 border-t px-2 py-2'>
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
      <span className='text-muted-foreground min-w-[3rem] text-center text-xs'>
        {viewingIndex} / {totalPositions - 1}
      </span>
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
  );
}
