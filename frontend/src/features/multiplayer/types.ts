import type { TimeControl } from '@/features/game/types/rules';

// ─── Connection / Matchmaking Status ─────────────────────────────────────────

export type MultiplayerStatus =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'matched'
  | 'rejoined'
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
      rejoinToken: string;
      whiteUserId: string | null;
      blackUserId: string | null;
      whiteDisplayName: string | null;
      blackDisplayName: string | null;
      whiteImage: string | null;
      blackImage: string | null;
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
      rejoinToken: string;
      opponentLatencyMs: number | null;
      whiteUserId: string | null;
      blackUserId: string | null;
      whiteDisplayName: string | null;
      blackDisplayName: string | null;
      whiteImage: string | null;
      blackImage: string | null;
    }
  | { type: 'rejoin_failed'; reason: string }
  | { type: 'opponent_move'; from: string; to: string; promotion?: string }
  | {
      type: 'game_over';
      result: string;
      reason: string;
      winner?: string;
      whiteUserId: string | null;
      blackUserId: string | null;
    }
  | { type: 'draw_offered' }
  | { type: 'draw_declined' }
  | { type: 'opponent_disconnected' }
  | { type: 'opponent_reconnected' }
  | { type: 'opponent_latency'; latencyMs: number }
  | { type: 'rematch_offered' }
  | { type: 'rematch_declined' }
  | { type: 'pong' }
  | { type: 'error'; message: string };

// ─── Client → Server messages ─────────────────────────────────────────────────

export type ChallengeColor = 'white' | 'black' | 'random';

export type ClientMessage =
  | {
      type: 'join_queue';
      variant: string;
      timeControl: TimeControl;
      displayName?: string;
      userImage?: string | null;
    }
  | { type: 'leave_queue' }
  | { type: 'rejoin_room'; roomId: string; rejoinToken: string }
  | {
      type: 'create_challenge';
      variant: string;
      timeControl: TimeControl;
      color: ChallengeColor;
      displayName?: string;
      userImage?: string | null;
    }
  | {
      type: 'join_challenge';
      challengeId: string;
      displayName?: string;
      userImage?: string | null;
    }
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
  | { type: 'ping' }
  | { type: 'latency_update'; latencyMs: number }
  | { type: 'offer_rematch' }
  | { type: 'accept_rematch' }
  | { type: 'decline_rematch' };

// ─── Hook state / return type ─────────────────────────────────────────────────

export interface MultiplayerWSState {
  status: MultiplayerStatus;
  myColor: 'white' | 'black' | null;
  roomId: string | null;
  playerId: string | null;
  variant: string | null;
  startingFen: string | null;
  timeControl: TimeControl | null;
  drawOffered: boolean;
  opponentDisconnected: boolean;
  /** Timestamp (Date.now()) when opponent_disconnected was received, null otherwise */
  opponentDisconnectedAt: number | null;
  errorMessage: string | null;
  /** Set when we have created a pending challenge (waiting for a friend to join) */
  pendingChallengeId: string | null;
  /** Moves to replay after reconnection — cleared once board has applied them */
  movesToReplay: string[] | null;
  /** Round-trip latency in ms from the last ping/pong, null until first pong */
  latencyMs: number | null;
  /** Opponent's latency relayed by the server, null until first update */
  opponentLatencyMs: number | null;
  /** Opponent has offered a rematch */
  rematchOffered: boolean;
  /** Opponent declined our rematch offer */
  rematchDeclined: boolean;
  /** Auth user IDs for both players — set on match/rejoin, used for game save */
  whiteUserId: string | null;
  blackUserId: string | null;
  /** Opponent's display name and avatar — populated from matched/rejoined messages */
  opponentName: string | null;
  opponentImage: string | null;
}

export type OnOpponentMoveFn = (
  from: string,
  to: string,
  promotion?: string
) => void;

export type OnServerGameOverFn = (result: string, reason: string) => void;

export interface UseMultiplayerWSReturn extends MultiplayerWSState {
  /** Join the matchmaking queue for a variant */
  joinQueue: (
    variant: string,
    timeControl: TimeControl,
    displayName?: string,
    userImage?: string | null
  ) => void;
  /** Leave the matchmaking queue */
  leaveQueue: () => void;
  /** Eagerly open the WebSocket connection without sending any game message */
  preConnect: () => void;
  /** Rejoin an active game after a page refresh */
  rejoin: (roomId: string, rejoinToken: string) => void;
  /** Clear the movesToReplay queue after the board has replayed them */
  clearMovesToReplay: () => void;
  /** Create a challenge link (Play with Friend) */
  createChallenge: (
    variant: string,
    timeControl: TimeControl,
    color: ChallengeColor,
    displayName?: string,
    userImage?: string | null
  ) => void;
  /** Join a challenge by ID from a shared link */
  joinChallenge: (
    challengeId: string,
    displayName?: string,
    userImage?: string | null
  ) => void;
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
  /** Transition status to 'playing' once the board is live */
  setPlaying: () => void;
  /** Notify server that the game ended locally (checkmate, stalemate, etc.) */
  notifyGameOver: (result: string, reason: string) => void;
  /** Register a callback for when the opponent makes a move */
  setOnOpponentMove: (fn: OnOpponentMoveFn | null) => void;
  /** Register a callback for server-side game over events */
  setOnServerGameOver: (fn: OnServerGameOverFn | null) => void;
  /** Offer a rematch after the game ends */
  offerRematch: () => void;
  /** Accept the opponent's rematch offer */
  acceptRematch: () => void;
  /** Decline the opponent's rematch offer */
  declineRematch: () => void;
  /** Disconnect and clean up */
  disconnect: () => void;
}
