export const VARIANT_LABELS: Record<string, string> = {
  standard: 'Standard',
  fischerRandom: '960',
  atomic: 'Atomic',
  racingKings: 'Racing Kings',
  horde: 'Horde',
  threeCheck: '3-Check',
  antichess: 'Antichess',
  kingOfTheHill: 'KOTH',
  crazyhouse: 'Crazyhouse',
  checkersChess: 'Chess with Checkers',
  'dice-chess': 'Dice Chess',
  'card-chess': 'Card Chess'
};

export function formatVariantLabel(variant: string): string {
  return VARIANT_LABELS[variant] ?? variant;
}
