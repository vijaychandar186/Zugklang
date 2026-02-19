import { ChessGameSession } from '../base/ChessGameSession';
import { StandardGameSession } from '../base/StandardGameSession';
import { AtomicGameSession } from './AtomicGameSession';
import { CrazyhouseGameSession } from './CrazyhouseGameSession';
import { FischerRandomSession } from './FischerRandomSession';
import { RacingKingsSession } from './RacingKingsSession';
import { HordeSession } from './HordeSession';
import { ThreeCheckSession } from './ThreeCheckSession';
import { AntichessSession } from './AntichessSession';
import { KingOfTheHillSession } from './KingOfTheHillSession';
import {
  ChessVariant,
  variantToRules,
  getStartingFEN
} from '@/features/chess/config/variants';

export function createGameSession(
  variant: ChessVariant,
  fen?: string
): ChessGameSession {
  const rules = variantToRules(variant);
  const startFen = fen || getStartingFEN(variant);

  switch (variant) {
    case 'atomic':
      return new AtomicGameSession(startFen, rules);

    case 'crazyhouse':
      return new CrazyhouseGameSession(startFen, rules);

    case 'fischerRandom':
      return new FischerRandomSession(startFen, rules);

    case 'racingKings':
      return new RacingKingsSession(startFen, rules);

    case 'horde':
      return new HordeSession(startFen, rules);

    case 'threeCheck':
      return new ThreeCheckSession(startFen, rules);

    case 'antichess':
      return new AntichessSession(startFen, rules);

    case 'kingOfTheHill':
      return new KingOfTheHillSession(startFen, rules);

    case 'standard':
    default:
      return new StandardGameSession(startFen, rules);
  }
}
