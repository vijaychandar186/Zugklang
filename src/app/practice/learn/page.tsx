import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { learnModes } from '@/constants/learn-modes';

export const metadata: Metadata = {
  title: 'Learn | Zugklang',
  description:
    'Study chess concepts, openings, and more. Build foundational knowledge.'
};

export default function LearnPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.book}
        title='Learn'
        description='Study chess concepts, openings, endgames, and more. Build foundational knowledge.'
        backHref='/practice'
        backLabel='Back to Practice'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {learnModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
