import {
  useAnalysisBoardState,
  useAnalysisBoardStore,
  useAnalysisBoardActions
} from '@/hooks/stores/useAnalysisBoardStore';
import { useGameStore } from '@/hooks/stores/useGameStore';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig
} from '@/hooks/stores/useAnalysisStore';
import { playSound } from '@/utils/sounds';
import { useStockfish } from '@/hooks/computer/useStockfish';
import { useChessArrows } from '@/hooks/useChessArrows';
import {
  useSquareInteraction,
  useBoardTheme
} from '@/hooks/useSquareInteraction';
import { UnifiedChessBoard as Board } from '@/components/board/Board';

export function AnalysisBoard() {
  const {
    currentFEN,
    playingAgainstStockfish,
    playerColor,
    stockfishLevel,
    viewingIndex,
    positionHistory,
    boardOrientation
  } = useAnalysisBoardState();

  const { makeMove } = useAnalysisBoardActions();
  const game = useAnalysisBoardStore((state) => state.game);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const theme = useBoardTheme();

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();

  const { squareStyles, handleSquareClick, handleSquareRightClick } =
    useSquareInteraction();

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow
  });

  // Stockfish integration for play-from-position
  useStockfish({
    game,
    gameId: 1,
    playAs: playerColor,
    stockfishLevel,
    enabled: playingAgainstStockfish,
    onMove: (from, to, promotion) => makeMove(from, to, promotion),
    soundEnabled,
    playSound
  });

  function onDrop({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare) return false;
    return makeMove(sourceSquare, targetSquare);
  }

  const isViewingHistory = viewingIndex < positionHistory.length - 1;

  return (
    <Board
      position={currentFEN}
      boardOrientation={boardOrientation}
      canDrag={!isViewingHistory}
      squareStyles={squareStyles}
      darkSquareStyle={theme.darkSquareStyle}
      lightSquareStyle={theme.lightSquareStyle}
      onPieceDrop={onDrop}
      onSquareClick={handleSquareClick}
      onSquareRightClick={handleSquareRightClick}
      arrows={analysisArrows}
      id='analysis-chess-board'
    />
  );
}
