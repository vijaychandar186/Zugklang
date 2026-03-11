import { variantRegistry, VariantModule } from '../shared/VariantRegistry';
import { AtomicOverlay } from './components/AtomicOverlay';
import { useAtomicThreats } from './hooks/useAtomicThreats';
import { playAtomicMoveSound } from './sounds';
export { AtomicOverlay } from './components/AtomicOverlay';
export { useAtomicThreats } from './hooks/useAtomicThreats';
export {
  computePassiveThreats,
  computeExplosionZone
} from './utils/atomicThreats';
export { playAtomicMoveSound, isAtomicCapture } from './sounds';
const atomicModule: VariantModule = {
  components: {
    Overlay: AtomicOverlay,
    BoardOverlay: AtomicOverlay
  },
  hooks: {
    useOverlay: useAtomicThreats,
    useThreats: useAtomicThreats
  },
  sounds: {
    onMove: playAtomicMoveSound
  },
  metadata: {
    displayName: 'Atomic Chess',
    description: 'Captures cause explosions destroying surrounding pieces'
  }
};
variantRegistry.register('atomic', atomicModule);
export default atomicModule;
