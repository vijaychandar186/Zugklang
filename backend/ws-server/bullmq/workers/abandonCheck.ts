import type { Job, Processor } from 'bullmq';
import { rooms, revokeRoomTokens } from '../../state';
import { stopRoomClock } from '../../utils/clock';
import { sendToUser } from '../../utils/routing';
import { enqueueGameEnd } from '../../handlers/game';
import { logger } from '../../utils/logger';
import type { AbandonCheckPayload } from '../types';

export const processAbandonCheck: Processor<AbandonCheckPayload> = async (
  job: Job<AbandonCheckPayload>
): Promise<void> => {
  const { playerId, roomId, color } = job.data;

  const room = rooms.get(roomId);

  if (!room || room.status !== 'active') return;

  const stillDisconnected =
    color === 'white'
      ? room.whiteDisconnectedAt !== null
      : room.blackDisconnectedAt !== null;
  if (!stillDisconnected) return;

  room.status = 'ended';
  stopRoomClock(room);
  await revokeRoomTokens(room);

  const isWhite = color === 'white';
  const winner = isWhite ? 'Black' : 'White';
  const remainingUserId = isWhite ? room.blackUserId : room.whiteUserId;

  const payload = {
    type: 'game_over',
    result: `${winner} wins — opponent abandoned`,
    reason: 'abandoned',
    winner: winner.toLowerCase(),
    whiteUserId: room.whiteUserId,
    blackUserId: room.blackUserId
  };

  await enqueueGameEnd(
    room,
    winner.toLowerCase() as 'white' | 'black',
    'abandoned'
  );
  if (remainingUserId) await sendToUser(remainingUserId, payload);

  logger.info('player_abandoned', {
    roomId: roomId.slice(0, 8),
    playerId: playerId.slice(0, 8),
    color
  });
};
