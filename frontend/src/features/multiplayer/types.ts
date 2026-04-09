import type { TimeControl } from '@/features/game/types/rules';
import type { Team } from '@/features/custom/four-player/engine';
export type MultiplayerStatus =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'matched'
  | 'rejoined'
  | 'playing'
  | 'game_over'
  | 'error';
export interface FourPlayerLobbyPlayer {
  playerId: string;
  userId: string | null;
  displayName: string | null;
  userImage: string | null;
  team: Team;
  isLeader: boolean;
}
export interface FourPlayerLobbyState {
  lobbyId: string;
  leaderId: string;
  started: boolean;
  timeControl: TimeControl;
  players: FourPlayerLobbyPlayer[];
}
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
      abortStartedAt: number | null;
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
      abortStartedAt: number | null;
      opponentDisconnectedAt: number | null;
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
      type: 'abort_window';
      startedAt: number;
    }
  | {
      type: 'opponent_disconnected';
      disconnectedAt: number;
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
      offeredBy?: string;
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
    }
  | {
      type: 'position_sync';
      moves: string[];
    }
  | {
      type: 'dice_synced';
      pieces: [string, string, string];
    }
  | {
      type: 'card_synced';
      rank: string;
      suit: string;
    }
  | ({
      type: 'four_player_lobby_created';
    } & FourPlayerLobbyState)
  | ({
      type: 'four_player_lobby_updated';
    } & FourPlayerLobbyState)
  | {
      type: 'four_player_lobby_started';
      lobbyId: string;
      startedAt: number;
      timeControl: TimeControl;
      rejoinToken: string;
    }
  | ({
      type: 'four_player_lobby_rejoined';
      myPlayerId: string;
      rejoinToken: string;
    } & FourPlayerLobbyState)
  | {
      type: 'four_player_player_disconnected';
      playerId: string;
    }
  | {
      type: 'four_player_player_reconnected';
      playerId: string;
    }
  | {
      type: 'four_player_state_synced';
      lobbyId: string;
      fromPlayerId: string;
      state: string;
    }
  | {
      type: 'trid_move_received';
      move: string;
    };
export type ChallengeColor = 'white' | 'black' | 'random';
export type ClientMessage =
  | {
      type: 'join_queue';
      variant: string;
      timeControl: TimeControl;
      rating?: number;
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
    }
  | {
      type: 'create_four_player_lobby';
      timeControl?: TimeControl;
      displayName?: string;
      userImage?: string | null;
    }
  | {
      type: 'join_four_player_lobby';
      lobbyId: string;
      displayName?: string;
      userImage?: string | null;
    }
  | {
      type: 'leave_four_player_lobby';
      lobbyId: string;
    }
  | {
      type: 'start_four_player_lobby';
      lobbyId: string;
    }
  | {
      type: 'shuffle_four_player_lobby';
      lobbyId: string;
    }
  | {
      type: 'assign_four_player_team';
      lobbyId: string;
      playerId: string;
      team: Team;
    }
  | {
      type: 'sync_four_player_state';
      lobbyId: string;
      state: string;
    }
  | {
      type: 'rejoin_four_player_lobby';
      lobbyId: string;
      rejoinToken: string;
    }
  | {
      type: 'sync_trid_move';
      roomId: string;
      move: string;
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
  abortStartedAt: number | null;
  errorMessage: string | null;
  pendingChallengeId: string | null;
  movesToReplay: string[] | null;
  latencyMs: number | null;
  opponentLatencyMs: number | null;
  rematchOffered: boolean;
  rematchDeclined: boolean;
  rematchOfferedBy: string | null;
  whiteUserId: string | null;
  blackUserId: string | null;
  opponentName: string | null;
  opponentImage: string | null;
  isSecondaryTab: boolean;
  gameOverResult: string | null;
  gameOverReason: string | null;
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
export type OnPositionSyncFn = (moves: string[]) => void;
export type OnSyncDiceFn = (pieces: [string, string, string]) => void;
export type OnSyncCardFn = (rank: string, suit: string) => void;
export type OnFourPlayerLobbyStateFn = (state: FourPlayerLobbyState) => void;
export type OnFourPlayerLobbyStartedFn = (
  lobbyId: string,
  startedAt: number,
  timeControl: TimeControl
) => void;
export type OnFourPlayerLobbyRejoinedFn = (
  state: FourPlayerLobbyState,
  rejoinToken: string
) => void;
export type OnFourPlayerPlayerReconnectedFn = (playerId: string) => void;
export type OnFourPlayerStateSyncFn = (
  lobbyId: string,
  fromPlayerId: string,
  state: string
) => void;
export type OnTriDMoveReceivedFn = (move: string) => void;
export interface UseMultiplayerWSReturn extends MultiplayerWSState {
  joinQueue: (
    variant: string,
    timeControl: TimeControl,
    displayName?: string,
    userImage?: string | null,
    rating?: number
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
  sendDiceSync: (pieces: [string, string, string]) => void;
  sendCardSync: (rank: string, suit: string) => void;
  setOnSyncDice: (fn: OnSyncDiceFn | null) => void;
  setOnSyncCard: (fn: OnSyncCardFn | null) => void;
  setOnPositionSync: (fn: OnPositionSyncFn | null) => void;
  createFourPlayerLobby: (
    displayName?: string,
    userImage?: string | null,
    timeControl?: TimeControl
  ) => void;
  joinFourPlayerLobby: (
    lobbyId: string,
    displayName?: string,
    userImage?: string | null
  ) => void;
  leaveFourPlayerLobby: (lobbyId: string) => void;
  startFourPlayerLobby: (lobbyId: string) => void;
  shuffleFourPlayerLobby: (lobbyId: string) => void;
  assignFourPlayerTeam: (lobbyId: string, playerId: string, team: Team) => void;
  sendFourPlayerStateSync: (lobbyId: string, state: string) => void;
  rejoinFourPlayerLobby: (lobbyId: string, rejoinToken: string) => void;
  setOnFourPlayerLobbyState: (fn: OnFourPlayerLobbyStateFn | null) => void;
  setOnFourPlayerLobbyStarted: (fn: OnFourPlayerLobbyStartedFn | null) => void;
  setOnFourPlayerLobbyRejoined: (
    fn: OnFourPlayerLobbyRejoinedFn | null
  ) => void;
  setOnFourPlayerPlayerReconnected: (
    fn: OnFourPlayerPlayerReconnectedFn | null
  ) => void;
  setOnFourPlayerStateSync: (fn: OnFourPlayerStateSyncFn | null) => void;
  sendTriDMoveSync: (move: string) => void;
  setOnTriDMoveReceived: (fn: OnTriDMoveReceivedFn | null) => void;
  offerRematch: () => void;
  acceptRematch: () => void;
  declineRematch: () => void;
  disconnect: () => void;
}
