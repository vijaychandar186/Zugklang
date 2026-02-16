'use client';

import { memo, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { useFourPlayerStore, TEAM_ROTATIONS } from '../store';
import type { Team, MoveRecord } from '../engine';

const TEAM_INFO: Record<Team, { label: string; hex: string; short: string }> = {
  r: { label: 'Red', hex: '#D7263D', short: 'R' },
  b: { label: 'Blue', hex: '#1E90FF', short: 'B' },
  y: { label: 'Yellow', hex: '#FFD700', short: 'Y' },
  g: { label: 'Green', hex: '#00A86B', short: 'G' }
};

const TEAMS: Team[] = ['r', 'b', 'y', 'g'];

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
        style={{ backgroundColor: info.hex }}
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
      style={isActive ? { boxShadow: `0 0 0 2px ${info.hex}` } : undefined}
    >
      <div
        className='h-2.5 w-2.5 rounded-full'
        style={{ backgroundColor: info.hex }}
      />
      {info.label}
    </button>
  );
}

export function FourPlayerSidebar() {
  const {
    moves,
    viewingMoveIndex,
    currentTeam,
    orientation,
    isGameOver,
    winner,
    loseOrder,
    game,
    goToMove,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    resetGame,
    setOrientation
  } = useFourPlayerStore();

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
    <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
      <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
        <h3 className='font-semibold'>Moves</h3>
        <span className='text-muted-foreground text-xs'>
          {moves.length} move{moves.length !== 1 ? 's' : ''}
        </span>
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
        {isGameOver && winner && (
          <div className='flex flex-col gap-2 border-b pb-2'>
            <div className='flex items-center justify-center gap-2'>
              <div
                className='h-3.5 w-3.5 rounded-full'
                style={{ backgroundColor: TEAM_INFO[winner].hex }}
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
                    <span style={{ color: TEAM_INFO[t].hex }}>
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
                style={{ backgroundColor: currentInfo.hex }}
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
                    <span style={{ color: TEAM_INFO[t].hex }}>
                      {TEAM_INFO[t].label}
                    </span>
                  </span>
                ))}
              </p>
            )}

            <div className='flex justify-center gap-3'>
              {TEAMS.map((team) => {
                const info = TEAM_INFO[team];
                const isEliminated = loseOrder.includes(team);
                const isCurrent = team === currentTeam;
                return (
                  <div
                    key={team}
                    className={`flex items-center gap-1 text-xs ${
                      isEliminated
                        ? 'text-muted-foreground line-through opacity-50'
                        : isCurrent
                          ? 'font-bold'
                          : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className='h-2 w-2 rounded-full'
                      style={{
                        backgroundColor: info.hex,
                        opacity: isEliminated ? 0.3 : 1
                      }}
                    />
                    {info.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className='flex flex-wrap items-center justify-center gap-1'>
          {TEAMS.map((team) => (
            <PlayerButton
              key={team}
              team={team}
              isActive={orientation === TEAM_ROTATIONS[team]}
              onClick={() => setOrientation(TEAM_ROTATIONS[team])}
            />
          ))}
        </div>

        {!isGameOver && (
          <div className='flex justify-center'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={resetGame}>
                  <Icons.rematch className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Game</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
