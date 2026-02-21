import { variantRegistry, VariantModule } from '../shared/VariantRegistry';
import { FinishLineOverlay } from './components/FinishLineOverlay';

export { FinishLineOverlay } from './components/FinishLineOverlay';

const racingKingsModule: VariantModule = {
  components: {
    BoardOverlay: FinishLineOverlay,
    Overlay: FinishLineOverlay
  },
  metadata: {
    displayName: 'Racing Kings',
    description: 'Race your king to the 8th rank to win'
  }
};

variantRegistry.register('racingKings', racingKingsModule);

export default racingKingsModule;
