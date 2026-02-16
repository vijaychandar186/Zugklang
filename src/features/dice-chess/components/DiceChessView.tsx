'use client';

import { useEffect, useState } from 'react';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { DiceChessSidebar } from './DiceChessSidebar';
import { useDiceChessStore } from '../stores/useDiceChessStore';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage
} from '@/features/chess/utils/fen-logic';
import type { CapturedPieces } from '@/features/chess/types/core';

export function DiceChessView() {
  const { currentFEN, turn, gameStarted, gameOver, hasHydrated, makeMove } =
    useDiceChessStore();

  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const theme = useBoardTheme();

  const [captured, setCaptured] = useState<CapturedPieces>({
    white: [],
    black: []
  });
  const [materialAdvantage, setMaterialAdvantage] = useState(0);

  useEffect(() => {
    if (!currentFEN) return;
    const caps = getCapturedPiecesFromFEN(currentFEN);
    setCaptured(caps);
    setMaterialAdvantage(getMaterialAdvantage(caps));
  }, [currentFEN]);

  function handlePieceDrop({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) {
    if (!targetSquare) return false;
    if (makeMove(sourceSquare, targetSquare)) return true;
    // Try promotion (auto-queen)
    return makeMove(sourceSquare, targetSquare, 'q');
  }

  if (!hasHydrated) return null;

  const isActive = gameStarted && !gameOver;
  const orientation = boardFlipped ? ('black' as const) : ('white' as const);

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        {/* Top Player */}
        <div className='flex w-full items-center justify-between py-2'>
          <PlayerInfo name={boardFlipped ? 'White' : 'Black'} />
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
            />
          )}
        </BoardContainer>

        {/* Bottom Player */}
        <div className='flex w-full items-center justify-between py-2'>
          <PlayerInfo name={boardFlipped ? 'Black' : 'White'} />
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

        {!gameStarted && (
          <div className='bg-background/50 pointer-events-none absolute inset-0 flex items-center justify-center'>
            <div className='bg-card rounded p-4 shadow'>
              Click New Game to Start
            </div>
          </div>
        )}
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
