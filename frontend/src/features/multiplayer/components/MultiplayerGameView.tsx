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
  fixedBoardOrientation?: 'white';
}
export function MultiplayerGameView({
  variant = 'standard',
  initialBoard3dEnabled,
  challengeId,
  fixedBoardOrientation
}: MultiplayerGameViewProps) {
  const ws = useMultiplayerWS();
  const { data: session, status: sessionStatus } = useSession();
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [allowAutoMatchmakingOpen, setAllowAutoMatchmakingOpen] =
    useState(true);
  const [sessionRestorePending, setSessionRestorePending] = useState(true);
  const restoreAttemptedRef = useRef(false);
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
  const resetMultiplayerGame = useChessStore((s) => s.resetMultiplayerGame);
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
  const serverMovesRef = useRef<string[]>([]);
  const syncReconcileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const lastNotifiedGameOverRoomRef = useRef<string | null>(null);
  const lastRoomIdRef = useRef<string | null>(null);
  const saveMultiplayerGameRef = useRef<((result: string, reason: string, serverWhiteUserId: string | null, serverBlackUserId: string | null) => void) | null>(null);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [myRatingDelta, setMyRatingDelta] = useState<number | null>(null);
  const [ratingRefreshKey, setRatingRefreshKey] = useState(0);
  const [opponentRatingDelta, setOpponentRatingDelta] = useState<number | null>(
    null
  );
  // Track pre-game ratings so the fallback can compute deltas after game over
  const pregameMyRatingRef = useRef<number | null>(null);
  const pregameOpponentRatingRef = useRef<number | null>(null);
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
  }, [session?.user?.id, variant, ratingCategory, ratingRefreshKey]);
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
  const rematchOfferedByMe = useMemo(() => {
    const me = session?.user?.id ?? null;
    if (!me) return false;
    return ws.rematchOfferedBy === me;
  }, [session?.user?.id, ws.rematchOfferedBy]);
  useEffect(() => {
    if (!opponentUserId) {
      setOpponentRating(null);
      setOpponentFlagCode(DEFAULT_FLAG_CODE);
      return;
    }
    const params = new URLSearchParams({ variant });
    if (ratingCategory) params.set('category', ratingCategory);
    fetch(`/api/users/${opponentUserId}?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { rating: 700 }))
      .then((data: { rating: number | null; flagCode?: string | null }) => {
        setOpponentRating(data.rating ?? 700);
        setOpponentFlagCode(normalizeFlagCode(data.flagCode));
      })
      .catch(() => setOpponentFlagCode(DEFAULT_FLAG_CODE));
  }, [opponentUserId, variant, ratingCategory, ratingRefreshKey]);
  // Capture pre-game ratings when a new game starts so the fallback can compute deltas
  useEffect(() => {
    if (ws.status === 'playing') {
      pregameMyRatingRef.current = myRating;
      pregameOpponentRatingRef.current = opponentRating;
    }
  }, [ws.status, myRating, opponentRating]);
  // Fallback: if the primary save path didn't set deltas within the expected window,
  // re-fetch both ratings and compute the delta from the pre-game snapshot.
  // Uses ws.gameOverResult (set only by the server's game_over message) so the timer
  // starts after the server confirms game end — not when the winner calls notifyGameOver.
  useEffect(() => {
    if (!ws.gameOverResult) return;
    if (myRatingDelta !== null) return; // primary path already succeeded
    if (!session?.user?.id) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ variant });
      if (ratingCategory) params.set('category', ratingCategory);
      fetch(`/api/user/rating?${params.toString()}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { rating: number } | null) => {
          if (!data) return;
          const preRating = pregameMyRatingRef.current;
          if (preRating !== null && data.rating !== preRating) {
            setMyRatingDelta(data.rating - preRating);
            setMyRating(data.rating);
          }
        })
        .catch(() => {});
      if (opponentUserId) {
        fetch(`/api/users/${opponentUserId}?${params.toString()}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data: { rating: number | null } | null) => {
            if (!data?.rating) return;
            const preRating = pregameOpponentRatingRef.current;
            if (preRating !== null && data.rating !== preRating) {
              setOpponentRatingDelta(data.rating - preRating);
              setOpponentRating(data.rating);
            }
          })
          .catch(() => {});
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [ws.gameOverResult, myRatingDelta, session?.user?.id, variant, ratingCategory, opponentUserId]);
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
            if (myDelta != null) {
              setMyRatingDelta(myDelta);
              setMyRating((prev: number | null) => (prev !== null ? prev + myDelta : null));
            }
            if (theirDelta != null) {
              setOpponentRatingDelta(theirDelta);
              setOpponentRating((prev: number | null) => (prev !== null ? prev + theirDelta : null));
            }
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
                      if (retryMyDelta != null) {
                        setMyRatingDelta(retryMyDelta);
                        setMyRating((prev: number | null) =>
                          prev !== null ? prev + retryMyDelta : null
                        );
                      }
                      if (retryTheirDelta != null) {
                        setOpponentRatingDelta(retryTheirDelta);
                        setOpponentRating((prev: number | null) => (prev !== null ? prev + retryTheirDelta : null));
                      }
                    }
                  )
                  .catch(() => {});
              }, 700);
            }
          }
        )
        .catch((err) => console.error('Failed to save multiplayer game:', err));
    },
    [ws, moves, variant, timeControl, positionHistory]
  );
  // Keep a stable ref so the game-over handler never sees a stale closure
  saveMultiplayerGameRef.current = saveMultiplayerGame;
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
  }, [matchmakingOpen, ws.isSecondaryTab, ws.preConnect]);
  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (restoreAttemptedRef.current) return;
    if (typeof window === 'undefined') return;
    restoreAttemptedRef.current = true;
    const savedSession = loadSession();
    if (savedSession && savedSession.variant === variant) {
      setMatchmakingOpen(false);
      ws.rejoin(savedSession.roomId, savedSession.rejoinToken);
      return;
    }
    setSessionRestorePending(false);
    if (!ws.isSecondaryTab) {
      setMatchmakingOpen(true);
      setAllowAutoMatchmakingOpen(true);
    }
    if (challengeId) {
      ws.joinChallenge(
        challengeId,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    }
  }, [
    challengeId,
    session?.user?.name,
    session?.user?.image,
    sessionStatus,
    variant,
    ws.isSecondaryTab,
    ws.joinChallenge,
    ws.rejoin
  ]);
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
      // New match: clear any stale server sync data from the previous game
      serverMovesRef.current = [];
      setServerSyncGeneration(0);
      setPendingMoves(null);
      lastNotifiedGameOverRoomRef.current = null;
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
        const flipForFixed = fixedBoardOrientation === 'white' && ws.myColor === 'black';
        startMultiplayerGame(ws.myColor!, tc, ws.startingFen || undefined, flipForFixed);
        ws.setPlaying();
        setMatchmakingOpen(false);
        if (moves && moves.length > 0) {
          setPendingMoves(moves);
          ws.clearMovesToReplay();
        }
      }, 800);
      return () => clearTimeout(t);
    }
    // ws object intentionally excluded — it's a new reference on every render
    // (pong/latency updates cause re-renders) and would reset the 800ms
    // startMultiplayerGame timer on every render, preventing it from ever
    // firing during rematch. ws.status, ws.myColor etc. cover all the fields
    // that actually need to trigger this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ws.status,
    ws.myColor,
    ws.startingFen,
    ws.movesToReplay,
    ws.timeControl,
    ws.isSecondaryTab,
    startMultiplayerGame,
    endAnalysis,
    fixedBoardOrientation
  ]);
  useEffect(() => {
    if (ws.isSecondaryTab) return;
    if (!ws.roomId || !ws.myColor) return;
    if (lastRoomIdRef.current === ws.roomId) return;
    lastRoomIdRef.current = ws.roomId;
    // Clear stale rating deltas and re-fetch the current rating for the new game
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setRatingRefreshKey((k: number) => k + 1);
    // Room changed (e.g. rematch): force a clean reset to the starting position
    serverMovesRef.current = [];
    setServerSyncGeneration(0);
    setPendingMoves(null);
    lastNotifiedGameOverRoomRef.current = null;
    endAnalysis();
    const tc = ws.timeControl ?? {
      mode: 'unlimited' as const,
      minutes: 0,
      increment: 0
    };
    const flipForFixed =
      fixedBoardOrientation === 'white' && ws.myColor === 'black';
    startMultiplayerGame(
      ws.myColor,
      tc,
      ws.startingFen || undefined,
      flipForFixed
    );
    ws.setPlaying();
    setMatchmakingOpen(false);
  }, [
    ws.roomId,
    ws.myColor,
    ws.startingFen,
    ws.timeControl,
    ws.isSecondaryTab,
    startMultiplayerGame,
    endAnalysis,
    fixedBoardOrientation,
    ws.setPlaying
  ]);
  useEffect(() => {
    if (ws.isSecondaryTab) return;
    if (ws.status === 'rejoined' && ws.myColor) {
      // Rejoin: reset server sync state to avoid replaying stale moves
      serverMovesRef.current = [];
      setServerSyncGeneration(0);
      setPendingMoves(null);
      lastNotifiedGameOverRoomRef.current = null;
      setMyRatingDelta(null);
      setOpponentRatingDelta(null);
      const moves = ws.movesToReplay;
      endAnalysis();
      ws.setPlaying();
      const flipForFixed = fixedBoardOrientation === 'white' && ws.myColor === 'black';
      startMultiplayerGame(
        ws.myColor,
        ws.timeControl ?? { mode: 'unlimited', minutes: 0, increment: 0 },
        ws.startingFen || undefined,
        flipForFixed
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
    ws.timeControl,
    ws.isSecondaryTab,
    startMultiplayerGame,
    endAnalysis,
    fixedBoardOrientation
  ]);
  useEffect(() => {
    if (sessionRestorePending) return;
    if (
      ws.status === 'idle' &&
      !matchmakingOpen &&
      allowAutoMatchmakingOpen &&
      loadSession() === null &&
      !ws.isSecondaryTab
    ) {
      setMatchmakingOpen(true);
    }
  }, [
    sessionRestorePending,
    ws.status,
    ws.isSecondaryTab,
    matchmakingOpen,
    allowAutoMatchmakingOpen
  ]);
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
    ws.setOnServerGameOver((result, reason) => {
      if (reason !== 'checkmate') {
        setGameResult(result);
      }
      setGameOver(true);
      // saveMultiplayerGame is triggered reactively below via ws.gameOverResult
    });
    return () => ws.setOnServerGameOver(null);
    // ws.setOnServerGameOver is stable (empty useCallback deps). Excluding `ws`
    // prevents the effect from re-running on every render and creating a
    // null-ref window that could cause the game_over callback to be missed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.setOnServerGameOver, setGameResult, setGameOver]);
  // Reactively trigger saveMultiplayerGame when the server's game_over message
  // arrives (ws.gameOverResult is only set by the server, unlike ws.status
  // which the winner sets locally via notifyGameOver before the server responds).
  useEffect(() => {
    if (!ws.gameOverResult || !ws.gameOverReason) return;
    saveMultiplayerGameRef.current?.(
      ws.gameOverResult,
      ws.gameOverReason,
      ws.whiteUserId,
      ws.blackUserId
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.gameOverResult, ws.gameOverReason, ws.whiteUserId, ws.blackUserId]);
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
  }, [ws, ws.setOnClockSync, setTimerSnapshot]);
  const [serverSyncGeneration, setServerSyncGeneration] = useState(0);
  useEffect(() => {
    ws.setOnPositionSync((serverMoves) => {
      serverMovesRef.current = serverMoves;
      setServerSyncGeneration((g) => g + 1);
    });
    return () => ws.setOnPositionSync(null);
  }, [ws, ws.setOnPositionSync]);
  useEffect(() => {
    if (
      serverSyncGeneration === 0 ||
      !gameStarted ||
      gameOver ||
      pendingMoves !== null
    )
      return;
    if (syncReconcileTimeoutRef.current) {
      clearTimeout(syncReconcileTimeoutRef.current);
      syncReconcileTimeoutRef.current = null;
    }
    // Debounce reconciliation so brief WS/store ordering gaps don't trigger
    // full board resets (visible as piece flash on every move).
    syncReconcileTimeoutRef.current = setTimeout(() => {
      const serverMoves = serverMovesRef.current;
      const currentMovesCount = useChessStore.getState().moves.length;
      if (serverMoves.length === currentMovesCount) return;
      const myColor = ws.myColor ?? 'white';
      const tc = ws.timeControl ?? {
        mode: 'unlimited' as const,
        minutes: 0,
        increment: 0
      };
      const flipForFixed =
        fixedBoardOrientation === 'white' && myColor === 'black';
      // Use resetMultiplayerGame (no gameId bump) so ChessBoard stays mounted
      // and isMounted stays true — prevents the piece flash on every move.
      resetMultiplayerGame(myColor, tc, ws.startingFen || undefined, flipForFixed);
      setPendingMoves(serverMoves);
    }, 180);
    return () => {
      if (syncReconcileTimeoutRef.current) {
        clearTimeout(syncReconcileTimeoutRef.current);
        syncReconcileTimeoutRef.current = null;
      }
    };
  }, [
    // ws object intentionally excluded — it's a new reference on every render
    // and would cause this effect (and its debounce timeout) to reset on every
    // render, preventing the 180ms debounce from ever firing reliably.
    // ws.myColor, ws.startingFen, ws.timeControl cover all fields we actually use.
    serverSyncGeneration,
    gameStarted,
    gameOver,
    pendingMoves,
    resetMultiplayerGame,
    ws.myColor,
    ws.startingFen,
    ws.timeControl,
    fixedBoardOrientation
  ]);
  useEffect(() => {
    if (gameOver && ws.status === 'playing' && movesCount > 0) {
      if (ws.roomId && lastNotifiedGameOverRoomRef.current === ws.roomId) {
        return;
      }
      const game = useChessStore.getState().game;
      let pgnResult = '*';
      let reason = 'unknown';
      
      if (game.isCheckmate()) {
        reason = 'checkmate';
        pgnResult = game.turn() === 'w' ? '0-1' : '1-0';
      } else if (game.isStalemate()) {
        reason = 'stalemate';
        pgnResult = '1/2-1/2';
      } else if (game.isThreefoldRepetition()) {
        reason = 'repetition';
        pgnResult = '1/2-1/2';
      } else if (game.isInsufficientMaterial()) {
        reason = 'insufficient';
        pgnResult = '1/2-1/2';
      } else if (game.isDraw()) {
        reason = 'draw';
        pgnResult = '1/2-1/2';
      } else {
        return;
      }
      
      lastNotifiedGameOverRoomRef.current = ws.roomId ?? null;
      ws.notifyGameOver(pgnResult, reason);
    }
  }, [ws, gameOver, ws.status, ws.myColor, movesCount, ws.roomId]);
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
          setMyRating(data.rating);
        }
      } catch {}
      ws.joinQueue(
        variant,
        timeControl,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined,
        rating
      );
      setAllowAutoMatchmakingOpen(true);
    },
    [ws, variant, session]
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
      setAllowAutoMatchmakingOpen(true);
    },
    [ws, variant, session]
  );
  const handleCancelSearch = useCallback(() => {
    ws.leaveQueue();
  }, [ws]);
  const handleFindNewGame = useCallback(() => {
    ws.disconnect();
    setPendingMoves(null);
    setActiveChallengeId(undefined);
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setMatchmakingOpen(true);
    setAllowAutoMatchmakingOpen(true);
  }, [ws]);
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
            key={gameId}
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
            rematchOfferedByMe,
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
                setAllowAutoMatchmakingOpen(false);
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
