'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
import { useSession } from 'next-auth/react';
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

const ABANDON_TIMEOUT_MS = 30_000;
const ABORT_TIMEOUT_MS = 60_000;

/** Counts down from 30 to 0 starting from the given timestamp. */
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
      Reconnecting… Auto-abandon in {secsLeft}s
    </span>
  );
}

/** Counts down from 60 to 0 for the first-move auto-abort window. */
function AbortCountdown({ startedAt }: { startedAt: number }) {
  const [secsLeft, setSecsLeft] = useState(() =>
    Math.max(0, Math.ceil((ABORT_TIMEOUT_MS - (Date.now() - startedAt)) / 1000))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecsLeft(
        Math.max(
          0,
          Math.ceil((ABORT_TIMEOUT_MS - (Date.now() - startedAt)) / 1000)
        )
      );
    }, 500);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <span className='animate-pulse text-xs text-yellow-500'>
      Auto-abort in {secsLeft}s
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
  // Declared first so its isSecondaryTab value is available to the useState
  // initialiser for matchmakingOpen below.
  const ws = useMultiplayerWS();
  const { data: session } = useSession();

  // Start the dialog closed if we have a session to rejoin, or if another tab
  // already owns the active WS (secondary tab) — avoids eagerly superseding it.
  const [matchmakingOpen, setMatchmakingOpen] = useState(
    () => loadSession() === null && !ws.isSecondaryTab
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
  const movesCount = useChessStore((s) => s.moves.length);
  const moves = useChessStore((s) => s.moves);
  const positionHistory = useChessStore((s) => s.positionHistory);
  const timeControl = useChessStore((s) => s.timeControl);

  const { isAnalysisOn } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup, endAnalysis } =
    useAnalysisActions();
  const currentFEN = useChessStore((s) => s.currentFEN);

  // Own rating fetched from API; name and image come from the session directly
  const [myRating, setMyRating] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/user/rating?variant=${variant}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: { rating: number | null } | null) =>
          data && setMyRating(data.rating)
      )
      .catch(() => {});
  }, [session?.user?.id, variant]);

  // Opponent rating fetched from API once we have their userId
  const [opponentRating, setOpponentRating] = useState<number | null>(null);

  const opponentUserId = useMemo(() => {
    if (!ws.myColor) return null;
    return ws.myColor === 'white' ? ws.blackUserId : ws.whiteUserId;
  }, [ws.myColor, ws.whiteUserId, ws.blackUserId]);

  useEffect(() => {
    if (!opponentUserId) return;
    setOpponentRating(null); // reset for new game
    fetch(`/api/users/${opponentUserId}?variant=${variant}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: { rating: number | null } | null) =>
          data && setOpponentRating(data.rating)
      )
      .catch(() => {});
  }, [opponentUserId, variant]);

  // Track the last saved roomId to avoid double-saves from the same client
  const savedRoomIdRef = useRef<string | null>(null);
  // Capture result/reason at game-over time for use in the save effect
  const gameOverDataRef = useRef<{ result: string; reason: string } | null>(
    null
  );

  const saveMultiplayerGame = useCallback(
    (result: string, reason: string) => {
      const roomId = ws.roomId;
      if (!roomId || savedRoomIdRef.current === roomId) return;
      if (!session?.user?.id) return;
      savedRoomIdRef.current = roomId;

      const myColor = ws.myColor ?? 'white';
      const opponentUserId =
        myColor === 'white' ? ws.blackUserId : ws.whiteUserId;
      const startingFen =
        positionHistory[0] ??
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          moves,
          variant,
          gameType: 'multiplayer',
          result,
          resultReason: reason,
          myColor,
          opponentUserId,
          timeControl,
          startingFen
        })
      }).catch((err) => console.error('Failed to save multiplayer game:', err));
    },
    [
      ws.roomId,
      ws.myColor,
      ws.whiteUserId,
      ws.blackUserId,
      moves,
      variant,
      timeControl,
      positionHistory,
      session
    ] // eslint-disable-line react-hooks/exhaustive-deps
  );

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
  // Skip when this tab is secondary — pre-connecting would supersede the primary.
  useEffect(() => {
    if (matchmakingOpen && !ws.isSecondaryTab) {
      ws.preConnect();
    }
  }, [matchmakingOpen, ws.isSecondaryTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-rejoin session on mount (page refresh case)
  // Active session takes priority over challenge link — the challenge is consumed
  // once the game starts, so reloading mid-game must use the rejoin token.
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession && savedSession.variant === variant) {
      ws.rejoin(savedSession.roomId, savedSession.rejoinToken);
      return;
    }
    if (challengeId) {
      ws.joinChallenge(
        challengeId,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fresh match: show "Opponent found!" animation then start
  useEffect(() => {
    if (ws.isSecondaryTab) return;
    if (ws.status === 'matched' && ws.myColor) {
      // Clear any stale ?challenge= param.
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('challenge');
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
        ws.setPlaying();
        setMatchmakingOpen(false);
        if (moves && moves.length > 0) {
          setPendingMoves(moves);
          ws.clearMovesToReplay();
        }
      }, 800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    startMultiplayerGame
  ]);

  // Rejoin: restore immediately with no dialog, no animation delay
  useEffect(() => {
    if (ws.isSecondaryTab) return;
    if (ws.status === 'rejoined' && ws.myColor) {
      const moves = ws.movesToReplay;
      endAnalysis();
      ws.setPlaying();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    startMultiplayerGame
  ]);

  // Open the matchmaking dialog only when there is no active session to rejoin
  // and this is the primary tab.
  useEffect(() => {
    if (
      ws.status === 'idle' &&
      !matchmakingOpen &&
      loadSession() === null &&
      !ws.isSecondaryTab
    ) {
      setMatchmakingOpen(true);
    }
  }, [ws.status, ws.isSecondaryTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // For secondary tabs, keep the matchmaking dialog in sync with the mirrored
  // status so the user sees the correct state (e.g. "Searching…" when waiting).
  useEffect(() => {
    if (!ws.isSecondaryTab) return;
    const showDialog =
      ws.status === 'idle' ||
      ws.status === 'connecting' ||
      ws.status === 'waiting' ||
      ws.status === 'error';
    setMatchmakingOpen(showDialog);
  }, [ws.status, ws.isSecondaryTab]);

  // Handle server-initiated game over (resign, draw, abandon, abandon)
  useEffect(() => {
    ws.setOnServerGameOver((result, reason) => {
      // For checkmate/stalemate the board already set the correct result locally
      // ('You win!' / 'Opponent wins!' / 'Draw!'). Don't overwrite it.
      if (reason !== 'checkmate') {
        setGameResult(result);
      }
      setGameOver(true);
      // Save from the receiving side (resign, draw, abandon, etc.)
      saveMultiplayerGame(result, reason);
    });
    return () => ws.setOnServerGameOver(null);
  }, [ws.setOnServerGameOver, setGameResult, setGameOver, saveMultiplayerGame]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle locally-detected game over (checkmate, stalemate) — the server never
  // sends game_over back to the detecting client, so we transition WS status here.
  useEffect(() => {
    if (gameOver && ws.status === 'playing') {
      ws.notifyGameOver('Game over', 'checkmate');
      // Save from the detecting client's side
      const myColor = ws.myColor ?? 'white';
      // Determine result: if the game is over and we called notifyGameOver,
      // the detecting client is the one who delivered checkmate (they win).
      const pgnResult = myColor === 'white' ? '1-0' : '0-1';
      saveMultiplayerGame(pgnResult, 'checkmate');
    }
  }, [gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFindGame = useCallback(
    (timeControl: TimeControl) => {
      ws.joinQueue(
        variant,
        timeControl,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    },
    [ws.joinQueue, variant, session] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCreateChallenge = useCallback(
    (timeControl: TimeControl, color: ChallengeColor) => {
      ws.createChallenge(
        variant,
        timeControl,
        color,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    },
    [ws.createChallenge, variant, session] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCancelSearch = useCallback(() => {
    ws.leaveQueue();
  }, [ws.leaveQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFindNewGame = useCallback(() => {
    ws.disconnect();
    setPendingMoves(null);
    setActiveChallengeId(undefined);
    setMatchmakingOpen(true);
  }, [ws.disconnect]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMovesReplayed = useCallback(() => {
    setPendingMoves(null);
  }, []);

  // Track the start of each first-move abort window so the waiting player sees
  // a live countdown. Resets when white moves (movesCount 0→1); clears at 2+.
  const [abortWindowStart, setAbortWindowStart] = useState<number | null>(null);
  // Only show the countdown after a 20-second buffer — no need to alarm players
  // who are about to move imminently.
  const [abortVisible, setAbortVisible] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver || movesCount >= 2) {
      setAbortWindowStart(null);
      setAbortVisible(false);
      return;
    }
    const start = Date.now();
    setAbortWindowStart(start);
    setAbortVisible(false);
    const t = setTimeout(() => setAbortVisible(true), 20_000);
    return () => clearTimeout(t);
  }, [gameStarted, gameOver, movesCount]);

  // Show to the waiting player only (the opponent is the one who needs to move)
  // moves=0 → white must move  → black is waiting
  // moves=1 → black must move  → white is waiting
  const showOpponentAbortCountdown =
    abortVisible &&
    abortWindowStart !== null &&
    ((movesCount === 0 && playAs === 'black') ||
      (movesCount === 1 && playAs === 'white'));

  // Use ws.myColor (set immediately on match) rather than playAs (set 800ms later)
  const isMe = (color: 'white' | 'black') => color === (ws.myColor ?? playAs);

  const getPlayerName = (color: 'white' | 'black') => {
    if (isMe(color)) return session?.user?.name ?? 'You';
    return ws.opponentName ?? 'Opponent';
  };

  const getPlayerImage = (color: 'white' | 'black') => {
    if (isMe(color)) return session?.user?.image ?? null;
    return ws.opponentImage ?? null;
  };

  const getPlayerRating = (color: 'white' | 'black') => {
    if (isMe(color)) return myRating;
    return opponentRating;
  };

  const showIndicator = gameStarted && !gameOver;

  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        <div className='flex flex-col items-center gap-2'>
          {/* Top player */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
              <PlayerInfo
                name={getPlayerName(topColor)}
                image={getPlayerImage(topColor)}
                rating={getPlayerRating(topColor)}
              />
              {showIndicator &&
              topColor !== playAs &&
              ws.opponentDisconnected ? (
                <AbandonCountdown
                  disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
                />
              ) : (
                showIndicator && (
                  <>
                    <SignalIndicator
                      wsStatus={ws.status}
                      latencyMs={
                        topColor !== playAs
                          ? ws.opponentLatencyMs
                          : ws.latencyMs
                      }
                    />
                    {topColor !== playAs &&
                      showOpponentAbortCountdown &&
                      abortWindowStart !== null && (
                        <AbortCountdown startedAt={abortWindowStart} />
                      )}
                  </>
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
              <PlayerInfo
                name={getPlayerName(bottomColor)}
                image={getPlayerImage(bottomColor)}
                rating={getPlayerRating(bottomColor)}
              />
              {showIndicator &&
              bottomColor !== playAs &&
              ws.opponentDisconnected ? (
                <AbandonCountdown
                  disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
                />
              ) : (
                showIndicator && (
                  <>
                    <SignalIndicator
                      wsStatus={ws.status}
                      latencyMs={
                        bottomColor !== playAs
                          ? ws.opponentLatencyMs
                          : ws.latencyMs
                      }
                    />
                    {bottomColor !== playAs &&
                      showOpponentAbortCountdown &&
                      abortWindowStart !== null && (
                        <AbortCountdown startedAt={abortWindowStart} />
                      )}
                  </>
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
        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(70vw,calc(100dvh-180px),820px)] lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)]'>
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

      {/* Secondary-tab overlay: shown when this tab is mirroring another tab's
          active game. Prevents the user from accidentally interacting with a
          stale board and makes the situation clear. */}
      {ws.isSecondaryTab &&
        (ws.status === 'playing' ||
          ws.status === 'matched' ||
          ws.status === 'rejoined') && (
          <div className='bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
            <div className='bg-card mx-4 flex max-w-sm flex-col items-center gap-3 rounded-xl border p-8 text-center shadow-xl'>
              <Icons.system className='text-muted-foreground h-10 w-10' />
              <div>
                <p className='text-lg font-semibold'>
                  Game in progress in another tab
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Switch to the other tab to continue playing.
                </p>
              </div>
            </div>
          </div>
        )}

      <MatchmakingDialog
        open={matchmakingOpen}
        onOpenChange={(v) => {
          if (
            !v &&
            (ws.status === 'idle' ||
              ws.status === 'connecting' ||
              ws.status === 'error')
          ) {
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
