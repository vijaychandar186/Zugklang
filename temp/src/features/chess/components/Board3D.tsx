'use client';

import { useMemo, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import type { CSSProperties } from 'react';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ChessArrow } from '@/features/chess/types/visualization';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import Image from 'next/image';

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
  const hasMountedRef = useRef(false);

  useEffect(() => {
    // Mark as mounted after first render to enable animations
    const timer = setTimeout(() => {
      hasMountedRef.current = true;
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Create custom 3D piece components - use percentage-based sizing
  const threeDPieces = useMemo(() => {
    const pieces = Object.keys(PIECE_FILE_MAP);
    const pieceComponents: Record<string, () => React.JSX.Element> = {};

    pieces.forEach((piece) => {
      const fileName = PIECE_FILE_MAP[piece];
      const isKing = piece[1] === 'K';

      pieceComponents[piece] = () => (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'visible',
            zIndex: 10
          }}
        >
          <Image
            src={`/3d-assets/3d-pieces/${fileName}.svg`}
            alt={piece}
            width={100}
            height={100}
            unoptimized
            draggable={false}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%) translateY(120%) scale(1.8)',
              transformOrigin: 'bottom center',
              objectFit: isKing ? 'contain' : 'cover',
              width: '100%',
              height: 'auto'
            }}
          />
        </div>
      );
    });

    return pieceComponents;
  }, []);

  const options = useMemo(() => {
    // 3D board styles using CSS variables from theme
    const boardStyle = {
      boxSizing: 'border-box',
      transform: 'rotateX(27.5deg)',
      transformOrigin: 'center',
      borderTopWidth: '0px',
      borderRightWidth: '2px',
      borderBottomWidth: '18px',
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
      boxShadow: 'var(--board-3d-shadow) 2px 24px 24px 8px',
      padding: '8px',
      background: 'var(--board-3d-background)',
      backgroundImage: 'url("/3d-assets/wood-texture.svg")',
      backgroundSize: 'cover',
      overflow: 'visible'
    } as CSSProperties;

    // Use the theme's square styles with wood pattern overlay
    const lightSquareStyle = {
      ...theme.lightSquareStyle,
      backgroundImage: 'url("/3d-assets/wood-texture.svg")',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay'
    } as CSSProperties;

    const darkSquareStyle = {
      ...theme.darkSquareStyle,
      backgroundImage: 'url("/3d-assets/wood-texture.svg")',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay'
    } as CSSProperties;

    return {
      id: 'board-3d',
      position,
      boardOrientation,
      allowDragging: canDrag,
      animationDurationInMs: hasMountedRef.current ? animationDuration : 0,
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

  // The rotateX(27.5deg) transform reduces visual height by factor of cos(27.5°) ≈ 0.887
  // We compensate with negative margins: (1 - 0.887) / 2 ≈ 5.65% on each side
  return (
    <div
      className='w-full'
      style={{
        marginTop: '-5.5%',
        marginBottom: '-5.5%'
      }}
    >
      <Chessboard options={options} />
    </div>
  );
}
