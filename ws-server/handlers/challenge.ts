import type { BunWS, TimeControl, CreatorColor } from '../types';
import { challenges } from '../state';
import { send } from '../utils/socket';
import { logger } from '../utils/logger';
import { createRoom } from './queue';

export function handleCreateChallenge(
  ws: BunWS,
  msg: { variant: string; timeControl: TimeControl; color: CreatorColor }
): void {
  const { variant, timeControl } = msg;
  const creatorColor = msg.color;

  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
  }

  const challengeId = crypto.randomUUID();
  ws.data.challengeId = challengeId;

  challenges.set(challengeId, {
    id: challengeId,
    creator: ws,
    variant,
    timeControl,
    creatorColor,
    createdAt: Date.now()
  });

  send(ws, { type: 'challenge_created', challengeId });
  logger.info('challenge_created', {
    challengeId: challengeId.slice(0, 8),
    variant,
    creatorColor
  });
}

export function handleJoinChallenge(
  ws: BunWS,
  msg: { challengeId: string }
): void {
  const { challengeId } = msg;

  const challenge = challenges.get(challengeId);
  if (!challenge) {
    send(ws, { type: 'challenge_not_found' });
    return;
  }

  if (challenge.creator.data.id === ws.data.id) {
    send(ws, { type: 'error', message: "You can't join your own game link." });
    return;
  }

  challenges.delete(challengeId);
  delete challenge.creator.data.challengeId;

  let white: BunWS, black: BunWS;
  if (challenge.creatorColor === 'white') {
    [white, black] = [challenge.creator, ws];
  } else if (challenge.creatorColor === 'black') {
    [white, black] = [ws, challenge.creator];
  } else {
    [white, black] =
      Math.random() < 0.5 ? [challenge.creator, ws] : [ws, challenge.creator];
  }

  createRoom(white, black, challenge.variant, challenge.timeControl);
  logger.info('challenge_joined', {
    challengeId: challengeId.slice(0, 8),
    joiner: ws.data.id.slice(0, 8)
  });
}

export function handleCancelChallenge(ws: BunWS): void {
  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    delete ws.data.challengeId;
  }
}
