import type { Color, Room } from '../types';
import { send } from './socket';

function clampMs(ms: number): number {
  return Math.max(0, Math.floor(ms));
}

export function roomHasClock(room: Room): boolean {
  return (
    room.activeClock !== null &&
    room.clockLastUpdatedAt !== null &&
    room.whiteTimeMs !== null &&
    room.blackTimeMs !== null
  );
}

export function settleActiveClock(room: Room, now = Date.now()): void {
  if (!roomHasClock(room) || room.activeClock === null) return;
  const elapsed = Math.max(0, now - (room.clockLastUpdatedAt ?? now));
  if (room.activeClock === 'white' && room.whiteTimeMs !== null) {
    room.whiteTimeMs = clampMs(room.whiteTimeMs - elapsed);
  } else if (room.activeClock === 'black' && room.blackTimeMs !== null) {
    room.blackTimeMs = clampMs(room.blackTimeMs - elapsed);
  }
  room.clockLastUpdatedAt = now;
}

export function projectClock(
  room: Room,
  now = Date.now()
): {
  whiteTimeMs: number | null;
  blackTimeMs: number | null;
  activeClock: Color | null;
} {
  let whiteTimeMs = room.whiteTimeMs;
  let blackTimeMs = room.blackTimeMs;
  if (roomHasClock(room) && room.activeClock !== null) {
    const elapsed = Math.max(0, now - (room.clockLastUpdatedAt ?? now));
    if (room.activeClock === 'white' && whiteTimeMs !== null) {
      whiteTimeMs = clampMs(whiteTimeMs - elapsed);
    } else if (room.activeClock === 'black' && blackTimeMs !== null) {
      blackTimeMs = clampMs(blackTimeMs - elapsed);
    }
  }
  return { whiteTimeMs, blackTimeMs, activeClock: room.activeClock };
}

export function stopRoomClock(room: Room): void {
  if (room.clockInterval !== null) {
    clearInterval(room.clockInterval);
    room.clockInterval = null;
  }
}

export function broadcastClock(room: Room): void {
  const snapshot = projectClock(room);
  const payload = {
    type: 'clock_sync',
    whiteTimeMs: snapshot.whiteTimeMs,
    blackTimeMs: snapshot.blackTimeMs,
    activeClock: snapshot.activeClock,
    serverNow: Date.now()
  };
  send(room.white, payload);
  send(room.black, payload);
}

export function startRoomClock(
  room: Room,
  onTimeout: (timedOutColor: Color) => void
): void {
  if (!roomHasClock(room)) return;
  stopRoomClock(room);
  room.clockInterval = setInterval(() => {
    if (room.status !== 'active') {
      stopRoomClock(room);
      return;
    }
    const snapshot = projectClock(room);
    if (snapshot.activeClock === 'white' && snapshot.whiteTimeMs === 0) {
      settleActiveClock(room);
      onTimeout('white');
      return;
    }
    if (snapshot.activeClock === 'black' && snapshot.blackTimeMs === 0) {
      settleActiveClock(room);
      onTimeout('black');
      return;
    }
    broadcastClock(room);
  }, 1000);
}
