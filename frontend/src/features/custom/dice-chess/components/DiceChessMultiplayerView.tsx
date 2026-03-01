'use client';
import { TwoPlayerCustomGameView } from '@/features/custom/shared/components/TwoPlayerCustomGameView';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
import { useDiceChessMultiplayerGame } from '../hooks/useDiceChessMultiplayerGame';
import { DiceMultiplayerPanel } from './DiceMultiplayerPanel';
import { DiceRollChart } from './DiceRollChart';
export function DiceChessMultiplayerView({
  challengeId
}: {
  challengeId?: string;
}) {
  const game = useDiceChessMultiplayerGame(challengeId);
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
            <DiceMultiplayerPanel
              dice={game.dice}
              isRolling={game.isRolling}
              needsRoll={game.needsRoll}
              onRoll={game.onRollDice}
              turnColor={game.turn}
              isMyTurn={game.isMyTurn}
              gameStarted={game.gameStarted}
              gameOver={game.gameOver}
            />
          }
          statsNode={<DiceRollChart diceRolls={game.diceRollHistory} />}
          statsTitle='Dice Roll Distribution'
        />
      }
    />
  );
}
