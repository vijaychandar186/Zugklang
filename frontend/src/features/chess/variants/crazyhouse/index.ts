import { variantRegistry, VariantModule } from '../shared/VariantRegistry';
import { CrazyhousePocket } from './components/CrazyhousePocket';
import { useCrazyhousePocket } from './hooks/useCrazyhousePocket';
export { CrazyhousePocket } from './components/CrazyhousePocket';
export { useCrazyhousePocket } from './hooks/useCrazyhousePocket';
const crazyhouseModule: VariantModule = {
  components: {
    Pocket: CrazyhousePocket
  },
  hooks: {
    usePocket: useCrazyhousePocket
  },
  metadata: {
    displayName: 'Crazyhouse',
    description: 'Captured pieces can be dropped back on the board'
  }
};
variantRegistry.register('crazyhouse', crazyhouseModule);
export default crazyhouseModule;
