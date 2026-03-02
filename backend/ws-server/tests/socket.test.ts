import { beforeEach, describe, expect, test } from 'bun:test';
import { getOpponent, isInRoom, removeFromQueues, send } from '../utils/socket';
import {
  asBunWs,
  createMockWs,
  createTestRoom,
  resetInMemoryState
} from './helpers';
describe('socket utilities', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  test('send serializes payload as JSON', () => {
    const ws = createMockWs('p1');
    send(asBunWs(ws), { type: 'pong' });
    expect(ws.sent).toEqual([{ type: 'pong' }]);
  });
  test('removeFromQueues is a no-op for sockets without a queue key', async () => {
    const a = createMockWs('a');
    // Should complete without throwing even when there is no queueKey
    await removeFromQueues(asBunWs(a));
    expect(asBunWs(a).data.queueKey).toBeUndefined();
  });
  test('getOpponent and isInRoom resolve room participants', () => {
    const white = createMockWs('w');
    const black = createMockWs('b');
    const outsider = createMockWs('x');
    const room = createTestRoom({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    expect(getOpponent(room, asBunWs(white)).data.id).toBe('b');
    expect(getOpponent(room, asBunWs(black)).data.id).toBe('w');
    expect(isInRoom(room, asBunWs(white))).toBe(true);
    expect(isInRoom(room, asBunWs(black))).toBe(true);
    expect(isInRoom(room, asBunWs(outsider))).toBe(false);
  });
});
