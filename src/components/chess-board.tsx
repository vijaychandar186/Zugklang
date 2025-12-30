import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { StockfishEngine } from '@/lib/engine';
import { useBoardStore } from '@/lib/store';
import { OptionSquares, RightClickedSquares } from '@/utils/types';

export function ChessBoard() {
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

  // Use a ref to track pending moves to add to store
  const pendingMoveRef = useRef<{ san: string; fen: string } | null>(null);
  // Use a ref to always get the current game state
  const gameRef = useRef(game);
  gameRef.current = game;

  const stockfishLevel = useBoardStore((state) => state.stockfishLevel);
  const playAs = useBoardStore((state) => state.playAs);

  const theme = useBoardStore((state) => state.theme);
  const addMove = useBoardStore((state) => state.addMove);
  const setOnNewGame = useBoardStore((state) => state.setOnNewGame);
  const setGameOver = useBoardStore((state) => state.setGameOver);
  const resetGame = useBoardStore((state) => state.resetGame);
  const setGameResult = useBoardStore((state) => state.setGameResult);
  const currentFEN = useBoardStore((state) => state.currentFEN);
  const viewingIndex = useBoardStore((state) => state.viewingIndex);
  const positionHistory = useBoardStore((state) => state.positionHistory);
  const goToEnd = useBoardStore((state) => state.goToEnd);
  const isViewingHistory = viewingIndex < positionHistory.length - 1;

  const playerTurn = playAs === 'white' ? 'w' : 'b';
  const isPlayerTurn = game.turn() === playerTurn;

  // Process pending move after render
  useEffect(() => {
    if (pendingMoveRef.current) {
      const { san, fen } = pendingMoveRef.current;
      pendingMoveRef.current = null;
      addMove(san, fen);
    }
  });

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
          addMove(move.san, newGame.fen());
          setGame(newGame);
          setTimeout(makeStockfishMove, 300);
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
          // Only apply if it's still Stockfish's turn and FEN matches
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
              // Schedule addMove for after render
              pendingMoveRef.current = { san: move.san, fen: newGame.fen() };
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
    if (playAs === 'black' && game.history().length === 0) {
      makeStockfishMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAs]);

  // Check for game over after each move
  useEffect(() => {
    if (game.isGameOver()) {
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
  }, [game, playAs, setGameResult, setGameOver]);

  const onNewGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    resetGame();
    setOptionSquares({});
    setRightClickedSquares({});
    setMoveFrom(null);
    setMoveTo(null);
    setPremove(null);
    pendingMoveRef.current = null;
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
                  // Schedule addMove for after render
                  pendingMoveRef.current = {
                    san: move.san,
                    fen: gameToUpdate.fen()
                  };
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
      const isCapture =
        game.get(move.to) &&
        game.get(move.to)!.color !== game.get(square)!.color;
      newSquares[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
    return true;
  }

  function makeMove(from: Square, to: Square, promotion?: string): boolean {
    // If viewing history, go back to current position first
    if (isViewingHistory) {
      goToEnd();
      return false;
    }

    // If it's not player's turn, set as premove
    if (!isPlayerTurn) {
      setPremove({ from, to, promotion: promotion || 'q' });
      return true; // Return true to show the piece snapping back
    }

    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from,
        to,
        promotion: (promotion || 'q') as 'q' | 'r' | 'b' | 'n'
      });

      if (move) {
        addMove(move.san, newGame.fen());
        setGame(newGame);
        setMoveFrom(null);
        setMoveTo(null);
        setOptionSquares({});
        setTimeout(makeStockfishMove, 300);
        return true;
      }
    } catch {
      // Invalid move
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
    // If viewing history, go back to current position
    if (isViewingHistory) {
      goToEnd();
      return;
    }

    // Clear premove on click
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
        // If not player's turn, allow setting premove by clicking
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

      // Check for pawn promotion
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
    // Right click clears premove
    if (premove) {
      setPremove(null);
      return;
    }

    const sq = square as Square;
    const color = 'rgba(255, 0, 0, 0.5)';
    setRightClickedSquares((prev) => ({
      ...prev,
      [sq]:
        prev[sq]?.backgroundColor === color
          ? undefined
          : { backgroundColor: color }
    }));
  }

  // Build square styles including premove highlight
  const squareStyles: OptionSquares = {
    ...optionSquares,
    ...rightClickedSquares
  };

  if (premove) {
    squareStyles[premove.from] = {
      background: 'rgba(0, 150, 255, 0.5)'
    };
    squareStyles[premove.to] = {
      background: 'rgba(0, 150, 255, 0.5)'
    };
  }

  return (
    <div className='w-[280px] sm:w-[400px] lg:w-[560px]'>
      <Chessboard
        options={{
          position: isViewingHistory ? currentFEN : game.fen(),
          boardOrientation: playAs,
          allowDragging: true,
          animationDurationInMs: 200,
          boardStyle: {
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          },
          squareStyles,
          darkSquareStyle: theme.darkSquareStyle,
          lightSquareStyle: theme.lightSquareStyle,
          onSquareClick: handleSquareClick,
          onSquareRightClick: handleSquareRightClick,
          onPieceDrop: onDrop
        }}
      />
    </div>
  );
}
