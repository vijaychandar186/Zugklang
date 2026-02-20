import { beforeEach, describe, expect, test } from 'bun:test';
import { queues } from '../state';
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

  test('removeFromQueues removes player from all queues', () => {
    const a = createMockWs('a');
    const b = createMockWs('b');
    const c = createMockWs('c');
    queues.set('q1', [asBunWs(a), asBunWs(b)]);
    queues.set('q2', [asBunWs(c), asBunWs(a)]);

    removeFromQueues(asBunWs(a));
    expect(queues.get('q1')?.map((p) => p.data.id)).toEqual(['b']);
    expect(queues.get('q2')?.map((p) => p.data.id)).toEqual(['c']);
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
