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
  /**
   * The Redis sorted-set key for the queue this player is currently waiting in
   * (e.g. "queue:standard:timed:3:2"). Used for O(1) removal on disconnect.
   */
  queueKey?: string;
}
export type BunWS = ServerWebSocket<SocketData>;
export interface Challenge {
  id: string;
  creator: BunWS;
  creatorUserId: string | null;
  variant: string;
  timeControl: TimeControl;
  creatorColor: CreatorColor;
  createdAt: number;
}
export interface Room {
  id: string;
  white: BunWS;
  black: BunWS;
  /** Explicit userId stored separately so cross-pod routing works even after
   *  the BunWS ref becomes stale. */
  whiteUserId: string | null;
  blackUserId: string | null;
  /** Session IDs used for identity checks (e.g. rejoin, isInRoom). */
  whiteSessionId: string;
  blackSessionId: string;
  /** Ratings at match time, used for anti-cheat reporting. */
  whiteRating: number | null;
  blackRating: number | null;
  variant: string;
  timeControl: TimeControl;
  startingFen: string;
  moves: string[];
  position: Position;
  drawOfferedBy: Color | null;
  rematchOfferedBy: string | null;
  status: 'active' | 'ended';
  createdAt: number;
  /** Node.js/Bun timer reference for the in-progress abort countdown. */
  abortTimer: ReturnType<typeof setTimeout> | null;
  /** Unix ms timestamp when the current abort window started; sent to clients for countdown display. */
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
