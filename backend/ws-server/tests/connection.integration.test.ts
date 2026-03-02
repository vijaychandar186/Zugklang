import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { handleDisconnect, handleRejoinRoom } from '../handlers/connection';
import { issueRejoinToken, reconnectTimeouts, rooms } from '../state';
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
  const originalSetTimeout = globalThis.setTimeout;
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    globalThis.setTimeout = originalSetTimeout;
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
  test('disconnect schedules abandonment and ends game when timer fires', async () => {
    globalThis.setTimeout = ((cb: unknown) => {
      if (typeof cb === 'function') cb();
      return 1 as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout;
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
    expect(rooms.get(room.id)?.status).toBe('ended');
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
