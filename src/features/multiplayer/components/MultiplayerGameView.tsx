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
import { Icons } from '@/components/Icons';
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

/** Signal-strength icon based on connection latency */
function SignalIndicator({
  wsStatus,
  latencyMs
}: {
  wsStatus: string;
  latencyMs: number | null;
}) {
  if (wsStatus === 'error' || wsStatus === 'idle' || latencyMs === null)
    return null;

  if (latencyMs <= 80)
    return (
      <Icons.signal
        className='h-4 w-4 text-green-500'
        aria-label={`${latencyMs}ms`}
      />
    );
  if (latencyMs <= 150)
    return (
      <Icons.signalHigh
        className='h-4 w-4 text-green-400'
        aria-label={`${latencyMs}ms`}
      />
    );
  if (latencyMs <= 300)
    return (
      <Icons.signalMedium
        className='h-4 w-4 text-yellow-500'
        aria-label={`${latencyMs}ms`}
      />
    );
  return (
    <Icons.signalLow
      className='h-4 w-4 text-red-500'
      aria-label={`${latencyMs}ms`}
    />
  );
}

const ABANDON_TIMEOUT_MS = 60_000;

/** Counts down from 60 to 0 starting from the given timestamp. */
function AbandonCountdown({ disconnectedAt }: { disconnectedAt: number }) {
  const [secsLeft, setSecsLeft] = useState(() =>
    Math.max(
      0,
      Math.ceil((ABANDON_TIMEOUT_MS - (Date.now() - disconnectedAt)) / 1000)
    )
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecsLeft(
        Math.max(
          0,
          Math.ceil((ABANDON_TIMEOUT_MS - (Date.now() - disconnectedAt)) / 1000)
        )
      );
    }, 500);
    return () => clearInterval(id);
  }, [disconnectedAt]);

  return (
    <span className='animate-pulse text-xs text-yellow-500'>
      Reconnecting… Auto-abort in {secsLeft}s
    </span>
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
  // Start the dialog closed if we have a session to rejoin — avoids flashing
  // the matchmaking UI. If rejoin fails the dialog will be opened then.
  const [matchmakingOpen, setMatchmakingOpen] = useState(
    () => loadSession() === null
  );
  // Moves to replay after reconnection — set after game starts, cleared by board
  const [pendingMoves, setPendingMoves] = useState<string[] | null>(null);
  // Track challenge ID locally so we can clear it once it's been consumed,
  // preventing stale ?challenge= URL params from being re-used after game ends.
  const [activeChallengeId, setActiveChallengeId] = useState(challengeId);

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
  const { initializeEngine, setPosition, cleanup, endAnalysis } =
    useAnalysisActions();
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

  // Pre-connect the WebSocket as soon as the dialog is visible so any subsequent
  // action (Create Game Link, Find Game) fires instantly with no connection delay.
  useEffect(() => {
    if (matchmakingOpen) {
      ws.preConnect();
    }
  }, [matchmakingOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-rejoin session on mount (page refresh case)
  // Active session takes priority over challenge link — the challenge is consumed
  // once the game starts, so reloading mid-game must use the rejoin token.
  useEffect(() => {
    const session = loadSession();
    if (session && session.variant === variant) {
      ws.rejoin(session.roomId, session.rejoinToken);
      return;
    }
    if (challengeId) {
      ws.joinChallenge(challengeId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fresh match: show "Opponent found!" animation then start
  useEffect(() => {
    if (ws.status === 'matched' && ws.myColor) {
      // Put the room ID in the URL so the address bar reflects the active game.
      // Also clear any stale ?challenge= param at the same time.
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('challenge');
        if (ws.roomId) url.searchParams.set('room', ws.roomId);
        window.history.replaceState({}, '', url.toString());
      }
      setActiveChallengeId(undefined);
      const moves = ws.movesToReplay;
      const tc = ws.timeControl ?? {
        mode: 'unlimited' as const,
        minutes: 0,
        increment: 0
      };
      const t = setTimeout(() => {
        endAnalysis();
        startMultiplayerGame(ws.myColor!, tc, ws.startingFen || undefined);
        setMatchmakingOpen(false);
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

  // Rejoin: restore immediately with no dialog, no animation delay
  useEffect(() => {
    if (ws.status === 'rejoined' && ws.myColor) {
      if (typeof window !== 'undefined' && ws.roomId) {
        const url = new URL(window.location.href);
        url.searchParams.set('room', ws.roomId);
        window.history.replaceState({}, '', url.toString());
      }
      const moves = ws.movesToReplay;
      endAnalysis();
      startMultiplayerGame(
        ws.myColor,
        ws.timeControl ?? { mode: 'unlimited', minutes: 0, increment: 0 },
        ws.startingFen || undefined
      );
      setMatchmakingOpen(false);
      if (moves && moves.length > 0) {
        setPendingMoves(moves);
        ws.clearMovesToReplay();
      }
    }
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    startMultiplayerGame
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Open the matchmaking dialog only when there is no active session to rejoin.
  // Checking loadSession() here prevents the dialog from flashing open on mount
  // while a rejoin is still in progress (status is 'idle' before the WS responds).
  useEffect(() => {
    if (ws.status === 'idle' && !matchmakingOpen && loadSession() === null) {
      setMatchmakingOpen(true);
    }
  }, [ws.status]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setActiveChallengeId(undefined);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.replaceState({}, '', url.toString());
    }
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
              {showIndicator &&
              topColor !== playAs &&
              ws.opponentDisconnected ? (
                <AbandonCountdown
                  disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
                />
              ) : (
                showIndicator && (
                  <SignalIndicator
                    wsStatus={ws.status}
                    latencyMs={
                      topColor !== playAs ? ws.opponentLatencyMs : ws.latencyMs
                    }
                  />
                )
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
              {showIndicator &&
              bottomColor !== playAs &&
              ws.opponentDisconnected ? (
                <AbandonCountdown
                  disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
                />
              ) : (
                showIndicator && (
                  <SignalIndicator
                    wsStatus={ws.status}
                    latencyMs={
                      bottomColor !== playAs
                        ? ws.opponentLatencyMs
                        : ws.latencyMs
                    }
                  />
                )
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
              rematchOffered={ws.rematchOffered}
              rematchDeclined={ws.rematchDeclined}
              onAbort={ws.abort}
              onResign={ws.resign}
              onOfferDraw={ws.offerDraw}
              onAcceptDraw={ws.acceptDraw}
              onDeclineDraw={ws.declineDraw}
              onOfferRematch={ws.offerRematch}
              onAcceptRematch={ws.acceptRematch}
              onDeclineRematch={ws.declineRematch}
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
        initialChallengeId={activeChallengeId}
        onFindGame={handleFindGame}
        onCancel={handleCancelSearch}
        onCreateChallenge={handleCreateChallenge}
        onCancelChallenge={ws.cancelChallenge}
      />
    </>
  );
}
