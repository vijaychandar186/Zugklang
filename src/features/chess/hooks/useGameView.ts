import { useMemo } from 'react';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage
} from '@/features/chess/utils/fen-logic';

export function useGameView() {
  const gameId = useChessStore((s) => s.gameId);
  const gameStarted = useChessStore((s) => s.gameStarted);
  const stockfishLevel = useChessStore((s) => s.stockfishLevel);
  const playAs = useChessStore((s) => s.playAs);
  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const currentFEN = useChessStore((s) => s.currentFEN);
  const timeControl = useChessStore((s) => s.timeControl);
  const whiteTime = useChessStore((s) => s.whiteTime);
  const blackTime = useChessStore((s) => s.blackTime);
  const activeTimer = useChessStore((s) => s.activeTimer);

  const hasTimer = timeControl.mode !== 'unlimited';

  const { captured, materialAdvantage } = useMemo(() => {
    const captured = getCapturedPiecesFromFEN(currentFEN);
    const materialAdvantage = getMaterialAdvantage(captured);
    return { captured, materialAdvantage };
  }, [currentFEN]);

  const boardOrientation = boardFlipped
    ? playAs === 'white'
      ? 'black'
      : 'white'
    : playAs;

  const topColor: 'white' | 'black' =
    boardOrientation === 'white' ? 'black' : 'white';
  const bottomColor: 'white' | 'black' = boardOrientation;

  const isTopStockfish = topColor !== playAs;
  const isBottomStockfish = bottomColor !== playAs;

  const topCaptured = topColor === 'white' ? captured.white : captured.black;
  const topAdvantage =
    topColor === 'white' ? materialAdvantage : -materialAdvantage;

  const bottomCaptured =
    bottomColor === 'white' ? captured.white : captured.black;
  const bottomAdvantage =
    bottomColor === 'white' ? materialAdvantage : -materialAdvantage;

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
    hasTimer,
    topTime,
    bottomTime,
    topTimerActive,
    bottomTimerActive,
    currentFEN
  };
}
