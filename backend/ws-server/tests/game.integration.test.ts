import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  handleAbort,
  handleAcceptDraw,
  handleDeclineDraw,
  handleGameOverNotify,
  handleOfferDraw,
  handleOfferRematch
} from '../handlers/game';
import { rooms } from '../state';
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
describe('game handler integration', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    resetInMemoryState();
  });
  test('draw offer, decline, and accept flow updates room and notifies players', () => {
    const white = createMockWs('w');
    const black = createMockWs('b');
    white.data.color = 'white';
    black.data.color = 'black';
    white.data.roomId = '33333333-3333-3333-3333-333333333333';
    black.data.roomId = '33333333-3333-3333-3333-333333333333';
    const room = createTestRoom({
      id: '33333333-3333-3333-3333-333333333333',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    rooms.set(room.id, room);
    handleOfferDraw(asBunWs(white));
    expect(room.drawOfferedBy).toBe('white');
    expect(
      findMessage<{
        type: 'draw_offered';
      }>(black.sent, 'draw_offered')
    ).toBeDefined();
    handleDeclineDraw(asBunWs(black));
    expect(room.drawOfferedBy).toBeNull();
    expect(
      findMessage<{
        type: 'draw_declined';
      }>(white.sent, 'draw_declined')
    ).toBeDefined();
    handleOfferDraw(asBunWs(white));
    handleAcceptDraw(asBunWs(black));
    expect(room.status).toBe('ended');
    const whiteGameOver = findMessage<{
      type: 'game_over';
      reason: string;
    }>(white.sent, 'game_over');
    expect(whiteGameOver?.reason).toBe('draw_agreement');
  });
  test('abort and game_over_notify mark room ended', () => {
    const white = createMockWs('w2');
    const black = createMockWs('b2');
    white.data.color = 'white';
    black.data.color = 'black';
    white.data.roomId = '44444444-4444-4444-4444-444444444444';
    black.data.roomId = '44444444-4444-4444-4444-444444444444';
    const room = createTestRoom({
      id: '44444444-4444-4444-4444-444444444444',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    rooms.set(room.id, room);
    handleGameOverNotify(asBunWs(white), {
      result: 'White wins',
      reason: 'checkmate'
    });
    expect(room.status).toBe('ended');
    const blackGameOver = findMessage<{
      type: 'game_over';
      reason: string;
    }>(black.sent, 'game_over');
    expect(blackGameOver?.reason).toBe('checkmate');
    const room2 = createTestRoom({
      id: '55555555-5555-5555-5555-555555555555',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    white.data.roomId = room2.id;
    black.data.roomId = room2.id;
    room2.status = 'active';
    rooms.set(room2.id, room2);
    handleAbort(asBunWs(white));
    expect(rooms.get(room2.id)?.status).toBe('ended');
    const whiteAbort = findMessage<{
      type: 'game_over';
      reason: string;
    }>(white.sent, 'game_over');
    expect(whiteAbort?.reason).toBe('abort');
  });
  test('offer rematch notifies opponent only after game ended', () => {
    const white = createMockWs('w3');
    const black = createMockWs('b3');
    white.data.color = 'white';
    black.data.color = 'black';
    white.data.roomId = '66666666-6666-6666-6666-666666666666';
    black.data.roomId = '66666666-6666-6666-6666-666666666666';
    const room = createTestRoom({
      id: '66666666-6666-6666-6666-666666666666',
      white: asBunWs(white),
      black: asBunWs(black),
      status: 'ended'
    });
    rooms.set(room.id, room);
    handleOfferRematch(asBunWs(white));
    expect(room.rematchOfferedBy).toBe('w3');
    expect(
      findMessage<{
        type: 'rematch_offered';
      }>(black.sent, 'rematch_offered')
    ).toBeDefined();
  });
});
