import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { StockfishEngine } from '@/lib/engine';
import { useGameStore } from '@/hooks/stores/useGameStore';
import { OptionSquares, RightClickedSquares } from '@/utils/types';
import { BOARD_STYLES } from '@/constants/board-themes';
import { playSound, getSoundType } from '@/utils/sounds';
import { MOVE_DELAY } from '@/constants/animation';

export function useChessBoard() {
  const engineRef = useRef<StockfishEngine | null>(null);
  const stockfishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize engine lazily
  const engine = useMemo(() => {
    if (!engineRef.current) {
      engineRef.current = new StockfishEngine();
    }
    return engineRef.current;
  }, []);

  // Cleanup engine and timers on unmount
  useEffect(() => {
    return () => {
      if (stockfishTimerRef.current) {
        clearTimeout(stockfishTimerRef.current);
        stockfishTimerRef.current = null;
      }
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Initialize game with persisted FEN if available
  const initialFEN = useGameStore.getState().currentFEN;
  const [game, setGame] = useState(() => {
    try {
      return new Chess(initialFEN);
    } catch {
      return new Chess();
    }
  });
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<OptionSquares>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  // Support multiple premoves queued up
  const [premoves, setPremoves] = useState<
    Array<{
      from: Square;
      to: Square;
      promotion?: string;
    }>
  >([]);
  const [pendingMove, setPendingMove] = useState<{
    san: string;
    fen: string;
    isCapture: boolean;
    isCheck: boolean;
    isCastle: boolean;
    isPromotion: boolean;
  } | null>(null);

  const gameRef = useRef(game);
  gameRef.current = game;

  // Individual selectors for better performance
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

  // Board orientation based on playAs and flip state
  const boardOrientation = boardFlipped
    ? playAs === 'white'
      ? 'black'
      : 'white'
    : playAs;

  // Ref to access current sound setting in callbacks
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Play sound for a chess move
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

  // Process pending move after animation completes
  useEffect(() => {
    if (pendingMove) {
      // Play sound immediately when move is made
      if (soundEnabledRef.current) {
        // Determine who made the move based on FEN (turn after move is opponent)
        const turnAfterMove = pendingMove.fen.split(' ')[1];
        const playerColor =
          useGameStore.getState().playAs === 'white' ? 'w' : 'b';
        const moverColor = turnAfterMove === 'w' ? 'b' : 'w';
        const isPlayerMove = moverColor === playerColor;

        const soundType = getSoundType(
          pendingMove.isCapture,
          pendingMove.isCheck,
          pendingMove.isCastle,
          pendingMove.isPromotion,
          isPlayerMove
        );
        playSound(soundType);
      }

      const timer = setTimeout(() => {
        addMove(pendingMove.san, pendingMove.fen);
        // Switch timer back to player after stockfish moves
        const playerColor = useGameStore.getState().playAs;
        useGameStore.getState().switchTimer(playerColor);
        setPendingMove(null);
      }, MOVE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [pendingMove, addMove]);

  // Execute first premove when it becomes player's turn
  useEffect(() => {
    if (premoves.length > 0 && isPlayerTurn && !game.isGameOver()) {
      const [firstPremove, ...remainingPremoves] = premoves;
      const { from, to, promotion } = firstPremove;

      try {
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from,
          to,
          promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined
        });
        if (move) {
          // Remove executed premove from queue
          setPremoves(remainingPremoves);
          playMoveSound(move, newGame);
          addMove(move.san, newGame.fen());
          setGame(newGame);
          // Switch timer to opponent after premove
          const opponentColor = playAs === 'white' ? 'black' : 'white';
          switchTimer(opponentColor);
          if (stockfishTimerRef.current) {
            clearTimeout(stockfishTimerRef.current);
          }
          stockfishTimerRef.current = setTimeout(makeStockfishMove, MOVE_DELAY);
        } else {
          // Invalid premove, clear all remaining premoves
          setPremoves([]);
        }
      } catch {
        // Invalid premove, clear all remaining premoves
        setPremoves([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, isPlayerTurn, premoves]);

  const makeStockfishMove = useCallback(() => {
    const currentGame = gameRef.current;
    const expectedTurn = playAs === 'white' ? 'b' : 'w';
    if (currentGame.turn() !== expectedTurn || currentGame.isGameOver()) {
      return;
    }

    const fenToEvaluate = currentGame.fen();
    engine.evaluatePosition(fenToEvaluate, stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        setGame((gameAtResponse) => {
          if (gameAtResponse.fen() !== fenToEvaluate) {
            return gameAtResponse;
          }
          try {
            const newGame = new Chess(gameAtResponse.fen());
            const move = newGame.move({
              from: bestMove.substring(0, 2) as Square,
              to: bestMove.substring(2, 4) as Square,
              promotion: (bestMove.substring(4, 5) || undefined) as
                | 'b'
                | 'n'
                | 'r'
                | 'q'
                | undefined
            });
            if (move) {
              setPendingMove({
                san: move.san,
                fen: newGame.fen(),
                isCapture: move.captured !== undefined,
                isCheck: newGame.isCheck(),
                isCastle: move.san === 'O-O' || move.san === 'O-O-O',
                isPromotion: move.promotion !== undefined
              });
              return newGame;
            }
            return gameAtResponse;
          } catch {
            return gameAtResponse;
          }
        });
      }
    });
  }, [engine, playAs, stockfishLevel]);

  // Trigger stockfish move on mount if it's stockfish's turn
  // ChessBoard remounts with key={gameId}, so this runs fresh for each new game
  useEffect(() => {
    const stockfishColor = playAs === 'white' ? 'b' : 'w';

    // Play game start sound for new games (gameId > 0)
    if (gameId > 0 && soundEnabledRef.current) {
      playSound('game-start');
    }

    // If it's stockfish's turn, trigger a move
    if (game.turn() === stockfishColor && !game.isGameOver()) {
      // Give engine time to initialize on fresh mount
      stockfishTimerRef.current = setTimeout(() => {
        makeStockfishMove();
      }, 200);
    }

    return () => {
      if (stockfishTimerRef.current) {
        clearTimeout(stockfishTimerRef.current);
        stockfishTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for game over after each move
  useEffect(() => {
    if (game.isGameOver()) {
      if (soundEnabled) playSound('game-end'); // Play game end sound

      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        const isUserWin =
          (playAs === 'white' && winner === 'White') ||
          (playAs === 'black' && winner === 'Black');
        setGameResult(isUserWin ? 'You win!' : 'Stockfish wins!');
      } else if (game.isDraw()) {
        setGameResult('Draw!');
      } else if (game.isStalemate()) {
        setGameResult('Stalemate!');
      }
      setGameOver(true);
    }
  }, [game, playAs, setGameResult, setGameOver, soundEnabled]);

  const onNewGame = useCallback(() => {
    if (soundEnabledRef.current) playSound('game-start'); // Play game start sound

    const newGame = new Chess();
    setGame(newGame);
    resetGame();
    setOptionSquares({});
    setRightClickedSquares({});
    setMoveFrom(null);
    setMoveTo(null);
    setPremoves([]);
    setPendingMove(null);
    // Clear any pending stockfish timer
    if (stockfishTimerRef.current) {
      clearTimeout(stockfishTimerRef.current);
      stockfishTimerRef.current = null;
    }
    if (playAs === 'black') {
      const startFen = newGame.fen();
      stockfishTimerRef.current = setTimeout(() => {
        engine.evaluatePosition(startFen, stockfishLevel);
        engine.onMessage(({ bestMove }) => {
          if (bestMove) {
            setGame((currentGame) => {
              if (currentGame.fen() !== startFen) {
                return currentGame;
              }
              try {
                const gameToUpdate = new Chess(currentGame.fen());
                const move = gameToUpdate.move({
                  from: bestMove.substring(0, 2) as Square,
                  to: bestMove.substring(2, 4) as Square
                });
                if (move) {
                  setPendingMove({
                    san: move.san,
                    fen: gameToUpdate.fen(),
                    isCapture: move.captured !== undefined,
                    isCheck: gameToUpdate.isCheck(),
                    isCastle: move.san === 'O-O' || move.san === 'O-O-O',
                    isPromotion: move.promotion !== undefined
                  });
                  return gameToUpdate;
                }
                return currentGame;
              } catch {
                return currentGame;
              }
            });
          }
        });
      }, 100);
    }
  }, [playAs, engine, stockfishLevel, resetGame]);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  function getMoveOptions(square: Square): boolean {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: OptionSquares = {};
    moves.forEach((move) => {
      const targetPiece = game.get(move.to);
      const sourcePiece = game.get(square);
      const isCapture = !!(
        targetPiece &&
        sourcePiece &&
        targetPiece.color !== sourcePiece.color
      );
      newSquares[move.to] = BOARD_STYLES.getMoveOptionStyle(isCapture);
    });
    newSquares[square] = BOARD_STYLES.selectedSquare;
    setOptionSquares(newSquares);
    return true;
  }

  function makeMove(from: Square, to: Square, promotion?: string): boolean {
    if (isViewingHistory) {
      goToEnd();
      return false;
    }

    if (!isPlayerTurn) {
      // Add to premove queue
      setPremoves((prev) => [
        ...prev,
        { from, to, promotion: promotion || 'q' }
      ]);
      if (soundEnabledRef.current) playSound('premove'); // Play premove sound
      return true;
    }

    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from,
        to,
        promotion: (promotion || 'q') as 'q' | 'r' | 'b' | 'n'
      });

      if (move) {
        playMoveSound(move, newGame);
        addMove(move.san, newGame.fen());
        setGame(newGame);
        setMoveFrom(null);
        setMoveTo(null);
        setOptionSquares({});
        // Switch timer to opponent (stockfish)
        const opponentColor = playAs === 'white' ? 'black' : 'white';
        switchTimer(opponentColor);
        if (stockfishTimerRef.current) {
          clearTimeout(stockfishTimerRef.current);
        }
        stockfishTimerRef.current = setTimeout(makeStockfishMove, MOVE_DELAY);
        return true;
      }
    } catch {
      // Invalid move
      if (soundEnabledRef.current) playSound('illegal'); // Play illegal sound
    }
    return false;
  }

  function onDrop({
    sourceSquare,
    targetSquare
  }: {
    piece: { pieceType: string };
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare) return false;
    return makeMove(sourceSquare as Square, targetSquare as Square);
  }

  function handleSquareClick({
    square
  }: {
    piece: { pieceType: string } | null;
    square: string;
  }) {
    if (isViewingHistory) {
      goToEnd();
      return;
    }

    setRightClickedSquares({});
    const sq = square as Square;

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(sq);
      if (hasMoveOptions) setMoveFrom(sq);
      return;
    }

    if (!moveTo) {
      const piece = game.get(moveFrom);
      const moves = game.moves({ square: moveFrom, verbose: true });
      const foundMove = moves.find((m) => m.from === moveFrom && m.to === sq);

      if (!foundMove) {
        if (!isPlayerTurn) {
          // Add to premove queue
          setPremoves((prev) => [
            ...prev,
            { from: moveFrom, to: sq, promotion: 'q' }
          ]);
          if (soundEnabledRef.current) playSound('premove');
          setMoveFrom(null);
          setOptionSquares({});
          return;
        }
        const hasMoveOptions = getMoveOptions(sq);
        setMoveFrom(hasMoveOptions ? sq : null);
        return;
      }

      setMoveTo(sq);

      const promotion =
        piece?.type === 'p' &&
        ((piece.color === 'w' && sq[1] === '8') ||
          (piece.color === 'b' && sq[1] === '1'))
          ? 'q'
          : undefined;

      makeMove(moveFrom, sq, promotion);
      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
    }
  }

  function handleSquareRightClick({
    square
  }: {
    piece: { pieceType: string } | null;
    square: string;
  }) {
    // Right-click clears all premoves
    if (premoves.length > 0) {
      setPremoves([]);
      return;
    }

    const sq = square as Square;
    setRightClickedSquares((prev) => ({
      ...prev,
      [sq]: prev[sq]?.backgroundColor
        ? undefined
        : BOARD_STYLES.rightClickSquare
    }));
  }

  // Build square styles including all premove highlights (memoized to prevent unnecessary re-renders)
  const squareStyles = useMemo<OptionSquares>(() => {
    const styles: OptionSquares = {
      ...optionSquares,
      ...rightClickedSquares
    };

    // Highlight all premove squares
    for (const premove of premoves) {
      styles[premove.from] = BOARD_STYLES.premoveSquare;
      styles[premove.to] = BOARD_STYLES.premoveSquare;
    }

    return styles;
  }, [optionSquares, rightClickedSquares, premoves]);

  // Derive theme styles from theme name (memoized)
  const theme = useMemo(() => {
    // We use the generic variables which are set by the data-board-scheme attribute
    // This allows instant theme switching via CSS without re-render flash
    return {
      darkSquareStyle: { backgroundColor: 'var(--board-square-dark)' },
      lightSquareStyle: { backgroundColor: 'var(--board-square-light)' }
    };
  }, []); // Empty dependency array as these values are static strings pointing to CSS vars

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
