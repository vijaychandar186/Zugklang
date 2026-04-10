export const ANALYSIS_DEFAULTS = {
  multiPV: 3,
  searchTime: 1,
  threads: 4,
  hashSize: 128,
  updateInterval: 100
} as const;

export const EVALUATION_CONFIG = {
  equalPosition: 50,
  mateAdvantageWhite: 98,
  mateAdvantageBlack: 2,
  clampMin: 2,
  clampMax: 98,
  sigmoidCoefficient: 0.2,
  centipawnDivisor: 100
} as const;
