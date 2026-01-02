'use client';

import { ChessBoard } from '@/components/board/ChessBoard';
import { CapturedPiecesDisplay } from '@/components/board/CapturedPieces';
import { GameSidebar } from '@/components/sidebar/GameSidebar';
import { PlayerInfo } from './PlayerInfo';
import { useGameView } from '@/hooks/useGameView';

export function GameView() {
  const {
    gameId,
    stockfishLevel,
    topColor,
    bottomColor,
    topCaptured,
    topAdvantage,
    bottomCaptured,
    bottomAdvantage
  } = useGameView();

  return (
    <div className='flex h-screen flex-col gap-4 overflow-hidden px-4 py-4 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center justify-between py-2'>
          <PlayerInfo
            name='Stockfish'
            subtitle={`Level ${stockfishLevel}`}
            isStockfish
          />
          <CapturedPiecesDisplay
            pieces={topCaptured}
            pieceColor={bottomColor}
            advantage={topAdvantage}
          />
        </div>
        <ChessBoard key={gameId} />
        <div className='flex w-full items-center justify-between py-2'>
          <PlayerInfo name='Player' />
          <CapturedPiecesDisplay
            pieces={bottomCaptured}
            pieceColor={topColor}
            advantage={bottomAdvantage}
          />
        </div>
      </div>
      <div className='min-h-[250px] w-full flex-1 overflow-hidden sm:h-[400px] sm:flex-none lg:h-[560px] lg:w-80'>
        <GameSidebar />
      </div>
    </div>
  );
}
