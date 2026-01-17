'use client';

import { SparePiece } from 'react-chessboard';

// Piece types for spare pieces
const BLACK_PIECE_TYPES = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
const WHITE_PIECE_TYPES = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];

interface SparePiecePaletteProps {
  orientation?: 'white' | 'black';
}

/**
 * Spare piece palette for the sidebar.
 * IMPORTANT: This component must be rendered inside a ChessboardProvider to work.
 */
export function SparePiecePalette({
  orientation = 'white'
}: SparePiecePaletteProps) {
  // Order pieces based on board orientation
  const topPieces =
    orientation === 'white' ? WHITE_PIECE_TYPES : BLACK_PIECE_TYPES;
  const bottomPieces =
    orientation === 'white' ? BLACK_PIECE_TYPES : WHITE_PIECE_TYPES;

  return (
    <div className='space-y-4 p-4'>
      {/* White pieces section */}
      <div>
        <p className='text-muted-foreground mb-2 text-xs font-medium'>
          White Pieces
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

      {/* Black pieces section */}
      <div>
        <p className='text-muted-foreground mb-2 text-xs font-medium'>
          Black Pieces
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
