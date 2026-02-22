import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const customMultiplayerModes: MenuCardItem[] = [
  {
    href: '/play/custom-multiplayer/four-player',
    icon: Icons.usersRound,
    title: '4-Player Chess',
    description:
      'Multiplayer 4-player chess on a 14x14 board with teams and rotating turns.',
    actionText: 'Play Multiplayer'
  },
  {
    href: '/play/custom-multiplayer/dice-chess',
    icon: Icons.dices,
    title: 'Dice Chess',
    description:
      'Multiplayer Dice Chess where rolls constrain legal piece moves each turn.',
    actionText: 'Play Multiplayer'
  },
  {
    href: '/play/custom-multiplayer/card-chess',
    icon: Icons.spade,
    title: 'Card Chess',
    description:
      'Multiplayer Card Chess with draw-based move constraints and tactical card play.',
    actionText: 'Play Multiplayer'
  }
];
