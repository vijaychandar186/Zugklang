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
  classification?: string;
  opening?: string;
  worker?: 'local' | 'cloud' | string;
}

export interface EvaluatedPosition extends Position {
  move: Move;
  topLines: EngineLine[];
  worker: string;
}
