import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  broadcastClock,
  projectClock,
  roomHasClock,
  settleActiveClock,
  startRoomClock,
  stopRoomClock
} from '../utils/clock';
import {
  resetInMemoryState,
  asBunWs,
  createMockWs,
  createTestRoom
} from './helpers';

function makeTimed(minutes = 3) {
  const white = createMockWs('w');
  const black = createMockWs('b');
  const room = createTestRoom({
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    white: asBunWs(white),
    black: asBunWs(black),
    timeControl: { mode: 'timed', minutes, increment: 0 }
  });
  return { white, black, room };
}

function makeUnlimited() {
  const white = createMockWs('w');
  const black = createMockWs('b');
  const room = createTestRoom({
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    white: asBunWs(white),
    black: asBunWs(black),
    timeControl: { mode: 'unlimited', minutes: 0, increment: 0 }
  });
  return { white, black, room };
}

describe('clock utilities', () => {
  beforeEach(() => resetInMemoryState());
  afterEach(() => resetInMemoryState());

  // ── roomHasClock ────────────────────────────────────────────────────────────
  describe('roomHasClock', () => {
    test('returns true for a timed room', () => {
      const { room } = makeTimed();
      expect(roomHasClock(room)).toBe(true);
    });

    test('returns false for an unlimited room', () => {
      const { room } = makeUnlimited();
      expect(roomHasClock(room)).toBe(false);
    });

    test('returns false when activeClock is null', () => {
      const { room } = makeTimed();
      room.activeClock = null;
      expect(roomHasClock(room)).toBe(false);
    });

    test('returns false when clockLastUpdatedAt is null', () => {
      const { room } = makeTimed();
      room.clockLastUpdatedAt = null;
      expect(roomHasClock(room)).toBe(false);
    });

    test('returns false when whiteTimeMs is null', () => {
      const { room } = makeTimed();
      room.whiteTimeMs = null;
      expect(roomHasClock(room)).toBe(false);
    });

    test('returns false when blackTimeMs is null', () => {
      const { room } = makeTimed();
      room.blackTimeMs = null;
      expect(roomHasClock(room)).toBe(false);
    });
  });

  // ── settleActiveClock ───────────────────────────────────────────────────────
  describe('settleActiveClock', () => {
    test('deducts elapsed time from white when white clock is active', () => {
      const { room } = makeTimed(3);
      room.activeClock = 'white';
      const start = Date.now();
      room.clockLastUpdatedAt = start;
      room.whiteTimeMs = 10000;

      settleActiveClock(room, start + 2000);

      expect(room.whiteTimeMs).toBe(8000);
      expect(room.blackTimeMs).toBe(3 * 60 * 1000); // unchanged
      expect(room.clockLastUpdatedAt).toBe(start + 2000);
    });

    test('deducts elapsed time from black when black clock is active', () => {
      const { room } = makeTimed(3);
      room.activeClock = 'black';
      const start = Date.now();
      room.clockLastUpdatedAt = start;
      room.blackTimeMs = 5000;

      settleActiveClock(room, start + 1500);

      expect(room.blackTimeMs).toBe(3500);
      expect(room.whiteTimeMs).toBe(3 * 60 * 1000); // unchanged
    });

    test('clamps time to 0 and does not go negative', () => {
      const { room } = makeTimed(1);
      room.activeClock = 'white';
      const start = Date.now();
      room.clockLastUpdatedAt = start;
      room.whiteTimeMs = 500;

      settleActiveClock(room, start + 5000);

      expect(room.whiteTimeMs).toBe(0);
    });

    test('updates clockLastUpdatedAt to the provided now value', () => {
      const { room } = makeTimed();
      const now = Date.now() + 99999;
      room.clockLastUpdatedAt = now - 1000;
      settleActiveClock(room, now);
      expect(room.clockLastUpdatedAt).toBe(now);
    });

    test('does nothing on an unlimited room', () => {
      const { room } = makeUnlimited();
      const before = { white: room.whiteTimeMs, black: room.blackTimeMs };
      settleActiveClock(room, Date.now() + 5000);
      expect(room.whiteTimeMs).toBe(before.white);
      expect(room.blackTimeMs).toBe(before.black);
    });
  });

  // ── projectClock ────────────────────────────────────────────────────────────
  describe('projectClock', () => {
    test('projects white time without mutating the room', () => {
      const { room } = makeTimed(3);
      room.activeClock = 'white';
      const start = Date.now();
      room.clockLastUpdatedAt = start;
      room.whiteTimeMs = 10000;

      const snapshot = projectClock(room, start + 3000);

      expect(snapshot.whiteTimeMs).toBe(7000);
      expect(snapshot.blackTimeMs).toBe(3 * 60 * 1000);
      // room itself must NOT be mutated
      expect(room.whiteTimeMs).toBe(10000);
      expect(room.clockLastUpdatedAt).toBe(start);
    });

    test('projects black time correctly', () => {
      const { room } = makeTimed();
      room.activeClock = 'black';
      const start = Date.now();
      room.clockLastUpdatedAt = start;
      room.blackTimeMs = 8000;

      const snapshot = projectClock(room, start + 2000);

      expect(snapshot.blackTimeMs).toBe(6000);
    });

    test('clamps projected time to 0', () => {
      const { room } = makeTimed(1);
      room.activeClock = 'white';
      const start = Date.now();
      room.clockLastUpdatedAt = start;
      room.whiteTimeMs = 100;

      const snapshot = projectClock(room, start + 10000);

      expect(snapshot.whiteTimeMs).toBe(0);
    });

    test('returns null times for unlimited room', () => {
      const { room } = makeUnlimited();
      const snapshot = projectClock(room);
      expect(snapshot.whiteTimeMs).toBeNull();
      expect(snapshot.blackTimeMs).toBeNull();
      expect(snapshot.activeClock).toBeNull();
    });

    test('returns activeClock from the room', () => {
      const { room } = makeTimed();
      room.activeClock = 'black';
      const snapshot = projectClock(room, Date.now());
      expect(snapshot.activeClock).toBe('black');
    });
  });

  // ── stopRoomClock ────────────────────────────────────────────────────────────
  describe('stopRoomClock', () => {
    test('clears an active interval and sets clockInterval to null', () => {
      const { room } = makeTimed();
      room.clockInterval = setInterval(() => void 0, 10000);
      expect(room.clockInterval).not.toBeNull();

      stopRoomClock(room);

      expect(room.clockInterval).toBeNull();
    });

    test('is safe to call when no interval is set', () => {
      const { room } = makeTimed();
      room.clockInterval = null;
      expect(() => stopRoomClock(room)).not.toThrow();
    });
  });

  // ── broadcastClock ──────────────────────────────────────────────────────────
  describe('broadcastClock', () => {
    test('sends clock_sync to both white and black', () => {
      const { white, black, room } = makeTimed(5);
      room.activeClock = 'white';
      room.whiteTimeMs = 30000;
      room.blackTimeMs = 30000;
      room.clockLastUpdatedAt = Date.now();

      broadcastClock(room);

      const findSync = (sent: unknown[]) =>
        sent.find((m) => (m as { type?: string }).type === 'clock_sync') as
          | {
              type: string;
              whiteTimeMs: number;
              blackTimeMs: number;
              activeClock: string;
            }
          | undefined;

      const wMsg = findSync(white.sent);
      const bMsg = findSync(black.sent);
      expect(wMsg).toBeDefined();
      expect(bMsg).toBeDefined();
      expect(wMsg?.activeClock).toBe('white');
    });

    test('broadcast includes serverNow timestamp', () => {
      const { white, room } = makeTimed();
      room.clockLastUpdatedAt = Date.now();
      broadcastClock(room);
      const msg = white.sent.find(
        (m) => (m as { type?: string }).type === 'clock_sync'
      ) as { serverNow?: number } | undefined;
      expect(typeof msg?.serverNow).toBe('number');
    });
  });

  // ── startRoomClock ──────────────────────────────────────────────────────────
  describe('startRoomClock', () => {
    test('does nothing on an unlimited room', () => {
      const { room } = makeUnlimited();
      startRoomClock(room, () => void 0);
      expect(room.clockInterval).toBeNull();
    });

    test('sets clockInterval on a timed room', () => {
      const { room } = makeTimed();
      startRoomClock(room, () => void 0);
      expect(room.clockInterval).not.toBeNull();
      stopRoomClock(room);
    });

    test('fires onTimeout with correct color when white time expires', async () => {
      const { room } = makeTimed();
      room.activeClock = 'white';
      room.whiteTimeMs = 1; // 1ms — will expire after the first tick
      room.clockLastUpdatedAt = Date.now() - 2000; // already overdue

      const result = await new Promise<string>((resolve) => {
        startRoomClock(room, (color) => {
          stopRoomClock(room);
          resolve(color);
        });
      });

      expect(result).toBe('white');
    });

    test('fires onTimeout with correct color when black time expires', async () => {
      const { room } = makeTimed();
      room.activeClock = 'black';
      room.blackTimeMs = 1;
      room.clockLastUpdatedAt = Date.now() - 2000;

      const result = await new Promise<string>((resolve) => {
        startRoomClock(room, (color) => {
          stopRoomClock(room);
          resolve(color);
        });
      });

      expect(result).toBe('black');
    });

    test('stops itself when room status becomes ended', async () => {
      const { room } = makeTimed(60);
      room.activeClock = 'white';
      room.whiteTimeMs = 3600000;
      room.clockLastUpdatedAt = Date.now();

      let timeoutFired = false;
      startRoomClock(room, () => {
        timeoutFired = true;
      });

      room.status = 'ended';
      await Bun.sleep(1100);

      expect(room.clockInterval).toBeNull();
      expect(timeoutFired).toBe(false);
    });
  });
});
