'use client';
import { useMemo } from 'react';
import { useTriDChessStore } from '../store/useTriDChessStore';
import { TriDChessSetupDialog } from './TriDChessSetupDialog';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
import { useChessStore } from '@/features/chess/stores/useChessStore';

export function TriDChessSidebar() {
  const store = useTriDChessStore();
  const {
    gameState,
    gameStarted,
    viewingIndex,
    pendingBoardArrival,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    setGameOver,
    setGameResult
  } = store;

  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const flipBoard = useChessStore((s) => s.flipBoard);

  const moves = useMemo(
    () => gameState.moveHistory.map((m) => m.san),
    [gameState.moveHistory]
  );

  // positionHistory is a dummy array matching snapshot count
  // (TwoPlayerCustomSidebar uses it only for length / FEN copy — we skip FEN copy)
  const positionHistory = useMemo(
    () => gameState.snapshots.map(() => ''),
    [gameState.snapshots]
  );

  const infoPanel = useMemo(() => {
    if (!gameStarted || gameState.isOver) return null;
    if (pendingBoardArrival) {
      return (
        <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
          <p className='font-semibold'>Choose arrival square</p>
          <p>
            Click one of the two highlighted squares to place the transported
            piece.
          </p>
        </div>
      );
    }
    return (
      <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
        <p className='font-semibold'>
          {gameState.turn === 'w' ? 'White' : 'Black'}&apos;s turn
        </p>
        <p>
          Click a piece to see legal moves, or click an attack board label to
          reposition it.
        </p>
      </div>
    );
  }, [gameStarted, gameState.isOver, gameState.turn, pendingBoardArrival]);

  return (
    <TwoPlayerCustomSidebar
      mode='play'
      moves={moves}
      viewingIndex={viewingIndex}
      positionHistory={positionHistory}
      gameOver={gameState.isOver}
      gameResult={gameState.result}
      gameStarted={gameStarted}
      turn={gameState.turn}
      soundEnabled={soundEnabled}
      isAnalysisOn={false}
      isAnalysisReady={false}
      onGoToStart={goToStart}
      onGoToEnd={goToEnd}
      onGoToPrev={goToPrev}
      onGoToNext={goToNext}
      onGoToMove={goToMove}
      onSetGameOver={setGameOver}
      onSetGameResult={setGameResult}
      onFlipBoard={flipBoard}
      onStartAnalysis={() => {}}
      onEndAnalysis={() => {}}
      setupDialog={TriDChessSetupDialog}
      activePanel={infoPanel}
    />
  );
}
