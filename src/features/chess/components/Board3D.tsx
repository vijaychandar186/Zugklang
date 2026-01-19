'use client';

import { useState, useMemo, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import type { CSSProperties } from 'react';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ChessArrow } from '@/features/chess/types/visualization';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';

// Position can be FEN string or position object
type PositionObject = Record<string, { pieceType: string }>;

// Piece heights for 3D effect (relative to square width)
const PIECE_HEIGHTS: Record<string, number> = {
  wP: 1,
  wN: 1.2,
  wB: 1.2,
  wR: 1.2,
  wQ: 1.5,
  wK: 1.6,
  bP: 1,
  bN: 1.2,
  bB: 1.2,
  bR: 1.2,
  bQ: 1.5,
  bK: 1.6
};

// Map piece codes to 3D piece image filenames
const PIECE_FILE_MAP: Record<string, string> = {
  wP: 'white-pawn',
  wN: 'white-knight',
  wB: 'white-bishop',
  wR: 'white-rook',
  wQ: 'white-queen',
  wK: 'white-king',
  bP: 'black-pawn',
  bN: 'black-knight',
  bB: 'black-bishop',
  bR: 'black-rook',
  bQ: 'black-queen',
  bK: 'black-king'
};

export type Board3DProps = {
  position: string | PositionObject;
  boardOrientation?: 'white' | 'black';
  canDrag?: boolean;
  squareStyles?: Record<string, CSSProperties>;
  onPieceDrop?: (args: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
  onSquareClick?: (args: { square: string }) => void;
  onSquareRightClick?: (args: { square: string }) => void;
  arrows?: ChessArrow[];
  animationDuration?: number;
};

export function Board3D({
  position,
  boardOrientation = 'white',
  canDrag = true,
  squareStyles = {},
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  arrows = [],
  animationDuration = ANIMATION_CONFIG.durationMs
}: Board3DProps) {
  const theme = useBoardTheme();
  const [squareWidth, setSquareWidth] = useState(0);

  // Get square width from DOM after mount (following official 3D example pattern)
  useEffect(() => {
    const updateSquareWidth = () => {
      const square = document.querySelector(
        '[data-square="a1"]'
      ) as HTMLElement | null;
      if (square) {
        const width = square.getBoundingClientRect().width;
        setSquareWidth(width);
      }
    };

    // Initial measurement after a short delay to ensure board is rendered
    const timer = setTimeout(updateSquareWidth, 100);

    // Update on resize
    window.addEventListener('resize', updateSquareWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSquareWidth);
    };
  }, []);

  // Create custom 3D piece components - following official react-chessboard 3D example exactly
  const threeDPieces = useMemo(() => {
    const pieceComponents: Record<string, () => React.JSX.Element> = {};

    Object.keys(PIECE_FILE_MAP).forEach((piece) => {
      const fileName = PIECE_FILE_MAP[piece];
      const pieceHeight = PIECE_HEIGHTS[piece];
      const isKing = piece[1] === 'K';

      pieceComponents[piece] = () => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            position: 'relative',
            pointerEvents: 'none'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/3d-assets/3d-pieces/${fileName}.svg`}
            alt={piece}
            width={squareWidth}
            height={pieceHeight * squareWidth}
            style={{
              position: 'absolute',
              bottom: `${0.2 * squareWidth}px`,
              objectFit: isKing ? 'contain' : 'cover'
            }}
          />
        </div>
      );
    });

    return pieceComponents;
  }, [squareWidth]);

  const options = useMemo(() => {
    // 3D board styles using CSS variables from theme
    const boardStyle: CSSProperties = {
      transform: 'rotateX(27.5deg)',
      transformOrigin: 'center',
      border: '16px solid var(--board-3d-frame)',
      borderStyle: 'outset',
      borderRightColor: 'var(--board-3d-frame-right)',
      borderRadius: '4px',
      boxShadow: 'var(--board-3d-shadow) 2px 24px 24px 8px',
      borderRightWidth: '2px',
      borderLeftWidth: '2px',
      borderTopWidth: '0px',
      borderBottomWidth: '18px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      padding: '8px 8px 12px',
      backgroundColor: 'var(--board-3d-background)',
      background:
        'var(--board-3d-background) url("/3d-assets/wood-texture.svg") center/cover',
      overflow: 'visible'
    };

    // Use the theme's square styles with wood pattern overlay
    const lightSquareStyle: CSSProperties = {
      backgroundColor:
        (theme.lightSquareStyle?.backgroundColor as string) || '#f0d9b5'
    };

    const darkSquareStyle: CSSProperties = {
      backgroundColor:
        (theme.darkSquareStyle?.backgroundColor as string) || '#b58863'
    };

    return {
      id: 'board-3d',
      position,
      boardOrientation,
      allowDragging: canDrag,
      animationDurationInMs: animationDuration,
      boardStyle,
      squareStyles,
      pieces: threeDPieces,
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
      onPieceDrop
    };
  }, [
    theme.lightSquareStyle,
    theme.darkSquareStyle,
    position,
    boardOrientation,
    canDrag,
    animationDuration,
    squareStyles,
    threeDPieces,
    arrows,
    onSquareClick,
    onSquareRightClick,
    onPieceDrop
  ]);

  return (
    <div
      className='w-full'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Chessboard options={options} />
    </div>
  );
}
