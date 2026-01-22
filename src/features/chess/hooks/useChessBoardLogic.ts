'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Chess, Square, Move, PieceSymbol } from '@/lib/chess';
import { SquareStyles, RightClickedSquares } from '@/features/chess/types/core';
import { getMoveOptionStyles } from '@/features/chess/hooks/useSquareInteraction';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Convert FEN to position object for react-chessboard
type PositionObject = Record<string, { pieceType: string }>;

function fenToPosition(fen: string): PositionObject {
  const position: PositionObject = {};
  const [boardPart] = fen.split(' ');
  const rows = boardPart.split('/');
  const pieceMap: Record<string, string> = {
    k: 'bK',
    q: 'bQ',
    r: 'bR',
    b: 'bB',
    n: 'bN',
    p: 'bP',
    K: 'wK',
    Q: 'wQ',
    R: 'wR',
    B: 'wB',
    N: 'wN',
    P: 'wP'
  };

  rows.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (/\d/.test(char)) {
        fileIndex += parseInt(char);
      } else {
        const square = `${String.fromCharCode(97 + fileIndex)}${8 - rowIndex}`;
        position[square] = { pieceType: pieceMap[char] };
        fileIndex++;
      }
    }
  });

  return position;
}

export type Premove = {
  from: Square;
  to: Square;
  promotion?: string;
};

export type PendingPromotion = {
  from: Square;
  to: Square;
  color: 'white' | 'black';
};

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
  /** Enable premove support (for playing against engine) */
  enablePremoves?: boolean;
  /** Called when premove sound should play */
  onPremoveAdded?: () => void;
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
  allowOpponentMoves = true,
  enablePremoves = false,
  onPremoveAdded
}: ChessBoardLogicOptions) {
  const [isMounted, setIsMounted] = useState(false);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const [premoves, setPremoves] = useState<Premove[]>([]);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

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
        setPendingPromotion(null);
        onMoveExecuted?.(move);
        return true;
      }
      return false;
    },
    [makeMove, playMoveSound, onMoveExecuted]
  );

  // Check if a move is a promotion
  const isPromotionMove = useCallback(
    (from: Square, to: Square): boolean => {
      const piece = game.get(from);
      if (!piece || piece.type !== 'p') return false;
      const targetRank = to[1];
      return targetRank === '8' || targetRank === '1';
    },
    [game]
  );

  // Complete a pending promotion with selected piece
  const completePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return;
      executeMove(pendingPromotion.from, pendingPromotion.to, piece);
    },
    [pendingPromotion, executeMove]
  );

  // Cancel pending promotion
  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
    setMoveFrom(null);
    setOptionSquares({});
  }, []);

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
        // If premoves enabled and not player's turn, queue as premove
        if (!isPlayerTurn && enablePremoves) {
          setPremoves((prev) => [
            ...prev,
            { from, to, promotion: promotion || 'q' }
          ]);
          onPremoveAdded?.();
          setMoveFrom(null);
          setOptionSquares({});
          return true;
        }
        if (!isPlayerTurn) {
          return false;
        }
      }

      // Check if this is a promotion move and no promotion piece specified
      if (!promotion && isPromotionMove(from, to)) {
        // Validate the move is legal before showing dialog
        const moves = game.moves({ square: from, verbose: true });
        const isLegal = moves.some((m) => m.to === to);
        if (isLegal) {
          const piece = game.get(from);
          setPendingPromotion({
            from,
            to,
            color: piece?.color === 'w' ? 'white' : 'black'
          });
          setMoveFrom(null);
          setOptionSquares({});
          return true; // Return true to prevent piece snapping back
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
      enablePremoves,
      onPremoveAdded,
      isPromotionMove,
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

      // Let handleUserMove handle promotion detection
      handleUserMove(moveFrom, sq);
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
      // If premoves are queued, right-click clears them
      if (enablePremoves && premoves.length > 0) {
        setPremoves([]);
        return;
      }
      const sq = square as Square;
      setRightClickedSquares((p) => ({
        ...p,
        [sq]: p[sq]?.backgroundColor ? undefined : BOARD_STYLES.rightClickSquare
      }));
    },
    [enablePremoves, premoves.length]
  );

  // Execute premoves when it becomes player's turn
  useEffect(() => {
    if (!enablePremoves || premoves.length === 0) return;
    if (!isPlayerTurn || game.isGameOver()) return;

    const [first, ...rest] = premoves;
    const success = executeMove(first.from, first.to, first.promotion);
    if (success) {
      setPremoves(rest);
    } else {
      // Invalid premove, clear all
      setPremoves([]);
    }
  }, [enablePremoves, premoves, isPlayerTurn, game, executeMove]);

  // Premove square highlighting
  const premoveStyles = useMemo<SquareStyles>(() => {
    if (!enablePremoves || premoves.length === 0) return {};
    return premoves.reduce(
      (acc, p) => ({
        ...acc,
        [p.from]: BOARD_STYLES.premoveSquare,
        [p.to]: BOARD_STYLES.premoveSquare
      }),
      {} as SquareStyles
    );
  }, [enablePremoves, premoves]);

  const squareStyles = useMemo<SquareStyles>(() => {
    return { ...optionSquares, ...rightClickedSquares, ...premoveStyles };
  }, [optionSquares, rightClickedSquares, premoveStyles]);

  const clearState = useCallback(() => {
    setOptionSquares({});
    setRightClickedSquares({});
    setMoveFrom(null);
    setPremoves([]);
    setPendingPromotion(null);
  }, []);

  // Calculate position - use object format when premoves exist to show pieces
  const position = useMemo(() => {
    const baseFen = isMounted
      ? isViewingHistory
        ? currentFEN
        : game.fen()
      : STARTING_FEN;

    // If no premoves, return FEN string directly
    if (!enablePremoves || premoves.length === 0) {
      return baseFen;
    }

    // Convert to position object and apply premoves
    const posObj = fenToPosition(baseFen);

    for (const premove of premoves) {
      const piece = posObj[premove.from];
      if (piece) {
        delete posObj[premove.from];
        posObj[premove.to] = piece;
      }
    }

    return posObj;
  }, [isMounted, isViewingHistory, currentFEN, game, enablePremoves, premoves]);

  return {
    isMounted,
    position,
    squareStyles,
    isViewingHistory,
    isPlayerTurn,
    gameTurn,
    playerColorShort,
    moveFrom,
    premoves,
    pendingPromotion,
    executeMove,
    handleUserMove,
    onDrop,
    handleSquareClick,
    handleSquareRightClick,
    getMoveOptions,
    clearState,
    completePromotion,
    cancelPromotion,
    setMoveFrom,
    setOptionSquares,
    setRightClickedSquares,
    setPremoves
  };
}
