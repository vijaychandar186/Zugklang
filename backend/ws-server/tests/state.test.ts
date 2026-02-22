import { beforeEach, describe, expect, test } from 'bun:test';
import { issueRejoinToken, rejoinTokens, revokeRoomTokens } from '../state';
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
  test('issueRejoinToken revokes previous token for the same player', () => {
    const playerId = 'player-1';
    const token1 = issueRejoinToken(playerId);
    const token2 = issueRejoinToken(playerId);
    expect(token2).not.toBe(token1);
    expect(rejoinTokens.has(token1)).toBe(false);
    expect(rejoinTokens.get(token2)).toBe(playerId);
  });
  test('revokeRoomTokens removes both players token mappings', () => {
    const white = createMockWs('white');
    const black = createMockWs('black');
    const outsiderId = 'outsider';
    const room = createTestRoom({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      white: asBunWs(white),
      black: asBunWs(black)
    });
    const whiteToken = issueRejoinToken('white');
    const blackToken = issueRejoinToken('black');
    const outsiderToken = issueRejoinToken(outsiderId);
    revokeRoomTokens(room);
    expect(rejoinTokens.has(whiteToken)).toBe(false);
    expect(rejoinTokens.has(blackToken)).toBe(false);
    expect(rejoinTokens.get(outsiderToken)).toBe(outsiderId);
  });
});
