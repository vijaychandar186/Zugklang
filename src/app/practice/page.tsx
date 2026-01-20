import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { practiceModes } from '@/constants/practice-modes';

export const metadata: Metadata = {
  title: 'Practice | Zugklang',
  description:
    'Improve your chess skills. Study openings and solve tactical puzzles.'
};

export default function PracticePage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.chessKing}
        title='Practice'
        description='Improve your chess skills with openings study and tactical puzzles.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {practiceModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
