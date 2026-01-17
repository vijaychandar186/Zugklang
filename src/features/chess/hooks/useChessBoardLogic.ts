'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { SquareStyles, RightClickedSquares } from '@/features/chess/types/core';
import { getMoveOptionStyles } from '@/features/chess/hooks/useSquareInteraction';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type ChessBoardLogicOptions = {
  game: Chess;
  currentFEN: string;
  viewingIndex: number;
  positionHistory: string[];
  playerColor: 'white' | 'black';
  soundEnabled: boolean;
  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  goToEnd: () => void;
  isGameOver?: boolean;
  onMoveExecuted?: (move: Move) => void;
  allowOpponentMoves?: boolean;
};

export function useChessBoardLogic({
  game,
  currentFEN,
  viewingIndex,
  positionHistory,
  playerColor,
  soundEnabled,
  makeMove,
  goToEnd,
  isGameOver = false,
  onMoveExecuted,
  allowOpponentMoves = true
}: ChessBoardLogicOptions) {
  const [isMounted, setIsMounted] = useState(false);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});

  const gameRef = useRef(game);
  gameRef.current = game;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const isViewingHistory = viewingIndex < positionHistory.length - 1;
  const playerColorShort: 'w' | 'b' = playerColor === 'white' ? 'w' : 'b';
  const gameTurn = game.turn();
  const isPlayerTurn = gameTurn === playerColorShort;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playMoveSound = useCallback(
    (move: Move, gameAfterMove: Chess) => {
      if (!soundEnabledRef.current) return;
      const isCapture = move.captured !== undefined;
      const isCheck = gameAfterMove.isCheck();
      const isCastle = move.san === 'O-O' || move.san === 'O-O-O';
      const isPromotion = move.promotion !== undefined;
      const isPlayerMove = move.color === playerColorShort;
      const soundType = getSoundType(
        isCapture,
        isCheck,
        isCastle,
        isPromotion,
        isPlayerMove
      );
      playSound(soundType);
    },
    [playerColorShort]
  );

  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      const move = makeMove(from, to, promotion || 'q');
      if (move) {
        playMoveSound(move, gameRef.current);
        setMoveFrom(null);
        setOptionSquares({});
        onMoveExecuted?.(move);
        return true;
      }
      return false;
    },
    [makeMove, playMoveSound, onMoveExecuted]
  );

  const getMoveOptions = useCallback(
    (square: Square): boolean => {
      const moves = game.moves({ square, verbose: true });
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }
      const newSquares = getMoveOptionStyles(moves, square);
      setOptionSquares(newSquares);
      return true;
    },
    [game]
  );

  const handleUserMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      if (isGameOver || game.isGameOver()) {
        return false;
      }

      if (isViewingHistory) {
        goToEnd();
        return false;
      }

      if (!allowOpponentMoves) {
        const piece = game.get(from);
        if (piece?.color !== playerColorShort) {
          return false;
        }
        if (!isPlayerTurn) {
          return false;
        }
      }

      const success = executeMove(from, to, promotion);
      if (!success && soundEnabledRef.current) {
        playSound('illegal');
      }
      return success;
    },
    [
      isGameOver,
      game,
      isViewingHistory,
      goToEnd,
      allowOpponentMoves,
      playerColorShort,
      isPlayerTurn,
      executeMove
    ]
  );

  const onDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!targetSquare) return false;
      return handleUserMove(sourceSquare as Square, targetSquare as Square);
    },
    [handleUserMove]
  );

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (isGameOver || game.isGameOver()) {
        return;
      }

      if (isViewingHistory) {
        goToEnd();
        return;
      }

      setRightClickedSquares({});
      const sq = square as Square;

      if (!moveFrom) {
        if (getMoveOptions(sq)) setMoveFrom(sq);
        return;
      }

      const moves = game.moves({ square: moveFrom, verbose: true });
      const found = moves.find((m) => m.from === moveFrom && m.to === sq);

      if (!found) {
        if (getMoveOptions(sq)) {
          setMoveFrom(sq);
        } else {
          setMoveFrom(null);
          setOptionSquares({});
        }
        return;
      }

      const piece = game.get(moveFrom);
      const promotion =
        piece?.type === 'p' && (sq[1] === '8' || sq[1] === '1')
          ? 'q'
          : undefined;
      handleUserMove(moveFrom, sq, promotion);
      setMoveFrom(null);
      setOptionSquares({});
    },
    [
      isGameOver,
      game,
      isViewingHistory,
      goToEnd,
      moveFrom,
      getMoveOptions,
      handleUserMove
    ]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      const sq = square as Square;
      setRightClickedSquares((p) => ({
        ...p,
        [sq]: p[sq]?.backgroundColor ? undefined : BOARD_STYLES.rightClickSquare
      }));
    },
    []
  );

  const squareStyles = useMemo<SquareStyles>(() => {
    return { ...optionSquares, ...rightClickedSquares };
  }, [optionSquares, rightClickedSquares]);

  const clearState = useCallback(() => {
    setOptionSquares({});
    setRightClickedSquares({});
    setMoveFrom(null);
  }, []);

  const position = isMounted
    ? isViewingHistory
      ? currentFEN
      : game.fen()
    : STARTING_FEN;

  return {
    isMounted,
    position,
    squareStyles,
    isViewingHistory,
    isPlayerTurn,
    gameTurn,
    playerColorShort,
    moveFrom,
    executeMove,
    handleUserMove,
    onDrop,
    handleSquareClick,
    handleSquareRightClick,
    getMoveOptions,
    clearState,
    setMoveFrom,
    setOptionSquares,
    setRightClickedSquares
  };
}
