import type { Job, Processor } from 'bullmq';
import { ANTI_CHEAT_URL } from '../../config';
import type { AntiCheatPayload } from '../types';

export const processAntiCheat: Processor<AntiCheatPayload> = async (
  job: Job<AntiCheatPayload>
): Promise<void> => {
  if (!ANTI_CHEAT_URL) {
    return;
  }

  const response = await fetch(`${ANTI_CHEAT_URL}/game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job.data)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Anti-cheat service returned ${String(response.status)}: ${body}`
    );
  }
};
