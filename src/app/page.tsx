'use client';

import { useEffect } from 'react';
import { ChessBoard } from '@/components/chess-board';
import { GameSidebar } from '@/components/game-sidebar';
import { useBoardStore } from '@/lib/store';
import { User, Bot } from 'lucide-react';

export default function Home() {
  const gameId = useBoardStore((state) => state.gameId);
  const gameStarted = useBoardStore((state) => state.gameStarted);
  const stockfishLevel = useBoardStore((state) => state.stockfishLevel);
  const startGame = useBoardStore((state) => state.startGame);

  const difficultyLabel =
    stockfishLevel === 2 ? 'Easy' : stockfishLevel === 6 ? 'Medium' : 'Hard';

  // Auto-start game on first load
  useEffect(() => {
    if (!gameStarted) {
      startGame(2, 'white');
    }
  }, [gameStarted, startGame]);

  return (
    <div className='flex min-h-screen flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:p-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center gap-2 py-2'>
          <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
            <Bot className='h-5 w-5' />
          </div>
          <div>
            <p className='font-semibold'>Stockfish</p>
            <p className='text-muted-foreground text-xs'>{difficultyLabel}</p>
          </div>
        </div>
        <ChessBoard key={gameId} />
        <div className='flex w-full items-center gap-2 py-2'>
          <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
            <User className='h-5 w-5' />
          </div>
          <div>
            <p className='font-semibold'>Player</p>
          </div>
        </div>
      </div>
      <div className='h-[280px] w-full sm:h-[400px] lg:h-[560px] lg:w-80'>
        <GameSidebar />
      </div>
    </div>
  );
}
