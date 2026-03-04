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
  OnClockSyncFn,
  OnPositionSyncFn,
  OnSyncDiceFn,
  OnSyncCardFn,
  OnFourPlayerLobbyStateFn,
  OnFourPlayerLobbyStartedFn,
  OnFourPlayerLobbyRejoinedFn,
  OnFourPlayerPlayerReconnectedFn,
  OnFourPlayerStateSyncFn,
  OnTriDMoveReceivedFn
} from '../types';
const SESSION_KEY = 'zugklang_mp_session';
const FP_SESSION_KEY = 'zugklang_4p_session';
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
function saveFourPlayerSession(
  lobbyId: string,
  playerId: string,
  rejoinToken: string
): void {
  try {
    sessionStorage.setItem(
      FP_SESSION_KEY,
      JSON.stringify({ lobbyId, playerId, rejoinToken })
    );
  } catch {}
}
export function clearFourPlayerSession(): void {
  try {
    sessionStorage.removeItem(FP_SESSION_KEY);
  } catch {}
}
export function loadFourPlayerSession(): {
  lobbyId: string;
  playerId: string;
  rejoinToken: string;
} | null {
  try {
    const raw = sessionStorage.getItem(FP_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function getDefaultWsUrl(): string {
  if (typeof window === 'undefined') {
    return 'ws://localhost:3000/ws';
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}

const configuredWsUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();
const isLegacyLocalWsUrl =
  configuredWsUrl === 'ws://localhost:8080' ||
  configuredWsUrl === 'ws://127.0.0.1:8080';
const WS_URL =
  configuredWsUrl && !isLegacyLocalWsUrl ? configuredWsUrl : getDefaultWsUrl();
const PING_INTERVAL_MS = 25000;
const REJOIN_DEBOUNCE_MS = 1500;
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
      abortStartedAt: null,
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
  const onPositionSyncRef = useRef<OnPositionSyncFn | null>(null);
  const onSyncDiceRef = useRef<OnSyncDiceFn | null>(null);
  const onSyncCardRef = useRef<OnSyncCardFn | null>(null);
  const onFourPlayerLobbyStateRef = useRef<OnFourPlayerLobbyStateFn | null>(
    null
  );
  const onFourPlayerLobbyStartedRef = useRef<OnFourPlayerLobbyStartedFn | null>(
    null
  );
  const onFourPlayerLobbyRejoinedRef =
    useRef<OnFourPlayerLobbyRejoinedFn | null>(null);
  const onFourPlayerPlayerReconnectedRef =
    useRef<OnFourPlayerPlayerReconnectedFn | null>(null);
  const onFourPlayerStateSyncRef = useRef<OnFourPlayerStateSyncFn | null>(null);
  const onTriDMoveReceivedRef = useRef<OnTriDMoveReceivedFn | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const isPrimaryRef = useRef(false);
  const latestStateRef = useRef<MultiplayerWSState>(state);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastRejoinRef = useRef<{
    roomId: string;
    rejoinToken: string;
    sentAt: number;
  } | null>(null);
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
  const handleServerMessage = useCallback(
    (msg: ServerMessage): void => {
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
          lastRejoinRef.current = null;
          roomIdRef.current = msg.roomId;
          saveSession(
            msg.roomId,
            latestStateRef.current.playerId ?? '',
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
            abortStartedAt: msg.abortStartedAt,
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
          lastRejoinRef.current = null;
          roomIdRef.current = msg.roomId;
          saveSession(
            msg.roomId,
            latestStateRef.current.playerId ?? '',
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
            opponentDisconnected: msg.opponentDisconnectedAt !== null,
            opponentDisconnectedAt: msg.opponentDisconnectedAt,
            abortStartedAt: msg.abortStartedAt,
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
          lastRejoinRef.current = null;
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
            abortStartedAt: null,
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
        case 'abort_window':
          setState((s) => ({ ...s, abortStartedAt: msg.startedAt }));
          break;
        case 'opponent_disconnected':
          setState((s) => ({
            ...s,
            opponentDisconnected: true,
            opponentDisconnectedAt: msg.disconnectedAt
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
        case 'position_sync':
          onPositionSyncRef.current?.(msg.moves);
          break;
        case 'dice_synced':
          onSyncDiceRef.current?.(msg.pieces);
          break;
        case 'card_synced':
          onSyncCardRef.current?.(msg.rank, msg.suit);
          break;
        case 'four_player_lobby_created':
        case 'four_player_lobby_updated':
          onFourPlayerLobbyStateRef.current?.({
            lobbyId: msg.lobbyId,
            leaderId: msg.leaderId,
            started: msg.started,
            timeControl: msg.timeControl,
            players: msg.players
          });
          break;
        case 'four_player_lobby_started':
          saveFourPlayerSession(
            msg.lobbyId,
            latestStateRef.current.playerId ?? '',
            msg.rejoinToken
          );
          onFourPlayerLobbyStartedRef.current?.(
            msg.lobbyId,
            msg.startedAt,
            msg.timeControl
          );
          break;
        case 'four_player_lobby_rejoined':
          setState((s) => ({ ...s, playerId: msg.myPlayerId }));
          saveFourPlayerSession(msg.lobbyId, msg.myPlayerId, msg.rejoinToken);
          onFourPlayerLobbyRejoinedRef.current?.(
            {
              lobbyId: msg.lobbyId,
              leaderId: msg.leaderId,
              started: msg.started,
              timeControl: msg.timeControl,
              players: msg.players
            },
            msg.rejoinToken
          );
          break;
        case 'four_player_player_disconnected':
          break;
        case 'four_player_player_reconnected':
          onFourPlayerPlayerReconnectedRef.current?.(msg.playerId);
          break;
        case 'four_player_state_synced':
          onFourPlayerStateSyncRef.current?.(
            msg.lobbyId,
            msg.fromPlayerId,
            msg.state
          );
          break;
        case 'trid_move_received':
          onTriDMoveReceivedRef.current?.(msg.move);
          break;
        case 'error':
          setState((s) => ({ ...s, errorMessage: msg.message }));
          break;
      }
    },
    [sendRaw, startPing]
  );
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
  }, [startPing, stopPing, handleServerMessage]);
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
      const now = Date.now();
      const lastRejoin = lastRejoinRef.current;
      if (
        lastRejoin &&
        lastRejoin.roomId === roomId &&
        lastRejoin.rejoinToken === rejoinToken &&
        now - lastRejoin.sentAt < REJOIN_DEBOUNCE_MS
      ) {
        return;
      }
      const current = latestStateRef.current;
      if (
        current.roomId === roomId &&
        (current.status === 'matched' ||
          current.status === 'rejoined' ||
          current.status === 'playing')
      ) {
        return;
      }
      try {
        await connect();
      } catch {
        return;
      }
      lastRejoinRef.current = { roomId, rejoinToken, sentAt: now };
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
      userImage?: string | null,
      rating?: number
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
        userImage,
        rating
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
  const sendDiceSync = useCallback(
    (pieces: [string, string, string]) => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      sendRaw({ type: 'sync_dice', roomId, pieces });
    },
    [sendRaw]
  );
  const sendCardSync = useCallback(
    (rank: string, suit: string) => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      sendRaw({ type: 'sync_card', roomId, rank, suit });
    },
    [sendRaw]
  );
  const setOnPositionSync = useCallback((fn: OnPositionSyncFn | null) => {
    onPositionSyncRef.current = fn;
  }, []);
  const setOnSyncDice = useCallback((fn: OnSyncDiceFn | null) => {
    onSyncDiceRef.current = fn;
  }, []);
  const setOnSyncCard = useCallback((fn: OnSyncCardFn | null) => {
    onSyncCardRef.current = fn;
  }, []);
  const sendTriDMoveSync = useCallback(
    (move: string) => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      sendRaw({ type: 'sync_trid_move', roomId, move });
    },
    [sendRaw]
  );
  const setOnTriDMoveReceived = useCallback(
    (fn: OnTriDMoveReceivedFn | null) => {
      onTriDMoveReceivedRef.current = fn;
    },
    []
  );
  const createFourPlayerLobby = useCallback(
    async (
      displayName?: string,
      userImage?: string | null,
      timeControl?: TimeControl
    ) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({
        type: 'create_four_player_lobby',
        displayName,
        userImage,
        ...(timeControl ? { timeControl } : {})
      });
    },
    [connect, sendRaw]
  );
  const joinFourPlayerLobby = useCallback(
    async (
      lobbyId: string,
      displayName?: string,
      userImage?: string | null
    ) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({
        type: 'join_four_player_lobby',
        lobbyId,
        displayName,
        userImage
      });
    },
    [connect, sendRaw]
  );
  const leaveFourPlayerLobby = useCallback(
    (lobbyId: string) => {
      sendRaw({ type: 'leave_four_player_lobby', lobbyId });
      clearFourPlayerSession();
    },
    [sendRaw]
  );
  const startFourPlayerLobby = useCallback(
    (lobbyId: string) => {
      sendRaw({ type: 'start_four_player_lobby', lobbyId });
    },
    [sendRaw]
  );
  const shuffleFourPlayerLobby = useCallback(
    (lobbyId: string) => {
      sendRaw({ type: 'shuffle_four_player_lobby', lobbyId });
    },
    [sendRaw]
  );
  const assignFourPlayerTeam = useCallback(
    (lobbyId: string, playerId: string, team: 'r' | 'b' | 'y' | 'g') => {
      sendRaw({ type: 'assign_four_player_team', lobbyId, playerId, team });
    },
    [sendRaw]
  );
  const sendFourPlayerStateSync = useCallback(
    (lobbyId: string, state: string) => {
      sendRaw({ type: 'sync_four_player_state', lobbyId, state });
    },
    [sendRaw]
  );
  const rejoinFourPlayerLobby = useCallback(
    async (lobbyId: string, rejoinToken: string) => {
      try {
        await connect();
      } catch {
        return;
      }
      sendRaw({ type: 'rejoin_four_player_lobby', lobbyId, rejoinToken });
    },
    [connect, sendRaw]
  );
  const setOnFourPlayerLobbyState = useCallback(
    (fn: OnFourPlayerLobbyStateFn | null) => {
      onFourPlayerLobbyStateRef.current = fn;
    },
    []
  );
  const setOnFourPlayerLobbyStarted = useCallback(
    (fn: OnFourPlayerLobbyStartedFn | null) => {
      onFourPlayerLobbyStartedRef.current = fn;
    },
    []
  );
  const setOnFourPlayerLobbyRejoined = useCallback(
    (fn: OnFourPlayerLobbyRejoinedFn | null) => {
      onFourPlayerLobbyRejoinedRef.current = fn;
    },
    []
  );
  const setOnFourPlayerPlayerReconnected = useCallback(
    (fn: OnFourPlayerPlayerReconnectedFn | null) => {
      onFourPlayerPlayerReconnectedRef.current = fn;
    },
    []
  );
  const setOnFourPlayerStateSync = useCallback(
    (fn: OnFourPlayerStateSyncFn | null) => {
      onFourPlayerStateSyncRef.current = fn;
    },
    []
  );
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
      abortStartedAt: null,
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
    sendDiceSync,
    sendCardSync,
    setOnPositionSync,
    setOnSyncDice,
    setOnSyncCard,
    createFourPlayerLobby,
    joinFourPlayerLobby,
    leaveFourPlayerLobby,
    startFourPlayerLobby,
    shuffleFourPlayerLobby,
    assignFourPlayerTeam,
    sendFourPlayerStateSync,
    rejoinFourPlayerLobby,
    setOnFourPlayerLobbyState,
    setOnFourPlayerLobbyStarted,
    setOnFourPlayerLobbyRejoined,
    setOnFourPlayerPlayerReconnected,
    setOnFourPlayerStateSync,
    sendTriDMoveSync,
    setOnTriDMoveReceived,
    disconnect
  };
}
