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
    href: '/play/custom/card-chess',
    icon: Icons.spade,
    title: 'Card Chess',
    description:
      'Draw cards to determine which pieces you can move. Each card rank corresponds to a specific piece!',
    actionText: 'Start Game'
  },
  {
    href: '/play/custom/three-d-chess',
    icon: Icons.rotate3D,
    title: 'Three-dimensional Chess',
    description:
      'Play 3D chess across multiple vertical boards with movable attack boards. Inspired by Star Trek.',
    actionText: 'Start Game'
  }
];
