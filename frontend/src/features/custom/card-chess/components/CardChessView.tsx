'use client';
import { useMemo } from 'react';
import { CardChessSidebar } from './CardChessSidebar';
import { useCardChessStore } from '../stores/useCardChessStore';
import { useCardChessTimer } from '../hooks/useCardChessTimer';
import { TwoPlayerCustomGameView } from '@/features/custom/shared/components/TwoPlayerCustomGameView';
export function CardChessView({ canMove }: { canMove?: boolean } = {}) {
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
  } = useCardChessStore();
  useCardChessTimer();
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
      sidebar={<CardChessSidebar mode='play' />}
      canMove={canMove}
      loserColor={loserColor}
    />
  );
}
