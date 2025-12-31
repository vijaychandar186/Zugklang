'use client';

import { PieceType } from '@/utils/types';
import { Icons, type LucideIcon } from '@/components/icons';

const PIECE_ICONS: Record<PieceType, LucideIcon> = {
  p: Icons.chessPawn,
  n: Icons.chessKnight,
  b: Icons.chessBishop,
  r: Icons.chessRook,
  q: Icons.chessQueen
};

type CapturedPiecesDisplayProps = {
  pieces: PieceType[];
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
              className={`-ml-1 h-4 w-4 first:ml-0 ${
                pieceColor === 'white'
                  ? 'fill-white stroke-black'
                  : 'fill-black stroke-black'
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
