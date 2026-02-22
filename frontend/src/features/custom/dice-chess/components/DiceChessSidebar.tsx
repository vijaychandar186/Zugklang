'use client';
import { DicePanel } from './DicePanel';
import { DiceChessSetupDialog } from './DiceChessSetupDialog';
import { useDiceChessStore } from '../stores/useDiceChessStore';
import {
  useChessStore,
  type ChessMode
} from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
interface DiceChessSidebarProps {
  mode: ChessMode;
}
export function DiceChessSidebar({ mode }: DiceChessSidebarProps) {
  const diceStore = useDiceChessStore();
  const {
    moves,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,
    turn,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    setGameOver,
    setGameResult
  } = diceStore;
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
      setupDialog={DiceChessSetupDialog}
      activePanel={
        gameStarted && !gameOver ? <DicePanel turnColor={turn} /> : null
      }
    />
  );
}
