import { Position } from 'chessops/chess';
import { setupPosition } from 'chessops/variant';
import type { Rules } from 'chessops/types';
import { parseFen } from 'chessops/fen';
import { parseUci } from 'chessops/util';

/**
 * Maps our variant strings to chessops Rules names.
 * 'checkers' uses standard chess rules — it's a visual overlay only.
 * 'fischerRandom' uses standard chess rules starting from a random FEN.
 */
const VARIANT_RULES: Record<string, Rules> = {
  standard: 'chess',
  fischerRandom: 'chess',
  atomic: 'atomic',
  antichess: 'antichess',
  racingKings: 'racingkings',
  horde: 'horde',
  threeCheck: '3check',
  kingOfTheHill: 'kingofthehill',
  crazyhouse: 'crazyhouse',
  checkers: 'chess'
};

/**
 * Build a chessops Position from a variant name and FEN string.
 * Throws if the FEN is invalid (should never happen — FENs are server-generated).
 */
export function buildPosition(variant: string, fen: string): Position {
  const setup = parseFen(fen).unwrap();
  const rules: Rules = VARIANT_RULES[variant] ?? 'chess';
  return setupPosition(rules, setup).unwrap();
}

/**
 * Validate a UCI move against the current position and, if legal, apply it
 * in-place (mutates `position`).
 *
 * Returns true if the move was legal and applied, false otherwise.
 *
 * NOTE: Crazyhouse drop moves (e.g. P@e4) are not yet supported in the
 * multiplayer move message protocol. They will fail `parseUci` and return
 * false, so normal-move validation still applies for non-drop Crazyhouse moves.
 */
export function applyMove(
  position: Position,
  from: string,
  to: string,
  promotion?: string
): boolean {
  const uci = `${from}${to}${promotion ?? ''}`;
  const move = parseUci(uci);
  if (!move) return false;
  if (!position.isLegal(move)) return false;
  position.play(move);
  return true;
}
