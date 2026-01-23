import type { Position } from '@/types/Position';

export type { Classification } from '@/types/classification';
export type { Move, Evaluation, EngineLine, Position } from '@/types/Position';

export {
  CLASSIFICATION_COLORS,
  CLASSIFICATION_ICONS,
  CLASSIFICATION_LABELS,
  CLASSIFICATION_VALUES
} from '@/types/classification';

export interface GameReport {
  accuracies: {
    white: number;
    black: number;
  };
  estimatedElo?: {
    white: number;
    black: number;
  };
  positions: Position[];
}

export interface LiveEvaluation {
  value: number;
  type: 'cp' | 'mate';
}

export type ReviewStatus =
  | 'idle'
  | 'parsing'
  | 'evaluating'
  | 'reporting'
  | 'complete'
  | 'error';
