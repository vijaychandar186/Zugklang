import { useMemo } from 'react';
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
  const boardFlipped = useGameStore((s) => s.boardFlipped);
  const currentFEN = useGameStore((s) => s.currentFEN);
  const timeControl = useGameStore((s) => s.timeControl);
  const whiteTime = useGameStore((s) => s.whiteTime);
  const blackTime = useGameStore((s) => s.blackTime);
  const activeTimer = useGameStore((s) => s.activeTimer);

  const hasTimer = timeControl.mode !== 'unlimited';

  const { captured, materialAdvantage } = useMemo(() => {
    const captured = getCapturedPiecesFromFEN(currentFEN);
    const materialAdvantage = getMaterialAdvantage(captured);
    return { captured, materialAdvantage };
  }, [currentFEN]);

  // Calculate actual board orientation (same logic as useChessBoard)
  const boardOrientation = boardFlipped
    ? playAs === 'white'
      ? 'black'
      : 'white'
    : playAs;

  // Determine which color is at top vs bottom based on actual board orientation
  // Top = opponent of board orientation, Bottom = board orientation color
  const topColor: 'white' | 'black' =
    boardOrientation === 'white' ? 'black' : 'white';
  const bottomColor: 'white' | 'black' = boardOrientation;

  // Is the top player stockfish?
  const isTopStockfish = topColor !== playAs;
  const isBottomStockfish = bottomColor !== playAs;

  // Top player's captured pieces and advantage
  const topCaptured = topColor === 'white' ? captured.white : captured.black;
  const topAdvantage =
    topColor === 'white' ? materialAdvantage : -materialAdvantage;

  // Bottom player's captured pieces and advantage
  const bottomCaptured =
    bottomColor === 'white' ? captured.white : captured.black;
  const bottomAdvantage =
    bottomColor === 'white' ? materialAdvantage : -materialAdvantage;

  // Timer data based on board orientation
  const topTime = topColor === 'white' ? whiteTime : blackTime;
  const bottomTime = bottomColor === 'white' ? whiteTime : blackTime;
  const topTimerActive = activeTimer === topColor;
  const bottomTimerActive = activeTimer === bottomColor;

  return {
    gameId,
    gameStarted,
    stockfishLevel,
    topColor,
    bottomColor,
    topCaptured,
    topAdvantage,
    bottomCaptured,
    bottomAdvantage,
    isTopStockfish,
    isBottomStockfish,
    // Timer data
    hasTimer,
    topTime,
    bottomTime,
    topTimerActive,
    bottomTimerActive,
    // Analysis data
    currentFEN
  };
}
