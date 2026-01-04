import { UnifiedChessBoard as Board } from '@/components/board/Board';
import { useChessBoard } from '@/hooks/useChessBoard';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig
} from '@/hooks/stores/useAnalysisStore';
import { useChessArrows } from '@/hooks/useChessArrows';

export function ChessBoard({
  serverOrientation
}: {
  serverOrientation?: 'white' | 'black';
}) {
  const {
    game,
    theme,
    boardOrientation,
    currentFEN,
    isViewingHistory,
    squareStyles,
    onDrop,
    handleSquareClick,
    handleSquareRightClick
  } = useChessBoard();

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow
  });

  return (
    <Board
      position={isViewingHistory ? currentFEN : game.fen()}
      boardOrientation={boardOrientation || serverOrientation || 'white'}
      canDrag={!isViewingHistory}
      squareStyles={squareStyles}
      darkSquareStyle={theme.darkSquareStyle}
      lightSquareStyle={theme.lightSquareStyle}
      onPieceDrop={onDrop}
      onSquareClick={handleSquareClick}
      onSquareRightClick={handleSquareRightClick}
      arrows={analysisArrows}
      id='main-chess-board'
    />
  );
}
