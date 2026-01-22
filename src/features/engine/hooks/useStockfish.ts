import { useEffect, useRef, useCallback } from 'react';
import { Chess, ChessJSSquare as Square } from '@/lib/chess';
import { StockfishEngine } from '@/lib/engine';
import { MOVE_DELAY } from '@/features/chess/config/animation';
import { SoundType } from '@/features/game/utils/sounds';

type UseStockfishProps = {
  game: Chess;
  fen: string;
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
  fen,
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

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const makeStockfishMove = useCallback(async () => {
    const currentGame = gameRef.current;
    const expectedTurn = playAs === 'white' ? 'b' : 'w';

    if (currentGame.turn() !== expectedTurn || currentGame.isGameOver()) {
      return;
    }

    const fenToEvaluate = currentGame.fen();
    engine.stop();

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
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
      if (initializedGameIdRef.current !== gameId) {
        await engine.newGame();
        initializedGameIdRef.current = gameId;

        if (gameId > 0 && soundEnabled) {
          playSound('game-start');
        }
      }

      const stockfishColor = playAs === 'white' ? 'b' : 'w';
      if (game.turn() === stockfishColor && !game.isGameOver()) {
        stockfishTimerRef.current = setTimeout(async () => {
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
    fen,
    playAs,
    gameId,
    engine,
    makeStockfishMove,
    enabled,
    soundEnabled,
    playSound
  ]);
}
