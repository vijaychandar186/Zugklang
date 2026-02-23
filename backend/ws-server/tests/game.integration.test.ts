import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  handleAbort,
  handleAcceptDraw,
  handleAcceptRematch,
  handleDeclineDraw,
  handleDeclineRematch,
  handleGameOverNotify,
  handleOfferDraw,
  handleOfferRematch,
  handleResign
} from '../handlers/game';
import { rooms } from '../state';
import {
  asBunWs,
  createMockWs,
  createTestRoom,
  resetInMemoryState
} from './helpers';

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

function setupRoom(id: string) {
  const white = createMockWs(`w-${id}`);
  const black = createMockWs(`b-${id}`);
  white.data.color = 'white';
  black.data.color = 'black';
  white.data.roomId = id;
  black.data.roomId = id;
  const room = createTestRoom({
    id,
    white: asBunWs(white),
    black: asBunWs(black)
  });
  rooms.set(id, room);
  return { white, black, room };
}

describe('game handler integration', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    resetInMemoryState();
  });

  // ── draw flow ──────────────────────────────────────────────────────────────
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
      findMessage<{ type: 'draw_offered' }>(black.sent, 'draw_offered')
    ).toBeDefined();

    handleDeclineDraw(asBunWs(black));
    expect(room.drawOfferedBy).toBeNull();
    expect(
      findMessage<{ type: 'draw_declined' }>(white.sent, 'draw_declined')
    ).toBeDefined();

    handleOfferDraw(asBunWs(white));
    handleAcceptDraw(asBunWs(black));
    expect(room.status).toBe('ended');
    const whiteGameOver = findMessage<{ type: 'game_over'; reason: string }>(
      white.sent,
      'game_over'
    );
    expect(whiteGameOver?.reason).toBe('draw_agreement');
  });

  test('draw cannot be accepted by the offerer', () => {
    const { white, black, room } = setupRoom(
      '11111111-1111-1111-1111-111111111111'
    );
    handleOfferDraw(asBunWs(white));
    handleAcceptDraw(asBunWs(white));
    expect(room.status).toBe('active');
    expect(
      findMessage<{ type: 'game_over' }>(black.sent, 'game_over')
    ).toBeUndefined();
  });

  test('draw offer ignored when no prior offer exists', () => {
    const { black, room } = setupRoom('22222222-2222-2222-2222-222222222222');
    handleAcceptDraw(asBunWs(black));
    expect(room.status).toBe('active');
  });

  // ── abort / game_over_notify ───────────────────────────────────────────────
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
    const blackGameOver = findMessage<{ type: 'game_over'; reason: string }>(
      black.sent,
      'game_over'
    );
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
    const whiteAbort = findMessage<{ type: 'game_over'; reason: string }>(
      white.sent,
      'game_over'
    );
    expect(whiteAbort?.reason).toBe('abort');
  });

  test('abort is ignored when room is already ended', () => {
    const { white, room } = setupRoom('66666666-6666-6666-6666-666666666666');
    room.status = 'ended';
    handleAbort(asBunWs(white));
    // Status stays ended and no duplicate game_over sent
    expect(room.status).toBe('ended');
  });

  test('abort after opening window is treated as resignation', () => {
    const { white, black, room } = setupRoom(
      '67676767-6767-6767-6767-676767676767'
    );
    room.moves = ['e2e4', 'e7e5'];

    handleAbort(asBunWs(white));

    expect(room.status).toBe('ended');
    const whiteMsg = findMessage<{ type: 'game_over'; reason: string }>(
      white.sent,
      'game_over'
    );
    const blackMsg = findMessage<{ type: 'game_over'; reason: string }>(
      black.sent,
      'game_over'
    );
    expect(whiteMsg?.reason).toBe('resign');
    expect(blackMsg?.reason).toBe('resign');
  });

  test('game_over_notify is ignored when room is already ended', () => {
    const { white, black, room } = setupRoom(
      '77777777-7777-7777-7777-777777777777'
    );
    room.status = 'ended';
    handleGameOverNotify(asBunWs(white), {
      result: 'Draw',
      reason: 'stalemate'
    });
    expect(
      findMessage<{ type: 'game_over' }>(black.sent, 'game_over')
    ).toBeUndefined();
  });

  // ── resign ─────────────────────────────────────────────────────────────────
  test('resign by white ends room and notifies both players', () => {
    const { white, black, room } = setupRoom(
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    );

    handleResign(asBunWs(white));

    expect(room.status).toBe('ended');
    const whiteMsg = findMessage<{
      type: 'game_over';
      reason: string;
      winner?: string;
    }>(white.sent, 'game_over');
    const blackMsg = findMessage<{
      type: 'game_over';
      reason: string;
      winner?: string;
    }>(black.sent, 'game_over');
    expect(whiteMsg?.reason).toBe('resign');
    expect(whiteMsg?.winner).toBe('black');
    expect(blackMsg?.reason).toBe('resign');
    expect(blackMsg?.winner).toBe('black');
  });

  test('resign by black ends room with white as winner', () => {
    const { white, black, room } = setupRoom(
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    );

    handleResign(asBunWs(black));

    expect(room.status).toBe('ended');
    const whiteMsg = findMessage<{ type: 'game_over'; winner?: string }>(
      white.sent,
      'game_over'
    );
    expect(whiteMsg?.winner).toBe('white');
  });

  test('resign is ignored when room is already ended', () => {
    const { white, black, room } = setupRoom(
      'cccccccc-cccc-cccc-cccc-cccccccccccc'
    );
    room.status = 'ended';
    handleResign(asBunWs(white));
    expect(
      findMessage<{ type: 'game_over' }>(black.sent, 'game_over')
    ).toBeUndefined();
  });

  test('resign is ignored when player has no room', () => {
    const lone = createMockWs('lone');
    // roomId intentionally not set
    handleResign(asBunWs(lone));
    expect(lone.sent).toHaveLength(0);
  });

  // ── rematch flow ───────────────────────────────────────────────────────────
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
      findMessage<{ type: 'rematch_offered' }>(black.sent, 'rematch_offered')
    ).toBeDefined();
  });

  test('offer rematch ignored while game is still active', () => {
    const { white, black, room } = setupRoom(
      'dddddddd-dddd-dddd-dddd-dddddddddddd'
    );
    expect(room.status).toBe('active');
    handleOfferRematch(asBunWs(white));
    expect(room.rematchOfferedBy).toBeNull();
    expect(
      findMessage<{ type: 'rematch_offered' }>(black.sent, 'rematch_offered')
    ).toBeUndefined();
  });

  test('accept rematch creates a new room with colors swapped', () => {
    const { white, black, room } = setupRoom(
      'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
    );
    room.status = 'ended';

    // White offers, black accepts → colors swap (acceptor becomes white)
    room.rematchOfferedBy = white.data.id;
    handleAcceptRematch(asBunWs(black));

    // A new room should have been created
    expect(rooms.size).toBe(2);
    const newRoom = [...rooms.values()].find((r) => r.id !== room.id);
    expect(newRoom).toBeDefined();
    expect(newRoom?.status).toBe('active');

    // Both should have received a matched message
    expect(
      findMessage<{ type: 'matched' }>(white.sent, 'matched')
    ).toBeDefined();
    expect(
      findMessage<{ type: 'matched' }>(black.sent, 'matched')
    ).toBeDefined();
  });

  test('accept rematch ignored when offerer tries to accept own offer', () => {
    const { white, room } = setupRoom('ffffffff-ffff-ffff-ffff-ffffffffffff');
    room.status = 'ended';
    room.rematchOfferedBy = white.data.id;

    handleAcceptRematch(asBunWs(white));

    // No new room created
    expect(rooms.size).toBe(1);
  });

  test('accept rematch ignored when no offer pending', () => {
    const { black, room } = setupRoom('00000000-0000-0000-0000-000000000001');
    room.status = 'ended';
    room.rematchOfferedBy = null;

    handleAcceptRematch(asBunWs(black));
    expect(rooms.size).toBe(1);
  });

  test('decline rematch clears offer and notifies opponent', () => {
    const { white, black, room } = setupRoom(
      '00000000-0000-0000-0000-000000000002'
    );
    room.status = 'ended';
    room.rematchOfferedBy = white.data.id;

    handleDeclineRematch(asBunWs(black));

    expect(room.rematchOfferedBy).toBeNull();
    expect(
      findMessage<{ type: 'rematch_declined' }>(white.sent, 'rematch_declined')
    ).toBeDefined();
  });

  test('decline rematch ignored when room is active', () => {
    const { black, room } = setupRoom('00000000-0000-0000-0000-000000000003');
    expect(room.status).toBe('active');
    handleDeclineRematch(asBunWs(black));
    // No crash, nothing sent
    expect(
      findMessage<{ type: 'rematch_declined' }>(black.sent, 'rematch_declined')
    ).toBeUndefined();
  });
});
