import { ChessGameSession } from '../base/ChessGameSession';
import { VariantCapabilities } from '../base/types';
import { ChessVariant } from '@/features/chess/config/variants';

export class RacingKingsSession extends ChessGameSession {
  get capabilities(): VariantCapabilities {
    return {
      hasPockets: false,
      hasExplosions: false,
      hasSpecialOverlay: true, // Has finish line overlay
      supportsDrop: false,
      customSounds: false,
      usesFairyEngine: true
    };
  }

  get variant(): ChessVariant {
    return 'racingKings';
  }
}
