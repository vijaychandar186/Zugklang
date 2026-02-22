import type { Move } from '@/lib/chess/chess';
import { playRawSound } from '@/features/game/utils/sounds';
export function playAtomicMoveSound(move: Move, isCapture: boolean): void {
  if (isCapture) {
    playRawSound('/variant/atomic/impact.mp3');
  }
}
export function isAtomicCapture(move: Move): boolean {
  return !!move.captured;
}
