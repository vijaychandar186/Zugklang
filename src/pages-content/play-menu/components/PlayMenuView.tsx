import { Icons } from '@/components/Icons';
import { PlayMenuHeader } from './PlayMenuHeader';
import { GameModeCard } from './GameModeCard';

const gameModes = [
  {
    href: '/play/computer',
    icon: Icons.cpu,
    title: 'Vs Computer',
    description:
      'Challenge Stockfish 16 at various difficulty levels. Perfect your opening repertoire and tactical vision.',
    actionText: 'Play Now'
  },
  {
    href: '/play/local',
    icon: Icons.users,
    title: 'Pass and Play',
    description:
      'Play locally with a friend on the same device. Take turns and optionally flip the board after each move.',
    actionText: 'Play Now'
  },
  {
    href: '/analysis',
    icon: Icons.microscope,
    title: 'Analysis Board',
    description:
      'Access a fully featured analysis board. Import PGNs, evaluate positions, and study grandmaster games.',
    actionText: 'Start Analysis'
  },
  {
    href: '/game-review',
    icon: Icons.circlestar,
    title: 'Game Review',
    description:
      'Review your past games, explore move accuracy, and learn from mistakes to improve your play.',
    actionText: 'Review Game'
  }
];

export function PlayMenuView() {
  return (
    <div className='bg-background relative flex h-full w-full flex-col'>
      <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6'>
        <PlayMenuHeader />

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {gameModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </div>
    </div>
  );
}
