import { Queue } from 'bullmq';
import { getConnectionOptions } from './connection';
import { ABORT_TIMEOUT_MS, ABANDON_TIMEOUT_MS } from '../config';
import {
  defaultJobOptions,
  timerJobOptions,
  JobName,
  queueNameFor,
  type JobPayloadMap
} from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<string, Queue<any>>();

function getQueue<N extends JobName>(name: N): Queue<JobPayloadMap[N]> {
  const queueName = queueNameFor(name);

  if (!registry.has(queueName)) {
    registry.set(
      queueName,
      new Queue<JobPayloadMap[N]>(queueName, {
        connection: getConnectionOptions(),
        defaultJobOptions
      })
    );
  }
  return registry.get(queueName) as Queue<JobPayloadMap[N]>;
}

export const antiCheatQueue = (): Queue<
  JobPayloadMap[typeof JobName.ANTI_CHEAT]
> => getQueue(JobName.ANTI_CHEAT);

export const gameRecordQueue = (): Queue<
  JobPayloadMap[typeof JobName.GAME_RECORD]
> => getQueue(JobName.GAME_RECORD);

export const abortQueue = (): Queue<
  JobPayloadMap[typeof JobName.ABORT_CHECK]
> => getQueue(JobName.ABORT_CHECK);

export const abandonQueue = (): Queue<
  JobPayloadMap[typeof JobName.ABANDON_CHECK]
> => getQueue(JobName.ABANDON_CHECK);

export async function scheduleAbortCheck(
  roomId: string,
  expectedMinMoves: number
): Promise<void> {
  const jobId = `abort__${roomId}`;
  await abortQueue().add(
    JobName.ABORT_CHECK,
    { roomId, expectedMinMoves },
    { ...timerJobOptions, jobId, delay: ABORT_TIMEOUT_MS }
  );
}

export async function cancelAbortCheck(roomId: string): Promise<void> {
  const job = await abortQueue().getJob(`abort__${roomId}`);
  await job?.remove();
}

export async function rescheduleAbortCheck(
  roomId: string,
  expectedMinMoves: number
): Promise<void> {
  await cancelAbortCheck(roomId);
  await scheduleAbortCheck(roomId, expectedMinMoves);
}

export async function scheduleAbandonCheck(
  playerId: string,
  roomId: string,
  color: 'white' | 'black'
): Promise<void> {
  const jobId = `abandon__${playerId}`;
  await abandonQueue().add(
    JobName.ABANDON_CHECK,
    { playerId, roomId, color },
    {
      ...timerJobOptions,
      jobId,
      delay: ABANDON_TIMEOUT_MS
    }
  );
}

export async function cancelAbandonCheck(playerId: string): Promise<void> {
  const job = await abandonQueue().getJob(`abandon__${playerId}`);
  await job?.remove();
}

export async function closeAllQueues(): Promise<void> {
  await Promise.all([...registry.values()].map((q) => q.close()));
  registry.clear();
}
