'use client';

import { useChessBoard } from '@/hooks/useChessBoard';
import { Board } from './Board';
import { useEffect, useState } from 'react';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function ChessBoard({
  serverOrientation
}: {
  serverOrientation?: 'white' | 'black';
}) {
  const {
    game,
    theme,
    boardOrientation,
    currentFEN,
    isViewingHistory,
    squareStyles,
    onDrop,
    handleSquareClick,
    handleSquareRightClick
  } = useChessBoard();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine actual values based on mount state to avoid hydration mismatch
  const position = isMounted
    ? isViewingHistory
      ? currentFEN
      : game.fen()
    : STARTING_FEN;

  const orientation = isMounted
    ? boardOrientation
    : serverOrientation || 'white';

  const canDrag = isMounted && !isViewingHistory;
  const currentSquareStyles = isMounted ? squareStyles : {};

  return (
    <Board
      id='computer-chess-board'
      position={position}
      boardOrientation={orientation}
      canDrag={canDrag}
      squareStyles={currentSquareStyles}
      darkSquareStyle={theme.darkSquareStyle}
      lightSquareStyle={theme.lightSquareStyle}
      onPieceDrop={onDrop}
      onSquareClick={handleSquareClick}
      onSquareRightClick={handleSquareRightClick}
      // arrows prop is optional, AnalysisBoard uses it, ComputerBoard doesn't yet (unless we add visual cues)
    />
  );
}
