'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimeControl } from '@/features/game/types/rules';
import type {
  ChallengeColor,
  ServerMessage,
  MultiplayerWSState,
  UseMultiplayerWSReturn,
  OnOpponentMoveFn,
  OnServerGameOverFn,
  OnClockSyncFn
} from '../types';
const SESSION_KEY = 'zugklang_mp_session';
const LS_ACTIVE_KEY = 'zugklang_mp_active';
const BC_CHANNEL = 'zugklang_mp_state';
type TabBroadcast =
  | {
      type: 'state_sync';
      state: MultiplayerWSState;
    }
  | {
      type: 'state_request';
    };
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
  } catch {}
}
function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
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
const PING_INTERVAL_MS = 25000;
async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/ws-token');
    if (!res.ok) return null;
    const data = (await res.json()) as {
      token: string;
    };
    return data.token;
  } catch {
    return null;
  }
}
export function useMultiplayerWS(): UseMultiplayerWSReturn {
  const [state, setState] = useState<MultiplayerWSState>(() => {
    let isSecondaryTab = false;
    if (typeof window !== 'undefined') {
      try {
        isSecondaryTab = localStorage.getItem(LS_ACTIVE_KEY) === '1';
      } catch {}
    }
    return {
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
      rematchDeclined: false,
      whiteUserId: null,
      blackUserId: null,
      opponentName: null,
      opponentImage: null,
      isSecondaryTab
    };
  });
  const wsRef = useRef<WebSocket | null>(null);
  const connectPromiseRef = useRef<Promise<void> | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingTimestampRef = useRef<number | null>(null);
  const onOpponentMoveRef = useRef<OnOpponentMoveFn | null>(null);
  const onServerGameOverRef = useRef<OnServerGameOverFn | null>(null);
  const onClockSyncRef = useRef<OnClockSyncFn | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const isPrimaryRef = useRef(false);
  const latestStateRef = useRef<MultiplayerWSState>(state);
  const channelRef = useRef<BroadcastChannel | null>(null);
  latestStateRef.current = state;
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
    sendPing();
    pingTimerRef.current = setInterval(sendPing, PING_INTERVAL_MS);
  }, [sendPing, stopPing]);
  const connect = useCallback((): Promise<void> => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      return new Promise((resolve, reject) => {
        wsRef.current!.addEventListener('open', () => resolve(), {
          once: true
        });
        wsRef.current!.addEventListener(
          'error',
          () => reject(new Error('WebSocket error')),
          { once: true }
        );
      });
    }
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current = null;
    }
    if (connectPromiseRef.current) return connectPromiseRef.current;
    setState((s) => ({ ...s, status: 'connecting', errorMessage: null }));
    const promise = new Promise<void>((resolve, reject) => {
      fetchWsToken()
        .then((token) => {
          if (!token) {
            setState((s) => ({
              ...s,
              status: 'error',
              errorMessage: 'Sign in required to play multiplayer games.'
            }));
            reject(new Error('Unauthenticated'));
            return;
          }
          const wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}`;
          let ws: WebSocket;
          try {
            ws = new WebSocket(wsUrl);
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
            isPrimaryRef.current = true;
            try {
              localStorage.setItem(LS_ACTIVE_KEY, '1');
            } catch {}
            setState((s) => ({ ...s, isSecondaryTab: false }));
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
          ws.onclose = (event: CloseEvent) => {
            isPrimaryRef.current = false;
            stopPing();
            if (event.code === 1000 && event.reason === 'Session superseded') {
              setState((s) => ({
                ...s,
                status: 'idle',
                errorMessage: null,
                isSecondaryTab: true
              }));
              return;
            }
            try {
              localStorage.removeItem(LS_ACTIVE_KEY);
            } catch {}
            setState((s) => {
              if (s.status === 'error') return s;
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
              return { ...s, status: 'idle', errorMessage: null };
            });
          };
          ws.onmessage = (event: MessageEvent) => {
            try {
              const msg = JSON.parse(event.data as string) as ServerMessage;
              handleServerMessage(msg);
            } catch {}
          };
        })
        .catch(() => {
          setState((s) => ({
            ...s,
            status: 'error',
            errorMessage:
              'Connection error. Make sure the game server is running.'
          }));
          reject(new Error('Token fetch failed'));
        });
    }).finally(() => {
      connectPromiseRef.current = null;
    });
    connectPromiseRef.current = promise;
    return promise;
  }, [startPing, stopPing]);
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
      case 'matched': {
        roomIdRef.current = msg.roomId;
        saveSession(
          msg.roomId,
          state.playerId ?? '',
          msg.variant,
          msg.rejoinToken
        );
        const isWhiteM = msg.color === 'white';
        const opponentNameM = isWhiteM
          ? msg.blackDisplayName
          : msg.whiteDisplayName;
        const opponentImageM = isWhiteM ? msg.blackImage : msg.whiteImage;
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
          rematchDeclined: false,
          whiteUserId: msg.whiteUserId,
          blackUserId: msg.blackUserId,
          opponentName: opponentNameM,
          opponentImage: opponentImageM
        }));
        startPing();
        break;
      }
      case 'rejoined': {
        roomIdRef.current = msg.roomId;
        saveSession(
          msg.roomId,
          state.playerId ?? '',
          msg.variant,
          msg.rejoinToken
        );
        const isWhiteR = msg.color === 'white';
        const opponentNameR = isWhiteR
          ? msg.blackDisplayName
          : msg.whiteDisplayName;
        const opponentImageR = isWhiteR ? msg.blackImage : msg.whiteImage;
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
          movesToReplay: msg.moves.length > 0 ? msg.moves : null,
          opponentLatencyMs: msg.opponentLatencyMs,
          whiteUserId: msg.whiteUserId,
          blackUserId: msg.blackUserId,
          opponentName: opponentNameR,
          opponentImage: opponentImageR
        }));
        startPing();
        break;
      }
      case 'rejoin_failed':
        clearSession();
        setState((s) => ({
          ...s,
          status: 'idle',
          errorMessage: null
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
          drawOffered: false,
          whiteUserId: msg.whiteUserId,
          blackUserId: msg.blackUserId
        }));
        onServerGameOverRef.current?.(
          msg.result,
          msg.reason,
          msg.whiteUserId,
          msg.blackUserId
        );
        break;
      case 'clock_sync':
        onClockSyncRef.current?.(
          msg.whiteTimeMs,
          msg.blackTimeMs,
          msg.activeClock
        );
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
  useEffect(() => {
    if (isPrimaryRef.current && channelRef.current) {
      channelRef.current.postMessage({
        type: 'state_sync',
        state
      } as TabBroadcast);
    }
  }, [state]);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(BC_CHANNEL);
    channelRef.current = channel;
    channel.onmessage = (ev: MessageEvent<TabBroadcast>) => {
      const msg = ev.data;
      if (msg.type === 'state_sync') {
        if (!isPrimaryRef.current) {
          setState({ ...msg.state, isSecondaryTab: true });
        }
      } else if (msg.type === 'state_request') {
        if (isPrimaryRef.current) {
          channel.postMessage({
            type: 'state_sync',
            state: latestStateRef.current
          } as TabBroadcast);
        }
      }
    };
    channel.postMessage({ type: 'state_request' } as TabBroadcast);
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);
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
    async (
      variant: string,
      timeControl: TimeControl,
      displayName?: string,
      userImage?: string | null
    ) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({
        type: 'join_queue',
        variant,
        timeControl,
        displayName,
        userImage
      });
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
      color: ChallengeColor,
      displayName?: string,
      userImage?: string | null
    ) => {
      try {
        await connect();
      } catch {
        return;
      }
      setState((s) => ({
        ...s,
        status: 'waiting',
        variant,
        timeControl,
        errorMessage: null
      }));
      sendRaw({
        type: 'create_challenge',
        variant,
        timeControl,
        color,
        displayName,
        userImage
      });
    },
    [connect, sendRaw]
  );
  const joinChallenge = useCallback(
    async (
      challengeId: string,
      displayName?: string,
      userImage?: string | null
    ) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({ type: 'join_challenge', challengeId, displayName, userImage });
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
      setState((s) => ({ ...s, status: 'game_over' }));
    },
    [sendRaw]
  );
  const setOnOpponentMove = useCallback((fn: OnOpponentMoveFn | null) => {
    onOpponentMoveRef.current = fn;
  }, []);
  const setOnServerGameOver = useCallback((fn: OnServerGameOverFn | null) => {
    onServerGameOverRef.current = fn;
  }, []);
  const setOnClockSync = useCallback((fn: OnClockSyncFn | null) => {
    onClockSyncRef.current = fn;
  }, []);
  const disconnect = useCallback(() => {
    clearSession();
    stopPing();
    connectPromiseRef.current = null;
    isPrimaryRef.current = false;
    try {
      localStorage.removeItem(LS_ACTIVE_KEY);
    } catch {}
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
      rematchDeclined: false,
      whiteUserId: null,
      blackUserId: null,
      opponentName: null,
      opponentImage: null,
      isSecondaryTab: false
    });
  }, [stopPing]);
  useEffect(() => {
    return () => {
      stopPing();
      if (isPrimaryRef.current) {
        try {
          localStorage.removeItem(LS_ACTIVE_KEY);
        } catch {}
      }
      const ws = wsRef.current;
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [stopPing]);
  const setPlaying = useCallback(() => {
    setState((s) => ({ ...s, status: 'playing' }));
  }, []);
  const preConnect = useCallback(() => {
    const rs = wsRef.current?.readyState;
    if (rs === WebSocket.OPEN || rs === WebSocket.CONNECTING) return;
    connect().catch(() => {
      setState((s) =>
        s.status !== 'idle' ? { ...s, status: 'idle', errorMessage: null } : s
      );
    });
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
    setPlaying,
    notifyGameOver,
    setOnOpponentMove,
    setOnServerGameOver,
    setOnClockSync,
    disconnect
  };
}
