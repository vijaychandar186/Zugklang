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
    href: '/play/custom/tri-d',
    icon: Icons.rotate3D,
    title: 'Tri-D Chess',
    description:
      'Star Trek–inspired Tri-Dimensional Chess: three fixed 4×4 boards and four movable 2×2 attack boards, displayed flat.',
    actionText: 'Start Game'
  }
];
