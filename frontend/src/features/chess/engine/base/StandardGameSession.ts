import { ChessGameSession } from './ChessGameSession';
import { VariantCapabilities } from './types';
import { ChessVariant } from '@/features/chess/config/variants';
export class StandardGameSession extends ChessGameSession {
  get capabilities(): VariantCapabilities {
    return {
      hasPockets: false,
      hasExplosions: false,
      hasSpecialOverlay: false,
      supportsDrop: false,
      customSounds: false,
      usesFairyEngine: false
    };
  }
  get variant(): ChessVariant {
    return 'standard';
  }
}
