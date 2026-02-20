import type { BunWS, Room, TimeControl } from '../types';
import type { SocketData } from '../types';
import {
  challenges,
  connectedUserIds,
  queues,
  reconnectTimeouts,
  rejoinTokens,
  rooms
} from '../state';
import { buildPosition } from '../utils/chess';
import { getStartingFen } from '../utils/fen';

export interface MockWs {
  data: SocketData;
  sent: unknown[];
  send: (payload: string) => number;
}

export function createMockWs(id: string, userId?: string): MockWs {
  const data: SocketData = userId ? { id, userId } : { id };
  const ws: MockWs = {
    data,
    sent: [],
    send(payload: string) {
      this.sent.push(JSON.parse(payload));
      return 1;
    }
  };
  return ws;
}

export function asBunWs(ws: MockWs): BunWS {
  return ws as unknown as BunWS;
}

export function resetInMemoryState(): void {
  for (const room of rooms.values()) {
    if (room.abortTimer !== null) clearTimeout(room.abortTimer);
  }
  for (const timeout of reconnectTimeouts.values()) {
    clearTimeout(timeout);
  }

  queues.clear();
  rooms.clear();
  challenges.clear();
  reconnectTimeouts.clear();
  connectedUserIds.clear();
  rejoinTokens.clear();
}

export function createTestRoom(params: {
  id: string;
  white: BunWS;
  black: BunWS;
  variant?: string;
  timeControl?: TimeControl;
  status?: Room['status'];
}): Room {
  const variant = params.variant ?? 'standard';
  const timeControl = params.timeControl ?? {
    mode: 'timed',
    minutes: 3,
    increment: 0
  };
  const startingFen = getStartingFen(variant);

  return {
    id: params.id,
    white: params.white,
    black: params.black,
    variant,
    timeControl,
    startingFen,
    moves: [],
    position: buildPosition(variant, startingFen),
    drawOfferedBy: null,
    rematchOfferedBy: null,
    status: params.status ?? 'active',
    createdAt: Date.now(),
    abortTimer: null,
    whiteLatencyMs: null,
    blackLatencyMs: null,
    whiteDisplayName: null,
    blackDisplayName: null,
    whiteImage: null,
    blackImage: null
  };
}
