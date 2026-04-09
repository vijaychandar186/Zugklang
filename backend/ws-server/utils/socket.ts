import type { BunWS, Room } from '../types';
import { redis } from '../redis';

export function send(ws: BunWS, msg: object): void {
  try {
    ws.send(JSON.stringify(msg));
  } catch {
    void 0;
  }
}

export async function removeFromQueues(ws: BunWS): Promise<void> {
  const userId = ws.data.userId;
  const queueKey = ws.data.queueKey;
  if (userId && queueKey) {
    await Promise.all([
      redis.zrem(queueKey, userId),
      redis.del(`queue:player:${userId}`)
    ]);
    delete ws.data.queueKey;
  }
}

export function getOpponent(room: Room, ws: BunWS): BunWS {
  return room.whiteSessionId === ws.data.id ? room.black : room.white;
}

export function isInRoom(room: Room, ws: BunWS): boolean {
  if (ws.data.userId) {
    return (
      room.whiteUserId === ws.data.userId || room.blackUserId === ws.data.userId
    );
  }
  return (
    room.whiteSessionId === ws.data.id || room.blackSessionId === ws.data.id
  );
}
