import type { ServerWebSocket } from 'bun';
import type { Position } from 'chessops/chess';

export type Color = 'white' | 'black';
export type CreatorColor = 'white' | 'black' | 'random';

export interface TimeControl {
  mode: 'unlimited' | 'timed' | 'custom';
  minutes: number;
  increment: number;
}

export interface SocketData {
  id: string;
  color?: Color;
  roomId?: string;
  variant?: string;
  challengeId?: string;
}

export type BunWS = ServerWebSocket<SocketData>;

export interface Challenge {
  id: string;
  creator: BunWS;
  variant: string;
  timeControl: TimeControl;
  creatorColor: CreatorColor;
  createdAt: number;
}

export interface Room {
  id: string;
  white: BunWS;
  black: BunWS;
  variant: string;
  timeControl: TimeControl;
  startingFen: string;
  moves: string[];
  /** Authoritative chessops position — updated on every legal move. */
  position: Position;
  drawOfferedBy: Color | null;
  rematchOfferedBy: string | null;
  status: 'active' | 'ended';
  createdAt: number;
  /** Auto-abort timer for the first two moves (1 min each) */
  abortTimer: ReturnType<typeof setTimeout> | null;
}
