import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const customMultiplayerModes: MenuCardItem[] = [
  {
    href: '/play/custom-multiplayer/dice-chess',
    icon: Icons.dices,
    title: 'Dice Chess',
    description:
      'Multiplayer Dice Chess — rolls constrain which piece type you may move each turn.',
    actionText: 'Play Multiplayer'
  },
  {
    href: '/play/custom-multiplayer/card-chess',
    icon: Icons.spade,
    title: 'Card Chess',
    description:
      'Multiplayer Card Chess — draw a card each turn to unlock the piece you must move.',
    actionText: 'Play Multiplayer'
  }
];
