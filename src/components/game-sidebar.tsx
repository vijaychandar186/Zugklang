'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/page-container';
import { useBoardStore } from '@/lib/store';
import { SettingsDialog } from '@/components/settings-dialog';
import { GameSelectionDialog } from '@/components/game-selection-dialog';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export function GameSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [copiedMoves, setCopiedMoves] = useState(false);
  const [copiedPGN, setCopiedPGN] = useState(false);

  const moves = useBoardStore((state) => state.moves);
  const onNewGame = useBoardStore((state) => state.onNewGame);
  const gameOver = useBoardStore((state) => state.gameOver);
  const setGameOver = useBoardStore((state) => state.setGameOver);
  const gameResult = useBoardStore((state) => state.gameResult);
  const setGameResult = useBoardStore((state) => state.setGameResult);
  const playAs = useBoardStore((state) => state.playAs);
  const viewingIndex = useBoardStore((state) => state.viewingIndex);
  const positionHistory = useBoardStore((state) => state.positionHistory);
  const goToStart = useBoardStore((state) => state.goToStart);
  const goToEnd = useBoardStore((state) => state.goToEnd);
  const goToPrev = useBoardStore((state) => state.goToPrev);
  const goToNext = useBoardStore((state) => state.goToNext);
  const goToMove = useBoardStore((state) => state.goToMove);

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  // Reset copied states after timeout
  useEffect(() => {
    if (copiedMoves) {
      const timer = setTimeout(() => setCopiedMoves(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedMoves]);

  useEffect(() => {
    if (copiedPGN) {
      const timer = setTimeout(() => setCopiedPGN(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPGN]);

  const formatMovesText = () => {
    const pairs: string[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = moves[i];
      const blackMove = moves[i + 1] || '';
      pairs.push(`${moveNum}. ${whiteMove}${blackMove ? ' ' + blackMove : ''}`);
    }
    return pairs.join(' ');
  };

  const formatPGN = () => {
    const date = new Date();
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    const result = gameOver
      ? gameResult?.includes('win')
        ? playAs === 'white'
          ? '1-0'
          : '0-1'
        : gameResult?.includes('resigned')
          ? playAs === 'white'
            ? '0-1'
            : '1-0'
          : '1/2-1/2'
      : '*';

    const headers = [
      '[Event "Casual Game"]',
      '[Site "Chess Variant"]',
      `[Date "${dateStr}"]`,
      `[White "${playAs === 'white' ? 'Player' : 'Stockfish'}"]`,
      `[Black "${playAs === 'black' ? 'Player' : 'Stockfish'}"]`,
      `[Result "${result}"]`
    ].join('\n');

    return `${headers}\n\n${formatMovesText()} ${result}`;
  };

  const handleCopyMoves = () => {
    navigator.clipboard.writeText(formatMovesText());
    setCopiedMoves(true);
  };

  const handleCopyPGN = () => {
    navigator.clipboard.writeText(formatPGN());
    setCopiedPGN(true);
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
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          <div className='shrink-0 border-b px-4 py-3'>
            <h3 className='font-semibold'>Moves</h3>
          </div>
          <PageContainer className='h-0 flex-grow'>
            <div className='px-4 py-2'>
              {moves.length === 0 ? (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  No moves yet
                </p>
              ) : (
                <ol className='space-y-1'>
                  {moves.map(
                    (move, index) =>
                      index % 2 === 0 && (
                        <li
                          key={index / 2}
                          className='flex items-center text-sm'
                        >
                          <span className='text-muted-foreground w-6'>
                            {index / 2 + 1}.
                          </span>
                          <button
                            onClick={() => goToMove(index)}
                            className='hover:bg-muted -ml-1 w-16 rounded px-1 text-left font-mono'
                            style={{
                              color: 'var(--move-white)',
                              backgroundColor:
                                viewingIndex === index + 1
                                  ? 'var(--move-white-active)'
                                  : undefined
                            }}
                          >
                            {move}
                          </button>
                          {index + 1 < moves.length && (
                            <button
                              onClick={() => goToMove(index + 1)}
                              className='hover:bg-muted rounded px-1 text-left font-mono'
                              style={{
                                color: 'var(--move-black)',
                                backgroundColor:
                                  viewingIndex === index + 2
                                    ? 'var(--move-black-active)'
                                    : undefined
                              }}
                            >
                              {moves[index + 1]}
                            </button>
                          )}
                        </li>
                      )
                  )}
                </ol>
              )}
            </div>
          </PageContainer>

          {/* Navigation Controls */}
          <div className='flex items-center justify-center gap-1 border-t px-2 py-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToStart}
              disabled={!canGoBack}
              title='Go to start'
            >
              <Icons.chevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToPrev}
              disabled={!canGoBack}
              title='Previous move'
            >
              <Icons.chevronLeft className='h-4 w-4' />
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
              <Icons.chevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={goToEnd}
              disabled={!canGoForward}
              title='Go to end'
            >
              <Icons.chevronsRight className='h-4 w-4' />
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
                <Icons.rematch className='mr-2 h-4 w-4' />
                Rematch
              </Button>
            </div>
          )}
          <div className='flex items-center gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleCopyMoves}
                  disabled={moves.length === 0}
                >
                  {copiedMoves ? (
                    <Icons.check
                      className='h-4 w-4'
                      style={{ color: 'var(--success)' }}
                    />
                  ) : (
                    <Icons.copy className='h-4 w-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Moves</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleCopyPGN}
                  disabled={moves.length === 0}
                  className='text-xs'
                >
                  {copiedPGN ? (
                    <Icons.check
                      className='h-4 w-4'
                      style={{ color: 'var(--success)' }}
                    />
                  ) : (
                    <>PGN</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy PGN</TooltipContent>
            </Tooltip>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSettingsOpen(true)}
              title='Settings'
            >
              <Icons.settings className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setNewGameOpen(true)}
              title='New Game'
            >
              <Icons.newGame className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='ml-auto'
              onClick={handleResign}
              disabled={gameOver || moves.length === 0}
            >
              <Icons.flag className='mr-2 h-4 w-4' />
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
