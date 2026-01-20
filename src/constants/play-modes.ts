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
  }
];
