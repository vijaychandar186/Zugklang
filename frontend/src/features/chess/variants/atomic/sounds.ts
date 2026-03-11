import type { Move } from '@/lib/chess/chess';
import { playRawSound } from '@/features/game/utils/sounds';
import { ATOMIC_IMPACT_SOUND } from '@/lib/public-paths';
export function playAtomicMoveSound(move: Move, isCapture: boolean): void {
  if (isCapture) {
    playRawSound(ATOMIC_IMPACT_SOUND);
  }
}
export function isAtomicCapture(move: Move): boolean {
  return !!move.captured;
}
