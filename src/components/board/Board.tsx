'use client';

import dynamic from 'next/dynamic';
import type {
  Arrow,
  PieceDropHandlerArgs,
  SquareHandlerArgs
} from 'react-chessboard';
import {
  CSSProperties,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react';
import { BOARD_STYLES } from '@/constants/board-themes';
import { ANIMATION_CONFIG } from '@/constants/animation';
import { ARROW_COLORS } from '@/constants/colors';
import { ChessArrow } from '@/hooks/useChessArrows';

/**
 * Board skeleton that matches the exact dimensions of the actual board.
 * Uses CSS to create an 8x8 checkerboard pattern.
 * This is rendered during SSR to prevent layout shift.
 * Fallback colors ensure visibility even if CSS variables aren't loaded.
 */
export function BoardSkeleton() {
  return (
    <div
      className='aspect-square w-full rounded-sm'
      style={{
        // Fallback colors (green theme) in case CSS variables aren't ready
        background: `
          repeating-conic-gradient(
            var(--board-square-light, #e8e5c4) 0% 25%,
            var(--board-square-dark, #6f9b4a) 25% 50%
          ) 0 0 / 25% 25%
        `,
        minHeight: '200px'
      }}
    />
  );
}

// Dynamically import Chessboard with SSR disabled to prevent hydration mismatch
// react-chessboard uses dnd-kit which adds ARIA attributes only on client
const Chessboard = dynamic(
  () => import('react-chessboard').then((mod) => mod.Chessboard),
  { ssr: false }
);

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
  // Track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <div className='aspect-square w-full max-w-[calc(100vw-4rem)] sm:max-w-[400px] lg:max-w-[560px]'>
      {!isMounted ? (
        <BoardSkeleton />
      ) : (
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
      )}
    </div>
  );
}
