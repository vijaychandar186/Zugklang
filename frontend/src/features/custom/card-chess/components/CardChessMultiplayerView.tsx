'use client';
import { TwoPlayerCustomGameView } from '@/features/custom/shared/components/TwoPlayerCustomGameView';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
import { useCardChessMultiplayerGame } from '../hooks/useCardChessMultiplayerGame';
import { CardMultiplayerPanel } from './CardMultiplayerPanel';
import { CardDrawChart } from './CardDrawChart';
export function CardChessMultiplayerView({
  challengeId
}: {
  challengeId?: string;
}) {
  const game = useCardChessMultiplayerGame(challengeId);
  const timeControl = {
    mode: game.activeClock ? ('timed' as const) : ('unlimited' as const),
    minutes: 0,
    increment: 0
  };
  return (
    <TwoPlayerCustomGameView
      currentFEN={game.currentFEN}
      gameStarted={game.gameStarted}
      gameOver={game.gameOver}
      highlightedSquares={game.highlightedSquares}
      makeMove={() => null}
      isCheck={() => false}
      timeControl={timeControl}
      whiteTime={game.whiteTimeSecs}
      blackTime={game.blackTimeSecs}
      activeTimer={game.activeClock}
      loserColor={game.loserColor}
      canMove={game.canDrag}
      topPlayer={game.topPlayerInfo}
      bottomPlayer={game.bottomPlayerInfo}
      topPlayerExtras={game.topPlayerExtras}
      bottomPlayerExtras={game.bottomPlayerExtras}
      overlays={game.overlays}
      onPieceDrop={game.onPieceDrop}
      sidebar={
        <TwoPlayerCustomSidebar
          mode='play'
          moves={game.moves}
          viewingIndex={game.viewingIndex}
          positionHistory={game.positionHistory}
          gameOver={game.gameOver}
          gameResult={game.gameResult}
          gameStarted={game.gameStarted}
          turn={game.turn}
          soundEnabled={false}
          isAnalysisOn={false}
          isAnalysisReady={false}
          onGoToStart={game.goToStart}
          onGoToEnd={game.goToEnd}
          onGoToPrev={game.goToPrev}
          onGoToNext={game.goToNext}
          onGoToMove={game.goToMove}
          onSetGameOver={() => {}}
          onSetGameResult={() => {}}
          onFlipBoard={() => {}}
          onStartAnalysis={() => {}}
          onEndAnalysis={() => {}}
          multiplayer={game.multiplayerSidebarProps}
          activePanel={
            <CardMultiplayerPanel
              drawnCard={game.drawnCard}
              isDrawing={game.isDrawing}
              needsDraw={game.needsDraw}
              onDraw={game.onDrawCard}
              turnColor={game.turn}
              isMyTurn={game.isMyTurn}
              gameStarted={game.gameStarted}
              gameOver={game.gameOver}
              isInCheck={game.isInCheck}
              drawCount={game.drawCount}
            />
          }
          statsNode={<CardDrawChart cardDraws={game.cardDrawHistory} />}
          statsTitle='Card Draw Distribution'
        />
      }
    />
  );
}
