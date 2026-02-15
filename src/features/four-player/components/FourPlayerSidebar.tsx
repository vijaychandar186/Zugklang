'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
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
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { GameOverPanel } from '@/features/chess/components/sidebar/GameOverPanel';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { useFourPlayerStore, TEAM_ROTATIONS } from '../store';
import { FourPlayerGameDialog } from './FourPlayerGameDialog';
import { TEAM_INFO, TEAMS } from '../config/teams';
import type { Team, MoveRecord } from '../engine';

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

  // Group moves into rounds of 4 (R, B, Y, G)
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
  isCurrent,
  isEliminated,
  score,
  onClick
}: {
  team: Team;
  isActive: boolean;
  isCurrent: boolean;
  isEliminated: boolean;
  score: number;
  onClick: () => void;
}) {
  const info = TEAM_INFO[team];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
        isEliminated
          ? 'line-through opacity-40'
          : isActive
            ? 'bg-foreground/10'
            : 'hover:bg-muted'
      }`}
      style={
        isActive && !isEliminated
          ? { boxShadow: `0 0 0 2px ${info.cssVar}` }
          : undefined
      }
    >
      <div
        className={`rounded-full ${isCurrent && !isEliminated ? 'h-3 w-3 animate-pulse' : 'h-2.5 w-2.5'}`}
        style={{
          backgroundColor: info.cssVar,
          opacity: isEliminated ? 0.3 : 1
        }}
      />
      {info.label}
      <span className='text-muted-foreground ml-auto text-[10px] tabular-nums'>
        {score}
      </span>
    </button>
  );
}

export function FourPlayerSidebar() {
  const moves = useFourPlayerStore((s) => s.moves);
  const viewingMoveIndex = useFourPlayerStore((s) => s.viewingMoveIndex);
  const currentTeam = useFourPlayerStore((s) => s.currentTeam);
  const orientation = useFourPlayerStore((s) => s.orientation);
  const isGameOver = useFourPlayerStore((s) => s.isGameOver);
  const winner = useFourPlayerStore((s) => s.winner);
  const loseOrder = useFourPlayerStore((s) => s.loseOrder);
  const game = useFourPlayerStore((s) => s.game);
  const scores = useFourPlayerStore((s) => s.scores);
  const gameStarted = useFourPlayerStore((s) => s.gameStarted);
  const hasHydrated = useFourPlayerStore((s) => s.hasHydrated);
  const startGame = useFourPlayerStore((s) => s.startGame);

  const goToMove = useFourPlayerStore((s) => s.goToMove);
  const goToStart = useFourPlayerStore((s) => s.goToStart);
  const goToEnd = useFourPlayerStore((s) => s.goToEnd);
  const goToPrev = useFourPlayerStore((s) => s.goToPrev);
  const goToNext = useFourPlayerStore((s) => s.goToNext);
  const resetGame = useFourPlayerStore((s) => s.resetGame);
  const setOrientation = useFourPlayerStore((s) => s.setOrientation);

  const [newGameOpen, setNewGameOpen] = useState(false);

  const canAbort = moves.length < 4;

  useEffect(() => {
    if (hasHydrated && !gameStarted && !isGameOver) {
      setNewGameOpen(true);
    }
  }, [hasHydrated, gameStarted, isGameOver]);

  const handleNewGame = () => setNewGameOpen(true);

  const canGoBack = viewingMoveIndex > -1;
  const canGoForward = viewingMoveIndex < moves.length - 1;

  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingMoveIndex + 1,
    totalItems: moves.length + 1,
    onNext: goToNext
  });

  const currentInfo = TEAM_INFO[currentTeam];
  const isChecked = !isGameOver && game.isChecked;

  return (
    <>
      <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
        {/* Header */}
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
          <span className='text-muted-foreground text-xs'>
            {moves.length} move{moves.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Move History */}
        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <FourPlayerMoveHistory
              moves={moves}
              viewingMoveIndex={viewingMoveIndex}
              onMoveClick={goToMove}
            />
          </div>
        </ScrollArea>

        {/* Navigation Controls */}
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

        {/* Game Status & Actions */}
        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {/* No active game panel */}
          {!gameStarted && !isGameOver && (
            <GameOverPanel
              gameResult='No active game'
              onNewGame={handleNewGame}
            />
          )}

          {/* Game over panel */}
          {isGameOver && winner && (
            <div className='flex flex-col gap-2 border-b pb-2'>
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
              <Button
                variant='default'
                size='sm'
                className='w-full'
                onClick={handleNewGame}
              >
                <Icons.newGame className='mr-2 h-4 w-4' />
                New Game
              </Button>
            </div>
          )}

          {/* Game status during play */}
          {gameStarted && !isGameOver && (
            <div className='flex flex-col gap-2'>
              {/* Current turn + check indicator */}
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

              {/* Eliminated players */}
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

          {/* View perspective & player statuses (combined) */}
          <div className='flex flex-wrap items-center justify-center gap-1'>
            {TEAMS.map((team) => (
              <PlayerButton
                key={team}
                team={team}
                isActive={orientation === TEAM_ROTATIONS[team]}
                isCurrent={team === currentTeam && !isGameOver}
                isEliminated={loseOrder.includes(team)}
                score={scores[team]}
                onClick={() => setOrientation(TEAM_ROTATIONS[team])}
              />
            ))}
          </div>

          {/* Abort/Resign button */}
          {gameStarted && !isGameOver && (
            <div className='flex justify-center'>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                      >
                        {canAbort ? (
                          <Icons.abort className='h-4 w-4' />
                        ) : (
                          <Icons.flag className='h-4 w-4' />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    {canAbort ? 'Abort Game' : 'Resign Game'}
                  </TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {canAbort ? 'Abort Game?' : 'Resign Game?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {canAbort
                        ? 'Are you sure you want to abort? This game will not be counted.'
                        : 'Are you sure you want to resign? This will end the game.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={resetGame}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      {canAbort ? 'Abort' : 'Resign'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      <FourPlayerGameDialog
        open={newGameOpen}
        onOpenChange={setNewGameOpen}
        onStart={startGame}
      />
    </>
  );
}
