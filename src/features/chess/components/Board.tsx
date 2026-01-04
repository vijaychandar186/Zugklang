'use client';

import { Chessboard, Arrow } from 'react-chessboard';
import { useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ChessArrow } from '@/features/chess/types/visualization';

export type UnifiedChessBoardProps = {
  position: string;
  boardOrientation?: 'white' | 'black';
  canDrag?: boolean;
  squareStyles?: Record<string, CSSProperties>;
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChessboardAny = Chessboard as any;

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
  animationDuration = ANIMATION_CONFIG.durationMs
}: UnifiedChessBoardProps) {
  const handlePieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      if (!onPieceDrop) return false;
      return onPieceDrop({ sourceSquare, targetSquare });
    },
    [onPieceDrop]
  );

  const handleSquareClick = useCallback(
    (square: string) => {
      if (onSquareClick) {
        onSquareClick({ square });
      }
    },
    [onSquareClick]
  );

  const handleSquareRightClick = useCallback(
    (square: string) => {
      if (onSquareRightClick) {
        onSquareRightClick({ square });
      }
    },
    [onSquareRightClick]
  );

  const chessboardArrows: Arrow[] = useMemo(
    () =>
      arrows.map((arrow) => ({
        startSquare: arrow.startSquare,
        endSquare: arrow.endSquare,
        color: arrow.color
      })),
    [arrows]
  );

  return (
    <div className='w-[calc(100vw-2rem)] max-w-[380px] sm:w-[400px] sm:max-w-none lg:w-[560px]'>
      <ChessboardAny
        id='UnifiedChessBoard'
        position={position}
        boardOrientation={boardOrientation}
        arePiecesDraggable={canDrag}
        showBoardNotation={true}
        animationDuration={animationDuration}
        customBoardStyle={BOARD_STYLES.boardStyle}
        customSquareStyles={squareStyles}
        customDropSquareStyle={{
          boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
        }}
        customDarkSquareStyle={darkSquareStyle}
        customLightSquareStyle={lightSquareStyle}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        onSquareRightClick={handleSquareRightClick}
        customArrows={chessboardArrows}
      />
    </div>
  );
}
