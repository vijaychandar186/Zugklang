'use client';

import { useMemo } from 'react';
import { Chessboard, defaultPieces } from 'react-chessboard';
import type { CSSProperties } from 'react';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ChessArrow } from '@/features/chess/types/visualization';

type PositionObject = Record<string, { pieceType: string }>;

export type UnifiedChessBoardProps = {
  position: string | PositionObject;
  boardOrientation?: 'white' | 'black';
  canDrag?: boolean;
  squareStyles?: Record<string, CSSProperties | undefined>;
  darkSquareStyle?: CSSProperties;
  lightSquareStyle?: CSSProperties;
  onPieceDrop?: (args: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
  onSquareClick?: (args: { square: string }) => void;
  onSquareRightClick?: (args: { square: string }) => void;
  arrows?: ChessArrow[];
  animationDuration?: number;
  loserColor?: 'w' | 'b' | null;
};

const PIECE_KEYS = ['P', 'R', 'N', 'B', 'Q', 'K'] as const;
const COLORS = ['w', 'b'] as const;

function buildPiecesWithGrayed(loserColor: 'w' | 'b') {
  const pieces: Record<string, () => React.JSX.Element> = {};

  for (const color of COLORS) {
    for (const key of PIECE_KEYS) {
      const pieceKey = `${color}${key}`;
      const OriginalPiece = defaultPieces[pieceKey];
      if (color === loserColor) {
        pieces[pieceKey] = () => (
          <div style={{ filter: 'grayscale(100%)', opacity: 0.45 }}>
            <OriginalPiece />
          </div>
        );
      } else {
        pieces[pieceKey] = OriginalPiece;
      }
    }
  }

  return pieces;
}

export function UnifiedChessBoard({
  position,
  boardOrientation = 'white',
  canDrag = true,
  squareStyles = {},
  darkSquareStyle,
  lightSquareStyle,
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  arrows = [],
  animationDuration = ANIMATION_CONFIG.durationMs,
  loserColor = null
}: UnifiedChessBoardProps) {
  const grayedPieces = useMemo(
    () => (loserColor ? buildPiecesWithGrayed(loserColor) : undefined),
    [loserColor]
  );

  const options = useMemo(
    () => ({
      position,
      boardOrientation,
      allowDragging: canDrag,
      animationDurationInMs: animationDuration,
      boardStyle: BOARD_STYLES.boardStyle,
      squareStyles: Object.fromEntries(
        Object.entries(squareStyles).filter(([, v]) => v !== undefined)
      ) as Record<string, CSSProperties>,
      darkSquareStyle,
      lightSquareStyle,
      dropSquareStyle: {
        boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
      },
      arrows: arrows.map((a) => ({
        startSquare: a.startSquare,
        endSquare: a.endSquare,
        color: a.color
      })),
      onSquareClick,
      onSquareRightClick,
      onPieceDrop,
      ...(grayedPieces ? { pieces: grayedPieces } : {})
    }),
    [
      position,
      boardOrientation,
      canDrag,
      animationDuration,
      squareStyles,
      darkSquareStyle,
      lightSquareStyle,
      arrows,
      onSquareClick,
      onSquareRightClick,
      onPieceDrop,
      grayedPieces
    ]
  );

  return (
    <div className='w-full'>
      <Chessboard options={options} />
    </div>
  );
}
