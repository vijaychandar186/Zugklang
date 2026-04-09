import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { handleSyncDice, handleSyncCard } from '../handlers/sync';
import { rooms } from '../state';
import {
  asBunWs,
  createMockWs,
  createTestRoom,
  resetInMemoryState
} from './helpers';

const ROOM_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

function findMessage<T extends { type: string }>(
  messages: unknown[],
  type: T['type']
): T | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i] as { type?: string };
    if (m.type === type) return m as T;
  }
  return undefined;
}

describe('sync handler integration', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    resetInMemoryState();
  });

  function setupRoom() {
    const white = createMockWs('white-id');
    const black = createMockWs('black-id');
    white.data.color = 'white';
    black.data.color = 'black';
    white.data.roomId = ROOM_ID;
    black.data.roomId = ROOM_ID;
    const room = createTestRoom({
      id: ROOM_ID,
      white: asBunWs(white),
      black: asBunWs(black)
    });
    rooms.set(room.id, room);
    return { white, black, room };
  }

  // ── sync_dice ──────────────────────────────────────────────────────────────
  describe('handleSyncDice', () => {
    test('relays dice pieces to opponent when room is active', () => {
      const { white, black } = setupRoom();
      handleSyncDice(asBunWs(white), {
        roomId: ROOM_ID,
        pieces: ['k', 'q', 'n']
      });
      const msg = findMessage<{ type: 'dice_synced'; pieces: string[] }>(
        black.sent,
        'dice_synced'
      );
      expect(msg).toBeDefined();
      expect(msg?.pieces).toEqual(['k', 'q', 'n']);
    });

    test('relays dice pieces from black to white', () => {
      const { white, black } = setupRoom();
      handleSyncDice(asBunWs(black), {
        roomId: ROOM_ID,
        pieces: ['r', 'b', 'p']
      });
      const msg = findMessage<{ type: 'dice_synced'; pieces: string[] }>(
        white.sent,
        'dice_synced'
      );
      expect(msg).toBeDefined();
      expect(msg?.pieces).toEqual(['r', 'b', 'p']);
    });

    test('does not relay to sender', () => {
      const { white } = setupRoom();
      handleSyncDice(asBunWs(white), {
        roomId: ROOM_ID,
        pieces: ['k', 'q', 'n']
      });
      const selfMsg = findMessage<{ type: 'dice_synced' }>(
        white.sent,
        'dice_synced'
      );
      expect(selfMsg).toBeUndefined();
    });

    test('ignores sync when room does not exist', () => {
      const { white, black } = setupRoom();
      handleSyncDice(asBunWs(white), {
        roomId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        pieces: ['k', 'q', 'n']
      });
      expect(
        findMessage<{ type: 'dice_synced' }>(black.sent, 'dice_synced')
      ).toBeUndefined();
    });

    test('ignores sync when room has ended', () => {
      const { white, black, room } = setupRoom();
      room.status = 'ended';
      handleSyncDice(asBunWs(white), {
        roomId: ROOM_ID,
        pieces: ['k', 'q', 'n']
      });
      expect(
        findMessage<{ type: 'dice_synced' }>(black.sent, 'dice_synced')
      ).toBeUndefined();
    });

    test('relays all valid piece types', () => {
      const pieces = ['k', 'q', 'b', 'n', 'r', 'p'] as const;
      for (const piece of pieces) {
        resetInMemoryState();
        const { white, black } = setupRoom();
        handleSyncDice(asBunWs(white), {
          roomId: ROOM_ID,
          pieces: [piece, piece, piece]
        });
        const msg = findMessage<{ type: 'dice_synced'; pieces: string[] }>(
          black.sent,
          'dice_synced'
        );
        expect(msg?.pieces).toEqual([piece, piece, piece]);
      }
    });
  });

  // ── sync_card ──────────────────────────────────────────────────────────────
  describe('handleSyncCard', () => {
    test('relays card rank and suit to opponent when room is active', () => {
      const { white, black } = setupRoom();
      handleSyncCard(asBunWs(white), {
        roomId: ROOM_ID,
        rank: 'A',
        suit: 'S'
      });
      const msg = findMessage<{
        type: 'card_synced';
        rank: string;
        suit: string;
      }>(black.sent, 'card_synced');
      expect(msg).toBeDefined();
      expect(msg?.rank).toBe('A');
      expect(msg?.suit).toBe('S');
    });

    test('relays card from black to white', () => {
      const { white, black } = setupRoom();
      handleSyncCard(asBunWs(black), {
        roomId: ROOM_ID,
        rank: '10',
        suit: 'H'
      });
      const msg = findMessage<{
        type: 'card_synced';
        rank: string;
        suit: string;
      }>(white.sent, 'card_synced');
      expect(msg).toBeDefined();
      expect(msg?.rank).toBe('10');
      expect(msg?.suit).toBe('H');
    });

    test('does not relay card to sender', () => {
      const { white } = setupRoom();
      handleSyncCard(asBunWs(white), {
        roomId: ROOM_ID,
        rank: 'K',
        suit: 'D'
      });
      expect(
        findMessage<{ type: 'card_synced' }>(white.sent, 'card_synced')
      ).toBeUndefined();
    });

    test('ignores sync when room does not exist', () => {
      const { black } = setupRoom();
      handleSyncCard(asBunWs(black), {
        roomId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        rank: 'A',
        suit: 'S'
      });
      expect(
        findMessage<{ type: 'card_synced' }>(black.sent, 'card_synced')
      ).toBeUndefined();
    });

    test('ignores sync when room has ended', () => {
      const { white, black, room } = setupRoom();
      room.status = 'ended';
      handleSyncCard(asBunWs(white), {
        roomId: ROOM_ID,
        rank: 'J',
        suit: 'C'
      });
      expect(
        findMessage<{ type: 'card_synced' }>(black.sent, 'card_synced')
      ).toBeUndefined();
    });

    test('relays all suits correctly', () => {
      for (const suit of ['H', 'D', 'C', 'S'] as const) {
        resetInMemoryState();
        const { white, black } = setupRoom();
        handleSyncCard(asBunWs(white), { roomId: ROOM_ID, rank: 'A', suit });
        const msg = findMessage<{ type: 'card_synced'; suit: string }>(
          black.sent,
          'card_synced'
        );
        expect(msg?.suit).toBe(suit);
      }
    });

    test('relays all ranks correctly', () => {
      const ranks = [
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
        'A'
      ] as const;
      for (const rank of ranks) {
        resetInMemoryState();
        const { white, black } = setupRoom();
        handleSyncCard(asBunWs(white), { roomId: ROOM_ID, rank, suit: 'S' });
        const msg = findMessage<{ type: 'card_synced'; rank: string }>(
          black.sent,
          'card_synced'
        );
        expect(msg?.rank).toBe(rank);
      }
    });
  });
});
