import { useEffect, useRef, useCallback } from 'react';
import { Chess, ChessJSSquare as Square } from '@/lib/chess/chess';
import { FairyStockfishEngine } from '@/lib/engine/fairyStockfish';
import { MOVE_DELAY } from '@/features/chess/config/animation';
import { SoundType } from '@/features/game/utils/sounds';
import type { ChessVariant } from '@/features/chess/utils/chess960';
import {
  EngineConfig,
  sampleFromGaussian
} from '@/features/chess/types/engine';
type UseFairyStockfishProps = {
  game: Chess;
  fen: string;
  gameId: number;
  playAs: 'white' | 'black';
  engineConfig: EngineConfig;
  enabled: boolean;
  variant: ChessVariant;
  onMove: (from: Square, to: Square, promotion?: string) => boolean;
  onDropMove?: (san: string) => unknown;
  onMoveDepthRecorded?: (depth: number) => void;
  soundEnabled: boolean;
  playSound: (type: SoundType) => void;
};
export function useFairyStockfish({
  game,
  fen,
  gameId,
  playAs,
  engineConfig,
  enabled,
  variant,
  onMove,
  onDropMove,
  onMoveDepthRecorded,
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
    let depthToUse: number;
    if (engineConfig.mode === 'probabilistic') {
      depthToUse = sampleFromGaussian(engineConfig.mean, engineConfig.variance);
      console.log(
        `Probabilistic mode (Fairy): sampled depth ${depthToUse} (mean: ${engineConfig.mean}, variance: ${engineConfig.variance})`
      );
    } else {
      depthToUse = engineConfig.level;
    }
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        if (gameRef.current.fen() !== fenToEvaluate) return;
        if (bestMove.includes('@') && onDropMove) {
          onDropMove(bestMove);
          onMoveDepthRecorded?.(depthToUse);
          return;
        }
        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion = bestMove.substring(4, 5) || undefined;
        onMove(from, to, promotion);
        onMoveDepthRecorded?.(depthToUse);
      }
    });
    await engine.evaluatePosition(fenToEvaluate, depthToUse, variant);
  }, [
    engine,
    playAs,
    engineConfig,
    variant,
    onMove,
    onDropMove,
    onMoveDepthRecorded
  ]);
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
