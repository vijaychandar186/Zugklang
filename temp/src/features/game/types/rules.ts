import { PlayerColor } from '@/features/chess/types/core';

export type TimeControlMode = 'unlimited' | 'timed' | 'custom';

export type TimeControl = {
  mode: TimeControlMode;
  minutes: number;
  increment: number;
  whiteMinutes?: number;
  whiteIncrement?: number;
  blackMinutes?: number;
  blackIncrement?: number;
};

export type GameResult = {
  winner: PlayerColor | 'draw' | null;
  reason: string;
};
