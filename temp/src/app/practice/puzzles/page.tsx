import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { puzzleModes } from '@/constants/puzzle-modes';

export const metadata: Metadata = {
  title: 'Puzzles | Zugklang',
  description:
    'Choose your puzzle mode. Solve at your own pace or race against the clock.'
};

export default function PuzzlesMenuPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.puzzle}
        title='Puzzles'
        description='Sharpen your tactical skills with chess puzzles. Choose your preferred mode.'
        backHref='/practice'
        backLabel='Back to Practice'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {puzzleModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
