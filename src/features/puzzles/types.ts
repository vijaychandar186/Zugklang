export interface Puzzle {
  FEN: string;
  Moves: string;
  Rating: number;
  Themes: string;
}

export type PuzzleDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'master'
  | 'elite';

export type PuzzleStatus = 'idle' | 'playing' | 'success' | 'failed';
