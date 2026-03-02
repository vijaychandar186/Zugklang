import type { BunWS, TimeControl, CreatorColor } from '../types';
import { challenges } from '../state';
import { send } from '../utils/socket';
import { logger } from '../utils/logger';
import { createRoom } from './queue';
import { redis, POD_ID } from '../redis';
import { CHALLENGE_TTL_SEC } from '../config';

interface RedisChallengeEntry {
  creatorUserId: string;
  creatorSessionId: string;
  creatorPodId: string;
  variant: string;
  timeControl: string;
  creatorColor: string;
  createdAt: string;
  displayName: string;
  userImage: string;
}

export async function handleCreateChallenge(
  ws: BunWS,
  msg: {
    variant: string;
    timeControl: TimeControl;
    color: CreatorColor;
    displayName?: string | undefined;
    userImage?: string | null | undefined;
  }
): Promise<void> {
  const { variant, timeControl } = msg;
  const creatorColor = msg.color;
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;

  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    await redis.del(`challenge:${ws.data.challengeId}`);
  }

  const challengeId = crypto.randomUUID();
  ws.data.challengeId = challengeId;
  const creatorUserId = ws.data.userId ?? null;

  challenges.set(challengeId, {
    id: challengeId,
    creator: ws,
    creatorUserId,
    variant,
    timeControl,
    creatorColor,
    createdAt: Date.now()
  });

  await redis.hset(`challenge:${challengeId}`, {
    creatorUserId: creatorUserId ?? '',
    creatorSessionId: ws.data.id,
    creatorPodId: POD_ID,
    variant,
    timeControl: JSON.stringify(timeControl),
    creatorColor,
    createdAt: String(Date.now()),
    displayName: ws.data.displayName ?? '',
    userImage: ws.data.userImage ?? ''
  });
  await redis.expire(`challenge:${challengeId}`, CHALLENGE_TTL_SEC);

  send(ws, { type: 'challenge_created', challengeId });
  logger.info('challenge_created', {
    challengeId: challengeId.slice(0, 8),
    variant,
    creatorColor
  });
}

export async function handleJoinChallenge(
  ws: BunWS,
  msg: {
    challengeId: string;
    displayName?: string | undefined;
    userImage?: string | null | undefined;
  }
): Promise<void> {
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;
  const { challengeId } = msg;

  const raw = (await redis.hgetall(
    `challenge:${challengeId}`
  )) as unknown as RedisChallengeEntry | null;
  if (!raw || !raw.creatorUserId) {
    send(ws, { type: 'challenge_not_found' });
    return;
  }

  if (
    raw.creatorSessionId === ws.data.id ||
    raw.creatorUserId === ws.data.userId
  ) {
    send(ws, { type: 'error', message: "You can't join your own game link." });
    return;
  }

  const deleted = await redis.del(`challenge:${challengeId}`);
  if (deleted === 0) {
    send(ws, { type: 'challenge_not_found' });
    return;
  }

  const creatorPodId = raw.creatorPodId;

  if (creatorPodId === POD_ID) {
    const challenge = challenges.get(challengeId);
    if (!challenge) {
      send(ws, { type: 'challenge_not_found' });
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
    await createRoom(white, black, challenge.variant, challenge.timeControl);
  } else {
    await redis.publish(
      `ws:pod:${creatorPodId}:in`,
      JSON.stringify({
        type: 'pod_challenge_accepted',
        challengeId,
        joinerUserId: ws.data.userId ?? '',
        joinerSessionId: ws.data.id,
        joinerPodId: POD_ID,
        joinerDisplayName: ws.data.displayName ?? '',
        joinerUserImage: ws.data.userImage ?? ''
      })
    );
  }

  logger.info('challenge_joined', {
    challengeId: challengeId.slice(0, 8),
    joiner: ws.data.id.slice(0, 8)
  });
}

export async function handleCancelChallenge(ws: BunWS): Promise<void> {
  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    await redis.del(`challenge:${ws.data.challengeId}`);
    delete ws.data.challengeId;
  }
}
