'use client';
import { CardPanel } from './CardPanel';
import { CardDrawChart } from './CardDrawChart';
import { CardChessSetupDialog } from './CardChessSetupDialog';
import { useCardChessStore } from '../stores/useCardChessStore';
import {
  useChessStore,
  type ChessMode
} from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
interface CardChessSidebarProps {
  mode: ChessMode;
}
export function CardChessSidebar({ mode }: CardChessSidebarProps) {
  const cardStore = useCardChessStore();
  const {
    moves,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,
    turn,
    cardDrawHistory,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    setGameOver,
    setGameResult
  } = cardStore;
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const flipBoard = useChessStore((s) => s.flipBoard);
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();
  return (
    <TwoPlayerCustomSidebar
      mode={mode}
      moves={moves}
      viewingIndex={viewingIndex}
      positionHistory={positionHistory}
      gameOver={gameOver}
      gameResult={gameResult}
      gameStarted={gameStarted}
      turn={turn}
      soundEnabled={soundEnabled}
      isAnalysisOn={isAnalysisOn}
      isAnalysisReady={isInitialized}
      onGoToStart={goToStart}
      onGoToEnd={goToEnd}
      onGoToPrev={goToPrev}
      onGoToNext={goToNext}
      onGoToMove={goToMove}
      onSetGameOver={setGameOver}
      onSetGameResult={setGameResult}
      onFlipBoard={flipBoard}
      onStartAnalysis={startAnalysis}
      onEndAnalysis={endAnalysis}
      setupDialog={CardChessSetupDialog}
      activePanel={
        gameStarted && !gameOver ? <CardPanel turnColor={turn} /> : null
      }
      statsNode={<CardDrawChart cardDraws={cardDrawHistory} />}
      statsTitle='Card Draw Distribution'
    />
  );
}
