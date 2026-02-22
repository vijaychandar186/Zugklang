import type { TimeControl } from '@/features/game/types/rules';
export type MultiplayerStatus =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'matched'
  | 'rejoined'
  | 'playing'
  | 'game_over'
  | 'error';
export type ServerMessage =
  | {
      type: 'connected';
      playerId: string;
    }
  | {
      type: 'waiting';
    }
  | {
      type: 'queue_left';
    }
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
  | {
      type: 'challenge_created';
      challengeId: string;
    }
  | {
      type: 'challenge_not_found';
    }
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
  | {
      type: 'rejoin_failed';
      reason: string;
    }
  | {
      type: 'opponent_move';
      from: string;
      to: string;
      promotion?: string;
    }
  | {
      type: 'game_over';
      result: string;
      reason: string;
      winner?: string;
      whiteUserId: string | null;
      blackUserId: string | null;
    }
  | {
      type: 'clock_sync';
      whiteTimeMs: number | null;
      blackTimeMs: number | null;
      activeClock: 'white' | 'black' | null;
      serverNow: number;
    }
  | {
      type: 'draw_offered';
    }
  | {
      type: 'draw_declined';
    }
  | {
      type: 'opponent_disconnected';
    }
  | {
      type: 'opponent_reconnected';
    }
  | {
      type: 'opponent_latency';
      latencyMs: number;
    }
  | {
      type: 'rematch_offered';
    }
  | {
      type: 'rematch_declined';
    }
  | {
      type: 'pong';
    }
  | {
      type: 'error';
      message: string;
    };
export type ChallengeColor = 'white' | 'black' | 'random';
export type ClientMessage =
  | {
      type: 'join_queue';
      variant: string;
      timeControl: TimeControl;
      displayName?: string;
      userImage?: string | null;
    }
  | {
      type: 'leave_queue';
    }
  | {
      type: 'rejoin_room';
      roomId: string;
      rejoinToken: string;
    }
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
  | {
      type: 'cancel_challenge';
    }
  | {
      type: 'move';
      roomId: string;
      from: string;
      to: string;
      promotion?: string;
    }
  | {
      type: 'abort';
      roomId: string;
    }
  | {
      type: 'resign';
      roomId: string;
    }
  | {
      type: 'offer_draw';
      roomId: string;
    }
  | {
      type: 'accept_draw';
      roomId: string;
    }
  | {
      type: 'decline_draw';
      roomId: string;
    }
  | {
      type: 'game_over_notify';
      roomId: string;
      result: string;
      reason: string;
    }
  | {
      type: 'ping';
    }
  | {
      type: 'latency_update';
      latencyMs: number;
    }
  | {
      type: 'offer_rematch';
    }
  | {
      type: 'accept_rematch';
    }
  | {
      type: 'decline_rematch';
    };
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
  opponentDisconnectedAt: number | null;
  errorMessage: string | null;
  pendingChallengeId: string | null;
  movesToReplay: string[] | null;
  latencyMs: number | null;
  opponentLatencyMs: number | null;
  rematchOffered: boolean;
  rematchDeclined: boolean;
  whiteUserId: string | null;
  blackUserId: string | null;
  opponentName: string | null;
  opponentImage: string | null;
  isSecondaryTab: boolean;
}
export type OnOpponentMoveFn = (
  from: string,
  to: string,
  promotion?: string
) => void;
export type OnServerGameOverFn = (
  result: string,
  reason: string,
  whiteUserId: string | null,
  blackUserId: string | null
) => void;
export type OnClockSyncFn = (
  whiteTimeMs: number | null,
  blackTimeMs: number | null,
  activeClock: 'white' | 'black' | null
) => void;
export interface UseMultiplayerWSReturn extends MultiplayerWSState {
  joinQueue: (
    variant: string,
    timeControl: TimeControl,
    displayName?: string,
    userImage?: string | null
  ) => void;
  leaveQueue: () => void;
  preConnect: () => void;
  rejoin: (roomId: string, rejoinToken: string) => void;
  clearMovesToReplay: () => void;
  createChallenge: (
    variant: string,
    timeControl: TimeControl,
    color: ChallengeColor,
    displayName?: string,
    userImage?: string | null
  ) => void;
  joinChallenge: (
    challengeId: string,
    displayName?: string,
    userImage?: string | null
  ) => void;
  cancelChallenge: () => void;
  sendMove: (from: string, to: string, promotion?: string) => void;
  abort: () => void;
  resign: () => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  declineDraw: () => void;
  setPlaying: () => void;
  notifyGameOver: (result: string, reason: string) => void;
  setOnOpponentMove: (fn: OnOpponentMoveFn | null) => void;
  setOnServerGameOver: (fn: OnServerGameOverFn | null) => void;
  setOnClockSync: (fn: OnClockSyncFn | null) => void;
  offerRematch: () => void;
  acceptRematch: () => void;
  declineRematch: () => void;
  disconnect: () => void;
}
