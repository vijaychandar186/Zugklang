import type { ServerWebSocket } from 'bun';

// ─── Types ────────────────────────────────────────────────────────────────────

type Color = 'white' | 'black';

interface TimeControl {
  mode: 'unlimited' | 'timed' | 'custom';
  minutes: number;
  increment: number;
}

/** Data attached to each Bun WebSocket connection */
interface SocketData {
  id: string;
  color?: Color;
  roomId?: string;
  variant?: string;
  challengeId?: string;
}

type CreatorColor = 'white' | 'black' | 'random';

interface Challenge {
  id: string;
  creator: BunWS;
  variant: string;
  timeControl: TimeControl;
  creatorColor: CreatorColor;
  createdAt: number;
}

type BunWS = ServerWebSocket<SocketData>;

interface Room {
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

// ─── Chess960 FEN generator ───────────────────────────────────────────────────

function generateChess960Fen(): string {
  const files = [0, 1, 2, 3, 4, 5, 6, 7];

  const darkSquares = [1, 3, 5, 7];
  const lightSquares = [0, 2, 4, 6];
  const bishop1Pos = darkSquares[Math.floor(Math.random() * 4)];
  const bishop2Pos = lightSquares[Math.floor(Math.random() * 4)];
  files.splice(files.indexOf(bishop1Pos), 1);
  files.splice(files.indexOf(bishop2Pos), 1);

  const queenIdx = Math.floor(Math.random() * files.length);
  const queenPos = files[queenIdx];
  files.splice(queenIdx, 1);

  const knight1Idx = Math.floor(Math.random() * files.length);
  const knight1Pos = files[knight1Idx];
  files.splice(knight1Idx, 1);

  const knight2Idx = Math.floor(Math.random() * files.length);
  const knight2Pos = files[knight2Idx];
  files.splice(knight2Idx, 1);

  const [rook1Pos, kingPos, rook2Pos] = files.sort((a, b) => a - b);

  const pieces = new Array<string>(8);
  pieces[bishop1Pos] = 'b';
  pieces[bishop2Pos] = 'b';
  pieces[queenPos] = 'q';
  pieces[knight1Pos] = 'n';
  pieces[knight2Pos] = 'n';
  pieces[rook1Pos] = 'r';
  pieces[kingPos] = 'k';
  pieces[rook2Pos] = 'r';

  const backRankBlack = pieces.join('');
  const backRankWhite = backRankBlack.toUpperCase();

  const leftRookFile = String.fromCharCode(97 + rook1Pos);
  const rightRookFile = String.fromCharCode(97 + rook2Pos);
  const castling = `KQ${leftRookFile}${rightRookFile}kq${leftRookFile}${rightRookFile}`;

  return `${backRankBlack}/pppppppp/8/8/8/8/PPPPPPPP/${backRankWhite} w ${castling} - 0 1`;
}

function getStartingFen(variant: string): string {
  switch (variant) {
    case 'fischerRandom':
      return generateChess960Fen();
    case 'racingKings':
      return '8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w KQkq - 0 1';
    case 'horde':
      return 'rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1';
    default:
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }
}

// ─── State ────────────────────────────────────────────────────────────────────

/** Matchmaking queues keyed by "variant:mode:minutes:increment" */
const queues = new Map<string, BunWS[]>();
const rooms = new Map<string, Room>();
const challenges = new Map<string, Challenge>();
/** playerId → abandon timeout: started when player disconnects from active room */
const reconnectTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function send(ws: BunWS, msg: object): void {
  try {
    ws.send(JSON.stringify(msg));
  } catch {
    // ignore closed socket errors
  }
}

function removeFromQueues(ws: BunWS): void {
  for (const queue of queues.values()) {
    const idx = queue.findIndex((w) => w.data.id === ws.data.id);
    if (idx !== -1) queue.splice(idx, 1);
  }
}

function getOpponent(room: Room, ws: BunWS): BunWS {
  return room.white.data.id === ws.data.id ? room.black : room.white;
}

function isInRoom(room: Room, ws: BunWS): boolean {
  return room.white.data.id === ws.data.id || room.black.data.id === ws.data.id;
}

// ─── Message handlers ─────────────────────────────────────────────────────────

function timeControlKey(tc: TimeControl): string {
  return `${tc.mode}:${tc.minutes}:${tc.increment}`;
}

function handleJoinQueue(
  ws: BunWS,
  msg: { variant?: string; timeControl?: TimeControl }
): void {
  const variant = msg.variant || 'standard';
  const timeControl: TimeControl = msg.timeControl || {
    mode: 'unlimited',
    minutes: 0,
    increment: 0
  };

  removeFromQueues(ws);

  // Leave active room if any
  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room && room.status === 'active') handleResign(ws);
    ws.data.roomId = undefined;
  }

  ws.data.variant = variant;

  const queueKey = `${variant}:${timeControlKey(timeControl)}`;

  if (!queues.has(queueKey)) queues.set(queueKey, []);
  const queue = queues.get(queueKey)!;

  if (queue.length > 0) {
    const opponent = queue.shift()!;
    matchPlayers(ws, opponent, variant, timeControl);
  } else {
    queue.push(ws);
    send(ws, { type: 'waiting' });
  }
}

function createRoom(
  white: BunWS,
  black: BunWS,
  variant: string,
  timeControl: TimeControl
): void {
  const roomId = crypto.randomUUID();
  const startingFen = getStartingFen(variant);

  white.data.color = 'white';
  white.data.roomId = roomId;
  black.data.color = 'black';
  black.data.roomId = roomId;

  const room: Room = {
    id: roomId,
    white,
    black,
    variant,
    timeControl,
    startingFen,
    moves: [],
    drawOfferedBy: null,
    status: 'active',
    createdAt: Date.now()
  };

  rooms.set(roomId, room);

  send(white, {
    type: 'matched',
    roomId,
    color: 'white',
    variant,
    timeControl,
    startingFen
  });
  send(black, {
    type: 'matched',
    roomId,
    color: 'black',
    variant,
    timeControl,
    startingFen
  });

  console.log(
    `[room:${roomId.slice(0, 8)}] ${white.data.id.slice(0, 8)} (white) vs ${black.data.id.slice(0, 8)} (black) — ${variant}`
  );
}

function matchPlayers(
  playerA: BunWS,
  playerB: BunWS,
  variant: string,
  timeControl: TimeControl
): void {
  const [white, black] =
    Math.random() < 0.5 ? [playerA, playerB] : [playerB, playerA];
  createRoom(white, black, variant, timeControl);
}

function handleCreateChallenge(
  ws: BunWS,
  msg: { variant?: string; timeControl?: TimeControl; color?: CreatorColor }
): void {
  const variant = msg.variant || 'standard';
  const timeControl: TimeControl = msg.timeControl || {
    mode: 'unlimited',
    minutes: 0,
    increment: 0
  };
  const creatorColor = msg.color || 'random';

  // Cancel any existing pending challenge from this socket
  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
  }

  const challengeId = crypto.randomUUID();
  ws.data.challengeId = challengeId;

  challenges.set(challengeId, {
    id: challengeId,
    creator: ws,
    variant,
    timeControl,
    creatorColor,
    createdAt: Date.now()
  });

  send(ws, { type: 'challenge_created', challengeId });
  console.log(
    `[challenge:${challengeId.slice(0, 8)}] Created — ${variant} (${creatorColor})`
  );
}

function handleJoinChallenge(ws: BunWS, msg: { challengeId?: string }): void {
  const challengeId = msg.challengeId;
  if (!challengeId) return;

  const challenge = challenges.get(challengeId);
  if (!challenge) {
    send(ws, { type: 'challenge_not_found' });
    return;
  }

  if (challenge.creator.data.id === ws.data.id) {
    send(ws, { type: 'error', message: "You can't join your own game link." });
    return;
  }

  challenges.delete(challengeId);
  challenge.creator.data.challengeId = undefined;

  let white: BunWS, black: BunWS;
  if (challenge.creatorColor === 'white') {
    [white, black] = [challenge.creator, ws];
  } else if (challenge.creatorColor === 'black') {
    [white, black] = [ws, challenge.creator];
  } else {
    [white, black] =
      Math.random() < 0.5 ? [challenge.creator, ws] : [ws, challenge.creator];
  }

  createRoom(white, black, challenge.variant, challenge.timeControl);
  console.log(
    `[challenge:${challengeId.slice(0, 8)}] Joined by ${ws.data.id.slice(0, 8)}`
  );
}

function handleCancelChallenge(ws: BunWS): void {
  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    ws.data.challengeId = undefined;
  }
}

function handleLeaveQueue(ws: BunWS): void {
  removeFromQueues(ws);
  send(ws, { type: 'queue_left' });
}

function handleMove(
  ws: BunWS,
  msg: { from?: string; to?: string; promotion?: string }
): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (!isInRoom(room, ws)) return;

  const from = msg.from;
  const to = msg.to;
  if (!from || !to) return;

  room.moves.push(`${from}${to}${msg.promotion || ''}`);
  send(getOpponent(room, ws), {
    type: 'opponent_move',
    from,
    to,
    promotion: msg.promotion
  });
}

function handleResign(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;

  room.status = 'ended';
  const isWhite = room.white.data.id === ws.data.id;
  const winner = isWhite ? 'Black' : 'White';

  const payload = {
    type: 'game_over',
    result: `${winner} wins by resignation`,
    reason: 'resign',
    winner: winner.toLowerCase()
  };
  send(room.white, payload);
  send(room.black, payload);

  console.log(
    `[room:${roomId.slice(0, 8)}] ${isWhite ? 'White' : 'Black'} resigned`
  );
}

function handleOfferDraw(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;

  room.drawOfferedBy = ws.data.color ?? null;
  send(getOpponent(room, ws), { type: 'draw_offered' });
}

function handleAcceptDraw(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended' || !room.drawOfferedBy) return;

  // Can't accept your own offer
  if (room.drawOfferedBy === ws.data.color) return;

  room.status = 'ended';
  const payload = {
    type: 'game_over',
    result: 'Draw by agreement',
    reason: 'draw_agreement'
  };
  send(room.white, payload);
  send(room.black, payload);

  console.log(`[room:${roomId.slice(0, 8)}] Draw agreed`);
}

function handleAbort(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;

  room.status = 'ended';
  const payload = {
    type: 'game_over',
    result: 'Game Aborted',
    reason: 'abort'
  };
  send(room.white, payload);
  send(room.black, payload);

  console.log(`[room:${roomId.slice(0, 8)}] Game aborted`);
}

function handleDeclineDraw(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;

  room.drawOfferedBy = null;
  send(getOpponent(room, ws), { type: 'draw_declined' });
}

function handleGameOverNotify(
  ws: BunWS,
  msg: { result?: string; reason?: string }
): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;

  room.status = 'ended';
  send(getOpponent(room, ws), {
    type: 'game_over',
    result: msg.result || 'Game over',
    reason: msg.reason || 'unknown'
  });

  console.log(
    `[room:${roomId.slice(0, 8)}] Game over — ${msg.result} (${msg.reason})`
  );
}

function handleRejoinRoom(
  ws: BunWS,
  msg: { roomId?: string; playerId?: string }
): void {
  const { roomId, playerId } = msg;
  if (!roomId || !playerId) return;

  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') {
    send(ws, { type: 'rejoin_failed', reason: 'game_over' });
    return;
  }

  const isWhite = room.white.data.id === playerId;
  const isBlack = room.black.data.id === playerId;
  if (!isWhite && !isBlack) {
    send(ws, { type: 'rejoin_failed', reason: 'not_in_room' });
    return;
  }

  // Cancel the abandon timer
  const timer = reconnectTimeouts.get(playerId);
  if (timer) {
    clearTimeout(timer);
    reconnectTimeouts.delete(playerId);
  }

  // Update socket reference and data
  const color: Color = isWhite ? 'white' : 'black';
  ws.data.color = color;
  ws.data.roomId = roomId;
  if (isWhite) room.white = ws;
  else room.black = ws;

  // Notify opponent
  const opponent = isWhite ? room.black : room.white;
  send(opponent, { type: 'opponent_reconnected' });

  // Send full game state to rejoining player
  send(ws, {
    type: 'rejoined',
    roomId,
    color,
    variant: room.variant,
    timeControl: room.timeControl,
    startingFen: room.startingFen,
    moves: room.moves
  });

  console.log(`[room:${roomId.slice(0, 8)}] ${color} rejoined`);
}

function handleDisconnect(ws: BunWS): void {
  removeFromQueues(ws);

  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    ws.data.challengeId = undefined;
  }

  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room && room.status === 'active') {
      send(getOpponent(room, ws), { type: 'opponent_disconnected' });

      // Start 60-second reconnect window before awarding abandon win
      const playerId = ws.data.id;
      const roomId = ws.data.roomId;
      const color = ws.data.color;
      const timeout = setTimeout(() => {
        reconnectTimeouts.delete(playerId);
        const r = rooms.get(roomId);
        if (r && r.status === 'active') {
          r.status = 'ended';
          const isWhite = color === 'white';
          const winner = isWhite ? 'Black' : 'White';
          const remaining = isWhite ? r.black : r.white;
          send(remaining, {
            type: 'game_over',
            result: `${winner} wins — opponent abandoned`,
            reason: 'abandoned'
          });
          console.log(
            `[room:${roomId.slice(0, 8)}] ${color} abandoned — ${winner} wins`
          );
        }
      }, 60_000);
      reconnectTimeouts.set(playerId, timeout);
    }
  }

  console.log(`[player:${ws.data.id.slice(0, 8)}] Disconnected`);
}

// ─── Bun server ───────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '8080', 10);

Bun.serve<SocketData>({
  port: PORT,

  fetch(req, server) {
    const id = crypto.randomUUID();
    const upgraded = server.upgrade(req, { data: { id } });
    if (upgraded) return undefined;
    return new Response('Zugklang WebSocket Server', { status: 200 });
  },

  websocket: {
    open(ws: BunWS) {
      console.log(`[player:${ws.data.id.slice(0, 8)}] Connected`);
      send(ws, { type: 'connected', playerId: ws.data.id });
    },

    message(ws: BunWS, raw: string | Buffer) {
      try {
        const msg = JSON.parse(raw.toString()) as {
          type: string;
          [key: string]: unknown;
        };

        switch (msg.type) {
          case 'join_queue':
            handleJoinQueue(
              ws,
              msg as { variant?: string; timeControl?: TimeControl }
            );
            break;
          case 'leave_queue':
            handleLeaveQueue(ws);
            break;
          case 'move':
            handleMove(
              ws,
              msg as { from?: string; to?: string; promotion?: string }
            );
            break;
          case 'abort':
            handleAbort(ws);
            break;
          case 'resign':
            handleResign(ws);
            break;
          case 'offer_draw':
            handleOfferDraw(ws);
            break;
          case 'accept_draw':
            handleAcceptDraw(ws);
            break;
          case 'decline_draw':
            handleDeclineDraw(ws);
            break;
          case 'game_over_notify':
            handleGameOverNotify(
              ws,
              msg as { result?: string; reason?: string }
            );
            break;
          case 'rejoin_room':
            handleRejoinRoom(ws, msg as { roomId?: string; playerId?: string });
            break;
          case 'create_challenge':
            handleCreateChallenge(
              ws,
              msg as {
                variant?: string;
                timeControl?: TimeControl;
                color?: CreatorColor;
              }
            );
            break;
          case 'join_challenge':
            handleJoinChallenge(ws, msg as { challengeId?: string });
            break;
          case 'cancel_challenge':
            handleCancelChallenge(ws);
            break;
          case 'ping':
            send(ws, { type: 'pong' });
            break;
        }
      } catch {
        // ignore malformed messages
      }
    },

    close(ws: BunWS) {
      handleDisconnect(ws);
    }
  }
});

console.log(`Zugklang WebSocket server listening on port ${PORT}`);

// Clean up stale ended rooms and expired challenges every 5 minutes
setInterval(
  () => {
    const threshold = Date.now() - 30 * 60 * 1000;
    for (const [id, room] of rooms) {
      if (room.status === 'ended' && room.createdAt < threshold) {
        rooms.delete(id);
      }
    }
    // Challenges expire after 30 minutes unclaimed
    for (const [id, challenge] of challenges) {
      if (challenge.createdAt < threshold) {
        challenges.delete(id);
      }
    }
  },
  5 * 60 * 1000
);
