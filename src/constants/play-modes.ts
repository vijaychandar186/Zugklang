import { Icons } from '@/components/Icons';
import type { LucideIcon } from '@/components/Icons';

export interface MenuCardItem {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  comingSoon?: boolean;
}

export const playModes: MenuCardItem[] = [
  {
    href: '/play/computer',
    icon: Icons.cpu,
    title: 'Vs Computer',
    description:
      'Challenge Stockfish 16 at various difficulty levels. Standard chess and variants available.',
    actionText: 'Choose Mode'
  },
  {
    href: '/play/local',
    icon: Icons.users,
    title: 'Local Play',
    description:
      'Play with a friend on the same device. Standard chess and variants available.',
    actionText: 'Choose Mode'
  },
  {
    href: '/play/four-player',
    icon: Icons.usersRound,
    title: '4-Player Chess',
    description:
      'Play 4-player chess on a 14×14 board with friends on the same device. Free-move mode.',
    actionText: 'Start Game'
  },
  {
    href: '/play/dice-chess',
    icon: Icons.dices,
    title: 'Dice Chess',
    description:
      'Roll 3 dice to determine which pieces you can move each turn. Capture the enemy King to win!',
    actionText: 'Start Game'
  }
];
