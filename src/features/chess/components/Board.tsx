'use client';

import { Chessboard } from 'react-chessboard';
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
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!onPieceDrop) return false;
      return onPieceDrop({ sourceSquare, targetSquare });
    },
    [onPieceDrop]
  );

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (onSquareClick) {
        onSquareClick({ square });
      }
    },
    [onSquareClick]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      if (onSquareRightClick) {
        onSquareRightClick({ square });
      }
    },
    [onSquareRightClick]
  );

  const chessboardArrows = useMemo(
    () =>
      arrows.map((arrow) => ({
        startSquare: arrow.startSquare,
        endSquare: arrow.endSquare,
        color: arrow.color
      })),
    [arrows]
  );

  const options = useMemo(
    () => ({
      position,
      boardOrientation,
      allowDragging: canDrag,
      animationDurationInMs: animationDuration,
      boardStyle: BOARD_STYLES.boardStyle,
      squareStyles,
      darkSquareStyle,
      lightSquareStyle,
      dropSquareStyle: {
        boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
      },
      arrows: chessboardArrows,
      onSquareClick: handleSquareClick,
      onSquareRightClick: handleSquareRightClick,
      onPieceDrop: handlePieceDrop
    }),
    [
      position,
      boardOrientation,
      canDrag,
      animationDuration,
      squareStyles,
      darkSquareStyle,
      lightSquareStyle,
      chessboardArrows,
      handleSquareClick,
      handleSquareRightClick,
      handlePieceDrop
    ]
  );

  return (
    <div className='w-[calc(100vw-5rem)] max-w-[380px] sm:w-[400px] sm:max-w-none lg:w-[560px]'>
      <Chessboard options={options} />
    </div>
  );
}
