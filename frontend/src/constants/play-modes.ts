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
    href: '/play/multiplayer',
    icon: Icons.usersRound,
    title: 'Online Multiplayer',
    description:
      'Get matched with a random online opponent instantly. All variants available — no account needed.',
    actionText: 'Choose Mode'
  },
  {
    href: '/play/custom',
    icon: Icons.sparkles,
    title: 'Custom',
    description:
      'Unique chess variants including 4-Player Chess and Dice Chess. Experience chess in exciting new ways!',
    actionText: 'Choose Mode'
  },
  {
    href: '/play/custom-multiplayer',
    icon: Icons.bookUser,
    title: 'Custom Multiplayer',
    description:
      'Play custom game modes in multiplayer setups, including Dice Chess, Card Chess, and 4-Player Chess.',
    actionText: 'Choose Mode'
  }
];
