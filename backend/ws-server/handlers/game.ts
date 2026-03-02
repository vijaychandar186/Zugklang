import type { BunWS, Room } from '../types';
import { rooms, revokeRoomTokens } from '../state';
import { send, isInRoom } from '../utils/socket';
import { sendToUser } from '../utils/routing';
import { applyMove } from '../utils/chess';
import {
  broadcastClock,
  projectClock,
  settleActiveClock,
  stopRoomClock
} from '../utils/clock';
import { logger } from '../utils/logger';
import { createRoom, persistRoom } from './queue';
import {
  antiCheatQueue,
  gameRecordQueue,
  cancelAbortCheck,
  rescheduleAbortCheck
} from '../bullmq/queues';

function bothPlayersMovedAtLeastOnce(moves: string[]): boolean {
  return moves.length >= 2;
}

async function sendToRoom(
  room: Room,
  color: 'white' | 'black',
  message: object
): Promise<void> {
  const userId = color === 'white' ? room.whiteUserId : room.blackUserId;
  if (userId) await sendToUser(userId, message);
}

async function broadcastToRoom(room: Room, message: object): Promise<void> {
  await Promise.all([
    sendToRoom(room, 'white', message),
    sendToRoom(room, 'black', message)
  ]);
}

export async function enqueueGameEnd(
  room: Room,
  result: 'white' | 'black' | 'draw',
  reason: string
): Promise<void> {
  const playedAt = new Date().toISOString();
  const jobId = `room:${room.id}`;

  const jobs: Promise<unknown>[] = [];

  if (
    (room.whiteUserId ?? room.blackUserId) &&
    room.moveTimesWhiteMs.length >= 2
  ) {
    jobs.push(
      antiCheatQueue().add(
        'game:anti-cheat',
        {
          game_id: room.id,
          variant: room.variant,
          time_control_minutes: room.timeControl.minutes,
          time_control_increment: room.timeControl.increment,
          moves: room.moves,
          move_times_white_ms: room.moveTimesWhiteMs,
          move_times_black_ms: room.moveTimesBlackMs,
          white_user_id: room.whiteUserId,
          black_user_id: room.blackUserId,
          white_rating: room.whiteRating,
          black_rating: room.blackRating,
          result,
          played_at: playedAt
        },
        { jobId: `anti-cheat:${jobId}` }
      )
    );
  }

  if ((room.whiteUserId ?? room.blackUserId) && reason !== 'abort') {
    jobs.push(
      gameRecordQueue().add(
        'game:record',
        {
          roomId: room.id,
          variant: room.variant,
          timeControl: room.timeControl,
          whiteUserId: room.whiteUserId,
          blackUserId: room.blackUserId,
          whiteDisplayName: room.whiteDisplayName,
          blackDisplayName: room.blackDisplayName,
          whiteRating: room.whiteRating,
          blackRating: room.blackRating,
          moves: room.moves,
          moveTimesWhiteMs: room.moveTimesWhiteMs,
          moveTimesBlackMs: room.moveTimesBlackMs,
          result,
          reason,
          playedAt
        },
        { jobId: `record:${jobId}` }
      )
    );
  }

  await Promise.all(jobs);
}

export async function handleMove(
  ws: BunWS,
  msg: {
    from: string;
    to: string;
    promotion?: string | undefined;
  }
): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (!isInRoom(room, ws)) return;
  if (room.position.turn !== ws.data.color) {
    send(ws, { type: 'error', message: 'Not your turn.' });
    return;
  }
  const movedColor = ws.data.color!;
  const { from, to, promotion } = msg;
  const legal = applyMove(room.position, from, to, promotion);
  if (!legal) {
    send(ws, { type: 'error', message: 'Illegal move.' });
    return;
  }
  const uci = `${from}${to}${promotion ?? ''}`;
  room.moves.push(uci);

  const now = Date.now();
  const moveStart = room.clockLastUpdatedAt ?? room.createdAt;
  const elapsedMs = Math.max(0, now - moveStart);
  if (movedColor === 'white') {
    room.moveTimesWhiteMs.push(elapsedMs);
  } else {
    room.moveTimesBlackMs.push(elapsedMs);
  }

  if (room.activeClock !== null) {
    settleActiveClock(room, now);
    const snapshot = projectClock(room);
    const timedOut =
      (snapshot.activeClock === 'white' && snapshot.whiteTimeMs === 0) ||
      (snapshot.activeClock === 'black' && snapshot.blackTimeMs === 0);
    if (timedOut) {
      room.status = 'ended';
      stopRoomClock(room);
      await revokeRoomTokens(room);
      const timedOutColor = snapshot.activeClock!;
      const winner = timedOutColor === 'white' ? 'Black' : 'White';
      const payload = {
        type: 'game_over',
        result: `${winner} wins on time`,
        reason: 'timeout',
        winner: winner.toLowerCase(),
        whiteUserId: room.whiteUserId,
        blackUserId: room.blackUserId
      };
      await enqueueGameEnd(
        room,
        winner.toLowerCase() as 'white' | 'black',
        'timeout'
      );
      await broadcastToRoom(room, payload);
      logger.info('game_timeout', {
        roomId: roomId.slice(0, 8),
        timedOutColor
      });
      return;
    }
  }

  const opponentColor = movedColor === 'white' ? 'black' : 'white';
  await sendToRoom(room, opponentColor, {
    type: 'opponent_move',
    from,
    to,
    promotion
  });
  const positionSync = { type: 'position_sync', moves: [...room.moves] };
  await broadcastToRoom(room, positionSync);

  if (room.activeClock !== null) {
    if (movedColor === 'white' && room.whiteTimeMs !== null) {
      room.whiteTimeMs += room.timeControl.increment * 1000;
    } else if (movedColor === 'black' && room.blackTimeMs !== null) {
      room.blackTimeMs += room.timeControl.increment * 1000;
    }
    room.activeClock = movedColor === 'white' ? 'black' : 'white';
    room.clockLastUpdatedAt = now;
    await broadcastClock(room);
  } else {
    room.clockLastUpdatedAt = now;
  }

  void persistRoom(room);

  if (room.moves.length === 1) {
    const abortNow = Date.now();
    room.abortTimerStartedAt = abortNow;
    await rescheduleAbortCheck(room.id, 2);
    await broadcastToRoom(room, { type: 'abort_window', startedAt: abortNow });
  } else if (room.moves.length === 2) {
    room.abortTimerStartedAt = null;
    await cancelAbortCheck(room.id);
  }
}

export async function handleResign(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  await cancelAbortCheck(roomId);
  room.status = 'ended';
  stopRoomClock(room);
  await revokeRoomTokens(room);
  const isWhite = room.whiteSessionId === ws.data.id;
  const winner = isWhite ? 'Black' : 'White';
  const payload = {
    type: 'game_over',
    result: `${winner} wins by resignation`,
    reason: 'resign',
    winner: winner.toLowerCase(),
    whiteUserId: room.whiteUserId,
    blackUserId: room.blackUserId
  };
  await enqueueGameEnd(
    room,
    winner.toLowerCase() as 'white' | 'black',
    'resign'
  );
  await broadcastToRoom(room, payload);
  logger.info('game_resign', {
    roomId: roomId.slice(0, 8),
    resignedColor: isWhite ? 'white' : 'black'
  });
}

export async function handleOfferDraw(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  room.drawOfferedBy = ws.data.color ?? null;
  const opponentColor = ws.data.color === 'white' ? 'black' : 'white';
  await sendToRoom(room, opponentColor, { type: 'draw_offered' });
}

export async function handleAcceptDraw(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended' || !room.drawOfferedBy) return;
  if (room.drawOfferedBy === ws.data.color) return;
  await cancelAbortCheck(roomId);
  room.status = 'ended';
  stopRoomClock(room);
  await revokeRoomTokens(room);
  const payload = {
    type: 'game_over',
    result: 'Draw by agreement',
    reason: 'draw_agreement',
    whiteUserId: room.whiteUserId,
    blackUserId: room.blackUserId
  };
  await enqueueGameEnd(room, 'draw', 'draw_agreement');
  await broadcastToRoom(room, payload);
  logger.info('game_draw', { roomId: roomId.slice(0, 8) });
}

export async function handleDeclineDraw(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;
  room.drawOfferedBy = null;
  const opponentColor = ws.data.color === 'white' ? 'black' : 'white';
  await sendToRoom(room, opponentColor, { type: 'draw_declined' });
}

export async function handleAbort(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (bothPlayersMovedAtLeastOnce(room.moves)) {
    await handleResign(ws);
    return;
  }
  await cancelAbortCheck(roomId);
  room.status = 'ended';
  stopRoomClock(room);
  await revokeRoomTokens(room);
  const payload = {
    type: 'game_over',
    result: 'Game Aborted',
    reason: 'abort',
    whiteUserId: room.whiteUserId,
    blackUserId: room.blackUserId
  };
  await broadcastToRoom(room, payload);
  logger.info('game_aborted', { roomId: roomId.slice(0, 8) });
}

export async function handleOfferRematch(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'ended') return;
  if (!isInRoom(room, ws)) return;
  const opponentUserId =
    ws.data.userId === room.whiteUserId ? room.blackUserId : room.whiteUserId;
  if (!opponentUserId) return;
  room.rematchOfferedBy = ws.data.id;
  await sendToUser(opponentUserId, { type: 'rematch_offered' });
}

export async function handleAcceptRematch(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'ended') return;
  if (!room.rematchOfferedBy || room.rematchOfferedBy === ws.data.id) return;
  const [newWhite, newBlack] =
    room.whiteSessionId === ws.data.id
      ? [room.white, room.black]
      : [room.black, room.white];
  await createRoom(newWhite, newBlack, room.variant, room.timeControl);
}

export async function handleDeclineRematch(ws: BunWS): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'ended') return;
  room.rematchOfferedBy = null;
  const opponentColor = ws.data.color === 'white' ? 'black' : 'white';
  await sendToRoom(room, opponentColor, { type: 'rematch_declined' });
}

export async function handleGameOverNotify(
  ws: BunWS,
  msg: {
    result: string;
    reason: string;
  }
): Promise<void> {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  await cancelAbortCheck(roomId);
  room.status = 'ended';
  stopRoomClock(room);
  await revokeRoomTokens(room);
  const gameOverPayload = {
    type: 'game_over',
    result: msg.result,
    reason: msg.reason,
    whiteUserId: room.whiteUserId,
    blackUserId: room.blackUserId
  };
  const resultLower = msg.result.toLowerCase();
  const winner: 'white' | 'black' | 'draw' =
    msg.result === '1-0' || resultLower.startsWith('white')
      ? 'white'
      : msg.result === '0-1' || resultLower.startsWith('black')
        ? 'black'
        : 'draw';
  await enqueueGameEnd(room, winner, msg.reason);
  await broadcastToRoom(room, gameOverPayload);
  logger.info('game_over', {
    roomId: roomId.slice(0, 8),
    result: msg.result,
    reason: msg.reason
  });
}
