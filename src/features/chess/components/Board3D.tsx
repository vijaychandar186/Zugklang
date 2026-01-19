'use client';

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { Chessboard } from 'react-chessboard';
import type { CSSProperties } from 'react';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ChessArrow } from '@/features/chess/types/visualization';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';

// Position can be FEN string or position object
type PositionObject = Record<string, { pieceType: string }>;

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

// Piece heights relative to square width
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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const theme = useBoardTheme();

  // Track window width for responsive styling
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate square width based on board container width
  // Container: w-[calc(100vw-0.5rem)] sm:w-[400px] lg:w-[560px]
  const boardWidth =
    windowWidth >= 1024 ? 560 : windowWidth >= 640 ? 400 : windowWidth - 8;
  const squareWidth = boardWidth / 8;

  // Create custom 3D piece components
  const threeDPieces = useMemo(() => {
    const pieces = Object.keys(PIECE_FILE_MAP);
    const pieceComponents: Record<string, () => React.JSX.Element> = {};

    pieces.forEach((piece) => {
      const pieceHeight = PIECE_HEIGHTS[piece] || 1;
      const fileName = PIECE_FILE_MAP[piece];
      const isKing = piece[1] === 'K';

      pieceComponents[piece] = () => (
        <div
          style={{
            width: squareWidth || '100%',
            height: squareWidth || '100%',
            position: 'relative',
            pointerEvents: 'none'
          }}
        >
          <Image
            src={`/3d-assets/3d-pieces/${fileName}.svg`}
            alt={piece}
            width={squareWidth || 60}
            height={pieceHeight * (squareWidth || 60)}
            style={{
              position: 'absolute',
              bottom: `${0.2 * (squareWidth || 60)}px`,
              objectFit: isKing ? 'contain' : 'cover',
              width: '100%',
              height: 'auto'
            }}
            priority
          />
        </div>
      );
    });

    return pieceComponents;
  }, [squareWidth]);

  // Scale 3D styling based on board size (mobile-friendly)
  const isMobile = squareWidth > 0 && squareWidth < 50;

  const options = useMemo(() => {
    const bottomBorder = isMobile ? 10 : 18;
    const padding = isMobile ? 4 : 8;
    const shadowSize = isMobile ? 12 : 24;

    // 3D board styles using CSS variables from theme
    const boardStyle: CSSProperties = {
      boxSizing: 'content-box',
      transform: 'rotateX(27.5deg)',
      transformOrigin: 'center',
      borderTopWidth: '0px',
      borderRightWidth: '2px',
      borderBottomWidth: `${bottomBorder}px`,
      borderLeftWidth: '2px',
      borderTopStyle: 'outset',
      borderRightStyle: 'outset',
      borderBottomStyle: 'outset',
      borderLeftStyle: 'outset',
      borderTopColor: 'var(--board-3d-frame)',
      borderRightColor: 'var(--board-3d-frame-right)',
      borderBottomColor: 'var(--board-3d-frame)',
      borderLeftColor: 'var(--board-3d-frame)',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px',
      boxShadow: `var(--board-3d-shadow) 2px ${shadowSize}px ${shadowSize}px ${isMobile ? 4 : 8}px`,
      padding: `${padding}px`,
      background: 'var(--board-3d-background)',
      backgroundImage: 'url("/3d-assets/wood-texture.svg")',
      backgroundSize: 'cover',
      overflow: 'visible'
    };

    // Use the theme's square styles with wood pattern overlay
    const lightSquareStyle: CSSProperties = {
      ...theme.lightSquareStyle,
      backgroundImage: 'url("/3d-assets/wood-texture.svg")',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay'
    };

    const darkSquareStyle: CSSProperties = {
      ...theme.darkSquareStyle,
      backgroundImage: 'url("/3d-assets/wood-texture.svg")',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay'
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
    isMobile,
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
      className='w-[calc(100vw-0.5rem)] sm:w-[400px] lg:w-[560px]'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: isMobile ? '-0.75rem' : '-1.5rem'
      }}
    >
      <Chessboard options={options} />
    </div>
  );
}
