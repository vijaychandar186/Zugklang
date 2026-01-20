import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { computerModes } from '@/constants/computer-modes';

export const metadata: Metadata = {
  title: 'Play vs Computer | Zugklang',
  description:
    'Challenge Stockfish at various difficulty levels. Play standard chess or try variants like Fischer Random.'
};

export default function ComputerPlayMenuPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.cpu}
        title='Vs Computer'
        description='Challenge Stockfish 16 at various difficulty levels. From beginner to grandmaster strength.'
        backHref='/play'
        backLabel='Back to Play'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {computerModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
