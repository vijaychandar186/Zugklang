import type { Job, Processor } from 'bullmq';
import type { GameRecordPayload } from '../types';

export const processGameRecord: Processor<GameRecordPayload> = async (
  job: Job<GameRecordPayload>
): Promise<void> => {
  const url = process.env['GAME_RECORD_URL'] ?? '';
  if (!url) {
    return;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env['INTERNAL_API_SECRET'] ?? ''}`
    },
    body: JSON.stringify(job.data)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Game record endpoint returned ${String(response.status)}: ${body}`
    );
  }
};
