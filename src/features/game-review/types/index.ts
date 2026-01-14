export type Classification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
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
  blunder: '/moves-classification/blunder.svg',
  forced: '/moves-classification/forced.svg',
  book: '/moves-classification/book.svg'
};
