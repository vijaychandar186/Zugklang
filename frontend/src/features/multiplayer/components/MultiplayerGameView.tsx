'use client';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { ChessBoard } from '@/features/chess/components/ChessBoard';
import { ChessSidebar } from '@/features/chess/components/ChessSidebar';
import { MatchmakingDialog } from './MatchmakingDialog';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { GameShell } from '@/features/chess/components/GameShell';
import { useGameView } from '@/features/chess/hooks/useGameView';
import { useGameTimer } from '@/features/chess/hooks/useGameTimer';
import { useAnalysisSync } from '@/features/chess/hooks/useAnalysisSync';
import {
  useChessStore,
  useTimerState
} from '@/features/chess/stores/useChessStore';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { useSession } from 'next-auth/react';
import { useMultiplayerWS, loadSession } from '../hooks/useMultiplayerWS';
import {
  ABORT_TIMEOUT_MS,
  ABORT_COUNTDOWN_VISIBILITY_DELAY_MS
} from '../config';
import { Icons } from '@/components/Icons';
import { formatVariantLabel } from '@/lib/chess/variantLabels';
import type { ChessVariant } from '@/features/chess/config/variants';
import type { TimeControl } from '@/features/game/types/rules';
import type { ChallengeColor } from '../types';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import {
  DEFAULT_FLAG_CODE,
  normalizeFlagCode
} from '@/features/settings/flags';
import { SignalIndicator, AbandonCountdown } from './PlayerStatusIndicators';
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
      Auto-abandon in {secsLeft}s
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
  const ws = useMultiplayerWS();
  const { data: session } = useSession();
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [sessionRestorePending, setSessionRestorePending] = useState(true);
  const [pendingMoves, setPendingMoves] = useState<string[] | null>(null);
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
  const { setTimerSnapshot } = useTimerState();
  const playAs = useChessStore((s) => s.playAs);
  const gameStarted = useChessStore((s) => s.gameStarted);
  const gameOver = useChessStore((s) => s.gameOver);
  const movesCount = useChessStore((s) => s.moves.length);
  const moves = useChessStore((s) => s.moves);
  const positionHistory = useChessStore((s) => s.positionHistory);
  const timeControl = useChessStore((s) => s.timeControl);
  const { isAnalysisOn } = useAnalysisState();
  const { endAnalysis } = useAnalysisActions();
  const currentFEN = useChessStore((s) => s.currentFEN);
  const [positionResetKey, setPositionResetKey] = useState(0);
  const serverMovesRef = useRef<string[]>([]);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [myRatingDelta, setMyRatingDelta] = useState<number | null>(null);
  const [opponentRatingDelta, setOpponentRatingDelta] = useState<number | null>(
    null
  );
  const ratingCategory = useMemo(() => {
    const tc = ws.timeControl;
    if (!tc) return null;
    if (tc.mode === 'unlimited') return 'classical' as const;
    if (tc.mode !== 'timed') return null;
    return getTimeCategory(tc.minutes, tc.increment);
  }, [ws.timeControl]);
  useEffect(() => {
    if (!session?.user?.id) {
      setMyRating(null);
      return;
    }
    const params = new URLSearchParams({ variant });
    if (ratingCategory) params.set('category', ratingCategory);
    fetch(`/api/user/rating?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            rating: number | null;
          } | null
        ) => data && setMyRating(data.rating)
      )
      .catch(() => {});
  }, [session?.user?.id, variant, ratingCategory]);
  const [myFlagCode, setMyFlagCode] = useState(DEFAULT_FLAG_CODE);
  useEffect(() => {
    if (!session?.user?.id) {
      setMyFlagCode(DEFAULT_FLAG_CODE);
      return;
    }
    fetch('/api/user/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            flagCode?: string | null;
          } | null
        ) => setMyFlagCode(normalizeFlagCode(data?.flagCode))
      )
      .catch(() => setMyFlagCode(DEFAULT_FLAG_CODE));
  }, [session?.user?.id]);
  const [opponentRating, setOpponentRating] = useState<number | null>(null);
  const [opponentFlagCode, setOpponentFlagCode] = useState(DEFAULT_FLAG_CODE);
  const opponentUserId = useMemo(() => {
    const me = session?.user?.id ?? null;
    if (me) {
      if (ws.whiteUserId === me) return ws.blackUserId;
      if (ws.blackUserId === me) return ws.whiteUserId;
    }
    if (!ws.myColor) return null;
    return ws.myColor === 'white' ? ws.blackUserId : ws.whiteUserId;
  }, [session?.user?.id, ws.myColor, ws.whiteUserId, ws.blackUserId]);
  useEffect(() => {
    if (!opponentUserId) {
      setOpponentRating(null);
      setOpponentFlagCode(DEFAULT_FLAG_CODE);
      return;
    }
    setOpponentRating(null);
    const params = new URLSearchParams({ variant });
    if (ratingCategory) params.set('category', ratingCategory);
    fetch(`/api/users/${opponentUserId}?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { rating: 700 }))
      .then((data: { rating: number | null; flagCode?: string | null }) => {
        setOpponentRating(data.rating ?? 700);
        setOpponentFlagCode(normalizeFlagCode(data.flagCode));
      })
      .catch(() => setOpponentFlagCode(DEFAULT_FLAG_CODE));
  }, [opponentUserId, variant, ratingCategory]);
  const savedRoomIdRef = useRef<string | null>(null);
  const isRatedGameRef = useRef(true);
  const saveMultiplayerGame = useCallback(
    (
      result: string,
      reason: string,
      serverWhiteUserId: string | null,
      serverBlackUserId: string | null
    ) => {
      const roomId = ws.roomId;
      if (!roomId || savedRoomIdRef.current === roomId) return;
      savedRoomIdRef.current = roomId;
      const myColor = ws.myColor ?? 'white';
      const opponentUserId =
        myColor === 'white' ? serverBlackUserId : serverWhiteUserId;
      const startingFen =
        positionHistory[0] ??
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const rated = isRatedGameRef.current;
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
          startingFen,
          rated
        })
      })
        .then((r) => (r.ok ? r.json() : null))
        .then(
          (
            data: {
              gameId?: string;
              whiteRatingDelta?: number | null;
              blackRatingDelta?: number | null;
            } | null
          ) => {
            if (!data) return;
            const myDelta =
              myColor === 'white'
                ? data.whiteRatingDelta
                : data.blackRatingDelta;
            const theirDelta =
              myColor === 'white'
                ? data.blackRatingDelta
                : data.whiteRatingDelta;
            if (myDelta != null) setMyRatingDelta(myDelta);
            if (theirDelta != null) setOpponentRatingDelta(theirDelta);
            if (myDelta == null) {
              setTimeout(() => {
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
                    startingFen,
                    rated
                  })
                })
                  .then((r) => (r.ok ? r.json() : null))
                  .then(
                    (
                      retryData: {
                        whiteRatingDelta?: number | null;
                        blackRatingDelta?: number | null;
                      } | null
                    ) => {
                      if (!retryData) return;
                      const retryMyDelta =
                        myColor === 'white'
                          ? retryData.whiteRatingDelta
                          : retryData.blackRatingDelta;
                      const retryTheirDelta =
                        myColor === 'white'
                          ? retryData.blackRatingDelta
                          : retryData.whiteRatingDelta;
                      if (retryMyDelta != null) setMyRatingDelta(retryMyDelta);
                      if (retryTheirDelta != null)
                        setOpponentRatingDelta(retryTheirDelta);
                    }
                  )
                  .catch(() => {});
              }, 700);
            }
          }
        )
        .catch((err) => console.error('Failed to save multiplayer game:', err));
    },
    [ws.roomId, ws.myColor, moves, variant, timeControl, positionHistory]
  );
  useEffect(() => {
    setVariant(variant);
    setGameType('multiplayer');
  }, [variant, setVariant, setGameType]);
  useGameTimer();
  useAnalysisSync(currentFEN);
  useEffect(() => {
    if (matchmakingOpen && !ws.isSecondaryTab) {
      ws.preConnect();
    }
  }, [matchmakingOpen, ws.isSecondaryTab]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedSession = loadSession();
    if (savedSession && savedSession.variant === variant) {
      setMatchmakingOpen(false);
      ws.rejoin(savedSession.roomId, savedSession.rejoinToken);
      return;
    }
    setSessionRestorePending(false);
    if (!ws.isSecondaryTab) {
      setMatchmakingOpen(true);
    }
    if (challengeId) {
      ws.joinChallenge(
        challengeId,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    }
  }, []);
  useEffect(() => {
    if (!sessionRestorePending) return;
    if (
      ws.status === 'rejoined' ||
      ws.status === 'matched' ||
      ws.status === 'playing' ||
      ws.status === 'error' ||
      (ws.status === 'idle' && loadSession() === null)
    ) {
      setSessionRestorePending(false);
    }
  }, [sessionRestorePending, ws.status]);
  useEffect(() => {
    if (ws.isSecondaryTab) return;
    if (ws.status === 'matched' && ws.myColor) {
      setMyRatingDelta(null);
      setOpponentRatingDelta(null);
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
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    startMultiplayerGame
  ]);
  useEffect(() => {
    if (ws.isSecondaryTab) return;
    if (ws.status === 'rejoined' && ws.myColor) {
      setMyRatingDelta(null);
      setOpponentRatingDelta(null);
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
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    startMultiplayerGame
  ]);
  useEffect(() => {
    if (sessionRestorePending) return;
    if (
      ws.status === 'idle' &&
      !matchmakingOpen &&
      loadSession() === null &&
      !ws.isSecondaryTab
    ) {
      setMatchmakingOpen(true);
    }
  }, [sessionRestorePending, ws.status, ws.isSecondaryTab, matchmakingOpen]);
  useEffect(() => {
    if (sessionRestorePending) return;
    if (!ws.isSecondaryTab) return;
    const showDialog =
      ws.status === 'idle' ||
      ws.status === 'connecting' ||
      ws.status === 'waiting' ||
      ws.status === 'error';
    setMatchmakingOpen(showDialog);
  }, [sessionRestorePending, ws.status, ws.isSecondaryTab]);
  useEffect(() => {
    ws.setOnServerGameOver((result, reason, whiteUserId, blackUserId) => {
      if (reason !== 'checkmate') {
        setGameResult(result);
      }
      setGameOver(true);
      saveMultiplayerGame(result, reason, whiteUserId, blackUserId);
    });
    return () => ws.setOnServerGameOver(null);
  }, [ws.setOnServerGameOver, setGameResult, setGameOver, saveMultiplayerGame]);
  useEffect(() => {
    ws.setOnClockSync((whiteTimeMs, blackTimeMs, activeClock) => {
      const toSeconds = (ms: number | null) =>
        ms === null ? null : Math.max(0, Math.ceil(ms / 1000));
      setTimerSnapshot(
        toSeconds(whiteTimeMs),
        toSeconds(blackTimeMs),
        activeClock
      );
    });
    return () => ws.setOnClockSync(null);
  }, [ws.setOnClockSync, setTimerSnapshot]);
  const [serverSyncGeneration, setServerSyncGeneration] = useState(0);
  useEffect(() => {
    ws.setOnPositionSync((serverMoves) => {
      serverMovesRef.current = serverMoves;
      setServerSyncGeneration((g) => g + 1);
    });
    return () => ws.setOnPositionSync(null);
  }, [ws.setOnPositionSync]);
  useEffect(() => {
    if (
      serverSyncGeneration === 0 ||
      !gameStarted ||
      gameOver ||
      pendingMoves !== null
    )
      return;
    const serverMoves = serverMovesRef.current;
    if (serverMoves.length !== movesCount) {
      const myColor = ws.myColor ?? 'white';
      const tc = ws.timeControl ?? {
        mode: 'unlimited' as const,
        minutes: 0,
        increment: 0
      };
      startMultiplayerGame(myColor, tc, ws.startingFen || undefined);
      setPendingMoves(serverMoves);
      setPositionResetKey((k) => k + 1);
    }
  }, [serverSyncGeneration]);
  useEffect(() => {
    if (gameOver && ws.status === 'playing') {
      const myColor = ws.myColor ?? 'white';
      const pgnResult = myColor === 'white' ? '1-0' : '0-1';
      ws.notifyGameOver(pgnResult, 'checkmate');
    }
  }, [gameOver]);
  const handleFindGame = useCallback(
    async (timeControl: TimeControl, rated: boolean) => {
      isRatedGameRef.current = rated;
      let rating = 700;
      try {
        const category =
          timeControl.mode === 'unlimited'
            ? 'classical'
            : timeControl.mode === 'timed'
              ? getTimeCategory(timeControl.minutes, timeControl.increment)
              : 'classical';
        const res = await fetch(
          `/api/user/rating?variant=${encodeURIComponent(variant)}&category=${encodeURIComponent(category)}`
        );
        if (res.ok) {
          const data = (await res.json()) as {
            rating: number;
          };
          rating = data.rating;
        }
      } catch {}
      ws.joinQueue(
        variant,
        timeControl,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined,
        rating
      );
    },
    [ws.joinQueue, variant, session]
  );
  const handleCreateChallenge = useCallback(
    (timeControl: TimeControl, color: ChallengeColor, rated: boolean) => {
      isRatedGameRef.current = rated;
      ws.createChallenge(
        variant,
        timeControl,
        color,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    },
    [ws.createChallenge, variant, session]
  );
  const handleCancelSearch = useCallback(() => {
    ws.leaveQueue();
  }, [ws.leaveQueue]);
  const handleFindNewGame = useCallback(() => {
    ws.disconnect();
    setPendingMoves(null);
    setActiveChallengeId(undefined);
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setMatchmakingOpen(true);
  }, [ws.disconnect]);
  const handleMovesReplayed = useCallback(() => {
    setPendingMoves(null);
  }, []);
  const abortStartedAt = ws.abortStartedAt;
  const [abortVisible, setAbortVisible] = useState(false);
  useEffect(() => {
    if (!gameStarted || gameOver || movesCount >= 2 || !abortStartedAt) {
      setAbortVisible(false);
      return;
    }
    const elapsed = Date.now() - abortStartedAt;
    const remaining = Math.max(
      0,
      ABORT_COUNTDOWN_VISIBILITY_DELAY_MS - elapsed
    );
    if (remaining === 0) {
      setAbortVisible(true);
      return;
    }
    setAbortVisible(false);
    const t = setTimeout(() => setAbortVisible(true), remaining);
    return () => clearTimeout(t);
  }, [abortStartedAt, gameStarted, gameOver, movesCount]);
  const showOpponentAbortCountdown =
    abortVisible &&
    abortStartedAt !== null &&
    ((movesCount === 0 && playAs === 'black') ||
      (movesCount === 1 && playAs === 'white'));
  const showMyAbortCountdown =
    abortVisible &&
    abortStartedAt !== null &&
    ((movesCount === 0 && playAs === 'white') ||
      (movesCount === 1 && playAs === 'black'));
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
  const getPlayerRatingDelta = (color: 'white' | 'black') => {
    if (isMe(color)) return myRatingDelta;
    return opponentRatingDelta;
  };
  const getPlayerFlagCode = (color: 'white' | 'black') => {
    if (isMe(color)) return myFlagCode;
    return opponentFlagCode;
  };
  const showIndicator = gameStarted && !gameOver;
  const makePlayerLeft = (color: 'white' | 'black') => (
    <>
      <PlayerInfo
        name={getPlayerName(color)}
        image={getPlayerImage(color)}
        rating={getPlayerRating(color)}
        ratingDelta={getPlayerRatingDelta(color)}
        flagCode={getPlayerFlagCode(color)}
      />
      {showIndicator && color !== playAs && ws.opponentDisconnected ? (
        <AbandonCountdown
          disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
        />
      ) : (
        showIndicator && (
          <>
            <SignalIndicator
              wsStatus={ws.status}
              latencyMs={color !== playAs ? ws.opponentLatencyMs : ws.latencyMs}
            />
            {color !== playAs &&
              showOpponentAbortCountdown &&
              abortStartedAt !== null && (
                <AbortCountdown startedAt={abortStartedAt} />
              )}
            {color === playAs &&
              showMyAbortCountdown &&
              abortStartedAt !== null && (
                <AbortCountdown startedAt={abortStartedAt} />
              )}
          </>
        )
      )}
    </>
  );
  const makePlayerRight = (
    captured: typeof topCaptured,
    pieceColor: 'white' | 'black',
    advantage: number | undefined,
    time: number | null,
    timerActive: boolean,
    isPlayer: boolean
  ) => (
    <>
      <CapturedPiecesDisplay
        pieces={captured}
        pieceColor={pieceColor}
        advantage={advantage}
      />
      {hasTimer && (
        <PlayerClock time={time} isActive={timerActive} isPlayer={isPlayer} />
      )}
    </>
  );
  return (
    <GameShell
      topLeft={makePlayerLeft(topColor)}
      topRight={makePlayerRight(
        topCaptured,
        bottomColor,
        topAdvantage,
        topTime,
        topTimerActive,
        topColor === playAs
      )}
      bottomLeft={makePlayerLeft(bottomColor)}
      bottomRight={makePlayerRight(
        bottomCaptured,
        topColor,
        bottomAdvantage,
        bottomTime,
        bottomTimerActive,
        bottomColor === playAs
      )}
      boardArea={
        <BoardContainer>
          <ChessBoard
            key={`${gameId}-${positionResetKey}`}
            serverOrientation={ws.myColor || 'white'}
            initialBoard3dEnabled={initialBoard3dEnabled}
            onPlayerMove={ws.sendMove}
            setOnOpponentMove={ws.setOnOpponentMove}
            movesToReplay={pendingMoves}
            onMovesReplayed={handleMovesReplayed}
          />
        </BoardContainer>
      }
      sidebar={
        <ChessSidebar
          mode='play'
          multiplayer={{
            status: ws.status,
            drawOffered: ws.drawOffered,
            rematchOffered: ws.rematchOffered,
            rematchDeclined: ws.rematchDeclined,
            onAbort: ws.abort,
            onResign: ws.resign,
            onOfferDraw: ws.offerDraw,
            onAcceptDraw: ws.acceptDraw,
            onDeclineDraw: ws.declineDraw,
            onOfferRematch: ws.offerRematch,
            onAcceptRematch: ws.acceptRematch,
            onDeclineRematch: ws.declineRematch,
            onFindNewGame: handleFindNewGame
          }}
        />
      }
      analysisBar={isAnalysisOn ? <AnalysisLines /> : undefined}
      overlays={
        <>
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
            open={matchmakingOpen && !sessionRestorePending}
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
            variantLabel={formatVariantLabel(variant)}
            errorMessage={ws.errorMessage}
            pendingChallengeId={ws.pendingChallengeId}
            initialChallengeId={activeChallengeId}
            onFindGame={handleFindGame}
            onCancel={handleCancelSearch}
            onCreateChallenge={handleCreateChallenge}
            onCancelChallenge={ws.cancelChallenge}
          />
        </>
      }
    />
  );
}
