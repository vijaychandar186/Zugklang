import { ChessGameSession } from '../base/ChessGameSession';
import { VariantCapabilities } from '../base/types';
import { ChessVariant } from '@/features/chess/config/variants';
import { ChessJSColor, PieceSymbol, Move } from '@/lib/chess/chess';

export class CrazyhouseGameSession extends ChessGameSession {
  get capabilities(): VariantCapabilities {
    return {
      hasPockets: true,
      hasExplosions: false,
      hasSpecialOverlay: false,
      supportsDrop: true,
      customSounds: false,
      usesFairyEngine: true
    };
  }

  get variant(): ChessVariant {
    return 'crazyhouse';
  }

  getPocket(color: ChessJSColor): Record<PieceSymbol, number> {
    return this.game.getPocket(color);
  }

  getDropSquares(): string[] {
    return this.game.getDropSquares();
  }

  makeDropMove(san: string): Move | null {
    return this.game.move(san);
  }
}
