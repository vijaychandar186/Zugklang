'use client';

import {
  useAnalysisBoardState,
  useAnalysisBoardActions,
  AnalysisMode
} from '@/hooks/stores/useAnalysisBoardStore';
import { Button } from '@/components/ui/button';
import { PGNImport } from './PGNImport';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function AnalysisToolbar() {
  const { mode, viewingIndex, positionHistory, playingAgainstStockfish } =
    useAnalysisBoardState();
  const {
    setMode,
    resetToStarting,
    resetToEmpty,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    startPlayingFromPosition,
    stopPlayingFromPosition
  } = useAnalysisBoardActions();

  const isAtStart = viewingIndex === 0;
  const isAtEnd = viewingIndex === positionHistory.length - 1;

  const handleModeChange = (newMode: AnalysisMode) => {
    if (newMode === mode) return;
    setMode(newMode);
  };

  const handlePlayFromPosition = (color: 'white' | 'black') => {
    startPlayingFromPosition(color);
  };

  return (
    <div className='bg-card flex flex-col gap-3 rounded-lg border p-4'>
      {/* Top Row: Mode Selection and Actions */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex gap-2'>
          <Button
            variant={mode === 'normal' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleModeChange('normal')}
            className='gap-2'
          >
            <Icons.square className='h-4 w-4' />
            Normal
          </Button>
          <Button
            variant={mode === 'position-editor' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleModeChange('position-editor')}
            className='gap-2'
          >
            <Icons.edit className='h-4 w-4' />
            Position Editor
          </Button>
        </div>

        <div className='flex gap-2'>
          <PGNImport />

          {/* Play from Position */}
          {mode !== 'position-editor' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={playingAgainstStockfish ? 'default' : 'outline'}
                  size='sm'
                  className='gap-2'
                >
                  <Icons.stockfish className='h-4 w-4' />
                  {playingAgainstStockfish ? 'Playing...' : 'Play vs Stockfish'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Play from this position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {playingAgainstStockfish ? (
                  <DropdownMenuItem onClick={stopPlayingFromPosition}>
                    Stop Playing
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => handlePlayFromPosition('white')}
                    >
                      Play as White
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePlayFromPosition('black')}
                    >
                      Play as Black
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Reset Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='gap-2'>
                <Icons.rematch className='h-4 w-4' />
                Reset
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Reset Board</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetToStarting}>
                <Icons.square className='mr-2 h-4 w-4' />
                Starting Position
              </DropdownMenuItem>
              <DropdownMenuItem onClick={resetToEmpty}>
                <Icons.trash className='mr-2 h-4 w-4' />
                Empty Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Row: Navigation Controls */}
      {mode !== 'position-editor' && positionHistory.length > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={goToStart}
            disabled={isAtStart}
            className='gap-1'
          >
            <Icons.chevronFirst className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={goToPrev}
            disabled={isAtStart}
            className='gap-1'
          >
            <Icons.chevronLeft className='h-4 w-4' />
            Prev
          </Button>
          <span className='text-muted-foreground min-w-[80px] text-center text-sm'>
            {viewingIndex} / {positionHistory.length - 1}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={goToNext}
            disabled={isAtEnd}
            className='gap-1'
          >
            Next
            <Icons.chevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={goToEnd}
            disabled={isAtEnd}
            className='gap-1'
          >
            <Icons.chevronLast className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  );
}
