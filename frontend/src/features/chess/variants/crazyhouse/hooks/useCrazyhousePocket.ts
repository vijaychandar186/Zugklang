'use client';

import { useMemo, useCallback } from 'react';
import type { Chess, PieceSymbol } from '@/lib/chess/chess';
import type { ChessVariant } from '@/features/chess/config/variants';
import type { SquareStyles } from '@/features/chess/types/core';
import { useChessStore } from '@/features/chess/stores/useChessStore';

const ROLE_TO_SAN: Record<PieceSymbol, string> = {
  p: 'P',
  n: 'N',
  b: 'B',
  r: 'R',
  q: 'Q',
  k: 'K'
};

export function useCrazyhousePocket({
  game,
  variant,
  currentFEN,
  playerColor,
  makeDropMove,
  onMoveExecuted,
  isGameOver
}: {
  game: Chess;
  variant: ChessVariant;
  currentFEN: string;
  playerColor: 'white' | 'black';
  makeDropMove: (san: string) => ReturnType<Chess['move']>;
  onMoveExecuted?: () => void;
  isGameOver: boolean;
}) {
  const selectedDropPiece = useChessStore((s) => s.selectedDropPiece);
  const setSelectedDropPiece = useChessStore((s) => s.setSelectedDropPiece);

  const isCrazyhouse = variant === 'crazyhouse';
  const playerColorShort = playerColor === 'white' ? 'w' : 'b';
  const opponentColorShort = playerColor === 'white' ? 'b' : 'w';
  const isPlayerTurn = game.turn() === playerColorShort;

  const playerPocket = useMemo(() => {
    if (!isCrazyhouse) return { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    return game.getPocket(playerColorShort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, isCrazyhouse, playerColorShort, currentFEN]);

  const opponentPocket = useMemo(() => {
    if (!isCrazyhouse) return { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    return game.getPocket(opponentColorShort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, isCrazyhouse, opponentColorShort, currentFEN]);

  const dropSquares = useMemo(() => {
    if (!isCrazyhouse || !selectedDropPiece || !isPlayerTurn) return [];
    return game.getDropSquares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, isCrazyhouse, selectedDropPiece, isPlayerTurn, currentFEN]);

  const dropSquareStyles = useMemo<SquareStyles>(() => {
    if (dropSquares.length === 0) return {};
    const styles: SquareStyles = {};
    for (const sq of dropSquares) {
      styles[sq] = {
        background:
          'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    }
    return styles;
  }, [dropSquares]);

  const handlePocketSelect = useCallback(
    (role: PieceSymbol) => {
      if (isGameOver || !isPlayerTurn) return;
      setSelectedDropPiece(selectedDropPiece === role ? null : role);
    },
    [isGameOver, isPlayerTurn, selectedDropPiece, setSelectedDropPiece]
  );

  const handleDropOnSquare = useCallback(
    (square: string): boolean => {
      if (!selectedDropPiece || !dropSquares.includes(square)) return false;

      const san = `${ROLE_TO_SAN[selectedDropPiece]}@${square}`;
      const move = makeDropMove(san);
      if (move) {
        onMoveExecuted?.();
        return true;
      }
      return false;
    },
    [selectedDropPiece, dropSquares, makeDropMove, onMoveExecuted]
  );

  const clearDropSelection = useCallback(() => {
    setSelectedDropPiece(null);
  }, [setSelectedDropPiece]);

  return {
    isCrazyhouse,
    playerPocket,
    opponentPocket,
    selectedDropPiece,
    dropSquareStyles,
    handlePocketSelect,
    handleDropOnSquare,
    clearDropSelection
  };
}
