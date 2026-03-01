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
import { GameShell } from '@/features/chess/components/GameShell';
import { useGameView } from '@/features/chess/hooks/useGameView';
import { useGameSave } from '@/features/chess/hooks/useGameSave';
import { useGameTimer } from '@/features/chess/hooks/useGameTimer';
import { useAnalysisSync } from '@/features/chess/hooks/useAnalysisSync';
import {
  useChessStore,
  ChessMode
} from '@/features/chess/stores/useChessStore';
import { useAnalysisState } from '@/features/chess/stores/useAnalysisStore';
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
  useAnalysisSync(currentFEN);
  const makePlayerLeft = (color: 'white' | 'black', isStockfish: boolean) =>
    isPlayMode ? (
      <PlayerInfo
        name={getPlayerName(color, isStockfish)}
        subtitle={isStockfish ? `Level ${stockfishLevel}` : undefined}
        isStockfish={isStockfish}
        image={getPlayerImage(color, isStockfish)}
        rating={getPlayerRating(color, isStockfish)}
      />
    ) : undefined;
  const makePlayerRight = (
    captured: typeof topCaptured,
    pieceColor: 'white' | 'black',
    advantage: number | undefined,
    time: number | null,
    timerActive: boolean,
    isStockfish: boolean
  ) => (
    <>
      <CapturedPiecesDisplay
        pieces={captured}
        pieceColor={pieceColor}
        advantage={advantage}
      />
      {isPlayMode && hasTimer && (
        <PlayerClock
          time={time}
          isActive={timerActive}
          isPlayer={!isStockfish}
        />
      )}
    </>
  );
  return (
    <GameShell
      topLeft={makePlayerLeft(topColor, isTopStockfishForDisplay)}
      topRight={makePlayerRight(
        topCaptured,
        bottomColor,
        topAdvantage,
        topTime,
        topTimerActive,
        isTopStockfishForDisplay
      )}
      bottomLeft={makePlayerLeft(bottomColor, isBottomStockfishForDisplay)}
      bottomRight={makePlayerRight(
        bottomCaptured,
        topColor,
        bottomAdvantage,
        bottomTime,
        bottomTimerActive,
        isBottomStockfishForDisplay
      )}
      boardArea={
        <BoardContainer>
          <ChessBoard
            key={gameId}
            serverOrientation={serverOrientation}
            initialBoard3dEnabled={initialBoard3dEnabled}
          />
        </BoardContainer>
      }
      sidebar={<ChessSidebar mode={mode} />}
      analysisBar={isAnalysisOn ? <AnalysisLines /> : undefined}
    />
  );
}
