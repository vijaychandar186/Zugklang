import type { Classification } from '@/types/classification';

export interface Move {
  san: string;
  uci: string;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineLine {
  id: number;
  depth: number;
  evaluation: Evaluation;
  moveUCI: string;
  moveSAN?: string;
}

export interface Position {
  fen: string;
  move?: Move;
  topLines?: EngineLine[];
  cutoffEvaluation?: Evaluation;
  classification?: Classification;
  opening?: string;
  worker?: 'local' | 'cloud';
}

export interface EvaluatedPosition extends Position {
  move: Move;
  topLines: EngineLine[];
  worker: 'local' | 'cloud';
}
