'use client';

import { Chessboard } from 'react-chessboard';
import { CSSProperties, useEffect, useState } from 'react';
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

  // These callbacks match react-chessboard's expected signatures
  onPieceDrop?: (args: {
    sourceSquare: string;
    targetSquare: string | null;
    piece: unknown;
  }) => boolean;
  onSquareClick?: (args: { square: string; piece?: unknown }) => void;
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentPosition = isMounted ? position : 'start';
  const currentOrientation = isMounted ? boardOrientation : 'white';

  return (
    <div className='aspect-square w-full max-w-[calc(100vw-4rem)] sm:max-w-[400px] lg:max-w-[560px]'>
      <Chessboard
        options={{
          position: currentPosition,
          boardOrientation: currentOrientation,

          allowDragging: canDrag,
          allowDragOffBoard: false,
          allowAutoScroll: true,
          showNotation: true,
          dragActivationDistance: 2,

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

          darkSquareStyle: darkSquareStyle,
          lightSquareStyle: lightSquareStyle,

          onPieceDrop: onPieceDrop,
          onSquareClick: onSquareClick,
          onSquareRightClick: onSquareRightClick,

          arrows: arrows,
          arrowOptions: {
            arrowWidthDenominator: 6,
            arrowLengthReducerDenominator: 8,
            sameTargetArrowLengthReducerDenominator: 4,
            opacity: 0.7,
            activeOpacity: 0.85,
            activeArrowWidthMultiplier: 1.1,
            // Colors from @/constants/colors.ts
            color: ARROW_COLORS.userPrimary,
            secondaryColor: ARROW_COLORS.userSecondary,
            tertiaryColor: ARROW_COLORS.userTertiary
          },

          id: id
        }}
      />
    </div>
  );
}
