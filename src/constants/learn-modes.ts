import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const learnModes: MenuCardItem[] = [
  {
    href: '/practice/learn/openings',
    icon: Icons.book,
    title: 'Opening Explorer',
    description:
      'Browse and study thousands of chess openings. Learn the key positions and variations.',
    actionText: 'Explore Openings'
  }
];
