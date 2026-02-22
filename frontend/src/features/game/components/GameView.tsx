'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ChessBoard } from '@/features/chess/components/ChessBoard';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { ChessSidebar } from '@/features/chess/components/ChessSidebar';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { useGameView } from '@/features/chess/hooks/useGameView';
import { useGameSave } from '@/features/chess/hooks/useGameSave';
import { useGameTimer } from '@/features/chess/hooks/useGameTimer';
import {
  useChessStore,
  ChessMode
} from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { GameType } from '@/features/chess/stores/useChessStore';
import { ChessVariant } from '@/features/chess/utils/chess960';
import { getEngineName } from '@/features/chess/config/variants';
interface UserProfile {
  name: string | null;
  image: string | null;
  rating: number | null;
}
interface GameViewProps {
  serverOrientation?: 'white' | 'black';
  mode?: ChessMode;
  gameType?: GameType;
  initialBoard3dEnabled?: boolean;
  variant?: ChessVariant;
}
export function GameView({
  serverOrientation,
  mode = 'play',
  gameType: initialGameType = 'computer',
  initialBoard3dEnabled,
  variant = 'standard'
}: GameViewProps) {
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
  const storeVariant = useChessStore((s) => s.variant);
  const playAs = useChessStore((s) => s.playAs);
  const { data: session } = useSession();
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const isLocalRoute = initialGameType === 'local';

  const isTopStockfishForDisplay = isLocalRoute ? false : isTopStockfish;
  const isBottomStockfishForDisplay = isLocalRoute ? false : isBottomStockfish;

  useEffect(() => {
    if (!session?.user?.id || isLocalRoute) return;
    fetch(`/api/user/rating?variant=${storeVariant}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setMyProfile(data))
      .catch(() => {});
  }, [session?.user?.id, storeVariant, isLocalRoute]);
  const getPlayerName = (color: 'white' | 'black', isStockfish: boolean) => {
    if (isLocalRoute) {
      if (color === playAs) {
        return session?.user?.name ?? (color === 'white' ? 'White' : 'Black');
      }
      return color === 'white' ? 'White' : 'Black';
    }
    if (isStockfish) {
      return getEngineName(storeVariant);
    }
    return myProfile?.name ?? session?.user?.name ?? 'Player';
  };
  const getPlayerImage = (color: 'white' | 'black', isStockfish: boolean) => {
    if (isLocalRoute) {
      return color === playAs ? (session?.user?.image ?? null) : null;
    }
    if (isStockfish) return null;
    return color === playAs
      ? (myProfile?.image ?? session?.user?.image ?? null)
      : null;
  };
  const getPlayerRating = (color: 'white' | 'black', isStockfish: boolean) => {
    if (isLocalRoute || isStockfish) return null;
    return color === playAs ? (myProfile?.rating ?? null) : null;
  };
  const setMode = useChessStore((s) => s.setMode);
  const { isAnalysisOn } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup } = useAnalysisActions();
  const isPlayMode = mode === 'play';
  const setGameType = useChessStore((s) => s.setGameType);
  const setVariant = useChessStore((s) => s.setVariant);
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
  useEffect(() => {
    setGameType(initialGameType);
    setVariant(variant);
  }, [initialGameType, setGameType, variant, setVariant]);
  useGameTimer();
  useGameSave(initialGameType);
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
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center justify-between py-2'>
          {isPlayMode && (
            <div className='flex items-center gap-3'>
              <PlayerInfo
                name={getPlayerName(topColor, isTopStockfishForDisplay)}
                subtitle={
                  isTopStockfishForDisplay
                    ? `Level ${stockfishLevel}`
                    : undefined
                }
                isStockfish={isTopStockfishForDisplay}
                image={getPlayerImage(topColor, isTopStockfishForDisplay)}
                rating={getPlayerRating(topColor, isTopStockfishForDisplay)}
              />
            </div>
          )}
          <div className='flex items-center gap-2'>
            <CapturedPiecesDisplay
              pieces={topCaptured}
              pieceColor={bottomColor}
              advantage={topAdvantage}
            />
            {isPlayMode && hasTimer && (
              <PlayerClock
                time={topTime}
                isActive={topTimerActive}
                isPlayer={!isTopStockfishForDisplay}
              />
            )}
          </div>
        </div>
        <BoardContainer>
          <ChessBoard
            key={gameId}
            serverOrientation={serverOrientation}
            initialBoard3dEnabled={initialBoard3dEnabled}
          />
        </BoardContainer>
        <div className='flex w-full items-center justify-between py-2'>
          {isPlayMode && (
            <div className='flex items-center gap-3'>
              <PlayerInfo
                name={getPlayerName(bottomColor, isBottomStockfishForDisplay)}
                subtitle={
                  isBottomStockfishForDisplay
                    ? `Level ${stockfishLevel}`
                    : undefined
                }
                isStockfish={isBottomStockfishForDisplay}
                image={getPlayerImage(bottomColor, isBottomStockfishForDisplay)}
                rating={getPlayerRating(
                  bottomColor,
                  isBottomStockfishForDisplay
                )}
              />
            </div>
          )}
          <div className='flex items-center gap-2'>
            <CapturedPiecesDisplay
              pieces={bottomCaptured}
              pieceColor={topColor}
              advantage={bottomAdvantage}
            />
            {isPlayMode && hasTimer && (
              <PlayerClock
                time={bottomTime}
                isActive={bottomTimerActive}
                isPlayer={!isBottomStockfishForDisplay}
              />
            )}
          </div>
        </div>
      </div>
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(70vw,calc(100dvh-180px),820px)] lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)]'>
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
