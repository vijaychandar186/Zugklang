'use client';

import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { PromotionDialog } from '@/features/chess/components/PromotionDialog';
import {
  useAnalysisBoardState,
  useAnalysisBoardActions
} from '../stores/useAnalysisBoardStore';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig,
  useAnalysisPosition
} from '@/features/chess/stores/useAnalysisStore';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { useChessBoardLogic } from '@/features/chess/hooks/useChessBoardLogic';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useStockfish } from '@/features/engine/hooks/useStockfish';
import { playSound } from '@/features/game/utils/sounds';
import { useChessStore } from '@/features/chess/stores/useChessStore';

export function AnalysisChessBoard() {
  const {
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    boardOrientation,
    playingAgainstStockfish,
    playerColor,
    stockfishLevel
  } = useAnalysisBoardState();

  const { makeMove, goToEnd } = useAnalysisBoardActions();
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  const theme = useBoardTheme();

  const {
    isMounted,
    position,
    isViewingHistory,
    gameTurn,
    playerColorShort,
    executeMove,
    onDrop,
    handleSquareClick,
    handleSquareRightClick,
    squareStyles,
    pendingPromotion,
    completePromotion,
    cancelPromotion
  } = useChessBoardLogic({
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    playerColor,
    soundEnabled,
    makeMove,
    goToEnd,
    allowOpponentMoves: !playingAgainstStockfish
  });

  useStockfish({
    game,
    fen: currentFEN,
    gameId: 1,
    playAs: playerColor,
    stockfishLevel,
    enabled: playingAgainstStockfish && !game.isGameOver(),
    onMove: executeMove,
    soundEnabled,
    playSound
  });

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor: playerColorShort,
    gameTurn,
    analysisTurn
  });

  const resolvedOrientation = isMounted ? boardOrientation : 'white';

  // Common board props
  const boardProps = {
    position,
    boardOrientation: resolvedOrientation,
    canDrag: isMounted && !isViewingHistory && !pendingPromotion,
    squareStyles: isMounted ? squareStyles : {},
    onPieceDrop: onDrop,
    onSquareClick: handleSquareClick,
    onSquareRightClick: handleSquareRightClick,
    arrows: analysisArrows
  };

  return (
    <div className='relative'>
      {isMounted && board3dEnabled ? (
        <Board3D {...boardProps} />
      ) : (
        <Board
          {...boardProps}
          darkSquareStyle={theme.darkSquareStyle}
          lightSquareStyle={theme.lightSquareStyle}
        />
      )}
      <PromotionDialog
        isOpen={!!pendingPromotion}
        color={pendingPromotion?.color || 'white'}
        targetSquare={pendingPromotion?.to || 'a8'}
        boardOrientation={resolvedOrientation}
        onSelect={completePromotion}
        onCancel={cancelPromotion}
      />
    </div>
  );
}

