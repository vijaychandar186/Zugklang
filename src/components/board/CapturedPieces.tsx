'use client';

import { CapturablePiece } from '@/types';
import { Icons, type LucideIcon } from '@/components/Icons';

const PIECE_ICONS: Record<CapturablePiece, LucideIcon> = {
  p: Icons.chessPawn,
  n: Icons.chessKnight,
  b: Icons.chessBishop,
  r: Icons.chessRook,
  q: Icons.chessQueen
};

type CapturedPiecesDisplayProps = {
  pieces: CapturablePiece[];
  pieceColor: 'white' | 'black';
  advantage?: number;
};

export function CapturedPiecesDisplay({
  pieces,
  pieceColor,
  advantage
}: CapturedPiecesDisplayProps) {
  if (pieces.length === 0 && (!advantage || advantage <= 0)) {
    return <div className='h-5' />;
  }

  return (
    <div className='flex items-center gap-1'>
      <div className='flex items-center'>
        {pieces.map((piece, index) => {
          const Icon = PIECE_ICONS[piece];
          return (
            <Icon
              key={`${piece}-${index}`}
              className={`-ml-0.5 h-4 w-4 first:ml-0 ${
                pieceColor === 'white'
                  ? 'fill-white stroke-black dark:stroke-white'
                  : 'fill-black stroke-black dark:fill-zinc-800 dark:stroke-zinc-400'
              }`}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {advantage !== undefined && advantage > 0 && (
        <span className='text-muted-foreground text-xs font-medium'>
          +{advantage}
        </span>
      )}
    </div>
  );
}
