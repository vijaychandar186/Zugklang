import { useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { StockfishEngine } from '@/lib/engine';
import { MOVE_DELAY } from '@/constants/animation';
import { SoundType } from '@/utils/sounds';

type UseStockfishProps = {
  game: Chess;
  gameId: number;
  playAs: 'white' | 'black';
  stockfishLevel: number;
  enabled: boolean;
  onMove: (from: Square, to: Square, promotion?: string) => boolean;
  soundEnabled: boolean;
  playSound: (type: SoundType) => void;
};

export function useStockfish({
  game,
  gameId,
  playAs,
  stockfishLevel,
  enabled,
  onMove,
  soundEnabled,
  playSound
}: UseStockfishProps) {
  const engine = StockfishEngine.getInstance();
  const stockfishTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedGameIdRef = useRef<number>(-1);
  const gameRef = useRef(game);

  // Keep gameRef fresh for async callbacks
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const makeStockfishMove = useCallback(async () => {
    const currentGame = gameRef.current;
    const expectedTurn = playAs === 'white' ? 'b' : 'w';

    // Double check it's actually engine's turn and game isn't over
    if (currentGame.turn() !== expectedTurn || currentGame.isGameOver()) {
      return;
    }

    const fenToEvaluate = currentGame.fen();
    engine.stop();

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        // Verify game state hasn't changed (e.g. user aborted or moved)
        if (gameRef.current.fen() !== fenToEvaluate) return;

        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion = bestMove.substring(4, 5) || undefined;

        onMove(from, to, promotion);
      }
    });

    await engine.evaluatePosition(fenToEvaluate, stockfishLevel);
  }, [engine, playAs, stockfishLevel, onMove]);

  useEffect(() => {
    if (!enabled) return;

    const manageEngineAndMove = async () => {
      // 1. Initialize engine if this is a new game ID
      if (initializedGameIdRef.current !== gameId) {
        await engine.newGame();
        initializedGameIdRef.current = gameId;

        // Play game start sound only once when game initializes
        if (gameId > 0 && soundEnabled) {
          playSound('game-start');
        }
      }

      // 2. Trigger Stockfish move if it's its turn
      const stockfishColor = playAs === 'white' ? 'b' : 'w';
      if (game.turn() === stockfishColor && !game.isGameOver()) {
        // Add delay for smoother experience
        stockfishTimerRef.current = setTimeout(async () => {
          // Double check readiness
          if (
            gameRef.current.turn() === stockfishColor &&
            !gameRef.current.isGameOver()
          ) {
            await makeStockfishMove();
          }
        }, MOVE_DELAY);
      }
    };

    manageEngineAndMove();

    return () => {
      if (stockfishTimerRef.current) {
        clearTimeout(stockfishTimerRef.current);
        stockfishTimerRef.current = null;
      }
      engine.stop();
    };
  }, [
    game,
    playAs,
    gameId,
    engine,
    makeStockfishMove,
    enabled,
    soundEnabled,
    playSound
  ]);
}
