'use client';
import { useMemo } from 'react';
import { CardPanel } from './CardPanel';
import { CardDrawChart } from './CardDrawChart';
import { useCardChessStore } from '../stores/useCardChessStore';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { TwoPlayerCustomGameView } from '@/features/custom/shared/components/TwoPlayerCustomGameView';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
import { TwoPlayerCustomSetupDialog } from '@/features/custom/shared/components/TwoPlayerCustomSetupDialog';
import { useTwoPlayerCustomTimer } from '@/features/custom/shared/hooks/useTwoPlayerCustomTimer';
function CardSetupDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const startNewGame = useCardChessStore((s) => s.startNewGame);
  return (
    <TwoPlayerCustomSetupDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Card Chess'
      onStartNewGame={startNewGame}
      rules={
        <p className='text-muted-foreground text-center text-sm leading-relaxed'>
          Draw a card each turn to determine which piece to move!
          <br />
          <strong className='text-foreground'>2-9</strong> = Pawns (by file),{' '}
          <strong className='text-foreground'>10</strong> = Knight
          <br />
          <strong className='text-foreground'>J</strong> = Bishop,{' '}
          <strong className='text-foreground'>Q</strong> = Queen,{' '}
          <strong className='text-foreground'>K</strong> = King,{' '}
          <strong className='text-foreground'>A</strong> = Rook
          <br />
          <br />
          If in check: max 5 card draws to escape!
        </p>
      }
    />
  );
}
export function CardChessView({
  canMove
}: {
  canMove?: boolean;
} = {}) {
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
    cardDrawHistory,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    setGameOver,
    setGameResult
  } = useCardChessStore();
  useTwoPlayerCustomTimer(useCardChessStore);
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
          setupDialog={CardSetupDialog}
          activePanel={
            gameStarted && !gameOver ? <CardPanel turnColor={turn} /> : null
          }
          statsNode={<CardDrawChart cardDraws={cardDrawHistory} />}
          statsTitle='Card Draw Distribution'
        />
      }
    />
  );
}
