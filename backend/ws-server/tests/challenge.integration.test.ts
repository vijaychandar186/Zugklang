import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  handleCancelChallenge,
  handleCreateChallenge,
  handleJoinChallenge
} from '../handlers/challenge';
import { challenges, rooms } from '../state';
import { asBunWs, createMockWs, resetInMemoryState } from './helpers';

function findMessage<T extends { type: string }>(
  messages: unknown[],
  type: T['type']
): T | undefined {
  return messages.find((m) => (m as { type?: string }).type === type) as
    | T
    | undefined;
}

describe('challenge flow integration', () => {
  beforeEach(() => {
    resetInMemoryState();
  });

  afterEach(() => {
    resetInMemoryState();
  });

  test('create challenge, block self-join, then join from second player', () => {
    const creator = createMockWs('creator');
    const joiner = createMockWs('joiner');

    handleCreateChallenge(asBunWs(creator), {
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 5, increment: 0 },
      color: 'white',
      displayName: 'Creator'
    });

    const created = findMessage<{
      type: 'challenge_created';
      challengeId: string;
    }>(creator.sent, 'challenge_created');
    expect(created).toBeDefined();
    expect(challenges.has(created!.challengeId)).toBe(true);

    handleJoinChallenge(asBunWs(creator), {
      challengeId: created!.challengeId
    });
    const selfJoinError = findMessage<{ type: 'error'; message: string }>(
      creator.sent,
      'error'
    );
    expect(selfJoinError?.message).toContain("can't join your own");

    handleJoinChallenge(asBunWs(joiner), { challengeId: created!.challengeId });
    expect(challenges.has(created!.challengeId)).toBe(false);
    expect(rooms.size).toBe(1);

    const creatorMatched = findMessage<{ type: 'matched'; color: string }>(
      creator.sent,
      'matched'
    );
    const joinerMatched = findMessage<{ type: 'matched'; color: string }>(
      joiner.sent,
      'matched'
    );
    expect(creatorMatched?.color).toBe('white');
    expect(joinerMatched?.color).toBe('black');
  });

  test('cancel challenge removes active challenge', () => {
    const creator = createMockWs('creator');
    handleCreateChallenge(asBunWs(creator), {
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 3, increment: 2 },
      color: 'random'
    });
    const created = findMessage<{
      type: 'challenge_created';
      challengeId: string;
    }>(creator.sent, 'challenge_created');
    expect(challenges.has(created!.challengeId)).toBe(true);

    handleCancelChallenge(asBunWs(creator));
    expect(challenges.size).toBe(0);
    expect(creator.data.challengeId).toBeUndefined();
  });
});
