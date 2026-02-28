'use client';
import { useMemo } from 'react';
import { DicePanel } from './DicePanel';
import { DiceRollChart } from './DiceRollChart';
import { useDiceChessStore } from '../stores/useDiceChessStore';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { TwoPlayerCustomGameView } from '@/features/custom/shared/components/TwoPlayerCustomGameView';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
import { TwoPlayerCustomSetupDialog } from '@/features/custom/shared/components/TwoPlayerCustomSetupDialog';
import { useTwoPlayerCustomTimer } from '@/features/custom/shared/hooks/useTwoPlayerCustomTimer';

function DiceSetupDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const startNewGame = useDiceChessStore((s) => s.startNewGame);
  return (
    <TwoPlayerCustomSetupDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Dice Chess'
      onStartNewGame={startNewGame}
      rules={
        <p className='text-muted-foreground text-center text-sm'>
          Roll 3 dice each turn. Move only the pieces shown!
          <br />
          If no valid moves, dice automatically re-roll.
        </p>
      }
    />
  );
}

export function DiceChessView({ canMove }: { canMove?: boolean } = {}) {
  const {
    currentFEN,
    gameStarted,
    gameOver,
    makeMove,
    highlightedSquares,
    game,
    timeControl,
    whiteTime,
    blackTime,
    activeTimer,
    moves,
    viewingIndex,
    positionHistory,
    gameResult,
    turn,
    diceRollHistory,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    setGameOver,
    setGameResult
  } = useDiceChessStore();

  useTwoPlayerCustomTimer(useDiceChessStore);

  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const flipBoard = useChessStore((s) => s.flipBoard);
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();

  const loserColor = useMemo((): 'w' | 'b' | null => {
    if (!gameOver || !game.isCheckmate()) return null;
    return game.turn();
  }, [gameOver, game]);

  return (
    <TwoPlayerCustomGameView
      currentFEN={currentFEN}
      gameStarted={gameStarted}
      gameOver={gameOver}
      highlightedSquares={highlightedSquares}
      makeMove={makeMove}
      isCheck={() => game.isCheck()}
      timeControl={timeControl}
      whiteTime={whiteTime}
      blackTime={blackTime}
      activeTimer={activeTimer}
      canMove={canMove}
      loserColor={loserColor}
      sidebar={
        <TwoPlayerCustomSidebar
          mode='play'
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
          setupDialog={DiceSetupDialog}
          activePanel={
            gameStarted && !gameOver ? <DicePanel turnColor={turn} /> : null
          }
          statsNode={<DiceRollChart diceRolls={diceRollHistory} />}
          statsTitle='Dice Roll Distribution'
        />
      }
    />
  );
}
