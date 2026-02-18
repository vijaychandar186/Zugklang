import type { ServerWebSocket } from 'bun';

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
  drawOfferedBy: Color | null;
  status: 'active' | 'ended';
  createdAt: number;
}
