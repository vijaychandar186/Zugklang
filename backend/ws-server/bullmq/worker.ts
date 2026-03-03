import { Worker } from 'bullmq';
import { getConnectionOptions } from './connection';
import { JobName, queueNameFor } from './types';
import { processAntiCheat } from './workers/antiCheat';
import { processGameRecord } from './workers/gameRecord';
import { processAbortCheck } from './workers/abortCheck';
import { processAbandonCheck } from './workers/abandonCheck';
import { logger } from '../utils/logger';

export function startWorkers(): Worker[] {
  const connection = getConnectionOptions();
  const concurrency = Number(process.env['WORKER_CONCURRENCY'] ?? 5);

  const workers: Worker[] = [
    new Worker(queueNameFor(JobName.ANTI_CHEAT), processAntiCheat, {
      connection,
      concurrency
    }),
    new Worker(queueNameFor(JobName.GAME_RECORD), processGameRecord, {
      connection,
      concurrency
    }),
    new Worker(queueNameFor(JobName.ABORT_CHECK), processAbortCheck, {
      connection,
      concurrency: 10
    }),
    new Worker(queueNameFor(JobName.ABANDON_CHECK), processAbandonCheck, {
      connection,
      concurrency: 10
    })
  ];

  for (const worker of workers) {
    worker.on('failed', (job, err) => {
      logger.warn('job_failed', {
        queue: worker.name,
        jobId: job?.id,
        attempt: job?.attemptsMade,
        attemptsLeft: (job?.opts.attempts ?? 1) - (job?.attemptsMade ?? 0),
        error: err.message
      });
    });

    worker.on('completed', (job) => {
      logger.info('job_completed', { queue: worker.name, jobId: job.id });
    });

    worker.on('error', (err) => {
      logger.warn('worker_error', { queue: worker.name, error: err.message });
    });
  }

  logger.info('workers_started', { queues: workers.map((w) => w.name) });
  return workers;
}

if (import.meta.main) {
  const workers = startWorkers();

  async function shutdown(signal: string): Promise<void> {
    logger.info('worker_shutdown', { signal });
    await Promise.all(workers.map((w) => w.close()));
    process.exit(0);
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}
