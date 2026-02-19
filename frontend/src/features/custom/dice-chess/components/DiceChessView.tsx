'use client';

import { useEffect, useState } from 'react';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { DiceChessSidebar } from './DiceChessSidebar';
import { useDiceChessStore } from '../stores/useDiceChessStore';
import { useDiceChessTimer } from '../hooks/useDiceChessTimer';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useAnalysisActions } from '@/features/chess/stores/useAnalysisStore';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage
} from '@/features/chess/utils/fen-logic';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import type { CapturedPieces } from '@/features/chess/types/core';

export function DiceChessView() {
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

  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const theme = useBoardTheme();

  // Initialize timer hook for countdown
  useDiceChessTimer();

  const [captured, setCaptured] = useState<CapturedPieces>({
    white: [],
    black: []
  });
  const [materialAdvantage, setMaterialAdvantage] = useState(0);

  const { initializeEngine, setPosition, cleanup } = useAnalysisActions();

  // Initialize analysis engine for sidebar toggle
  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  // Update engine position
  useEffect(() => {
    if (!currentFEN) return;
    const fenTurn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, fenTurn);
  }, [currentFEN, setPosition]);

  useEffect(() => {
    if (!currentFEN) return;
    const caps = getCapturedPiecesFromFEN(currentFEN);
    setCaptured(caps);
    setMaterialAdvantage(getMaterialAdvantage(caps));
  }, [currentFEN]);

  // Play game-end sound when game ends
  useEffect(() => {
    if (gameOver && gameStarted && soundEnabled) {
      playSound('game-end');
    }
  }, [gameOver, gameStarted, soundEnabled]);

  function handlePieceDrop({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) {
    if (!targetSquare) return false;

    // Try the move
    let move = makeMove(sourceSquare, targetSquare);

    // If failed, try promotion (auto-queen)
    if (!move) {
      move = makeMove(sourceSquare, targetSquare, 'q');
    }

    // If move succeeded, play sound
    if (move) {
      if (soundEnabled) {
        const isCapture = move.captured !== undefined;
        const isCheck = game.isCheck();
        const isCastle = move.san === 'O-O' || move.san === 'O-O-O';
        const isPromotion = move.promotion !== undefined;
        const soundType = getSoundType(
          isCapture,
          isCheck,
          isCastle,
          isPromotion,
          true
        );
        playSound(soundType);
      }
      return true;
    }

    // Play illegal sound if move failed
    if (soundEnabled) {
      playSound('illegal');
    }
    return false;
  }

  const isActive = gameStarted && !gameOver;
  const orientation = boardFlipped ? ('black' as const) : ('white' as const);

  // Timer logic
  const hasTimer = timeControl.mode === 'timed';
  const topTime = boardFlipped ? whiteTime : blackTime;
  const bottomTime = boardFlipped ? blackTime : whiteTime;
  const topColor = boardFlipped ? 'white' : 'black';
  const bottomColor = boardFlipped ? 'black' : 'white';
  const topTimerActive = activeTimer === topColor && !gameOver;
  const bottomTimerActive = activeTimer === bottomColor && !gameOver;

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        {/* Top Player */}
        <div className='flex w-full items-center justify-between py-2'>
          <div className='flex items-center gap-3'>
            <PlayerInfo name={boardFlipped ? 'White' : 'Black'} />
            {hasTimer && (
              <PlayerClock
                time={topTime}
                isActive={topTimerActive}
                isPlayer={true}
              />
            )}
          </div>
          <CapturedPiecesDisplay
            pieces={boardFlipped ? captured.black : captured.white}
            pieceColor={boardFlipped ? 'white' : 'black'}
            advantage={
              boardFlipped
                ? materialAdvantage > 0
                  ? materialAdvantage
                  : undefined
                : materialAdvantage < 0
                  ? Math.abs(materialAdvantage)
                  : undefined
            }
          />
        </div>

        {/* Board */}
        <BoardContainer>
          {board3dEnabled ? (
            <Board3D
              position={currentFEN}
              onPieceDrop={handlePieceDrop}
              boardOrientation={orientation}
              canDrag={isActive}
              squareStyles={highlightedSquares}
            />
          ) : (
            <Board
              position={currentFEN}
              onPieceDrop={handlePieceDrop}
              boardOrientation={orientation}
              darkSquareStyle={theme.darkSquareStyle}
              lightSquareStyle={theme.lightSquareStyle}
              canDrag={isActive}
              animationDuration={200}
              squareStyles={highlightedSquares}
            />
          )}
        </BoardContainer>

        {/* Bottom Player */}
        <div className='flex w-full items-center justify-between py-2'>
          <div className='flex items-center gap-3'>
            <PlayerInfo name={boardFlipped ? 'Black' : 'White'} />
            {hasTimer && (
              <PlayerClock
                time={bottomTime}
                isActive={bottomTimerActive}
                isPlayer={true}
              />
            )}
          </div>
          <CapturedPiecesDisplay
            pieces={boardFlipped ? captured.white : captured.black}
            pieceColor={boardFlipped ? 'black' : 'white'}
            advantage={
              boardFlipped
                ? materialAdvantage < 0
                  ? Math.abs(materialAdvantage)
                  : undefined
                : materialAdvantage > 0
                  ? materialAdvantage
                  : undefined
            }
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(560px,calc(100dvh-200px))] lg:w-80 lg:overflow-hidden xl:h-[min(640px,calc(100dvh-200px))] 2xl:h-[min(720px,calc(100dvh-200px))]'>
        <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
          <DiceChessSidebar mode='play' />
        </div>
      </div>
    </div>
  );
}
