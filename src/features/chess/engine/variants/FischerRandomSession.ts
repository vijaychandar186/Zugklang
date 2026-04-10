import { ChessGameSession } from '../base/ChessGameSession';
import { VariantCapabilities } from '../base/types';
import { ChessVariant } from '@/features/chess/config/variants';

export class FischerRandomSession extends ChessGameSession {
  get capabilities(): VariantCapabilities {
    return {
      hasPockets: false,
      hasExplosions: false,
      hasSpecialOverlay: false,
      supportsDrop: false,
      customSounds: false,
      usesFairyEngine: true // Uses Fairy-Stockfish for Chess960 support
    };
  }

  get variant(): ChessVariant {
    return 'fischerRandom';
  }
}
