'use client';

import { Chessboard, Arrow } from 'react-chessboard';
import type { PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';
import { CSSProperties, useCallback, useMemo } from 'react';
import { BOARD_STYLES } from '@/constants/board-themes';
import { ANIMATION_CONFIG } from '@/constants/animation';
import { ARROW_COLORS } from '@/constants/colors';
import { ChessArrow } from '@/hooks/useChessArrows';

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
  id?: string;
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
  id = 'unified-chess-board',
  animationDuration = ANIMATION_CONFIG.durationMs
}: UnifiedChessBoardProps) {
  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!onPieceDrop) return false;
      return onPieceDrop({ sourceSquare, targetSquare });
    },
    [onPieceDrop]
  );

  const handleSquareClick = useCallback(
    ({ square }: SquareHandlerArgs) => {
      if (!onSquareClick) return;
      onSquareClick({ square });
    },
    [onSquareClick]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: SquareHandlerArgs) => {
      if (!onSquareRightClick) return;
      onSquareRightClick({ square });
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
      <Chessboard
        options={{
          id,
          position,
          boardOrientation,
          allowDragging: canDrag,
          allowDragOffBoard: false,
          showNotation: true,
          showAnimations: true,
          animationDurationInMs: animationDuration,
          boardStyle: BOARD_STYLES.boardStyle,
          squareStyles: squareStyles,
          dropSquareStyle: {
            boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
          },
          draggingPieceStyle: {
            transform: 'scale(1.15)',
            cursor: 'grabbing',
            opacity: 0.9,
            filter: 'drop-shadow(2px 2px 4px var(--piece-drag-shadow))'
          },
          draggingPieceGhostStyle: {
            opacity: 0.4,
            filter: 'blur(1px)'
          },
          darkSquareStyle,
          lightSquareStyle,
          onPieceDrop: handlePieceDrop,
          onSquareClick: handleSquareClick,
          onSquareRightClick: handleSquareRightClick,
          arrows: chessboardArrows,
          arrowOptions: {
            arrowWidthDenominator: 6,
            arrowLengthReducerDenominator: 8,
            sameTargetArrowLengthReducerDenominator: 4,
            opacity: 0.7,
            activeOpacity: 0.85,
            activeArrowWidthMultiplier: 1.1,
            color: ARROW_COLORS.userPrimary,
            secondaryColor: ARROW_COLORS.userSecondary,
            tertiaryColor: ARROW_COLORS.userTertiary
          }
        }}
      />
    </div>
  );
}
