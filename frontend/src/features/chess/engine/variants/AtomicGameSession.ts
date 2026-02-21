import { ChessGameSession } from '../base/ChessGameSession';
import { VariantCapabilities } from '../base/types';
import { ChessVariant } from '@/features/chess/config/variants';
import { ChessJSColor } from '@/lib/chess/chess';

export class AtomicGameSession extends ChessGameSession {
  get capabilities(): VariantCapabilities {
    return {
      hasPockets: false,
      hasExplosions: true,
      hasSpecialOverlay: false,
      supportsDrop: false,
      customSounds: true,
      usesFairyEngine: true
    };
  }

  get variant(): ChessVariant {
    return 'atomic';
  }

  getSquaresAttackedBy(color: ChessJSColor): string[] {
    return this.game.getSquaresAttackedBy(color);
  }

  getAdjacentOccupied(square: string, excludePawns = false): string[] {
    return this.game.getAdjacentOccupied(square, excludePawns);
  }
}
