'use client';

import { useState, useCallback } from 'react';
import { Chess, type PieceSymbol, type Square } from '@/lib/chess';

export interface PendingPromotion {
  from: string;
  to: string;
  color: 'white' | 'black';
}

export interface UsePromotionOptions {
  fen: string;
  onMove: (from: string, to: string, promotion?: PieceSymbol) => void;
}

export interface UsePromotionReturn {
  pendingPromotion: PendingPromotion | null;
  isPromotionMove: (from: string, to: string) => boolean;
  handleMoveWithPromotionCheck: (from: string, to: string) => boolean;
  completePromotion: (piece: PieceSymbol) => void;
  cancelPromotion: () => void;
}

export function usePromotion({
  fen,
  onMove
}: UsePromotionOptions): UsePromotionReturn {
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

  const isPromotionMove = useCallback(
    (from: string, to: string): boolean => {
      try {
        const game = new Chess(fen);
        const piece = game.get(from as Square);
        if (!piece || piece.type !== 'p') return false;
        const targetRank = to[1];
        return targetRank === '8' || targetRank === '1';
      } catch {
        return false;
      }
    },
    [fen]
  );

  const handleMoveWithPromotionCheck = useCallback(
    (from: string, to: string): boolean => {
      if (!isPromotionMove(from, to)) {
        onMove(from, to);
        return false;
      }

      try {
        const game = new Chess(fen);
        const moves = game.moves({ square: from as Square, verbose: true });
        const isLegal = moves.some((m) => m.to === to);

        if (isLegal) {
          const piece = game.get(from as Square);
          setPendingPromotion({
            from,
            to,
            color: piece?.color === 'w' ? 'white' : 'black'
          });
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [fen, isPromotionMove, onMove]
  );

  const completePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return;
      onMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, onMove]
  );

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  return {
    pendingPromotion,
    isPromotionMove,
    handleMoveWithPromotionCheck,
    completePromotion,
    cancelPromotion
  };
}
