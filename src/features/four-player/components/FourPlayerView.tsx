'use client';

import { defaultPieces } from 'react-chessboard';
import { FourPlayerBoard } from './FourPlayerBoard';
import { FourPlayerSidebar } from './FourPlayerSidebar';
import { useFourPlayerStore } from '../store';
import type { Team, PieceType } from '../engine';

const TEAM_INFO: Record<Team, { label: string; hex: string }> = {
  r: { label: 'Red', hex: '#D7263D' },
  b: { label: 'Blue', hex: '#1E90FF' },
  y: { label: 'Yellow', hex: '#FFD700' },
  g: { label: 'Green', hex: '#00A86B' }
};

const PROMO_PIECES: PieceType[] = ['Q', 'R', 'B', 'N'];

function PromotionDialog({
  team,
  onSelect
}: {
  team: Team;
  onSelect: (piece: PieceType) => void;
}) {
  const hex = TEAM_INFO[team].hex;
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
                  <PieceComp fill={hex} />
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
  const { game, pendingPromotion, completePromotion } = useFourPlayerStore();

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='w-full sm:w-[400px] lg:w-[min(560px,calc(100dvh-200px))] xl:w-[min(640px,calc(100dvh-200px))] 2xl:w-[min(720px,calc(100dvh-200px))]'>
          <FourPlayerBoard />
        </div>
      </div>

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(560px,calc(100dvh-200px))] lg:w-80 lg:overflow-hidden xl:h-[min(640px,calc(100dvh-200px))] 2xl:h-[min(720px,calc(100dvh-200px))]'>
        <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
          <FourPlayerSidebar />
        </div>
      </div>

      {pendingPromotion && game.pendingPromotion && (
        <PromotionDialog
          team={game.pendingPromotion.piece.team}
          onSelect={completePromotion}
        />
      )}
    </div>
  );
}
