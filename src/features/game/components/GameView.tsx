'use client';

import { useEffect } from 'react';
import { ChessBoard } from '@/features/chess/components/ChessBoard';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { ChessSidebar } from '@/features/chess/components/ChessSidebar';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { useGameView } from '@/features/chess/hooks/useGameView';
import { useGameTimer } from '@/features/chess/hooks/useGameTimer';
import {
  useChessStore,
  ChessMode
} from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';

interface GameViewProps {
  serverOrientation?: 'white' | 'black';
  mode?: ChessMode;
}

export function GameView({ serverOrientation, mode = 'play' }: GameViewProps) {
  const {
    gameId,
    stockfishLevel,
    topColor,
    bottomColor,
    topCaptured,
    topAdvantage,
    bottomCaptured,
    bottomAdvantage,
    isTopStockfish,
    isBottomStockfish,
    hasTimer,
    topTime,
    bottomTime,
    topTimerActive,
    bottomTimerActive,
    currentFEN
  } = useGameView();

  const setMode = useChessStore((s) => s.setMode);
  const { isAnalysisOn } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup } = useAnalysisActions();

  const isPlayMode = mode === 'play';

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  useGameTimer();

  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  useEffect(() => {
    if (!currentFEN) return;
    const fenTurn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, fenTurn);
  }, [currentFEN, setPosition]);

  return (
    <div className='flex min-h-screen flex-col gap-4 px-4 py-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center justify-between py-2'>
          {isPlayMode && (
            <div className='flex items-center gap-3'>
              <PlayerInfo
                name={isTopStockfish ? 'Stockfish' : 'Player'}
                subtitle={
                  isTopStockfish ? `Level ${stockfishLevel}` : undefined
                }
                isStockfish={isTopStockfish}
              />
              {hasTimer && (
                <PlayerClock
                  time={topTime}
                  isActive={topTimerActive}
                  isPlayer={!isTopStockfish}
                />
              )}
            </div>
          )}
          <CapturedPiecesDisplay
            pieces={topCaptured}
            pieceColor={bottomColor}
            advantage={topAdvantage}
          />
        </div>
        <BoardContainer>
          <ChessBoard key={gameId} serverOrientation={serverOrientation} />
        </BoardContainer>
        <div className='flex w-full items-center justify-between py-2'>
          {isPlayMode && (
            <div className='flex items-center gap-3'>
              <PlayerInfo
                name={isBottomStockfish ? 'Stockfish' : 'Player'}
                subtitle={
                  isBottomStockfish ? `Level ${stockfishLevel}` : undefined
                }
                isStockfish={isBottomStockfish}
              />
              {hasTimer && (
                <PlayerClock
                  time={bottomTime}
                  isActive={bottomTimerActive}
                  isPlayer={!isBottomStockfish}
                />
              )}
            </div>
          )}
          <CapturedPiecesDisplay
            pieces={bottomCaptured}
            pieceColor={topColor}
            advantage={bottomAdvantage}
          />
        </div>
      </div>
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {isAnalysisOn && (
          <div className='bg-card shrink-0 rounded-lg border'>
            <AnalysisLines />
          </div>
        )}
        <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
          <ChessSidebar mode={mode} />
        </div>
      </div>
    </div>
  );
}
