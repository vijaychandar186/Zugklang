import { useMemo } from 'react';
import { ARROW_COLORS } from '@/utils/chessboard-utils';

export type ChessArrow = {
  startSquare: string;
  endSquare: string;
  color: string;
};

type UseChessArrowsProps = {
  isAnalysisOn: boolean;
  uciLines: string[][];
  showBestMoveArrow: boolean;
  showThreatArrow: boolean;
};

export function useChessArrows({
  isAnalysisOn,
  uciLines,
  showBestMoveArrow,
  showThreatArrow
}: UseChessArrowsProps): ChessArrow[] {
  return useMemo(() => {
    if (!isAnalysisOn || !uciLines[0]) return [];

    const uniqueArrows = new Map<string, ChessArrow>();

    // Pass 1: Best Move Arrows (Green) - Higher Priority
    // We add these first. If multiple lines suggest arrows for the same squares,
    // they are all "Best Moves" so the color is the same.
    if (showBestMoveArrow) {
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

    // Pass 2: Threat Arrows (Red) - Lower Priority
    // We only add these if there isn't already an arrow (Green) at the same position.
    // This prevents key collisions in react-chessboard and visual clutter.
    if (showThreatArrow) {
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
  }, [isAnalysisOn, uciLines, showBestMoveArrow, showThreatArrow]);
}
