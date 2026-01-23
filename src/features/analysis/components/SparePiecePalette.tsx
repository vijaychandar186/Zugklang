'use client';

import { SparePiece } from 'react-chessboard';

const BLACK_PIECE_TYPES = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
const WHITE_PIECE_TYPES = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];

interface SparePiecePaletteProps {
  orientation?: 'white' | 'black';
}

export function SparePiecePalette({
  orientation = 'white'
}: SparePiecePaletteProps) {
  const topPieces =
    orientation === 'white' ? WHITE_PIECE_TYPES : BLACK_PIECE_TYPES;
  const bottomPieces =
    orientation === 'white' ? BLACK_PIECE_TYPES : WHITE_PIECE_TYPES;

  const topLabel = orientation === 'white' ? 'White Pieces' : 'Black Pieces';
  const bottomLabel = orientation === 'white' ? 'Black Pieces' : 'White Pieces';

  return (
    <div className='space-y-4 p-4'>
      <div>
        <p className='text-muted-foreground mb-2 text-xs font-medium'>
          {topLabel}
        </p>
        <div className='bg-muted/30 grid grid-cols-6 gap-1 rounded-lg border p-2'>
          {topPieces.map((pieceType) => (
            <div
              key={pieceType}
              className='hover:bg-muted flex aspect-square cursor-grab items-center justify-center rounded transition-colors active:cursor-grabbing'
            >
              <SparePiece pieceType={pieceType} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className='text-muted-foreground mb-2 text-xs font-medium'>
          {bottomLabel}
        </p>
        <div className='bg-muted/30 grid grid-cols-6 gap-1 rounded-lg border p-2'>
          {bottomPieces.map((pieceType) => (
            <div
              key={pieceType}
              className='hover:bg-muted flex aspect-square cursor-grab items-center justify-center rounded transition-colors active:cursor-grabbing'
            >
              <SparePiece pieceType={pieceType} />
            </div>
          ))}
        </div>
      </div>

      <p className='text-muted-foreground text-center text-xs'>
        Drag pieces onto the board • Right-click to remove
      </p>
    </div>
  );
}
