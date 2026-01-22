import { useMemo } from 'react';
import { ARROW_COLORS } from '@/features/chess/config/colors';
import { ChessArrow } from '@/features/chess/types/visualization';

type UseChessArrowsProps = {
  isAnalysisOn: boolean;
  uciLines: string[][];
  showBestMoveArrow: boolean;
  showThreatArrow: boolean;
  playerColor: 'w' | 'b';
  gameTurn: 'w' | 'b';
  analysisTurn: 'w' | 'b';
};

export function useChessArrows({
  isAnalysisOn,
  uciLines,
  showBestMoveArrow,
  showThreatArrow,
  playerColor,
  gameTurn,
  analysisTurn
}: UseChessArrowsProps): ChessArrow[] {
  return useMemo(() => {
    if (!isAnalysisOn || !uciLines[0]) return [];

    if (analysisTurn !== gameTurn) return [];

    const isPlayerTurn = gameTurn === playerColor;
    const uniqueArrows = new Map<string, ChessArrow>();

    if (showBestMoveArrow && isPlayerTurn) {
      uciLines.forEach((line) => {
        if (line.length > 0) {
          const uci = line[0];
          const from = uci.slice(0, 2);
          const to = uci.slice(2, 4);
          const key = `${from}-${to}`;
          uniqueArrows.set(key, {
            startSquare: from,
            endSquare: to,
            color: ARROW_COLORS.bestMove
          });
        }
      });
    }

    if (showThreatArrow && isPlayerTurn) {
      uciLines.forEach((line) => {
        if (line.length > 1) {
          const uci = line[1];
          const from = uci.slice(0, 2);
          const to = uci.slice(2, 4);
          const key = `${from}-${to}`;
          if (!uniqueArrows.has(key)) {
            uniqueArrows.set(key, {
              startSquare: from,
              endSquare: to,
              color: ARROW_COLORS.threat
            });
          }
        }
      });
    }

    return Array.from(uniqueArrows.values());
  }, [
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor,
    gameTurn,
    analysisTurn
  ]);
}
