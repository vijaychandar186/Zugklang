'use client';

import { useCallback, type CSSProperties } from 'react';
import type { PieceSymbol } from '@/lib/chess';
import { UnifiedChessBoard as Board } from '../Board';
import { Board3D } from '../Board3D';
import { PromotionDialog } from '../PromotionDialog';
import { useBoardMounting } from '../../hooks/useBoardMounting';
import { usePromotion, type PendingPromotion } from '../../hooks/usePromotion';
import type { ChessArrow } from '../../types/visualization';

export interface UnifiedBoardWithPromotionProps {
  position: string;
  boardOrientation: 'white' | 'black';
  initialBoard3dEnabled?: boolean;
  canDrag?: boolean;
  onPieceDrop?: (args: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
  onSquareClick?: (args: { square: string }) => void;
  onSquareRightClick?: (args: { square: string }) => void;
  arrows?: ChessArrow[];
  squareStyles?: Record<string, CSSProperties>;
  animationDuration?: number;
  enablePromotion?: boolean;
  onMoveWithPromotion?: (
    from: string,
    to: string,
    promotion: PieceSymbol
  ) => void;
  pendingPromotion?: PendingPromotion | null;
  onPromotionSelect?: (piece: PieceSymbol) => void;
  onPromotionCancel?: () => void;
}

export function UnifiedBoardWithPromotion({
  position,
  boardOrientation,
  initialBoard3dEnabled,
  canDrag = true,
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  arrows = [],
  squareStyles = {},
  animationDuration,
  enablePromotion = false,
  onMoveWithPromotion,
  pendingPromotion: externalPendingPromotion,
  onPromotionSelect: externalOnPromotionSelect,
  onPromotionCancel: externalOnPromotionCancel
}: UnifiedBoardWithPromotionProps) {
  const { shouldShow3d, theme } = useBoardMounting({ initialBoard3dEnabled });

  const internalPromotion = usePromotion({
    fen: position,
    onMove: (from, to, promotion) => {
      if (promotion && onMoveWithPromotion) {
        onMoveWithPromotion(from, to, promotion);
      }
    }
  });

  const pendingPromotion =
    externalPendingPromotion !== undefined
      ? externalPendingPromotion
      : internalPromotion.pendingPromotion;

  const handlePromotionSelect =
    externalOnPromotionSelect || internalPromotion.completePromotion;
  const handlePromotionCancel =
    externalOnPromotionCancel || internalPromotion.cancelPromotion;

  const handlePieceDrop = useCallback(
    (args: { sourceSquare: string; targetSquare: string | null }) => {
      if (
        enablePromotion &&
        args.targetSquare &&
        externalPendingPromotion === undefined
      ) {
        const promotionTriggered =
          internalPromotion.handleMoveWithPromotionCheck(
            args.sourceSquare,
            args.targetSquare
          );
        if (promotionTriggered) {
          return true;
        }
      }
      return onPieceDrop?.(args) ?? false;
    },
    [enablePromotion, externalPendingPromotion, internalPromotion, onPieceDrop]
  );

  const boardProps = {
    position,
    boardOrientation,
    canDrag: canDrag && !pendingPromotion,
    onPieceDrop: handlePieceDrop,
    onSquareClick,
    onSquareRightClick,
    arrows,
    squareStyles,
    ...(animationDuration !== undefined && { animationDuration })
  };

  return (
    <div className='relative'>
      {shouldShow3d ? (
        <Board3D {...boardProps} />
      ) : (
        <Board
          {...boardProps}
          darkSquareStyle={theme.darkSquareStyle}
          lightSquareStyle={theme.lightSquareStyle}
        />
      )}
      <PromotionDialog
        isOpen={!!pendingPromotion}
        color={pendingPromotion?.color || 'white'}
        targetSquare={pendingPromotion?.to || 'a8'}
        boardOrientation={boardOrientation}
        onSelect={handlePromotionSelect}
        onCancel={handlePromotionCancel}
      />
    </div>
  );
}
