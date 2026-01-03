'use client';

import { Chessboard } from 'react-chessboard';
import { useChessBoard } from '@/hooks/useChessBoard';
import { BOARD_STYLES } from '@/constants/board-themes';
import { ANIMATION_CONFIG } from '@/constants/animation';
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

  return (
    <div className='w-[calc(100vw-2rem)] max-w-[380px] sm:w-[400px] sm:max-w-none lg:w-[560px]'>
      <Chessboard
        options={{
          position: isMounted
            ? isViewingHistory
              ? currentFEN
              : game.fen()
            : STARTING_FEN,
          boardOrientation: isMounted
            ? boardOrientation
            : serverOrientation || 'white',
          allowDragging: true,
          animationDurationInMs: ANIMATION_CONFIG.durationMs,
          boardStyle: BOARD_STYLES.boardStyle,
          squareStyles,
          darkSquareStyle: theme.darkSquareStyle,
          lightSquareStyle: theme.lightSquareStyle,
          onSquareClick: handleSquareClick,
          onSquareRightClick: handleSquareRightClick,
          onPieceDrop: onDrop
        }}
      />
    </div>
  );
}
