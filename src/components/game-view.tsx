'use client';

import { useEffect, useMemo } from 'react';
import { ChessBoard } from '@/components/chess-board';
import { GameSidebar } from '@/components/game-sidebar';
import { CapturedPiecesDisplay } from '@/components/captured-pieces';
import { useBoardStore } from '@/lib/store';
import { getCapturedPiecesFromFEN, getMaterialAdvantage } from '@/utils/types';
import { Icons } from '@/components/icons';

export function GameView() {
  const gameId = useBoardStore((state) => state.gameId);
  const gameStarted = useBoardStore((state) => state.gameStarted);
  const stockfishLevel = useBoardStore((state) => state.stockfishLevel);
  const playAs = useBoardStore((state) => state.playAs);
  const currentFEN = useBoardStore((state) => state.currentFEN);
  const startGame = useBoardStore((state) => state.startGame);

  // Auto-start game on first load
  useEffect(() => {
    if (!gameStarted) {
      startGame(10, 'white');
    }
  }, [gameStarted, startGame]);

  const { captured, materialAdvantage } = useMemo(() => {
    const captured = getCapturedPiecesFromFEN(currentFEN);
    const materialAdvantage = getMaterialAdvantage(captured);
    return { captured, materialAdvantage };
  }, [currentFEN]);

  // Determine which color is at top vs bottom based on board orientation
  const topColor = playAs === 'white' ? 'black' : 'white';
  const bottomColor = playAs;

  // Top player's captured pieces and advantage
  const topCaptured = topColor === 'white' ? captured.white : captured.black;
  const topAdvantage =
    topColor === 'white' ? materialAdvantage : -materialAdvantage;

  // Bottom player's captured pieces and advantage
  const bottomCaptured =
    bottomColor === 'white' ? captured.white : captured.black;
  const bottomAdvantage =
    bottomColor === 'white' ? materialAdvantage : -materialAdvantage;

  return (
    <div className='flex h-screen flex-col gap-4 overflow-hidden px-4 py-4 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center justify-between py-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
              <Icons.stockfish className='h-5 w-5' />
            </div>
            <div>
              <p className='font-semibold'>Stockfish</p>
              <p className='text-muted-foreground text-xs'>
                Level {stockfishLevel}
              </p>
            </div>
          </div>
          <CapturedPiecesDisplay
            pieces={topCaptured}
            pieceColor={bottomColor}
            advantage={topAdvantage}
          />
        </div>
        <ChessBoard key={gameId} />
        <div className='flex w-full items-center justify-between py-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
              <Icons.player className='h-5 w-5' />
            </div>
            <div>
              <p className='font-semibold'>Player</p>
            </div>
          </div>
          <CapturedPiecesDisplay
            pieces={bottomCaptured}
            pieceColor={topColor}
            advantage={bottomAdvantage}
          />
        </div>
      </div>
      <div className='h-[300px] w-full sm:h-[400px] sm:flex-none lg:h-[560px] lg:w-80'>
        <GameSidebar />
      </div>
    </div>
  );
}
