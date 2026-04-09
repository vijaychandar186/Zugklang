import type { JobsOptions } from 'bullmq';
import type { TimeControl } from '../types';

export const JobName = {
  ANTI_CHEAT: 'game:anti-cheat',
  GAME_RECORD: 'game:record',
  ABORT_CHECK: 'game:abort-check',
  ABANDON_CHECK: 'game:abandon-check'
} as const;

export type JobName = (typeof JobName)[keyof typeof JobName];

export function queueNameFor(jobName: JobName): string {
  return jobName.replaceAll(':', '-');
}

export interface AntiCheatPayload {
  game_id: string;
  variant: string;
  time_control_minutes: number;
  time_control_increment: number;
  moves: string[];
  move_times_white_ms: number[];
  move_times_black_ms: number[];
  white_user_id: string | null;
  black_user_id: string | null;
  white_username: string | null;
  black_username: string | null;
  white_rating: number | null;
  black_rating: number | null;
  result: 'white' | 'black' | 'draw';
  played_at: string;
}

export interface GameRecordPayload {
  roomId: string;
  variant: string;
  timeControl: TimeControl;
  whiteUserId: string | null;
  blackUserId: string | null;
  whiteDisplayName: string | null;
  blackDisplayName: string | null;
  whiteRating: number | null;
  blackRating: number | null;
  moves: string[];
  moveTimesWhiteMs: number[];
  moveTimesBlackMs: number[];
  result: 'white' | 'black' | 'draw';
  reason: string;
  playedAt: string;
}

export interface AbortCheckPayload {
  roomId: string;
  expectedMinMoves: number;
}

export interface AbandonCheckPayload {
  playerId: string;
  roomId: string;
  color: 'white' | 'black';
}

export interface JobPayloadMap {
  [JobName.ANTI_CHEAT]: AntiCheatPayload;
  [JobName.GAME_RECORD]: GameRecordPayload;
  [JobName.ABORT_CHECK]: AbortCheckPayload;
  [JobName.ABANDON_CHECK]: AbandonCheckPayload;
}

export const defaultJobOptions: JobsOptions = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2_000 },
  removeOnComplete: { count: 500 },
  removeOnFail: { count: 100 }
};

export const timerJobOptions: JobsOptions = {
  attempts: 1,
  removeOnComplete: { count: 200 },
  removeOnFail: { count: 50 }
};
