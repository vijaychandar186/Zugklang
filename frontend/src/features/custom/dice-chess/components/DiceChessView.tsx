'use client';
import { useMemo } from 'react';
import { DiceChessSidebar } from './DiceChessSidebar';
import { useDiceChessStore } from '../stores/useDiceChessStore';
import { useDiceChessTimer } from '../hooks/useDiceChessTimer';
import { TwoPlayerCustomGameView } from '@/features/custom/shared/components/TwoPlayerCustomGameView';
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
    activeTimer
  } = useDiceChessStore();
  useDiceChessTimer();
  const loserColor = useMemo((): 'w' | 'b' | null => {
    if (!gameOver) return null;
    if (!game.isCheckmate()) return null;
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
      sidebar={<DiceChessSidebar mode='play' />}
      canMove={canMove}
      loserColor={loserColor}
    />
  );
}
