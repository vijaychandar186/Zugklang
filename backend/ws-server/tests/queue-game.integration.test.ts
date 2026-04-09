import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { handleJoinQueue } from '../handlers/queue';
import { handleMove, handleResign } from '../handlers/game';
import { rooms, connectedUserIds } from '../state';
import { asBunWs, createMockWs, resetInMemoryState } from './helpers';
import type { TimeControl } from '../types';
const tc: TimeControl = { mode: 'timed', minutes: 3, increment: 0 };
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
describe('queue + game integration', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    resetInMemoryState();
  });
  test('matches two queued players, enforces turn order, and handles resignation', async () => {
    const a = createMockWs('player-a', 'user-a');
    const b = createMockWs('player-b', 'user-b');

    // Register WS in connectedUserIds so the queue matching logic can find them
    connectedUserIds.set('user-a', asBunWs(a));
    connectedUserIds.set('user-b', asBunWs(b));

    await handleJoinQueue(asBunWs(a), { variant: 'standard', timeControl: tc });
    expect(
      findMessage<{
        type: 'waiting';
      }>(a.sent, 'waiting')
    ).toBeDefined();

    await handleJoinQueue(asBunWs(b), { variant: 'standard', timeControl: tc });
    const aMatched = findMessage<{
      type: 'matched';
      color: 'white' | 'black';
      roomId: string;
    }>(a.sent, 'matched');
    const bMatched = findMessage<{
      type: 'matched';
      color: 'white' | 'black';
      roomId: string;
    }>(b.sent, 'matched');
    expect(aMatched).toBeDefined();
    expect(bMatched).toBeDefined();
    expect(aMatched?.roomId).toBe(bMatched?.roomId);
    expect(new Set([aMatched?.color, bMatched?.color]).size).toBe(2);
    const roomId = aMatched!.roomId;
    const room = rooms.get(roomId);
    expect(room).toBeDefined();
    const white = aMatched!.color === 'white' ? a : b;
    const black = aMatched!.color === 'black' ? a : b;

    await handleMove(asBunWs(black), { from: 'e7', to: 'e5' });
    const blackTurnError = findMessage<{
      type: 'error';
      message: string;
    }>(black.sent, 'error');
    expect(blackTurnError?.message).toBe('Not your turn.');

    await handleMove(asBunWs(white), { from: 'e2', to: 'e4' });
    const blackOpponentMove = findMessage<{
      type: 'opponent_move';
      from: string;
      to: string;
    }>(black.sent, 'opponent_move');
    expect(blackOpponentMove?.from).toBe('e2');
    expect(blackOpponentMove?.to).toBe('e4');
    expect(rooms.get(roomId)?.moves).toEqual(['e2e4']);

    await handleResign(asBunWs(black));
    const whiteGameOver = findMessage<{
      type: 'game_over';
      reason: string;
      winner?: string;
    }>(white.sent, 'game_over');
    const blackGameOver = findMessage<{
      type: 'game_over';
      reason: string;
      winner?: string;
    }>(black.sent, 'game_over');
    expect(whiteGameOver?.reason).toBe('resign');
    expect(blackGameOver?.reason).toBe('resign');
    expect(whiteGameOver?.winner).toBe('white');
    expect(rooms.get(roomId)?.status).toBe('ended');
  });
});
