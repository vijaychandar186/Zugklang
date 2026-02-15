import { useEffect, useRef, useCallback } from 'react';
import { Chess, ChessJSSquare as Square } from '@/lib/chess';
import { FairyStockfishEngine } from '@/lib/fairyEngine';
import { MOVE_DELAY } from '@/features/chess/config/animation';
import { SoundType } from '@/features/game/utils/sounds';
import type { ChessVariant } from '@/features/chess/utils/chess960';

type UseFairyStockfishProps = {
  game: Chess;
  fen: string;
  gameId: number;
  playAs: 'white' | 'black';
  stockfishLevel: number;
  enabled: boolean;
  variant: ChessVariant;
  onMove: (from: Square, to: Square, promotion?: string) => boolean;
  onDropMove?: (san: string) => unknown;
  soundEnabled: boolean;
  playSound: (type: SoundType) => void;
};

export function useFairyStockfish({
  game,
  fen,
  gameId,
  playAs,
  stockfishLevel,
  enabled,
  variant,
  onMove,
  onDropMove,
  soundEnabled,
  playSound
}: UseFairyStockfishProps) {
  const engine = FairyStockfishEngine.getInstance();
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

        // Drop moves (e.g. "P@e4") contain "@" - handle via SAN
        if (bestMove.includes('@') && onDropMove) {
          onDropMove(bestMove);
          return;
        }

        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion = bestMove.substring(4, 5) || undefined;

        onMove(from, to, promotion);
      }
    });

    await engine.evaluatePosition(fenToEvaluate, stockfishLevel, variant);
  }, [engine, playAs, stockfishLevel, variant, onMove, onDropMove]);

  useEffect(() => {
    if (!enabled) return;

    const manageEngineAndMove = async () => {
      if (initializedGameIdRef.current !== gameId) {
        await engine.newGame(variant);
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
    game,
    playAs,
    gameId,
    engine,
    variant,
    makeStockfishMove,
    enabled,
    soundEnabled,
    playSound
  ]);
}
