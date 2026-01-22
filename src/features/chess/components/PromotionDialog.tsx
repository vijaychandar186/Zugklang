'use client';

import { defaultPieces } from 'react-chessboard';
import type { PieceSymbol } from '@/lib/chess';

type PieceKey = keyof typeof defaultPieces;

const PROMOTION_PIECES: PieceSymbol[] = ['q', 'r', 'b', 'n'];

interface PromotionDialogProps {
  isOpen: boolean;
  color: 'white' | 'black';
  targetSquare: string;
  boardOrientation: 'white' | 'black';
  onSelect: (piece: PieceSymbol) => void;
  onCancel: () => void;
}

/**
 * Promotion piece selection dialog that appears over the board
 * when a pawn reaches the last rank.
 */
export function PromotionDialog({
  isOpen,
  color,
  targetSquare,
  boardOrientation,
  onSelect,
  onCancel
}: PromotionDialogProps) {
  if (!isOpen) return null;

  // Calculate position based on target square and board orientation
  const file = targetSquare.charCodeAt(0) - 97; // 0-7
  const rank = parseInt(targetSquare[1]) - 1; // 0-7

  // Adjust for board orientation
  const x = boardOrientation === 'white' ? file : 7 - file;
  const isTop = boardOrientation === 'white' ? rank === 7 : rank === 0;

  const leftPercent = x * 12.5;

  return (
    <>
      {/* Overlay to capture clicks outside */}
      <div
        className='absolute inset-0 z-40 bg-black/20'
        onClick={onCancel}
        onContextMenu={(e) => {
          e.preventDefault();
          onCancel();
        }}
      />

      {/* Promotion piece selector */}
      <div
        className={`absolute z-50 flex flex-col overflow-hidden rounded-sm shadow-lg ${
          color === 'white' ? 'bg-zinc-800' : 'bg-zinc-100'
        }`}
        style={{
          left: `${leftPercent}%`,
          width: '12.5%',
          ...(isTop ? { top: 0 } : { bottom: 0 })
        }}
      >
        {PROMOTION_PIECES.map((piece) => {
          const pieceKey =
            `${color === 'white' ? 'w' : 'b'}${piece.toUpperCase()}` as PieceKey;
          const PieceComponent = defaultPieces[pieceKey];
          return (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className={`flex aspect-square items-center justify-center transition-colors ${
                color === 'white' ? 'hover:bg-zinc-700' : 'hover:bg-zinc-200'
              }`}
              title={
                piece === 'q'
                  ? 'Queen'
                  : piece === 'r'
                    ? 'Rook'
                    : piece === 'b'
                      ? 'Bishop'
                      : 'Knight'
              }
            >
              <PieceComponent />
            </button>
          );
        })}
      </div>
    </>
  );
}
