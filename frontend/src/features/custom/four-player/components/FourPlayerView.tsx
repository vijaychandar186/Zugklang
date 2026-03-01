'use client';
import { useState, useEffect } from 'react';
import { defaultPieces } from 'react-chessboard';
import { FourPlayerBoard } from './FourPlayerBoard';
import { FourPlayerSidebar } from './FourPlayerSidebar';
import { FourPlayerGameDialog } from './FourPlayerGameDialog';
import { GameShell } from '@/features/chess/components/GameShell';
import { useFourPlayerStore, setFourPlayerStorageMode } from '../store';
import type { Team, PieceType } from '../engine';
const TEAM_INFO: Record<
  Team,
  {
    label: string;
    cssVar: string;
  }
> = {
  r: { label: 'Red', cssVar: 'var(--four-player-red)' },
  b: { label: 'Blue', cssVar: 'var(--four-player-blue)' },
  y: { label: 'Yellow', cssVar: 'var(--four-player-yellow)' },
  g: { label: 'Green', cssVar: 'var(--four-player-green)' }
};
const PROMO_PIECES: PieceType[] = ['Q', 'R', 'B', 'N'];
function PromotionDialog({
  team,
  onSelect
}: {
  team: Team;
  onSelect: (piece: PieceType) => void;
}) {
  const cssVar = TEAM_INFO[team].cssVar;
  return (
    <div className='bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
      <div className='bg-card flex flex-col items-center gap-3 rounded-xl border p-6 shadow-lg'>
        <p className='text-sm font-medium'>Promote pawn to:</p>
        <div className='flex gap-2'>
          {PROMO_PIECES.map((type) => {
            const key = `w${type}` as keyof typeof defaultPieces;
            const PieceComp = defaultPieces[key];
            return (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className='bg-muted hover:bg-muted/70 flex h-14 w-14 items-center justify-center rounded-lg transition-colors'
              >
                <div className='h-10 w-10'>
                  <PieceComp fill={cssVar} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export function FourPlayerView() {
  const {
    game,
    pendingPromotion,
    completePromotion,
    gameStarted,
    hasHydrated,
    isGameOver,
    moves,
    resetGame,
    startGame
  } = useFourPlayerStore();
  const [newGameOpen, setNewGameOpen] = useState(false);
  useEffect(() => {
    setFourPlayerStorageMode(false);
    useFourPlayerStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (hasHydrated && !gameStarted && !isGameOver && moves.length === 0) {
      setNewGameOpen(true);
    }
  }, [hasHydrated, gameStarted, isGameOver, moves.length]);
  const handleStartGame = () => {
    resetGame();
    startGame();
  };
  const handleNewGame = () => {
    setNewGameOpen(true);
  };
  return (
    <GameShell
      boardArea={
        <div className='mx-auto w-full sm:w-[400px] lg:w-[min(calc(100dvh-180px),calc(100vw-clamp(20rem,22vw,30rem)-6rem))]'>
          <FourPlayerBoard />
        </div>
      }
      sidebar={<FourPlayerSidebar onNewGame={handleNewGame} />}
      overlays={
        <>
          {pendingPromotion && game.pendingPromotion && (
            <PromotionDialog
              team={game.pendingPromotion.piece.team}
              onSelect={completePromotion}
            />
          )}
          <FourPlayerGameDialog
            open={newGameOpen}
            onOpenChange={setNewGameOpen}
            onStart={handleStartGame}
          />
        </>
      }
    />
  );
}
