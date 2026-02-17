'use client';

import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { useFourPlayerStore, TEAM_ROTATIONS } from '../store';
import { useFourPlayerTimer } from '../hooks/useFourPlayerTimer';
import { formatTime } from '@/features/game/utils/formatting';
import { playSound } from '@/features/game/utils/sounds';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { cn } from '@/lib/utils';
import type { Team, MoveRecord } from '../engine';

const TEAM_INFO: Record<
  Team,
  { label: string; cssVar: string; short: string }
> = {
  r: { label: 'Red', cssVar: 'var(--four-player-red)', short: 'R' },
  b: { label: 'Blue', cssVar: 'var(--four-player-blue)', short: 'B' },
  y: { label: 'Yellow', cssVar: 'var(--four-player-yellow)', short: 'Y' },
  g: { label: 'Green', cssVar: 'var(--four-player-green)', short: 'G' }
};

const TEAMS: Team[] = ['r', 'b', 'y', 'g'];

// Clipboard hook
function useClipboard({ resetDelay = 2000 }: { resetDelay?: number } = {}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), resetDelay);
        return true;
      } catch {
        return false;
      }
    },
    [resetDelay]
  );

  const isCopied = useCallback((key: string) => copiedKey === key, [copiedKey]);

  return {
    copy,
    isCopied,
    copiedKey
  };
}

// Format moves for text output
function formatMovesText(moves: MoveRecord[]): string {
  const rounds: string[] = [];
  for (let i = 0; i < moves.length; i += 4) {
    const roundNum = Math.floor(i / 4) + 1;
    const roundMoves: string[] = [];
    for (let j = 0; j < 4; j++) {
      const move = moves[i + j];
      if (move) {
        const info = TEAM_INFO[move.team];
        roundMoves.push(`${info.label}: ${move.notation}`);
      }
    }
    rounds.push(`${roundNum}. ${roundMoves.join(', ')}`);
  }
  return rounds.join('\n');
}

type MoveItemProps = {
  move: MoveRecord;
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
};

const MoveItem = memo(function MoveItem({
  move,
  index,
  isActive,
  onClick
}: MoveItemProps) {
  const handleClick = useCallback(() => onClick(index), [onClick, index]);
  const info = TEAM_INFO[move.team];

  return (
    <button
      onClick={handleClick}
      className={`hover:bg-muted flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs ${
        isActive ? 'bg-muted ring-border ring-1 ring-inset' : ''
      }`}
    >
      <span
        className='inline-block h-2 w-2 shrink-0 rounded-full'
        style={{ backgroundColor: info.cssVar }}
      />
      <span>{move.notation}</span>
    </button>
  );
});

function FourPlayerMoveHistory({
  moves,
  viewingMoveIndex,
  onMoveClick
}: {
  moves: MoveRecord[];
  viewingMoveIndex: number;
  onMoveClick: (index: number) => void;
}) {
  if (moves.length === 0) {
    return (
      <p className='text-muted-foreground py-4 text-center text-sm'>
        No moves yet
      </p>
    );
  }

  const rounds: { roundNum: number; startIndex: number }[] = [];
  for (let i = 0; i < moves.length; i += 4) {
    rounds.push({ roundNum: Math.floor(i / 4) + 1, startIndex: i });
  }

  return (
    <ol className='space-y-1'>
      {rounds.map(({ roundNum, startIndex }) => (
        <li
          key={roundNum}
          className='flex flex-wrap items-center gap-0.5 text-sm'
        >
          <span className='text-muted-foreground w-6 shrink-0 text-xs'>
            {roundNum}.
          </span>
          {[0, 1, 2, 3].map((offset) => {
            const idx = startIndex + offset;
            if (idx >= moves.length) return null;
            return (
              <MoveItem
                key={idx}
                move={moves[idx]}
                index={idx}
                isActive={viewingMoveIndex === idx}
                onClick={onMoveClick}
              />
            );
          })}
        </li>
      ))}
    </ol>
  );
}

function PlayerButton({
  team,
  isActive,
  onClick
}: {
  team: Team;
  isActive: boolean;
  onClick: () => void;
}) {
  const info = TEAM_INFO[team];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
        isActive ? 'bg-foreground/10' : 'hover:bg-muted'
      }`}
      style={isActive ? { boxShadow: `0 0 0 2px ${info.cssVar}` } : undefined}
    >
      <div
        className='h-2.5 w-2.5 rounded-full'
        style={{ backgroundColor: info.cssVar }}
      />
      {info.label}
    </button>
  );
}

export function FourPlayerSidebar() {
  const router = useRouter();
  const {
    moves,
    viewingMoveIndex,
    currentTeam,
    orientation,
    isGameOver,
    winner,
    loseOrder,
    game,
    gameStarted,
    gameResult,
    points,
    goToMove,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    resetGame,
    abortGame,
    setOrientation
  } = useFourPlayerStore();

  const { hasTimer, teamTimes, activeTimer } = useFourPlayerTimer();
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const canGoBack = viewingMoveIndex > -1;
  const canGoForward = viewingMoveIndex < moves.length - 1;

  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingMoveIndex + 1,
    totalItems: moves.length + 1,
    onNext: goToNext
  });

  const { copy, isCopied } = useClipboard();

  const currentInfo = TEAM_INFO[currentTeam];
  const isChecked = !isGameOver && game.isChecked;

  const handleAbort = () => {
    abortGame();
  };

  const handleOfferDraw = () => {
    if (soundEnabled) playSound('draw-offer');
  };

  const handleAcceptDraw = () => {
    if (soundEnabled) playSound('game-end');
    // Use the store's internal method to set game result
    useFourPlayerStore.setState({
      isGameOver: true,
      gameStarted: false,
      gameResult: 'Draw by agreement'
    });
  };

  const handleCopyMoves = () => copy(formatMovesText(moves), 'moves');
  const handleCopyGameState = () => {
    const gameState = JSON.stringify(
      {
        moves: moves,
        currentTeam: currentTeam,
        winner: winner,
        loseOrder: loseOrder,
        points: points
      },
      null,
      2
    );
    copy(gameState, 'state');
  };

  return (
    <>
      <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
          <div className='flex items-center gap-1'>
            <span className='text-muted-foreground mr-2 text-xs'>
              {moves.length} move{moves.length !== 1 ? 's' : ''}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => router.push('/')}
                >
                  <Icons.home className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Icons.share className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Game</DialogTitle>
                  <DialogDescription>
                    Copy moves or game state to clipboard.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-3 pt-2'>
                  <Button
                    onClick={handleCopyMoves}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>Copy Moves</span>
                      <span className='text-muted-foreground text-xs'>
                        Simple move list
                      </span>
                    </div>
                    {isCopied('moves') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                  <Button
                    onClick={handleCopyGameState}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>Copy Game State</span>
                      <span className='text-muted-foreground text-xs'>
                        Full game state as JSON
                      </span>
                    </div>
                    {isCopied('state') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setSettingsOpen(true)}
                >
                  <Icons.settings className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <FourPlayerMoveHistory
              moves={moves}
              viewingMoveIndex={viewingMoveIndex}
              onMoveClick={goToMove}
            />
          </div>
        </ScrollArea>

        <NavigationControls
          viewingIndex={viewingMoveIndex + 1}
          totalPositions={moves.length + 1}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onGoToStart={goToStart}
          onGoToEnd={goToEnd}
          onGoToPrev={goToPrev}
          onGoToNext={goToNext}
        />

        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {(isGameOver || !gameStarted) && (
            <div className='flex flex-col gap-2 border-b pb-2'>
              {gameResult ? (
                <p className='text-center text-sm font-medium'>{gameResult}</p>
              ) : isGameOver && winner ? (
                <>
                  <div className='flex items-center justify-center gap-2'>
                    <div
                      className='h-3.5 w-3.5 rounded-full'
                      style={{ backgroundColor: TEAM_INFO[winner].cssVar }}
                    />
                    <span className='text-sm font-bold'>
                      {TEAM_INFO[winner].label} wins!
                    </span>
                  </div>
                  {loseOrder.length > 0 && (
                    <p className='text-muted-foreground text-center text-xs'>
                      Eliminated:{' '}
                      {loseOrder.map((t, i) => (
                        <span key={t}>
                          {i > 0 && ', '}
                          <span style={{ color: TEAM_INFO[t].cssVar }}>
                            {TEAM_INFO[t].label}
                          </span>
                        </span>
                      ))}
                    </p>
                  )}
                </>
              ) : (
                <p className='text-center text-sm font-medium'>
                  No active game
                </p>
              )}
              <Button
                variant='default'
                size='sm'
                className='w-full'
                onClick={resetGame}
              >
                <Icons.newGame className='mr-2 h-4 w-4' />
                New Game
              </Button>
            </div>
          )}

          {!isGameOver && (
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full'
                  style={{ backgroundColor: currentInfo.cssVar }}
                />
                <span className='text-sm font-medium'>
                  {currentInfo.label}&apos;s turn
                </span>
                {isChecked && (
                  <span className='bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-xs font-bold'>
                    Check!
                  </span>
                )}
              </div>

              {loseOrder.length > 0 && (
                <p className='text-muted-foreground text-center text-xs'>
                  {loseOrder.length} eliminated:{' '}
                  {loseOrder.map((t, i) => (
                    <span key={t}>
                      {i > 0 && ', '}
                      <span style={{ color: TEAM_INFO[t].cssVar }}>
                        {TEAM_INFO[t].label}
                      </span>
                    </span>
                  ))}
                </p>
              )}
            </div>
          )}

          <div className='flex flex-wrap items-center justify-center gap-1'>
            {TEAMS.map((team) => {
              const time = teamTimes[team];
              const isActive = activeTimer === team;
              const isLow = time !== null && time <= 30;
              const isCritical = time !== null && time <= 10;
              return (
                <div key={team} className='flex flex-col items-center gap-0.5'>
                  <span className='text-muted-foreground text-[10px]'>
                    {points[team]}pts
                  </span>
                  {hasTimer && time !== null && (
                    <div
                      className={cn(
                        'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted',
                        !isActive && 'opacity-70',
                        isLow &&
                          isActive &&
                          'text-background bg-[color:var(--classification-inaccuracy)]',
                        isCritical &&
                          isActive &&
                          'bg-destructive text-destructive-foreground animate-pulse'
                      )}
                    >
                      {formatTime(time)}
                    </div>
                  )}
                  <PlayerButton
                    team={team}
                    isActive={orientation === TEAM_ROTATIONS[team]}
                    onClick={() => setOrientation(TEAM_ROTATIONS[team])}
                  />
                </div>
              );
            })}
          </div>

          {gameStarted && !isGameOver && (
            <div className='flex justify-center gap-1'>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                        onClick={handleOfferDraw}
                      >
                        <Icons.handshake className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Declare Draw</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Declare Draw</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do all players agree to a draw?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAcceptDraw}
                      className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                    >
                      Yes, Draw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                      >
                        <Icons.flag className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>End Game</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>End Game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to end the game? The current
                      progress will be saved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAbort}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      End Game
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
