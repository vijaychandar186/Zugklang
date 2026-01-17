export type Classification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'miss'
  | 'blunder'
  | 'forced'
  | 'book';

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
  worker?: 'local' | 'cloud' | undefined;
}

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

export const CLASSIFICATION_COLORS: Record<string, string> = {
  brilliant: 'var(--classification-brilliant)',
  great: 'var(--classification-great)',
  best: 'var(--classification-best)',
  excellent: 'var(--classification-excellent)',
  good: 'var(--classification-good)',
  inaccuracy: 'var(--classification-inaccuracy)',
  mistake: 'var(--classification-mistake)',
  miss: 'var(--classification-miss)',
  blunder: 'var(--classification-blunder)',
  forced: 'var(--classification-forced)',
  book: 'var(--classification-book)'
};

export const CLASSIFICATION_ICONS: Record<string, string> = {
  brilliant: '/moves-classification/brilliancy.svg',
  great: '/moves-classification/great.svg',
  best: '/moves-classification/best.svg',
  excellent: '/moves-classification/excellent.svg',
  good: '/moves-classification/good.svg',
  inaccuracy: '/moves-classification/inaccuracy.svg',
  mistake: '/moves-classification/mistake.svg',
  miss: '/moves-classification/miss.svg',
  blunder: '/moves-classification/blunder.svg',
  forced: '/moves-classification/forced.svg',
  book: '/moves-classification/book.svg'
};

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  brilliant: 'brilliant !!',
  great: 'great !',
  best: 'the best move',
  excellent: 'excellent',
  good: 'an okay move',
  inaccuracy: 'an inaccuracy',
  mistake: 'a mistake',
  miss: 'a miss',
  blunder: 'a blunder',
  forced: 'forced',
  book: 'an opening move'
};
