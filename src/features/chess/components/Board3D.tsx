'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
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

  // Track window width for responsive styling - initialize with SSR-safe default
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    // Set actual window width on mount
    setWindowWidth(document.documentElement.clientWidth);

    // Mark as mounted after first render to enable animations
    const timer = setTimeout(() => {
      hasMountedRef.current = true;
    }, 100);

    const handleResize = () =>
      setWindowWidth(document.documentElement.clientWidth);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.documentElement);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate board width based on viewport
  // These match the container sizes in BoardContainer
  const boardWidth =
    windowWidth >= 1024 ? 560 : windowWidth >= 640 ? 400 : windowWidth - 56;
  const squareWidth = boardWidth / 8;

  // Create custom 3D piece components
  const threeDPieces = useMemo(() => {
    const pieces = Object.keys(PIECE_FILE_MAP);
    const pieceComponents: Record<string, () => React.JSX.Element> = {};

    pieces.forEach((piece) => {
      const fileName = PIECE_FILE_MAP[piece];
      const isKing = piece[1] === 'K';

      pieceComponents[piece] = () => (
        <div
          style={{
            width: squareWidth || '100%',
            height: squareWidth || '100%',
            position: 'relative',
            pointerEvents: 'none',
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
            style={{
              position: 'absolute',
              bottom: `${0.1 * (squareWidth || 60)}px`,
              left: '50%',
              transform: 'translateX(-50%) scale(1.8)',
              transformOrigin: 'bottom center',
              objectFit: isKing ? 'contain' : 'cover',
              width: '100%',
              height: 'auto',
              pointerEvents: 'none'
            }}
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
      // Disable animation on initial mount to prevent zoom effect
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
      className='w-full px-2'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: `-${(boardWidth * (1 - Math.cos((27.5 * Math.PI) / 180))) / 2}px`,
        marginBottom: `-${(boardWidth * (1 - Math.cos((27.5 * Math.PI) / 180))) / 2}px`
      }}
    >
      <Chessboard options={options} />
    </div>
  );
}
