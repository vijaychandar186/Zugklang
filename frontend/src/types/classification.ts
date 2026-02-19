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

export const CLASSIFICATION_VALUES: Record<Classification, number> = {
  blunder: 0,
  mistake: 0.15,
  miss: 0.25,
  inaccuracy: 0.35,
  good: 0.55,
  excellent: 0.85,
  best: 1,
  great: 1,
  brilliant: 1,
  book: 0.9,
  forced: 1
};

export const CLASSIFICATION_COLORS: Record<Classification, string> = {
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

export const CLASSIFICATION_ICONS: Record<Classification, string> = {
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
