import { beforeEach, describe, expect, test } from 'bun:test';
import {
  issueRejoinToken,
  resolveRejoinToken,
  revokeRoomTokens
} from '../state';
import {
  asBunWs,
  createMockWs,
  createTestRoom,
  resetInMemoryState
} from './helpers';
describe('state token utilities', () => {
  beforeEach(() => {
    resetInMemoryState();
  });
  test('issueRejoinToken revokes previous token for the same player', async () => {
    const playerId = 'player-1';
    const roomId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const token1 = await issueRejoinToken(playerId, roomId);
    const token2 = await issueRejoinToken(playerId, roomId);
    expect(token2).not.toBe(token1);
    // Old token should no longer resolve (revoked by second issue)
    expect(await resolveRejoinToken(token1)).toBeNull();
    // New token should resolve to the correct player
    expect((await resolveRejoinToken(token2))?.playerId).toBe(playerId);
  });
  test('revokeRoomTokens removes both players token mappings', async () => {
    const white = createMockWs('white');
    const black = createMockWs('black');
    const outsiderId = 'outsider';
    const room = createTestRoom({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    const whiteToken = await issueRejoinToken('white', room.id);
    const blackToken = await issueRejoinToken('black', room.id);
    const outsiderToken = await issueRejoinToken(outsiderId, room.id);
    await revokeRoomTokens(room);
    expect(await resolveRejoinToken(whiteToken)).toBeNull();
    expect(await resolveRejoinToken(blackToken)).toBeNull();
    // Outsider token is for a different player and should still resolve
    expect((await resolveRejoinToken(outsiderToken))?.playerId).toBe(
      outsiderId
    );
  });
});
