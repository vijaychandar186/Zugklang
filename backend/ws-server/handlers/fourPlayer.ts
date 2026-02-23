import type { BunWS, TimeControl } from '../types';
import {
  fourPlayerLobbies,
  fourPlayerRejoinTokens,
  fourPlayerReconnectTimeouts,
  issueFourPlayerRejoinToken
} from '../state';
import { send } from '../utils/socket';

const DEFAULT_TIME_CONTROL: TimeControl = {
  mode: 'unlimited',
  minutes: 0,
  increment: 0
};

const TEAM_ORDER = ['r', 'b', 'y', 'g'] as const;

type FourPlayerLobbyPayload = {
  lobbyId: string;
  leaderId: string;
  started: boolean;
  timeControl: TimeControl;
  players: {
    playerId: string;
    userId: string | null;
    displayName: string | null;
    userImage: string | null;
    team: (typeof TEAM_ORDER)[number];
    isLeader: boolean;
  }[];
};

function toLobbyPayload(lobbyId: string): FourPlayerLobbyPayload | null {
  const lobby = fourPlayerLobbies.get(lobbyId);
  if (!lobby) return null;
  return {
    lobbyId: lobby.id,
    leaderId: lobby.leaderId,
    started: lobby.started,
    timeControl: lobby.timeControl,
    players: lobby.players.map((player) => ({
      playerId: player.data.id,
      userId: player.data.userId ?? null,
      displayName: player.data.displayName ?? null,
      userImage: player.data.userImage ?? null,
      team: lobby.teamAssignments.get(player.data.id) ?? 'r',
      isLeader: player.data.id === lobby.leaderId
    }))
  };
}

function assignTeam(
  lobby: {
    players: BunWS[];
    teamAssignments: Map<string, (typeof TEAM_ORDER)[number]>;
  },
  playerId: string
): void {
  const used = new Set(lobby.teamAssignments.values());
  const team = TEAM_ORDER.find((t) => !used.has(t)) ?? 'r';
  lobby.teamAssignments.set(playerId, team);
}

function broadcastLobbyUpdate(lobbyId: string): void {
  const lobby = fourPlayerLobbies.get(lobbyId);
  const payload = toLobbyPayload(lobbyId);
  if (!lobby || !payload) return;
  for (const player of lobby.players) {
    send(player, { type: 'four_player_lobby_updated', ...payload });
  }
}

function shuffleTeams(lobby: {
  players: BunWS[];
  teamAssignments: Map<string, (typeof TEAM_ORDER)[number]>;
}): void {
  const teams = [...TEAM_ORDER];
  for (let i = teams.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = teams[i];
    teams[i] = teams[j];
    teams[j] = tmp;
  }

  lobby.teamAssignments.clear();
  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    const team = teams[i];
    if (!player || !team) continue;
    lobby.teamAssignments.set(player.data.id, team);
  }
}

export function leaveFourPlayerLobby(ws: BunWS): void {
  const lobbyId = ws.data.fourPlayerLobbyId;
  if (!lobbyId) return;
  const lobby = fourPlayerLobbies.get(lobbyId);
  delete ws.data.fourPlayerLobbyId;
  if (!lobby) return;

  const index = lobby.players.findIndex(
    (player) => player.data.id === ws.data.id
  );
  if (index === -1) return;
  lobby.players.splice(index, 1);
  lobby.teamAssignments.delete(ws.data.id);

  if (lobby.players.length === 0) {
    fourPlayerLobbies.delete(lobbyId);
    return;
  }

  if (!lobby.players.some((player) => player.data.id === lobby.leaderId)) {
    lobby.leaderId = lobby.players[0]!.data.id;
  }

  for (const player of lobby.players) {
    player.data.fourPlayerLobbyId = lobbyId;
  }
  broadcastLobbyUpdate(lobbyId);
}

export function handleCreateFourPlayerLobby(
  ws: BunWS,
  msg: {
    displayName?: string | undefined;
    userImage?: string | null | undefined;
    timeControl?: TimeControl | undefined;
  }
): void {
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;

  leaveFourPlayerLobby(ws);
  const lobbyId = crypto.randomUUID();
  ws.data.fourPlayerLobbyId = lobbyId;
  const teamAssignments = new Map<string, (typeof TEAM_ORDER)[number]>();
  teamAssignments.set(ws.data.id, 'r');
  fourPlayerLobbies.set(lobbyId, {
    id: lobbyId,
    leaderId: ws.data.id,
    players: [ws],
    teamAssignments,
    started: false,
    timeControl: msg.timeControl ?? DEFAULT_TIME_CONTROL,
    createdAt: Date.now()
  });
  const payload = toLobbyPayload(lobbyId);
  if (!payload) return;
  send(ws, { type: 'four_player_lobby_created', ...payload });
}

export function handleJoinFourPlayerLobby(
  ws: BunWS,
  msg: {
    lobbyId: string;
    displayName?: string | undefined;
    userImage?: string | null | undefined;
  }
): void {
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;
  const lobby = fourPlayerLobbies.get(msg.lobbyId);
  if (!lobby) {
    send(ws, { type: 'error', message: 'Lobby not found.' });
    return;
  }
  if (lobby.started) {
    send(ws, { type: 'error', message: 'Lobby already started.' });
    return;
  }
  if (lobby.players.length >= 4) {
    send(ws, { type: 'error', message: 'Lobby is full.' });
    return;
  }
  if (lobby.players.some((player) => player.data.id === ws.data.id)) {
    const payload = toLobbyPayload(msg.lobbyId);
    if (!payload) return;
    send(ws, { type: 'four_player_lobby_updated', ...payload });
    return;
  }
  leaveFourPlayerLobby(ws);
  lobby.players.push(ws);
  ws.data.fourPlayerLobbyId = msg.lobbyId;
  assignTeam(lobby, ws.data.id);
  broadcastLobbyUpdate(msg.lobbyId);
}

export function handleLeaveFourPlayerLobby(
  ws: BunWS,
  msg: {
    lobbyId: string;
  }
): void {
  if (ws.data.fourPlayerLobbyId !== msg.lobbyId) return;
  leaveFourPlayerLobby(ws);
}

export function handleStartFourPlayerLobby(
  ws: BunWS,
  msg: {
    lobbyId: string;
  }
): void {
  const lobby = fourPlayerLobbies.get(msg.lobbyId);
  if (!lobby) {
    send(ws, { type: 'error', message: 'Lobby not found.' });
    return;
  }
  if (lobby.leaderId !== ws.data.id) {
    send(ws, {
      type: 'error',
      message: 'Only lobby leader can start the game.'
    });
    return;
  }
  if (lobby.players.length !== 4) {
    send(ws, { type: 'error', message: 'Four players are required to start.' });
    return;
  }
  lobby.started = true;
  const startedAt = Date.now();
  for (const player of lobby.players) {
    const token = issueFourPlayerRejoinToken(player.data.id);
    send(player, {
      type: 'four_player_lobby_started',
      lobbyId: lobby.id,
      startedAt,
      timeControl: lobby.timeControl,
      rejoinToken: token
    });
  }
  broadcastLobbyUpdate(lobby.id);
}

export function handleShuffleFourPlayerLobby(
  ws: BunWS,
  msg: {
    lobbyId: string;
  }
): void {
  const lobby = fourPlayerLobbies.get(msg.lobbyId);
  if (!lobby) {
    send(ws, { type: 'error', message: 'Lobby not found.' });
    return;
  }
  if (lobby.leaderId !== ws.data.id) {
    send(ws, {
      type: 'error',
      message: 'Only lobby leader can randomize colors.'
    });
    return;
  }
  if (lobby.started) {
    send(ws, { type: 'error', message: 'Lobby already started.' });
    return;
  }
  if (lobby.players.length < 2) {
    send(ws, {
      type: 'error',
      message: 'Need at least two players to randomize colors.'
    });
    return;
  }

  shuffleTeams(lobby);
  broadcastLobbyUpdate(lobby.id);
}

export function handleAssignFourPlayerTeam(
  ws: BunWS,
  msg: {
    lobbyId: string;
    playerId: string;
    team: (typeof TEAM_ORDER)[number];
  }
): void {
  const lobby = fourPlayerLobbies.get(msg.lobbyId);
  if (!lobby) {
    send(ws, { type: 'error', message: 'Lobby not found.' });
    return;
  }
  if (lobby.leaderId !== ws.data.id) {
    send(ws, {
      type: 'error',
      message: 'Only lobby leader can assign colors.'
    });
    return;
  }
  if (lobby.started) {
    send(ws, { type: 'error', message: 'Lobby already started.' });
    return;
  }

  const targetPlayer = lobby.players.find((p) => p.data.id === msg.playerId);
  if (!targetPlayer) {
    send(ws, { type: 'error', message: 'Player not in lobby.' });
    return;
  }

  const currentTeam = lobby.teamAssignments.get(msg.playerId);
  if (currentTeam === msg.team) return;

  const occupantId = lobby.players.find(
    (p) => lobby.teamAssignments.get(p.data.id) === msg.team
  )?.data.id;

  lobby.teamAssignments.set(msg.playerId, msg.team);
  if (occupantId && currentTeam) {
    lobby.teamAssignments.set(occupantId, currentTeam);
  }

  broadcastLobbyUpdate(lobby.id);
}

export function handleSyncFourPlayerState(
  ws: BunWS,
  msg: {
    lobbyId: string;
    state: string;
  }
): void {
  const lobby = fourPlayerLobbies.get(msg.lobbyId);
  if (!lobby || !lobby.started) return;
  if (!lobby.players.some((player) => player.data.id === ws.data.id)) return;
  for (const player of lobby.players) {
    if (player.data.id === ws.data.id) continue;
    send(player, {
      type: 'four_player_state_synced',
      lobbyId: lobby.id,
      fromPlayerId: ws.data.id,
      state: msg.state
    });
  }
}

export function handleRejoinFourPlayerLobby(
  ws: BunWS,
  msg: { lobbyId: string; rejoinToken: string }
): void {
  const playerId = fourPlayerRejoinTokens.get(msg.rejoinToken);
  if (!playerId) {
    send(ws, { type: 'error', message: 'Invalid or expired rejoin token.' });
    return;
  }
  const lobby = fourPlayerLobbies.get(msg.lobbyId);
  if (!lobby?.started) {
    fourPlayerRejoinTokens.delete(msg.rejoinToken);
    send(ws, { type: 'error', message: 'Game not found.' });
    return;
  }
  const playerIndex = lobby.players.findIndex((p) => p.data.id === playerId);
  if (playerIndex === -1) {
    fourPlayerRejoinTokens.delete(msg.rejoinToken);
    send(ws, { type: 'error', message: 'You are no longer in this game.' });
    return;
  }
  // Cancel the abandon timeout
  const timeout = fourPlayerReconnectTimeouts.get(playerId);
  if (timeout) {
    clearTimeout(timeout);
    fourPlayerReconnectTimeouts.delete(playerId);
  }
  // Revoke old token
  fourPlayerRejoinTokens.delete(msg.rejoinToken);
  // Transfer display info from old ws slot
  const oldWs = lobby.players[playerIndex]!;
  ws.data.id = playerId;
  if (oldWs.data.displayName !== undefined)
    ws.data.displayName = oldWs.data.displayName;
  if (oldWs.data.userImage !== undefined)
    ws.data.userImage = oldWs.data.userImage;
  if (oldWs.data.userId !== undefined) ws.data.userId = oldWs.data.userId;
  ws.data.fourPlayerLobbyId = msg.lobbyId;
  // Replace old ws with new ws in lobby
  lobby.players[playerIndex] = ws;
  // Issue new token
  const newToken = issueFourPlayerRejoinToken(playerId);
  // Send rejoined confirmation to reconnecting player
  const payload = toLobbyPayload(msg.lobbyId);
  if (!payload) return;
  send(ws, {
    type: 'four_player_lobby_rejoined',
    ...payload,
    myPlayerId: playerId,
    rejoinToken: newToken
  });
  // Notify other players so they re-broadcast state to the rejoined player
  for (const player of lobby.players) {
    if (player.data.id !== playerId) {
      send(player, { type: 'four_player_player_reconnected', playerId });
    }
  }
}
