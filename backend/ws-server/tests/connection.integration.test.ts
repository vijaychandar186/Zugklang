import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test
} from 'bun:test';
import { handleDisconnect, handleRejoinRoom } from '../handlers/connection';
import { issueRejoinToken, reconnectTimeouts, rooms } from '../state';
import { redis } from '../redis';
import {
  asBunWs,
  createMockWs,
  createTestRoom,
  resetInMemoryState
} from './helpers';
function findMessage<
  T extends {
    type: string;
  }
>(messages: unknown[], type: T['type']): T | undefined {
  return messages.find(
    (m) =>
      (
        m as {
          type?: string;
        }
      ).type === type
  ) as T | undefined;
}
describe('connection flow integration', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    jest.useRealTimers();
    resetInMemoryState();
  });
  test('rejoin succeeds with valid token and replaces room socket', async () => {
    const oldWhite = createMockWs('white-old', 'u-white');
    const black = createMockWs('black', 'u-black');
    oldWhite.data.color = 'white';
    oldWhite.data.roomId = '11111111-1111-1111-1111-111111111111';
    black.data.color = 'black';
    black.data.roomId = '11111111-1111-1111-1111-111111111111';
    const room = createTestRoom({
      id: '11111111-1111-1111-1111-111111111111',
      white: asBunWs(oldWhite),
      black: asBunWs(black)
    });
    room.moves = ['e2e4', 'e7e5'];
    room.blackLatencyMs = 42;
    rooms.set(room.id, room);
    // Issue a rejoin token via Redis-backed API (requires Redis in integration env)
    const token = await issueRejoinToken('white-old', room.id);
    const reconnecting = createMockWs('new-temp', 'u-white');
    await handleRejoinRoom(asBunWs(reconnecting), {
      roomId: room.id,
      rejoinToken: token
    });
    expect(reconnecting.data.id).toBe('white-old');
    expect(rooms.get(room.id)?.white.data.id).toBe('white-old');
    expect(
      findMessage<{
        type: 'opponent_reconnected';
      }>(black.sent, 'opponent_reconnected')
    ).toBeDefined();
    const rejoined = findMessage<{
      type: 'rejoined';
      moves: string[];
      opponentLatencyMs: number | null;
    }>(reconnecting.sent, 'rejoined');
    expect(rejoined?.moves).toEqual(['e2e4', 'e7e5']);
    expect(rejoined?.opponentLatencyMs).toBe(42);
  });
  test('rejoin fails when token is invalid', async () => {
    const ws = createMockWs('p1');
    await handleRejoinRoom(asBunWs(ws), {
      roomId: '11111111-1111-1111-1111-111111111111',
      rejoinToken: 'bbbb1111-1111-1111-1111-111111111111'
    });
    const failed = findMessage<{
      type: 'rejoin_failed';
      reason: string;
    }>(ws.sent, 'rejoin_failed');
    expect(failed?.reason).toBe('invalid_token');
  });
  test('rejoin fails with wrong_pod and includes pod url when available', async () => {
    const ws = createMockWs('p2', 'u-p2');
    await redis.set(
      'ws:rejoin:wrong-pod-token',
      JSON.stringify({
        playerId: 'p2',
        roomId: '11111111-1111-1111-1111-111111111111',
        podId: 'other-pod'
      })
    );
    await redis.set('pod:url:other-pod', 'wss://other.example/ws');

    await handleRejoinRoom(asBunWs(ws), {
      roomId: '11111111-1111-1111-1111-111111111111',
      rejoinToken: 'wrong-pod-token'
    });

    const failed = findMessage<{
      type: 'rejoin_failed';
      reason: string;
      wsPodUrl?: string;
    }>(ws.sent, 'rejoin_failed');
    expect(failed?.reason).toBe('wrong_pod');
    expect(failed?.wsPodUrl).toBe('wss://other.example/ws');
  });
  test('rejoin fails when room is already ended', async () => {
    const white = createMockWs('white-ended', 'u-white');
    const black = createMockWs('black-ended', 'u-black');
    const room = createTestRoom({
      id: '33333333-3333-3333-3333-333333333333',
      white: asBunWs(white),
      black: asBunWs(black),
      status: 'ended'
    });
    rooms.set(room.id, room);
    const token = await issueRejoinToken('white-ended', room.id);
    const reconnecting = createMockWs('new-ended', 'u-white');

    await handleRejoinRoom(asBunWs(reconnecting), {
      roomId: room.id,
      rejoinToken: token
    });

    const failed = findMessage<{
      type: 'rejoin_failed';
      reason: string;
    }>(reconnecting.sent, 'rejoin_failed');
    expect(failed?.reason).toBe('game_over');
  });
  test('rejoin fails when token player is not part of the room', async () => {
    const white = createMockWs('white-room', 'u-white');
    const black = createMockWs('black-room', 'u-black');
    const room = createTestRoom({
      id: '44444444-4444-4444-4444-444444444444',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    rooms.set(room.id, room);
    const token = await issueRejoinToken('outsider-player', room.id);
    const reconnecting = createMockWs('outsider-temp', 'u-outsider');

    await handleRejoinRoom(asBunWs(reconnecting), {
      roomId: room.id,
      rejoinToken: token
    });

    const failed = findMessage<{
      type: 'rejoin_failed';
      reason: string;
    }>(reconnecting.sent, 'rejoin_failed');
    expect(failed?.reason).toBe('not_in_room');
  });
  test('rejoin as black clears reconnect timeout and restores black socket', async () => {
    const white = createMockWs('white-stays', 'u-white');
    const oldBlack = createMockWs('black-old', 'u-black');
    white.data.color = 'white';
    white.data.roomId = '55555555-5555-5555-5555-555555555555';
    oldBlack.data.color = 'black';
    oldBlack.data.roomId = '55555555-5555-5555-5555-555555555555';
    const room = createTestRoom({
      id: '55555555-5555-5555-5555-555555555555',
      white: asBunWs(white),
      black: asBunWs(oldBlack)
    });
    room.whiteLatencyMs = 24;
    room.blackDisconnectedAt = Date.now() - 1000;
    rooms.set(room.id, room);
    const token = await issueRejoinToken('black-old', room.id);
    reconnectTimeouts.set(
      'black-old',
      setTimeout(() => {
        throw new Error('should have been cleared');
      }, 60_000)
    );
    const reconnecting = createMockWs('black-temp', 'u-black');

    await handleRejoinRoom(asBunWs(reconnecting), {
      roomId: room.id,
      rejoinToken: token
    });

    expect(reconnectTimeouts.has('black-old')).toBe(false);
    expect(rooms.get(room.id)?.black.data.id).toBe('black-old');
    expect(rooms.get(room.id)?.blackDisconnectedAt).toBeNull();
    const rejoined = findMessage<{
      type: 'rejoined';
      opponentLatencyMs: number | null;
    }>(reconnecting.sent, 'rejoined');
    expect(rejoined?.opponentLatencyMs).toBe(24);
    expect(
      findMessage<{ type: 'opponent_reconnected' }>(
        white.sent,
        'opponent_reconnected'
      )
    ).toBeDefined();
  });
  test('disconnect schedules abandonment and ends game when timer fires', async () => {
    jest.useFakeTimers();
    const white = createMockWs('white', 'u-white');
    const black = createMockWs('black', 'u-black');
    white.data.color = 'white';
    white.data.roomId = '22222222-2222-2222-2222-222222222222';
    black.data.color = 'black';
    black.data.roomId = '22222222-2222-2222-2222-222222222222';
    const room = createTestRoom({
      id: '22222222-2222-2222-2222-222222222222',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    rooms.set(room.id, room);
    await handleDisconnect(asBunWs(white));
    expect(reconnectTimeouts.size).toBe(1);
    jest.runAllTimers();
    expect(rooms.get(room.id)?.status).toBe('ended');
    expect(reconnectTimeouts.size).toBe(0);
    const blackDisconnected = findMessage<{
      type: 'opponent_disconnected';
    }>(black.sent, 'opponent_disconnected');
    const blackGameOver = findMessage<{
      type: 'game_over';
      reason: string;
    }>(black.sent, 'game_over');
    expect(blackDisconnected).toBeDefined();
    expect(blackGameOver?.reason).toBe('abandoned');
  });
});
