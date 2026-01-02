import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { StockfishEngine } from '@/lib/engine';
import { useGameStore } from '@/hooks/stores/useGameStore';
import { OptionSquares, RightClickedSquares } from '@/utils/types';
import { BOARD_STYLES, getBoardTheme } from '@/constants/board-themes';
import { playSound, getSoundType } from '@/utils/sounds';
import { MOVE_DELAY } from '@/constants/animation';

export function useChessBoard() {
  const engine = useMemo(() => new StockfishEngine(), []);
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<OptionSquares>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const [premove, setPremove] = useState<{
    from: Square;
    to: Square;
    promotion?: string;
  } | null>(null);
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
  const boardFlipped = useGameStore((s) => s.boardFlipped);
  const boardThemeName = useGameStore((s) => s.boardThemeName);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const addMove = useGameStore((s) => s.addMove);
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
        const isPlayerMove =
          pendingMove.fen.split(' ')[1] ===
          (useGameStore.getState().playAs === 'white' ? 'b' : 'w'); // Logic to check who moved. Pending move has FEN *after* move. So turn is now opponent.

        // Simpler: pendingMove is set by stockfish or premove execution.
        // Actually pendingMove is mostly used for stockfish moves or buffer.
        // Let's rely on standard logic.

        // Re-deriving isPlayerMove in pendingMove effect might be tricky without full move object?
        // pendingMove struct has: san, fen, isCapture... no color.
        // But we know who moved based on whose turn it is in the NEW fen?
        // If fen turn is 'b', then 'w' just moved.

        const turnAfterMove = pendingMove.fen.split(' ')[1];
        const playerColor =
          useGameStore.getState().playAs === 'white' ? 'w' : 'b';
        // If it's now 'b's turn, then 'w' moved.
        const moverColor = turnAfterMove === 'w' ? 'b' : 'w';
        const isPlayerMoveCheck = moverColor === playerColor;

        const soundType = getSoundType(
          pendingMove.isCapture,
          pendingMove.isCheck,
          pendingMove.isCastle,
          pendingMove.isPromotion,
          isPlayerMoveCheck
        );
        playSound(soundType);
      }

      const timer = setTimeout(() => {
        addMove(pendingMove.san, pendingMove.fen);
        setPendingMove(null);
      }, MOVE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [pendingMove, addMove]);

  // Execute premove when it becomes player's turn
  useEffect(() => {
    if (premove && isPlayerTurn && !game.isGameOver()) {
      const { from, to, promotion } = premove;
      setPremove(null);

      try {
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from,
          to,
          promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined
        });
        if (move) {
          playMoveSound(move, newGame);
          addMove(move.san, newGame.fen());
          setGame(newGame);
          setTimeout(makeStockfishMove, MOVE_DELAY);
        }
      } catch {
        // Invalid premove, just clear it
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, isPlayerTurn, premove]);

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

  // Initial move for black
  useEffect(() => {
    // Only play game start sound if it's the very beginning and we haven't played it yet?
    // Or just play it when component mounts if game is empty?
    // useGameStore persistence might make this tricky.
    // Let's just play it when a NEW game starts (onNewGame).

    if (playAs === 'black' && game.history().length === 0) {
      makeStockfishMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAs]);

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
    setPremove(null);
    setPendingMove(null);
    if (playAs === 'black') {
      const startFen = newGame.fen();
      setTimeout(() => {
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
      setPremove({ from, to, promotion: promotion || 'q' });
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
        setTimeout(makeStockfishMove, MOVE_DELAY);
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

    if (premove) {
      setPremove(null);
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
          setPremove({ from: moveFrom, to: sq, promotion: 'q' });
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
    if (premove) {
      setPremove(null);
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

  // Build square styles including premove highlight (memoized to prevent unnecessary re-renders)
  const squareStyles = useMemo<OptionSquares>(() => {
    const styles: OptionSquares = {
      ...optionSquares,
      ...rightClickedSquares
    };

    if (premove) {
      styles[premove.from] = BOARD_STYLES.premoveSquare;
      styles[premove.to] = BOARD_STYLES.premoveSquare;
    }

    return styles;
  }, [optionSquares, rightClickedSquares, premove]);

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
