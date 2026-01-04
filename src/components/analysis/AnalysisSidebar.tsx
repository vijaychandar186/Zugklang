'use client';

import { useState, useEffect, useRef } from 'react';

import {
  useAnalysisBoardState,
  useAnalysisBoardActions
} from '@/hooks/stores/useAnalysisBoardStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/hooks/stores/useAnalysisStore';
import { PGNImport } from './PGNImport';
import { MoveHistory } from '@/components/sidebar/MoveHistory';
import { NavigationControls } from '@/components/sidebar/NavigationControls';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/Icons';

export function AnalysisSidebar() {
  const {
    moves,
    viewingIndex,
    positionHistory,
    playingAgainstStockfish,
    boardOrientation
  } = useAnalysisBoardState();

  const { isAnalysisOn } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();

  const {
    resetToStarting,
    resetToEmpty,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    startPlayingFromPosition,
    stopPlayingFromPosition,
    toggleBoardOrientation
  } = useAnalysisBoardActions();

  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);

  // Auto-play on mount if history exists
  useEffect(() => {
    if (!hasAutoPlayed.current && positionHistory.length > 1) {
      hasAutoPlayed.current = true;
      // Short delay to ensure UI is ready
      setTimeout(() => {
        goToStart();
        setIsPlaying(true);
      }, 100);
    }
  }, [positionHistory.length, goToStart]);

  // Playback loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (viewingIndex < positionHistory.length - 1) {
          goToNext();
        } else {
          setIsPlaying(false);
        }
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewingIndex, positionHistory.length, goToNext]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  const handlePlayFromPosition = (color: 'white' | 'black') => {
    startPlayingFromPosition(color);
  };

  const toggleAnalysis = () => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  };

  return (
    <div className='bg-card flex h-full flex-col rounded-lg border'>
      {/* Header with Tools */}
      <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
        <h3 className='font-semibold'>Moves</h3>
        <div className='flex items-center gap-1'>
          {/* PGN Import Button */}
          <PGNImport>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              title='Import PGN/FEN'
            >
              <Icons.upload className='h-4 w-4' />
            </Button>
          </PGNImport>

          {/* Analysis Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                title='Analysis Options'
              >
                <Icons.settings className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleBoardOrientation}>
                <Icons.flipBoard className='mr-2 h-4 w-4' />
                Flip Board ({boardOrientation === 'white' ? 'Black' : 'White'})
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Engine</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleAnalysis}>
                <Icons.stockfish
                  className={`mr-2 h-4 w-4 ${isAnalysisOn ? 'text-green-500' : 'text-muted-foreground'}`}
                />
                {isAnalysisOn ? 'Disable Engine' : 'Enable Engine'}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Play vs Stockfish</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {playingAgainstStockfish ? (
                <DropdownMenuItem onClick={stopPlayingFromPosition}>
                  <Icons.stockfish className='mr-2 h-4 w-4' />
                  Stop Playing
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => handlePlayFromPosition('white')}
                  >
                    <Icons.stockfish className='mr-2 h-4 w-4' />
                    Play as White
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlayFromPosition('black')}
                  >
                    <Icons.stockfish className='mr-2 h-4 w-4' />
                    Play as Black
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Reset Board</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetToStarting}>
                <Icons.rematch className='mr-2 h-4 w-4' />
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

      {/* Moves List */}
      <ScrollArea className='h-0 flex-grow'>
        <div className='px-4 py-2'>
          <MoveHistory
            moves={moves}
            viewingIndex={viewingIndex}
            onMoveClick={goToMove}
          />
        </div>
      </ScrollArea>

      {/* Navigation Controls */}
      <NavigationControls
        viewingIndex={viewingIndex}
        totalPositions={positionHistory.length}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onGoToStart={goToStart}
        onGoToEnd={goToEnd}
        onGoToPrev={goToPrev}
        onGoToNext={goToNext}
      />
    </div>
  );
}
