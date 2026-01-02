import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/hooks/stores/useGameStore';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage
} from '@/utils/helpers';

export function useGameView() {
  // Individual selectors for better performance
  const gameId = useGameStore((s) => s.gameId);
  const gameStarted = useGameStore((s) => s.gameStarted);
  const stockfishLevel = useGameStore((s) => s.stockfishLevel);
  const playAs = useGameStore((s) => s.playAs);
  const currentFEN = useGameStore((s) => s.currentFEN);
  const startGame = useGameStore((s) => s.startGame);

  // Auto-start game on first load
  useEffect(() => {
    if (!gameStarted) {
      startGame(10, 'white');
    }
  }, [gameStarted, startGame]);

  const { captured, materialAdvantage } = useMemo(() => {
    const captured = getCapturedPiecesFromFEN(currentFEN);
    const materialAdvantage = getMaterialAdvantage(captured);
    return { captured, materialAdvantage };
  }, [currentFEN]);

  // Determine which color is at top vs bottom based on board orientation
  const topColor: 'white' | 'black' = playAs === 'white' ? 'black' : 'white';
  const bottomColor: 'white' | 'black' = playAs;

  // Top player's captured pieces and advantage
  const topCaptured = topColor === 'white' ? captured.white : captured.black;
  const topAdvantage =
    topColor === 'white' ? materialAdvantage : -materialAdvantage;

  // Bottom player's captured pieces and advantage
  const bottomCaptured =
    bottomColor === 'white' ? captured.white : captured.black;
  const bottomAdvantage =
    bottomColor === 'white' ? materialAdvantage : -materialAdvantage;

  return {
    gameId,
    stockfishLevel,
    topColor,
    bottomColor,
    topCaptured,
    topAdvantage,
    bottomCaptured,
    bottomAdvantage
  };
}
