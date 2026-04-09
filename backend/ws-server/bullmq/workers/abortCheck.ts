import type { Job, Processor } from 'bullmq';
import { rooms, revokeRoomTokens } from '../../state';
import { stopRoomClock } from '../../utils/clock';
import { sendToUser } from '../../utils/routing';
import { enqueueGameEnd } from '../../handlers/game';
import { logger } from '../../utils/logger';
import type { AbortCheckPayload } from '../types';

export const processAbortCheck: Processor<AbortCheckPayload> = async (
  job: Job<AbortCheckPayload>
): Promise<void> => {
  const { roomId, expectedMinMoves } = job.data;

  const room = rooms.get(roomId);

  if (!room || room.status === 'ended') return;
  if (room.moves.length >= expectedMinMoves) return;

  room.status = 'ended';
  stopRoomClock(room);
  await revokeRoomTokens(room);

  const abandonedColor = room.position.turn;
  const winner = abandonedColor === 'white' ? 'Black' : 'White';

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

  if (room.whiteUserId) await sendToUser(room.whiteUserId, payload);
  if (room.blackUserId) await sendToUser(room.blackUserId, payload);

  logger.info('game_auto_aborted', {
    roomId: roomId.slice(0, 8),
    moves: room.moves.length,
    expectedMinMoves
  });
};
