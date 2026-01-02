'use client';

import { Chessboard } from 'react-chessboard';
import { useChessBoard } from '@/hooks/useChessBoard';
import { BOARD_STYLES } from '@/constants/board-themes';
import { ANIMATION_CONFIG } from '@/constants/animation';

export function ChessBoard() {
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

  return (
    <div className='w-[calc(100vw-2rem)] max-w-[380px] sm:w-[400px] sm:max-w-none lg:w-[560px]'>
      <Chessboard
        options={{
          position: isViewingHistory ? currentFEN : game.fen(),
          boardOrientation: boardOrientation,
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
