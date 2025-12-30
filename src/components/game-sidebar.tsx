'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBoardStore } from '@/lib/store';
import { SettingsDialog } from '@/components/settings-dialog';
import { GameSelectionDialog } from '@/components/game-selection-dialog';
import {
  Share2,
  Settings,
  Flag,
  RotateCcw,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight
} from 'lucide-react';
import { toast } from 'sonner';

export function GameSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);

  const moves = useBoardStore((state) => state.moves);
  const onNewGame = useBoardStore((state) => state.onNewGame);
  const gameOver = useBoardStore((state) => state.gameOver);
  const setGameOver = useBoardStore((state) => state.setGameOver);
  const gameResult = useBoardStore((state) => state.gameResult);
  const currentFEN = useBoardStore((state) => state.currentFEN);
  const setGameResult = useBoardStore((state) => state.setGameResult);
  const viewingIndex = useBoardStore((state) => state.viewingIndex);
  const positionHistory = useBoardStore((state) => state.positionHistory);
  const goToStart = useBoardStore((state) => state.goToStart);
  const goToEnd = useBoardStore((state) => state.goToEnd);
  const goToPrev = useBoardStore((state) => state.goToPrev);
  const goToNext = useBoardStore((state) => state.goToNext);
  const goToMove = useBoardStore((state) => state.goToMove);

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  const handleCopyFEN = () => {
    navigator.clipboard.writeText(currentFEN).then(() => {
      toast.success('FEN copied to clipboard!');
    });
  };

  const handleResign = () => {
    setGameResult('You resigned');
    setGameOver(true);
  };

  const handleRematch = () => {
    onNewGame();
    setGameOver(false);
  };

  return (
    <>
      <div className='bg-card flex h-full flex-col rounded-lg border'>
        {/* Moves Section */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          <div className='border-b px-4 py-3'>
            <h3 className='font-semibold'>Moves</h3>
          </div>
          <ScrollArea className='flex-1 px-4 py-2'>
            {moves.length === 0 ? (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No moves yet
              </p>
            ) : (
              <ol className='space-y-1'>
                {moves.map(
                  (move, index) =>
                    index % 2 === 0 && (
                      <li key={index / 2} className='flex items-center text-sm'>
                        <span className='text-muted-foreground w-6'>
                          {index / 2 + 1}.
                        </span>
                        <button
                          onClick={() => goToMove(index)}
                          className={`hover:bg-muted -ml-1 w-16 rounded px-1 text-left font-mono ${
                            viewingIndex === index + 1
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-blue-500'
                          }`}
                        >
                          {move}
                        </button>
                        {index + 1 < moves.length && (
                          <button
                            onClick={() => goToMove(index + 1)}
                            className={`hover:bg-muted rounded px-1 text-left font-mono ${
                              viewingIndex === index + 2
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'text-yellow-500'
                            }`}
                          >
                            {moves[index + 1]}
                          </button>
                        )}
                      </li>
                    )
                )}
              </ol>
            )}
          </ScrollArea>

          {/* Navigation Controls */}
          <div className='flex items-center justify-center gap-1 border-t px-2 py-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToStart}
              disabled={!canGoBack}
              title='Go to start'
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToPrev}
              disabled={!canGoBack}
              title='Previous move'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='text-muted-foreground min-w-[3rem] text-center text-xs'>
              {viewingIndex} / {positionHistory.length - 1}
            </span>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToNext}
              disabled={!canGoForward}
              title='Next move'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToEnd}
              disabled={!canGoForward}
              title='Go to end'
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {gameOver && (
            <div className='flex flex-col gap-2 border-b pb-2'>
              <p className='text-center text-sm font-medium'>{gameResult}</p>
              <Button
                variant='default'
                size='sm'
                className='w-full'
                onClick={handleRematch}
              >
                <RotateCcw className='mr-2 h-4 w-4' />
                Rematch
              </Button>
            </div>
          )}
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCopyFEN}
              title='Copy FEN'
            >
              <Share2 className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSettingsOpen(true)}
              title='Settings'
            >
              <Settings className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setNewGameOpen(true)}
              title='New Game'
            >
              <Plus className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='ml-auto'
              onClick={handleResign}
              disabled={gameOver || moves.length === 0}
            >
              <Flag className='mr-2 h-4 w-4' />
              Resign
            </Button>
          </div>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <GameSelectionDialog open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
