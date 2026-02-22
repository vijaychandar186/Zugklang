import type { Rules } from 'chessops/types';
import {
  STARTING_FEN,
  RACING_KINGS_STARTING_FEN,
  HORDE_STARTING_FEN
} from './constants';
import { generateRandomChess960FEN } from '../utils/chess960';
export type ChessVariant =
  | 'standard'
  | 'fischerRandom'
  | 'atomic'
  | 'racingKings'
  | 'horde'
  | 'threeCheck'
  | 'antichess'
  | 'kingOfTheHill'
  | 'crazyhouse'
  | 'checkersChess';
type VariantConfig = {
  rules: Rules;
  uciVariant: string;
  useFairyEngine: boolean;
  engineName: string;
  getStartingFEN: () => string;
  boardOverlay?: 'finishLine';
};
const VARIANT_CONFIG: Record<ChessVariant, VariantConfig> = {
  standard: {
    rules: 'chess',
    uciVariant: 'chess',
    useFairyEngine: false,
    engineName: 'Stockfish',
    getStartingFEN: () => STARTING_FEN
  },
  fischerRandom: {
    rules: 'chess',
    uciVariant: 'chess',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => generateRandomChess960FEN()
  },
  atomic: {
    rules: 'atomic',
    uciVariant: 'atomic',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => STARTING_FEN
  },
  racingKings: {
    rules: 'racingkings',
    uciVariant: 'racingkings',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => RACING_KINGS_STARTING_FEN,
    boardOverlay: 'finishLine'
  },
  horde: {
    rules: 'horde',
    uciVariant: 'horde',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => HORDE_STARTING_FEN
  },
  threeCheck: {
    rules: '3check',
    uciVariant: '3check',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => STARTING_FEN
  },
  antichess: {
    rules: 'antichess',
    uciVariant: 'antichess',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => STARTING_FEN
  },
  kingOfTheHill: {
    rules: 'kingofthehill',
    uciVariant: 'kingofthehill',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => STARTING_FEN
  },
  crazyhouse: {
    rules: 'crazyhouse',
    uciVariant: 'crazyhouse',
    useFairyEngine: true,
    engineName: 'Fairy-Stockfish',
    getStartingFEN: () => STARTING_FEN
  },
  checkersChess: {
    rules: 'chess',
    uciVariant: 'chess',
    useFairyEngine: false,
    engineName: 'Stockfish',
    getStartingFEN: () => STARTING_FEN
  }
};
export function getVariantConfig(variant: ChessVariant): VariantConfig {
  return VARIANT_CONFIG[variant];
}
export function variantToRules(variant: ChessVariant): Rules {
  return VARIANT_CONFIG[variant].rules;
}
export function getStartingFEN(variant: ChessVariant): string {
  return VARIANT_CONFIG[variant].getStartingFEN();
}
export function usesFairyEngine(variant: ChessVariant): boolean {
  return VARIANT_CONFIG[variant].useFairyEngine;
}
export function getEngineName(variant: ChessVariant): string {
  return VARIANT_CONFIG[variant].engineName;
}
export function getUciVariant(variant: ChessVariant): string {
  return VARIANT_CONFIG[variant].uciVariant;
}
export function hasBoardOverlay(
  variant: ChessVariant
): VariantConfig['boardOverlay'] | undefined {
  return VARIANT_CONFIG[variant].boardOverlay;
}
