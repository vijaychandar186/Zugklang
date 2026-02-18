import type { TimeControl } from '@/features/game/types/rules';

// ─── Connection / Matchmaking Status ─────────────────────────────────────────

export type MultiplayerStatus =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'matched'
  | 'playing'
  | 'game_over'
  | 'error';

// ─── Server → Client messages ─────────────────────────────────────────────────

export type ServerMessage =
  | { type: 'connected'; playerId: string }
  | { type: 'waiting' }
  | { type: 'queue_left' }
  | {
      type: 'matched';
      roomId: string;
      color: 'white' | 'black';
      variant: string;
      timeControl: TimeControl;
      startingFen: string;
    }
  | { type: 'challenge_created'; challengeId: string }
  | { type: 'challenge_not_found' }
  | {
      type: 'rejoined';
      roomId: string;
      color: 'white' | 'black';
      variant: string;
      timeControl: TimeControl;
      startingFen: string;
      moves: string[];
    }
  | { type: 'rejoin_failed'; reason: string }
  | { type: 'opponent_move'; from: string; to: string; promotion?: string }
  | { type: 'game_over'; result: string; reason: string; winner?: string }
  | { type: 'draw_offered' }
  | { type: 'draw_declined' }
  | { type: 'opponent_disconnected' }
  | { type: 'opponent_reconnected' }
  | { type: 'pong' }
  | { type: 'error'; message: string };

// ─── Client → Server messages ─────────────────────────────────────────────────

export type ChallengeColor = 'white' | 'black' | 'random';

export type ClientMessage =
  | { type: 'join_queue'; variant: string; timeControl: TimeControl }
  | { type: 'leave_queue' }
  | { type: 'rejoin_room'; roomId: string; playerId: string }
  | {
      type: 'create_challenge';
      variant: string;
      timeControl: TimeControl;
      color: ChallengeColor;
    }
  | { type: 'join_challenge'; challengeId: string }
  | { type: 'cancel_challenge' }
  | {
      type: 'move';
      roomId: string;
      from: string;
      to: string;
      promotion?: string;
    }
  | { type: 'abort'; roomId: string }
  | { type: 'resign'; roomId: string }
  | { type: 'offer_draw'; roomId: string }
  | { type: 'accept_draw'; roomId: string }
  | { type: 'decline_draw'; roomId: string }
  | { type: 'game_over_notify'; roomId: string; result: string; reason: string }
  | { type: 'ping' };

// ─── Hook state / return type ─────────────────────────────────────────────────

export interface MultiplayerWSState {
  status: MultiplayerStatus;
  myColor: 'white' | 'black' | null;
  roomId: string | null;
  playerId: string | null;
  variant: string | null;
  startingFen: string | null;
  drawOffered: boolean;
  opponentDisconnected: boolean;
  errorMessage: string | null;
  /** Set when we have created a pending challenge (waiting for a friend to join) */
  pendingChallengeId: string | null;
  /** Moves to replay after reconnection — cleared once board has applied them */
  movesToReplay: string[] | null;
}

export type OnOpponentMoveFn = (
  from: string,
  to: string,
  promotion?: string
) => void;

export type OnServerGameOverFn = (result: string, reason: string) => void;

export interface UseMultiplayerWSReturn extends MultiplayerWSState {
  /** Join the matchmaking queue for a variant */
  joinQueue: (variant: string, timeControl: TimeControl) => void;
  /** Leave the matchmaking queue */
  leaveQueue: () => void;
  /** Rejoin an active game after a page refresh */
  rejoin: (roomId: string, playerId: string) => void;
  /** Clear the movesToReplay queue after the board has replayed them */
  clearMovesToReplay: () => void;
  /** Create a challenge link (Play with Friend) */
  createChallenge: (
    variant: string,
    timeControl: TimeControl,
    color: ChallengeColor
  ) => void;
  /** Join a challenge by ID from a shared link */
  joinChallenge: (challengeId: string) => void;
  /** Cancel a pending challenge we created */
  cancelChallenge: () => void;
  /** Send a player's move to the server */
  sendMove: (from: string, to: string, promotion?: string) => void;
  /** Abort the current game (before 2 moves each) */
  abort: () => void;
  /** Resign the current game */
  resign: () => void;
  /** Offer a draw */
  offerDraw: () => void;
  /** Accept the opponent's draw offer */
  acceptDraw: () => void;
  /** Decline the opponent's draw offer */
  declineDraw: () => void;
  /** Notify server that the game ended locally (checkmate, stalemate, etc.) */
  notifyGameOver: (result: string, reason: string) => void;
  /** Register a callback for when the opponent makes a move */
  setOnOpponentMove: (fn: OnOpponentMoveFn | null) => void;
  /** Register a callback for server-side game over events */
  setOnServerGameOver: (fn: OnServerGameOverFn | null) => void;
  /** Disconnect and clean up */
  disconnect: () => void;
}
