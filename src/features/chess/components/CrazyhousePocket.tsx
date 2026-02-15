'use client';

import { defaultPieces } from 'react-chessboard';
import type { PieceSymbol } from '@/lib/chess';

type PieceKey = keyof typeof defaultPieces;

const POCKET_PIECES: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];

interface CrazyhousePocketProps {
  color: 'white' | 'black';
  pocket: Record<PieceSymbol, number>;
  selectedRole: PieceSymbol | null;
  onPieceSelect: (role: PieceSymbol) => void;
  isActive: boolean;
}

export function CrazyhousePocket({
  color,
  pocket,
  selectedRole,
  onPieceSelect,
  isActive
}: CrazyhousePocketProps) {
  const hasAnyPiece = POCKET_PIECES.some((p) => pocket[p] > 0);

  if (!hasAnyPiece) {
    return <div className='h-8' />;
  }

  const colorPrefix = color === 'white' ? 'w' : 'b';

  return (
    <div className='bg-muted/30 flex items-center gap-1 rounded-lg border p-1.5'>
      {POCKET_PIECES.map((piece) => {
        const count = pocket[piece];
        if (count <= 0) return null;

        const pieceKey = `${colorPrefix}${piece.toUpperCase()}` as PieceKey;
        const PieceComponent = defaultPieces[pieceKey];
        const isSelected = selectedRole === piece;

        return (
          <button
            key={piece}
            onClick={() => isActive && onPieceSelect(piece)}
            className={`relative flex h-8 w-8 items-center justify-center rounded transition-colors ${
              isSelected
                ? 'bg-primary/20 ring-primary ring-2'
                : isActive
                  ? 'bg-muted hover:bg-muted/80 cursor-pointer'
                  : 'bg-muted cursor-default opacity-60'
            }`}
            disabled={!isActive}
            title={`Drop ${piece === 'q' ? 'Queen' : piece === 'r' ? 'Rook' : piece === 'b' ? 'Bishop' : piece === 'n' ? 'Knight' : 'Pawn'}`}
          >
            <div className='h-6 w-6'>
              <PieceComponent />
            </div>
            {count > 1 && (
              <span className='bg-foreground text-background absolute right-0 bottom-0 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] leading-none font-bold'>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
