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
  userId?: string;
  displayName?: string;
  userImage?: string | null;
  color?: Color;
  roomId?: string;
  variant?: string;
  challengeId?: string;
  fourPlayerLobbyId?: string;
  /** Player's current rating for the variant+category being queued.
   *  Used for ELO-based matchmaking when ELO_QUEUE_ENABLED is true. */
  rating?: number;
  /** Unix ms timestamp when the player entered the current queue slot.
   *  Used to expand the rating band the longer they wait. */
  queuedAt?: number;
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
  position: Position;
  drawOfferedBy: Color | null;
  rematchOfferedBy: string | null;
  status: 'active' | 'ended';
  createdAt: number;
  abortTimer: ReturnType<typeof setTimeout> | null;
  abortTimerStartedAt: number | null;
  whiteDisconnectedAt: number | null;
  blackDisconnectedAt: number | null;
  whiteLatencyMs: number | null;
  blackLatencyMs: number | null;
  whiteDisplayName: string | null;
  blackDisplayName: string | null;
  whiteImage: string | null;
  blackImage: string | null;
  whiteTimeMs: number | null;
  blackTimeMs: number | null;
  activeClock: Color | null;
  clockLastUpdatedAt: number | null;
  clockInterval: ReturnType<typeof setInterval> | null;
  moveTimesWhiteMs: number[];
  moveTimesBlackMs: number[];
}

export interface FourPlayerLobby {
  id: string;
  leaderId: string;
  players: BunWS[];
  teamAssignments: Map<string, 'r' | 'b' | 'y' | 'g'>;
  started: boolean;
  timeControl: TimeControl;
  createdAt: number;
}
