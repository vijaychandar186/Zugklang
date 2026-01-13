export enum Classification {
  BRILLIANT = 'brilliant',
  GREAT = 'great',
  BEST = 'best',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  INACCURACY = 'inaccuracy',
  MISTAKE = 'mistake',
  BLUNDER = 'blunder',
  BOOK = 'book',
  FORCED = 'forced'
}

export const classificationValues: Record<string, number> = {
  blunder: 0,
  mistake: 0.2,
  inaccuracy: 0.4,
  good: 0.65,
  excellent: 0.9,
  best: 1,
  great: 1,
  brilliant: 1,
  book: 1,
  forced: 1
};

// Classification types that use centipawn-based thresholds
export const centipawnClassifications = [
  Classification.BEST,
  Classification.EXCELLENT,
  Classification.GOOD,
  Classification.INACCURACY,
  Classification.MISTAKE,
  Classification.BLUNDER
];

/**
 * Get the maximum evaluation loss for a classification to be applied.
 * Uses a quadratic formula that scales thresholds based on the previous evaluation.
 * Higher eval positions have more lenient thresholds (harder to blunder when winning).
 */
export function getEvaluationLossThreshold(
  classif: Classification,
  prevEval: number
): number {
  const absPrevEval = Math.abs(prevEval);
  let threshold = 0;

  switch (classif) {
    case Classification.BEST:
      threshold =
        0.0001 * Math.pow(absPrevEval, 2) + 0.0236 * absPrevEval - 3.7143;
      break;
    case Classification.EXCELLENT:
      threshold =
        0.0002 * Math.pow(absPrevEval, 2) + 0.1231 * absPrevEval + 27.5455;
      break;
    case Classification.GOOD:
      threshold =
        0.0002 * Math.pow(absPrevEval, 2) + 0.2643 * absPrevEval + 60.5455;
      break;
    case Classification.INACCURACY:
      threshold =
        0.0002 * Math.pow(absPrevEval, 2) + 0.3624 * absPrevEval + 108.0909;
      break;
    case Classification.MISTAKE:
      threshold =
        0.0003 * Math.pow(absPrevEval, 2) + 0.4027 * absPrevEval + 225.8182;
      break;
    default:
      threshold = Infinity;
  }

  return Math.max(threshold, 0);
}

/**
 * Get the positive classifications used for determining book moves.
 */
export function getPositiveClassifications(): string[] {
  return Object.keys(classificationValues).slice(4, 8);
}
