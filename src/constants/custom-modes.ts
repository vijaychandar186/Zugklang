import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const customModes: MenuCardItem[] = [
  {
    href: '/play/custom/four-player',
    icon: Icons.usersRound,
    title: '4-Player Chess',
    description:
      'Play 4-player chess on a 14×14 board with friends on the same device. Free-move mode.',
    actionText: 'Start Game'
  },
  {
    href: '/play/custom/dice-chess',
    icon: Icons.dices,
    title: 'Dice Chess',
    description:
      'Roll 3 dice to determine which pieces you can move each turn. Capture the enemy King to win!',
    actionText: 'Start Game'
  },
  {
    href: '/play/custom/checkers-chess',
    icon: Icons.circle,
    title: 'Chess with Checkers',
    description:
      'All pieces look like checkers but move as regular chess pieces. White pieces are white, black pieces are black!',
    actionText: 'Start Game'
  }
];
