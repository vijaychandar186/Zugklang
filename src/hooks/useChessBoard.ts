import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { useGameStore } from '@/hooks/stores/useGameStore';
import { OptionSquares, RightClickedSquares } from '@/utils/types';
import { BOARD_STYLES } from '@/constants/board-themes';
import { playSound, getSoundType } from '@/utils/sounds';
import { useStockfish } from '@/hooks/computer/useStockfish';

export function useChessBoard() {
  const initialFEN = useGameStore.getState().currentFEN;
  const [game, setGame] = useState(() => {
    try {
      return new Chess(initialFEN);
    } catch {
      return new Chess();
    }
  });

  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [, setMoveTo] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<OptionSquares>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});

  // Premoves queue
  const [premoves, setPremoves] = useState<
    Array<{ from: Square; to: Square; promotion?: string }>
  >([]);

  const gameRef = useRef(game);
  gameRef.current = game;

  // Store Selectors
  const stockfishLevel = useGameStore((s) => s.stockfishLevel);
  const playAs = useGameStore((s) => s.playAs);
  const gameId = useGameStore((s) => s.gameId);
  const boardFlipped = useGameStore((s) => s.boardFlipped);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const addMove = useGameStore((s) => s.addMove);
  const switchTimer = useGameStore((s) => s.switchTimer);
  const setOnNewGame = useGameStore((s) => s.setOnNewGame);
  const setGameOver = useGameStore((s) => s.setGameOver);
  const resetGame = useGameStore((s) => s.resetGame);
  const setGameResult = useGameStore((s) => s.setGameResult);
  const currentFEN = useGameStore((s) => s.currentFEN);
  const viewingIndex = useGameStore((s) => s.viewingIndex);
  const positionHistory = useGameStore((s) => s.positionHistory);
  const goToEnd = useGameStore((s) => s.goToEnd);

  const isViewingHistory = viewingIndex < positionHistory.length - 1;
  const playerTurn = playAs === 'white' ? 'w' : 'b';
  const isPlayerTurn = game.turn() === playerTurn;

  const boardOrientation = boardFlipped
    ? playAs === 'white'
      ? 'black'
      : 'white'
    : playAs;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // --- Move Execution Helpers ---

  const playMoveSound = useCallback((move: Move, gameAfterMove: Chess) => {
    if (!soundEnabledRef.current) return;
    const isCapture = move.captured !== undefined;
    const isCheck = gameAfterMove.isCheck();
    const isCastle = move.san === 'O-O' || move.san === 'O-O-O';
    const isPromotion = move.promotion !== undefined;
    const isPlayerMove =
      move.color === (useGameStore.getState().playAs === 'white' ? 'w' : 'b');
    const soundType = getSoundType(
      isCapture,
      isCheck,
      isCastle,
      isPromotion,
      isPlayerMove
    );
    playSound(soundType);
  }, []);

  // Generic function to execute a move (Validation should happen before this or via try/catch)
  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      try {
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from,
          to,
          promotion: (promotion || 'q') as 'q' | 'r' | 'b' | 'n'
        });

        if (move) {
          setGame(newGame);
          playMoveSound(move, newGame);
          addMove(move.san, newGame.fen());
          setMoveFrom(null); // Clear selection
          setMoveTo(null);
          setOptionSquares({});

          // Switch timer to active side
          const activeColor = newGame.turn() === 'w' ? 'white' : 'black';
          switchTimer(activeColor);

          return true;
        }
      } catch {
        // Invalid move
      }
      return false;
    },
    [game, playMoveSound, addMove, switchTimer]
  );

  // --- Engine Integration ---

  // This hook handles all Stockfish logic (initialization, thinking, moving)
  useStockfish({
    game,
    gameId,
    playAs,
    stockfishLevel,
    enabled: true, // TODO: Check gameMode here
    onMove: executeMove,
    soundEnabled,
    playSound
  });

  // --- User Interaction Handling ---

  const handleUserMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      if (isViewingHistory) {
        goToEnd();
        return false;
      }

      // Prevent moving opponent pieces (User only)
      const piece = game.get(from);
      const playerColorShort = playAs === 'white' ? 'w' : 'b';
      if (piece?.color !== playerColorShort) {
        return false;
      }

      if (!isPlayerTurn) {
        // Queue Premove
        setPremoves((prev) => [
          ...prev,
          { from, to, promotion: promotion || 'q' }
        ]);
        if (soundEnabledRef.current) playSound('premove');

        // Clear selection to give feedback that "action is stored"
        setMoveFrom(null);
        setOptionSquares({});
        return true;
      }

      const success = executeMove(from, to, promotion);
      if (!success && soundEnabledRef.current) {
        playSound('illegal');
      }
      return success;
    },
    [isViewingHistory, goToEnd, game, playAs, isPlayerTurn, executeMove]
  );

  // Premove Execution Effect
  useEffect(() => {
    if (premoves.length > 0 && isPlayerTurn && !game.isGameOver()) {
      const [first, ...rest] = premoves;
      const success = executeMove(first.from, first.to, first.promotion);
      if (success) {
        setPremoves(rest);
      } else {
        // Invalid premove (maybe board changed), clear all
        setPremoves([]);
      }
    }
  }, [premoves, isPlayerTurn, game, executeMove]);

  // --- Game Lifecycle ---

  // Game Over Check
  useEffect(() => {
    if (game.isGameOver()) {
      if (soundEnabled) playSound('game-end');
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        // Logic assumes Computer Mode for now w.r.t messages
        const isUserWin =
          (playAs === 'white' && winner === 'White') ||
          (playAs === 'black' && winner === 'Black');
        setGameResult(isUserWin ? 'You win!' : 'Stockfish wins!');
      } else if (game.isDraw()) setGameResult('Draw!');
      else if (game.isStalemate()) setGameResult('Stalemate!');

      setGameOver(true);
    }
  }, [game, playAs, setGameResult, setGameOver, soundEnabled]); // Added game here

  const onNewGame = useCallback(() => {
    if (soundEnabledRef.current) playSound('game-start');
    const newGame = new Chess();
    setGame(newGame);
    resetGame();
    setOptionSquares({});
    setRightClickedSquares({});
    setMoveFrom(null);
    setMoveTo(null);
    setPremoves([]);
  }, [resetGame]);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  // --- Helper Functions (Stable) ---

  const getMoveOptions = useCallback(
    (square: Square): boolean => {
      const moves = game.moves({ square, verbose: true });
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }
      const newSquares: OptionSquares = {};
      moves.forEach((move) => {
        const target = game.get(move.to);
        const source = game.get(square);
        const isCapture = !!(target && source && target.color !== source.color);
        newSquares[move.to] = BOARD_STYLES.getMoveOptionStyle(isCapture);
      });
      newSquares[square] = BOARD_STYLES.selectedSquare;
      setOptionSquares(newSquares);
      return true;
    },
    [game]
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

      // Check validation
      // Optimization: Check if clicked square is in optionSquares?
      // Strict logic:
      const moves = game.moves({ square: moveFrom, verbose: true });
      const found = moves.find((m) => m.from === moveFrom && m.to === sq);

      if (!found) {
        // If clicked another one of own pieces, select it instead
        if (getMoveOptions(sq)) {
          setMoveFrom(sq);
        } else {
          // If completely invalid or empty...
          // If Premove?
          if (!isPlayerTurn) {
            handleUserMove(moveFrom, sq);
            setMoveFrom(null);
            setOptionSquares({});
          } else {
            setMoveFrom(null);
            setOptionSquares({});
          }
        }
        return;
      }

      // Found valid move
      const piece = game.get(moveFrom);
      const promotion =
        piece?.type === 'p' && (sq[1] === '8' || sq[1] === '1')
          ? 'q'
          : undefined;
      handleUserMove(moveFrom, sq, promotion);
      setMoveFrom(null);
      setOptionSquares({}); // Clear options
    },
    [
      isViewingHistory,
      goToEnd,
      moveFrom,
      getMoveOptions,
      game,
      isPlayerTurn,
      handleUserMove
    ]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      if (premoves.length > 0) {
        setPremoves([]);
        return;
      }
      const sq = square as Square;
      setRightClickedSquares((p) => ({
        ...p,
        [sq]: p[sq]?.backgroundColor ? undefined : BOARD_STYLES.rightClickSquare
      }));
    },
    [premoves]
  );

  // Styles Memoization
  const squareStyles = useMemo<OptionSquares>(() => {
    const s = { ...optionSquares, ...rightClickedSquares };
    premoves.forEach((p) => {
      s[p.from] = BOARD_STYLES.premoveSquare;
      s[p.to] = BOARD_STYLES.premoveSquare;
    });
    return s;
  }, [optionSquares, rightClickedSquares, premoves]);

  const theme = useMemo(
    () => ({
      darkSquareStyle: { backgroundColor: 'var(--board-square-dark)' },
      lightSquareStyle: { backgroundColor: 'var(--board-square-light)' }
    }),
    []
  );

  return {
    game,
    theme,
    boardOrientation,
    currentFEN,
    isViewingHistory,
    squareStyles,
    onDrop,
    handleSquareClick,
    handleSquareRightClick
  };
}
