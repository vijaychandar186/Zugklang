import { CSSProperties } from 'react';
import { Square } from 'chess.js';

export type OptionSquares = {
  [key in Square]?: CSSProperties;
};

export type RightClickedSquares = {
  [key in Square]?: CSSProperties | undefined;
};

export type BoardTheme = {
  darkSquareStyle: CSSProperties;
  lightSquareStyle: CSSProperties;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 6,
  hard: 12
};

export function convertCSSPropertiesToStringObject(
  style: CSSProperties
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  }
  return result;
}
