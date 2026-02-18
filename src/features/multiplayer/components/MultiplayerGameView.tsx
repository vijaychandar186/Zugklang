'use client';

import { useEffect, useState, useCallback } from 'react';
import { MultiplayerChessBoard } from './MultiplayerChessBoard';
import { MultiplayerSidebar } from './MultiplayerSidebar';
import { MatchmakingDialog } from './MatchmakingDialog';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { useGameView } from '@/features/chess/hooks/useGameView';
import { useGameTimer } from '@/features/chess/hooks/useGameTimer';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { useMultiplayerWS, loadSession } from '../hooks/useMultiplayerWS';
import type { ChessVariant } from '@/features/chess/config/variants';
import type { TimeControl } from '@/features/game/types/rules';
import type { ChallengeColor } from '../types';

const VARIANT_LABELS: Record<string, string> = {
  standard: 'Standard Chess',
  fischerRandom: 'Fischer Random',
  atomic: 'Atomic Chess',
  racingKings: 'Racing Kings',
  horde: 'Horde Chess',
  threeCheck: 'Three-Check',
  antichess: 'Antichess',
  kingOfTheHill: 'King of the Hill',
  crazyhouse: 'Crazyhouse',
  checkersChess: 'Chess with Checkers'
};

/** Small colored dot showing connection status */
function ConnectionDot({
  isOpponent,
  isDisconnected,
  wsStatus
}: {
  isOpponent: boolean;
  isDisconnected: boolean;
  wsStatus: string;
}) {
  let color = 'bg-green-500';
  let title = 'Connected';

  if (isOpponent) {
    if (isDisconnected) {
      color = 'bg-yellow-500 animate-pulse';
      title = 'Reconnecting…';
    }
  } else {
    if (wsStatus === 'error') {
      color = 'bg-red-500';
      title = 'Disconnected';
    } else if (wsStatus === 'connecting') {
      color = 'bg-yellow-500 animate-pulse';
      title = 'Connecting…';
    }
  }

  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${color}`}
      title={title}
    />
  );
}

interface MultiplayerGameViewProps {
  variant?: ChessVariant;
  initialBoard3dEnabled?: boolean;
  challengeId?: string;
}

export function MultiplayerGameView({
  variant = 'standard',
  initialBoard3dEnabled,
  challengeId
}: MultiplayerGameViewProps) {
  const [matchmakingOpen, setMatchmakingOpen] = useState(true);
  // Moves to replay after reconnection — set after game starts, cleared by board
  const [pendingMoves, setPendingMoves] = useState<string[] | null>(null);

  const {
    gameId,
    topColor,
    bottomColor,
    topCaptured,
    topAdvantage,
    bottomCaptured,
    bottomAdvantage,
    hasTimer,
    topTime,
    bottomTime,
    topTimerActive,
    bottomTimerActive
  } = useGameView();

  const setVariant = useChessStore((s) => s.setVariant);
  const setGameType = useChessStore((s) => s.setGameType);
  const startMultiplayerGame = useChessStore((s) => s.startMultiplayerGame);
  const setGameResult = useChessStore((s) => s.setGameResult);
  const setGameOver = useChessStore((s) => s.setGameOver);
  const playAs = useChessStore((s) => s.playAs);
  const gameStarted = useChessStore((s) => s.gameStarted);
  const gameOver = useChessStore((s) => s.gameOver);

  const { isAnalysisOn } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup } = useAnalysisActions();
  const currentFEN = useChessStore((s) => s.currentFEN);

  const ws = useMultiplayerWS();

  useEffect(() => {
    setVariant(variant);
    setGameType('multiplayer');
  }, [variant, setVariant, setGameType]);

  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  useEffect(() => {
    if (!currentFEN) return;
    const fenTurn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, fenTurn);
  }, [currentFEN, setPosition]);

  useGameTimer();

  // Auto-rejoin session on mount (page refresh case)
  useEffect(() => {
    if (challengeId) {
      ws.joinChallenge(challengeId);
      return;
    }
    const session = loadSession();
    if (session && session.variant === variant) {
      ws.rejoin(session.roomId, session.playerId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When matched/rejoined, start the chess game
  useEffect(() => {
    if (ws.status === 'matched' && ws.myColor) {
      const moves = ws.movesToReplay;
      const t = setTimeout(() => {
        startMultiplayerGame(
          ws.myColor!,
          { mode: 'unlimited', minutes: 0, increment: 0 },
          ws.startingFen || undefined
        );
        setMatchmakingOpen(false);
        // Schedule move replay after game starts
        if (moves && moves.length > 0) {
          setPendingMoves(moves);
          ws.clearMovesToReplay();
        }
      }, 800);
      return () => clearTimeout(t);
    }
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    startMultiplayerGame
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle server-initiated game over
  useEffect(() => {
    ws.setOnServerGameOver((result, _reason) => {
      setGameResult(result);
      setGameOver(true);
    });
    return () => ws.setOnServerGameOver(null);
  }, [ws.setOnServerGameOver, setGameResult, setGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFindGame = useCallback(
    (timeControl: TimeControl) => {
      ws.joinQueue(variant, timeControl);
    },
    [ws.joinQueue, variant] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCreateChallenge = useCallback(
    (timeControl: TimeControl, color: ChallengeColor) => {
      ws.createChallenge(variant, timeControl, color);
    },
    [ws.createChallenge, variant] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCancelSearch = useCallback(() => {
    ws.leaveQueue();
  }, [ws.leaveQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFindNewGame = useCallback(() => {
    ws.disconnect();
    setPendingMoves(null);
    setMatchmakingOpen(true);
  }, [ws.disconnect]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMovesReplayed = useCallback(() => {
    setPendingMoves(null);
  }, []);

  const getPlayerName = (color: 'white' | 'black') =>
    color === playAs ? 'You' : 'Opponent';

  const showIndicator = gameStarted && !gameOver;

  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        <div className='flex flex-col items-center gap-2'>
          {/* Top player */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
              <PlayerInfo name={getPlayerName(topColor)} />
              {showIndicator && (
                <ConnectionDot
                  isOpponent={topColor !== playAs}
                  isDisconnected={
                    topColor !== playAs && ws.opponentDisconnected
                  }
                  wsStatus={ws.status}
                />
              )}
              {hasTimer && (
                <PlayerClock
                  time={topTime}
                  isActive={topTimerActive}
                  isPlayer={topColor === playAs}
                />
              )}
            </div>
            <CapturedPiecesDisplay
              pieces={topCaptured}
              pieceColor={bottomColor}
              advantage={topAdvantage}
            />
          </div>

          <BoardContainer>
            <MultiplayerChessBoard
              key={gameId}
              serverOrientation={ws.myColor || 'white'}
              initialBoard3dEnabled={initialBoard3dEnabled}
              onPlayerMove={ws.sendMove}
              setOnOpponentMove={ws.setOnOpponentMove}
              movesToReplay={pendingMoves}
              onMovesReplayed={handleMovesReplayed}
            />
          </BoardContainer>

          {/* Bottom player */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
              <PlayerInfo name={getPlayerName(bottomColor)} />
              {showIndicator && (
                <ConnectionDot
                  isOpponent={bottomColor !== playAs}
                  isDisconnected={
                    bottomColor !== playAs && ws.opponentDisconnected
                  }
                  wsStatus={ws.status}
                />
              )}
              {hasTimer && (
                <PlayerClock
                  time={bottomTime}
                  isActive={bottomTimerActive}
                  isPlayer={bottomColor === playAs}
                />
              )}
            </div>
            <CapturedPiecesDisplay
              pieces={bottomCaptured}
              pieceColor={topColor}
              advantage={bottomAdvantage}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(560px,calc(100dvh-200px))] lg:w-80 lg:overflow-hidden xl:h-[min(640px,calc(100dvh-200px))] 2xl:h-[min(720px,calc(100dvh-200px))]'>
          {isAnalysisOn && (
            <div className='bg-card shrink-0 rounded-lg border'>
              <AnalysisLines />
            </div>
          )}
          <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
            <MultiplayerSidebar
              status={ws.status}
              drawOffered={ws.drawOffered}
              opponentDisconnected={ws.opponentDisconnected}
              onAbort={ws.abort}
              onResign={ws.resign}
              onOfferDraw={ws.offerDraw}
              onAcceptDraw={ws.acceptDraw}
              onDeclineDraw={ws.declineDraw}
              onFindNewGame={handleFindNewGame}
            />
          </div>
        </div>
      </div>

      <MatchmakingDialog
        open={matchmakingOpen}
        onOpenChange={(v) => {
          if (!v && (ws.status === 'idle' || ws.status === 'error')) {
            setMatchmakingOpen(false);
          }
        }}
        status={ws.status}
        variantLabel={VARIANT_LABELS[variant] || variant}
        errorMessage={ws.errorMessage}
        pendingChallengeId={ws.pendingChallengeId}
        initialChallengeId={challengeId}
        onFindGame={handleFindGame}
        onCancel={handleCancelSearch}
        onCreateChallenge={handleCreateChallenge}
        onCancelChallenge={ws.cancelChallenge}
      />
    </>
  );
}
