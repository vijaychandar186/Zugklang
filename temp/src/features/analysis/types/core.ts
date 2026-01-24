export type Advantage = 'white' | 'black' | 'equal';

export type AnalysisLine = {
  multiPvIndex: number;
  cp: number;
  mate: number | null;
  advantage: Advantage;
  pvMoves: string[];
  depth: number;
};

export type LineEvaluation = {
  advantage: Advantage;
  cp: number;
  mate: number | null;
  formattedEvaluation: string;
};

export type ProcessedAnalysis = {
  advantage: Advantage;
  cp: number | null;
  mate: number | null;
  formattedEvaluation: string;
  uciLines: string[][];
  lineEvaluations: LineEvaluation[];
};

export type AnalysisMode = 'normal' | 'position-editor' | 'play-from-position';
