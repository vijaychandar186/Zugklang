import type { BunWS, Room } from '../types';
import { queues } from '../state';
export function send(ws: BunWS, msg: object): void {
  try {
    ws.send(JSON.stringify(msg));
  } catch {
    void 0;
  }
}
export function removeFromQueues(ws: BunWS): void {
  for (const queue of queues.values()) {
    const idx = queue.findIndex((w) => w.data.id === ws.data.id);
    if (idx !== -1) queue.splice(idx, 1);
  }
}
export function getOpponent(room: Room, ws: BunWS): BunWS {
  return room.white.data.id === ws.data.id ? room.black : room.white;
}
export function isInRoom(room: Room, ws: BunWS): boolean {
  return room.white.data.id === ws.data.id || room.black.data.id === ws.data.id;
}
