import { ChessVariant } from '@/features/chess/config/variants';
import type { Move } from '@/lib/chess/chess';
type HookFunction = (params: unknown) => unknown;
export type VariantModule = {
  hooks?: {
    useOverlay?: HookFunction;
    usePocket?: HookFunction;
    useThreats?: HookFunction;
  };
  components?: {
    Overlay?: React.ComponentType<Record<string, unknown>>;
    Pocket?: React.ComponentType<Record<string, unknown>>;
    BoardOverlay?: React.ComponentType<Record<string, unknown>>;
  };
  sounds?: {
    onMove?: (move: Move, isCapture: boolean) => void;
    onCheck?: () => void;
    onCheckmate?: () => void;
  };
  metadata?: {
    displayName: string;
    description?: string;
  };
};
class VariantRegistry {
  private modules = new Map<ChessVariant, VariantModule>();
  register(variant: ChessVariant, module: VariantModule): void {
    this.modules.set(variant, module);
  }
  getModule(variant: ChessVariant): VariantModule | undefined {
    return this.modules.get(variant);
  }
  hasModule(variant: ChessVariant): boolean {
    return this.modules.has(variant);
  }
  getRegisteredVariants(): ChessVariant[] {
    return Array.from(this.modules.keys());
  }
  unregister(variant: ChessVariant): void {
    this.modules.delete(variant);
  }
  clear(): void {
    this.modules.clear();
  }
}
export const variantRegistry = new VariantRegistry();
