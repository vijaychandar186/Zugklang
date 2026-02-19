'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimeControl } from '@/features/game/types/rules';
import type {
  ChallengeColor,
  ServerMessage,
  MultiplayerWSState,
  UseMultiplayerWSReturn,
  OnOpponentMoveFn,
  OnServerGameOverFn
} from '../types';

const SESSION_KEY = 'zugklang_mp_session';

function saveSession(
  roomId: string,
  playerId: string,
  variant: string,
  rejoinToken: string
): void {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ roomId, playerId, variant, rejoinToken })
    );
  } catch {
    /* ignore */
  }
}

function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function loadSession(): {
  roomId: string;
  playerId: string;
  variant: string;
  rejoinToken: string;
} | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

const PING_INTERVAL_MS = 25_000;

export function useMultiplayerWS(): UseMultiplayerWSReturn {
  const [state, setState] = useState<MultiplayerWSState>({
    status: 'idle',
    myColor: null,
    roomId: null,
    playerId: null,
    variant: null,
    startingFen: null,
    timeControl: null,
    drawOffered: false,
    opponentDisconnected: false,
    opponentDisconnectedAt: null,
    errorMessage: null,
    pendingChallengeId: null,
    movesToReplay: null,
    latencyMs: null,
    opponentLatencyMs: null,
    rematchOffered: false,
    rematchDeclined: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingTimestampRef = useRef<number | null>(null);
  const onOpponentMoveRef = useRef<OnOpponentMoveFn | null>(null);
  const onServerGameOverRef = useRef<OnServerGameOverFn | null>(null);

  // Keep latest room state accessible inside callbacks without stale closures
  const roomIdRef = useRef<string | null>(null);

  // ─── Internal helpers ───────────────────────────────────────────────────────

  const sendRaw = useCallback((msg: object) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }, []);

  const stopPing = useCallback(() => {
    if (pingTimerRef.current !== null) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const sendPing = useCallback(() => {
    pingTimestampRef.current = Date.now();
    sendRaw({ type: 'ping' });
  }, [sendRaw]);

  const startPing = useCallback(() => {
    stopPing();
    sendPing(); // immediate reading on connect
    pingTimerRef.current = setInterval(sendPing, PING_INTERVAL_MS);
  }, [sendPing, stopPing]);

  // ─── Connect & listen ───────────────────────────────────────────────────────

  const connect = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          resolve();
          return;
        }
        if (wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.addEventListener('open', () => resolve(), {
            once: true
          });
          wsRef.current.addEventListener(
            'error',
            () => reject(new Error('WebSocket error')),
            { once: true }
          );
          return;
        }
      }

      setState((s) => ({ ...s, status: 'connecting', errorMessage: null }));

      let ws: WebSocket;
      try {
        ws = new WebSocket(WS_URL);
      } catch {
        setState((s) => ({
          ...s,
          status: 'error',
          errorMessage: 'Failed to create WebSocket connection'
        }));
        reject(new Error('Failed to create WebSocket'));
        return;
      }

      wsRef.current = ws;

      ws.onopen = () => {
        startPing();
        resolve();
      };

      ws.onerror = () => {
        setState((s) => ({
          ...s,
          status: 'error',
          errorMessage:
            'Connection error. Make sure the game server is running.'
        }));
        reject(new Error('WebSocket error'));
      };

      ws.onclose = () => {
        stopPing();
        setState((s) => {
          if (
            s.status === 'playing' ||
            s.status === 'waiting' ||
            s.status === 'connecting'
          ) {
            return {
              ...s,
              status: 'error',
              errorMessage: 'Connection lost. Please try again.'
            };
          }
          return { ...s, status: 'idle' };
        });
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data as string) as ServerMessage;
          handleServerMessage(msg);
        } catch {
          // ignore malformed messages
        }
      };
    });
  }, [startPing, stopPing]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Message handler ─────────────────────────────────────────────────────

  function handleServerMessage(msg: ServerMessage): void {
    switch (msg.type) {
      case 'connected':
        setState((s) => ({ ...s, playerId: msg.playerId }));
        break;

      case 'waiting':
        setState((s) => ({ ...s, status: 'waiting' }));
        break;

      case 'queue_left':
        setState((s) => ({ ...s, status: 'idle' }));
        break;

      case 'challenge_created':
        setState((s) => ({
          ...s,
          status: 'waiting',
          pendingChallengeId: msg.challengeId
        }));
        break;

      case 'challenge_not_found':
        setState((s) => ({
          ...s,
          status: 'error',
          errorMessage: 'Game link not found or has expired.'
        }));
        break;

      case 'matched':
        roomIdRef.current = msg.roomId;
        saveSession(
          msg.roomId,
          state.playerId ?? '',
          msg.variant,
          msg.rejoinToken
        );
        setState((s) => ({
          ...s,
          status: 'matched',
          myColor: msg.color,
          roomId: msg.roomId,
          variant: msg.variant,
          startingFen: msg.startingFen,
          timeControl: msg.timeControl,
          drawOffered: false,
          opponentDisconnected: false,
          opponentDisconnectedAt: null,
          pendingChallengeId: null,
          movesToReplay: null,
          rematchOffered: false,
          rematchDeclined: false
        }));
        // Restart the ping cycle so latency_update fires immediately with the
        // now-valid roomId — the initial ping fired before the room existed.
        startPing();
        break;

      case 'rejoined':
        roomIdRef.current = msg.roomId;
        saveSession(
          msg.roomId,
          state.playerId ?? '',
          msg.variant,
          msg.rejoinToken
        );
        setState((s) => ({
          ...s,
          status: 'rejoined',
          myColor: msg.color,
          roomId: msg.roomId,
          variant: msg.variant,
          startingFen: msg.startingFen,
          timeControl: msg.timeControl,
          drawOffered: false,
          opponentDisconnected: false,
          opponentDisconnectedAt: null,
          pendingChallengeId: null,
          movesToReplay: msg.moves.length > 0 ? msg.moves : null
        }));
        startPing();
        break;

      case 'rejoin_failed':
        clearSession();
        setState((s) => ({
          ...s,
          status: 'idle',
          errorMessage: null // just show matchmaking dialog normally
        }));
        break;

      case 'opponent_move':
        onOpponentMoveRef.current?.(msg.from, msg.to, msg.promotion);
        break;

      case 'game_over':
        clearSession();
        setState((s) => ({
          ...s,
          status: 'game_over',
          drawOffered: false
        }));
        onServerGameOverRef.current?.(msg.result, msg.reason);
        break;

      case 'draw_offered':
        setState((s) => ({ ...s, drawOffered: true }));
        break;

      case 'draw_declined':
        setState((s) => ({ ...s, drawOffered: false }));
        break;

      case 'opponent_disconnected':
        setState((s) => ({
          ...s,
          opponentDisconnected: true,
          opponentDisconnectedAt: Date.now()
        }));
        break;

      case 'opponent_reconnected':
        setState((s) => ({
          ...s,
          opponentDisconnected: false,
          opponentDisconnectedAt: null
        }));
        break;

      case 'pong':
        if (pingTimestampRef.current !== null) {
          const rtt = Date.now() - pingTimestampRef.current;
          pingTimestampRef.current = null;
          setState((s) => ({ ...s, latencyMs: rtt }));
          sendRaw({ type: 'latency_update', latencyMs: rtt });
        }
        break;

      case 'opponent_latency':
        setState((s) => ({ ...s, opponentLatencyMs: msg.latencyMs }));
        break;

      case 'rematch_offered':
        setState((s) => ({
          ...s,
          rematchOffered: true,
          rematchDeclined: false
        }));
        break;

      case 'rematch_declined':
        setState((s) => ({
          ...s,
          rematchDeclined: true,
          rematchOffered: false
        }));
        break;

      case 'error':
        setState((s) => ({ ...s, errorMessage: msg.message }));
        break;
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  const rejoin = useCallback(
    async (roomId: string, rejoinToken: string) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({ type: 'rejoin_room', roomId, rejoinToken });
    },
    [connect, sendRaw]
  );

  const clearMovesToReplay = useCallback(() => {
    setState((s) => ({ ...s, movesToReplay: null }));
  }, []);

  const joinQueue = useCallback(
    async (variant: string, timeControl: TimeControl) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({ type: 'join_queue', variant, timeControl });
      setState((s) => ({
        ...s,
        status: 'waiting',
        variant,
        errorMessage: null
      }));
    },
    [connect, sendRaw]
  );

  const leaveQueue = useCallback(() => {
    sendRaw({ type: 'leave_queue' });
    setState((s) => ({ ...s, status: 'idle' }));
  }, [sendRaw]);

  const createChallenge = useCallback(
    async (
      variant: string,
      timeControl: TimeControl,
      color: ChallengeColor
    ) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({ type: 'create_challenge', variant, timeControl, color });
    },
    [connect, sendRaw]
  );

  const joinChallenge = useCallback(
    async (challengeId: string) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({ type: 'join_challenge', challengeId });
    },
    [connect, sendRaw]
  );

  const cancelChallenge = useCallback(() => {
    sendRaw({ type: 'cancel_challenge' });
    setState((s) => ({ ...s, status: 'idle', pendingChallengeId: null }));
  }, [sendRaw]);

  const sendMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      sendRaw({ type: 'move', roomId, from, to, promotion });
    },
    [sendRaw]
  );

  const abort = useCallback(() => {
    const roomId = roomIdRef.current;
    if (!roomId) return;
    sendRaw({ type: 'abort', roomId });
  }, [sendRaw]);

  const resign = useCallback(() => {
    const roomId = roomIdRef.current;
    if (!roomId) return;
    sendRaw({ type: 'resign', roomId });
  }, [sendRaw]);

  const offerDraw = useCallback(() => {
    const roomId = roomIdRef.current;
    if (!roomId) return;
    sendRaw({ type: 'offer_draw', roomId });
  }, [sendRaw]);

  const acceptDraw = useCallback(() => {
    const roomId = roomIdRef.current;
    if (!roomId) return;
    sendRaw({ type: 'accept_draw', roomId });
  }, [sendRaw]);

  const declineDraw = useCallback(() => {
    const roomId = roomIdRef.current;
    if (!roomId) return;
    sendRaw({ type: 'decline_draw', roomId });
    setState((s) => ({ ...s, drawOffered: false }));
  }, [sendRaw]);

  const offerRematch = useCallback(() => {
    sendRaw({ type: 'offer_rematch' });
  }, [sendRaw]);

  const acceptRematch = useCallback(() => {
    sendRaw({ type: 'accept_rematch' });
  }, [sendRaw]);

  const declineRematch = useCallback(() => {
    sendRaw({ type: 'decline_rematch' });
    setState((s) => ({ ...s, rematchOffered: false }));
  }, [sendRaw]);

  const notifyGameOver = useCallback(
    (result: string, reason: string) => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      sendRaw({ type: 'game_over_notify', roomId, result, reason });
    },
    [sendRaw]
  );

  const setOnOpponentMove = useCallback((fn: OnOpponentMoveFn | null) => {
    onOpponentMoveRef.current = fn;
  }, []);

  const setOnServerGameOver = useCallback((fn: OnServerGameOverFn | null) => {
    onServerGameOverRef.current = fn;
  }, []);

  const disconnect = useCallback(() => {
    clearSession();
    stopPing();
    const ws = wsRef.current;
    if (ws) {
      ws.onclose = null;
      ws.close();
      wsRef.current = null;
    }
    roomIdRef.current = null;
    setState({
      status: 'idle',
      myColor: null,
      roomId: null,
      playerId: null,
      variant: null,
      startingFen: null,
      timeControl: null,
      drawOffered: false,
      opponentDisconnected: false,
      opponentDisconnectedAt: null,
      errorMessage: null,
      pendingChallengeId: null,
      movesToReplay: null,
      latencyMs: null,
      opponentLatencyMs: null,
      rematchOffered: false,
      rematchDeclined: false
    });
  }, [stopPing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPing();
      const ws = wsRef.current;
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [stopPing]);

  const preConnect = useCallback(() => {
    connect().catch(() => {});
  }, [connect]);

  return {
    ...state,
    preConnect,
    rejoin,
    clearMovesToReplay,
    joinQueue,
    leaveQueue,
    createChallenge,
    joinChallenge,
    cancelChallenge,
    sendMove,
    abort,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    offerRematch,
    acceptRematch,
    declineRematch,
    notifyGameOver,
    setOnOpponentMove,
    setOnServerGameOver,
    disconnect
  };
}
