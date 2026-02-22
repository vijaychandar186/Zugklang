import { Position } from 'chessops/chess';
import { setupPosition } from 'chessops/variant';
import type { Rules } from 'chessops/types';
import { parseFen } from 'chessops/fen';
import { parseUci } from 'chessops/util';
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
export function buildPosition(variant: string, fen: string): Position {
  const setup = parseFen(fen).unwrap();
  const rules: Rules = VARIANT_RULES[variant] ?? 'chess';
  return setupPosition(rules, setup).unwrap();
}
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
