import { describe, expect, test } from 'bun:test';
import { ClientMessageSchema } from '../utils/schemas';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_TC = { mode: 'timed', minutes: 3, increment: 0 };

describe('client message schema', () => {
  // ── existing tests ──────────────────────────────────────────────────────────
  test('accepts valid join_queue message', () => {
    const result = ClientMessageSchema.safeParse({
      type: 'join_queue',
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 3, increment: 0 },
      displayName: 'Alice',
      userImage: null
    });
    expect(result.success).toBe(true);
  });

  test('rejects invalid move square', () => {
    const result = ClientMessageSchema.safeParse({
      type: 'move',
      roomId: VALID_UUID,
      from: 'z9',
      to: 'e4'
    });
    expect(result.success).toBe(false);
  });

  test('rejects invalid latency range', () => {
    const result = ClientMessageSchema.safeParse({
      type: 'latency_update',
      latencyMs: 50000
    });
    expect(result.success).toBe(false);
  });

  // ── join_queue ──────────────────────────────────────────────────────────────
  test('accepts join_queue without optional fields', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'join_queue',
        variant: 'atomic',
        timeControl: VALID_TC
      }).success
    ).toBe(true);
  });

  test('rejects join_queue with empty variant', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'join_queue',
        variant: '',
        timeControl: VALID_TC
      }).success
    ).toBe(false);
  });

  test('rejects join_queue with minutes > 180', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'join_queue',
        variant: 'standard',
        timeControl: { mode: 'timed', minutes: 181, increment: 0 }
      }).success
    ).toBe(false);
  });

  // ── move ────────────────────────────────────────────────────────────────────
  test('accepts valid move with promotion', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'move',
        roomId: VALID_UUID,
        from: 'e7',
        to: 'e8',
        promotion: 'q'
      }).success
    ).toBe(true);
  });

  test('rejects move with invalid promotion piece', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'move',
        roomId: VALID_UUID,
        from: 'e7',
        to: 'e8',
        promotion: 'k'
      }).success
    ).toBe(false);
  });

  test('rejects move with non-UUID roomId', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'move',
        roomId: 'not-a-uuid',
        from: 'e2',
        to: 'e4'
      }).success
    ).toBe(false);
  });

  // ── create_challenge ────────────────────────────────────────────────────────
  test('accepts create_challenge with color white', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'create_challenge',
        variant: 'standard',
        timeControl: VALID_TC,
        color: 'white'
      }).success
    ).toBe(true);
  });

  test('rejects create_challenge with invalid color', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'create_challenge',
        variant: 'standard',
        timeControl: VALID_TC,
        color: 'blue'
      }).success
    ).toBe(false);
  });

  // ── latency_update ──────────────────────────────────────────────────────────
  test('accepts latency_update at max boundary (30000)', () => {
    expect(
      ClientMessageSchema.safeParse({
        type: 'latency_update',
        latencyMs: 30000
      }).success
    ).toBe(true);
  });

  test('rejects latency_update below 0', () => {
    expect(
      ClientMessageSchema.safeParse({ type: 'latency_update', latencyMs: -1 })
        .success
    ).toBe(false);
  });

  // ── sync_dice ───────────────────────────────────────────────────────────────
  describe('sync_dice', () => {
    test('accepts valid sync_dice with all piece types', () => {
      for (const piece of ['k', 'q', 'b', 'n', 'r', 'p'] as const) {
        expect(
          ClientMessageSchema.safeParse({
            type: 'sync_dice',
            roomId: VALID_UUID,
            pieces: [piece, 'q', 'n']
          }).success
        ).toBe(true);
      }
    });

    test('rejects sync_dice with invalid piece type', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_dice',
          roomId: VALID_UUID,
          pieces: ['k', 'q', 'x']
        }).success
      ).toBe(false);
    });

    test('rejects sync_dice with fewer than 3 pieces', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_dice',
          roomId: VALID_UUID,
          pieces: ['k', 'q']
        }).success
      ).toBe(false);
    });

    test('rejects sync_dice with more than 3 pieces', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_dice',
          roomId: VALID_UUID,
          pieces: ['k', 'q', 'n', 'r']
        }).success
      ).toBe(false);
    });

    test('rejects sync_dice with non-UUID roomId', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_dice',
          roomId: 'bad-room-id',
          pieces: ['k', 'q', 'n']
        }).success
      ).toBe(false);
    });

    test('rejects sync_dice without roomId', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_dice',
          pieces: ['k', 'q', 'n']
        }).success
      ).toBe(false);
    });
  });

  // ── sync_card ───────────────────────────────────────────────────────────────
  describe('sync_card', () => {
    test('accepts valid sync_card for each suit', () => {
      for (const suit of ['H', 'D', 'C', 'S'] as const) {
        expect(
          ClientMessageSchema.safeParse({
            type: 'sync_card',
            roomId: VALID_UUID,
            rank: 'A',
            suit
          }).success
        ).toBe(true);
      }
    });

    test('accepts valid sync_card for each rank', () => {
      for (const rank of [
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
      ] as const) {
        expect(
          ClientMessageSchema.safeParse({
            type: 'sync_card',
            roomId: VALID_UUID,
            rank,
            suit: 'S'
          }).success
        ).toBe(true);
      }
    });

    test('rejects sync_card with invalid rank', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_card',
          roomId: VALID_UUID,
          rank: '1',
          suit: 'S'
        }).success
      ).toBe(false);
    });

    test('rejects sync_card with invalid suit', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_card',
          roomId: VALID_UUID,
          rank: 'A',
          suit: 'X'
        }).success
      ).toBe(false);
    });

    test('rejects sync_card with non-UUID roomId', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_card',
          roomId: 'not-a-uuid',
          rank: 'K',
          suit: 'H'
        }).success
      ).toBe(false);
    });

    test('rejects sync_card without suit', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_card',
          roomId: VALID_UUID,
          rank: 'A'
        }).success
      ).toBe(false);
    });

    test('rejects sync_card without rank', () => {
      expect(
        ClientMessageSchema.safeParse({
          type: 'sync_card',
          roomId: VALID_UUID,
          suit: 'H'
        }).success
      ).toBe(false);
    });
  });

  // ── ping / simple messages ──────────────────────────────────────────────────
  test('accepts ping', () => {
    expect(ClientMessageSchema.safeParse({ type: 'ping' }).success).toBe(true);
  });

  test('accepts leave_queue', () => {
    expect(ClientMessageSchema.safeParse({ type: 'leave_queue' }).success).toBe(
      true
    );
  });

  test('rejects unknown message type', () => {
    expect(
      ClientMessageSchema.safeParse({ type: 'unknown_type' }).success
    ).toBe(false);
  });

  test('rejects completely empty object', () => {
    expect(ClientMessageSchema.safeParse({}).success).toBe(false);
  });
});
