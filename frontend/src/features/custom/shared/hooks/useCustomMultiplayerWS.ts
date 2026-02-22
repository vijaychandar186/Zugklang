'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type CustomMode = 'dice-chess' | 'card-chess' | 'four-player';
export type TwoPlayerMode = 'dice-chess' | 'card-chess';

type PlayerInfo = {
  playerId: string;
  userId: string | null;
  displayName: string | null;
  userImage: string | null;
};

type ServerMessage =
  | {
      type: 'custom_room_created';
      roomId: string;
      mode: CustomMode;
      hostId: string;
      players: PlayerInfo[];
      maxPlayers: number;
    }
  | {
      type: 'custom_joined';
      roomId: string;
      mode: CustomMode;
    }
  | {
      type: 'custom_room_update';
      roomId: string;
      mode: CustomMode;
      hostId: string;
      players: PlayerInfo[];
      maxPlayers: number;
    }
  | {
      type: 'custom_sync_request';
      roomId: string;
      requesterId: string;
    }
  | {
      type: 'custom_state';
      roomId: string;
      fromPlayerId: string;
      state: unknown;
    }
  | {
      type: 'custom_queue_joined';
      mode: TwoPlayerMode;
    }
  | {
      type: 'custom_error';
      message: string;
    }
  | {
      type: 'connected';
      playerId: string;
    };

type Status =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'in_queue'
  | 'in_room'
  | 'error';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/ws-token');
    if (!res.ok) return null;
    const data = (await res.json()) as { token: string };
    return data.token;
  } catch {
    return null;
  }
}

export function useCustomMultiplayerWS() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [mode, setMode] = useState<CustomMode | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [maxPlayers, setMaxPlayers] = useState<number>(2);
  const wsRef = useRef<WebSocket | null>(null);
  const onStateRef = useRef<((state: unknown) => void) | null>(null);
  const onSyncRequestRef = useRef<(() => void) | null>(null);

  const sendRaw = useCallback((msg: object) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }, []);

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return true;
    setStatus('connecting');
    setErrorMessage(null);
    const token = await fetchWsToken();
    if (!token) {
      setStatus('error');
      setErrorMessage('Sign in required.');
      return false;
    }
    try {
      const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;
      return await new Promise<boolean>((resolve) => {
        ws.onopen = () => {
          setStatus('connected');
          resolve(true);
        };
        ws.onerror = () => {
          setStatus('error');
          setErrorMessage('Connection error.');
          resolve(false);
        };
        ws.onclose = () => {
          setStatus((s) => (s === 'error' ? s : 'idle'));
        };
        ws.onmessage = (event: MessageEvent) => {
          try {
            const msg = JSON.parse(event.data as string) as ServerMessage;
            if (msg.type === 'connected') {
              setPlayerId(msg.playerId);
              return;
            }
            if (msg.type === 'custom_error') {
              setStatus('error');
              setErrorMessage(msg.message);
              return;
            }
            if (msg.type === 'custom_queue_joined') {
              setStatus('in_queue');
              return;
            }
            if (msg.type === 'custom_room_created') {
              setRoomId(msg.roomId);
              setMode(msg.mode);
              setHostId(msg.hostId);
              setPlayers(msg.players);
              setMaxPlayers(msg.maxPlayers);
              setStatus('in_room');
              return;
            }
            if (msg.type === 'custom_joined') {
              setRoomId(msg.roomId);
              setMode(msg.mode);
              setStatus('in_room');
              return;
            }
            if (msg.type === 'custom_room_update') {
              setRoomId(msg.roomId);
              setMode(msg.mode);
              setHostId(msg.hostId);
              setPlayers(msg.players);
              setMaxPlayers(msg.maxPlayers);
              setStatus('in_room');
              return;
            }
            if (msg.type === 'custom_state') {
              onStateRef.current?.(msg.state);
              return;
            }
            if (msg.type === 'custom_sync_request') {
              onSyncRequestRef.current?.();
              return;
            }
          } catch {}
        };
      });
    } catch {
      setStatus('error');
      setErrorMessage('Failed to connect.');
      return false;
    }
  }, []);

  const createRoom = useCallback(
    async (
      gameMode: CustomMode,
      displayName?: string,
      userImage?: string | null
    ) => {
      const ok = await connect();
      if (!ok) return;
      sendRaw({
        type: 'create_custom_room',
        mode: gameMode,
        displayName,
        userImage
      });
    },
    [connect, sendRaw]
  );

  const joinRoom = useCallback(
    async (id: string, displayName?: string, userImage?: string | null) => {
      const ok = await connect();
      if (!ok) return;
      sendRaw({ type: 'join_custom_room', roomId: id, displayName, userImage });
    },
    [connect, sendRaw]
  );

  const joinQueue = useCallback(
    async (
      gameMode: TwoPlayerMode,
      displayName?: string,
      userImage?: string | null
    ) => {
      const ok = await connect();
      if (!ok) return;
      setStatus('in_queue');
      sendRaw({
        type: 'join_custom_queue',
        mode: gameMode,
        displayName,
        userImage
      });
    },
    [connect, sendRaw]
  );

  const leaveQueue = useCallback(() => {
    sendRaw({ type: 'leave_custom_queue' });
    setStatus('connected');
  }, [sendRaw]);

  const leaveRoom = useCallback(() => {
    sendRaw({ type: 'leave_custom_room' });
    setRoomId(null);
    setPlayers([]);
    setHostId(null);
    setStatus('connected');
  }, [sendRaw]);

  const sendState = useCallback(
    (state: unknown) => {
      if (!roomId) return;
      sendRaw({ type: 'custom_state', roomId, state });
    },
    [roomId, sendRaw]
  );

  const disconnect = useCallback(() => {
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws) {
      ws.onclose = null;
      ws.close();
    }
    setStatus('idle');
    setRoomId(null);
    setPlayers([]);
    setHostId(null);
  }, []);

  useEffect(() => () => disconnect(), [disconnect]);

  const isHost = useMemo(
    () => !!playerId && !!hostId && playerId === hostId,
    [playerId, hostId]
  );

  return {
    status,
    errorMessage,
    playerId,
    roomId,
    mode,
    hostId,
    players,
    maxPlayers,
    isHost,
    connect,
    createRoom,
    joinRoom,
    joinQueue,
    leaveQueue,
    leaveRoom,
    sendState,
    disconnect,
    setOnState: (fn: ((state: unknown) => void) | null) => {
      onStateRef.current = fn;
    },
    setOnSyncRequest: (fn: (() => void) | null) => {
      onSyncRequestRef.current = fn;
    }
  };
}
