import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { playModes } from '@/constants/play-modes';

export const metadata: Metadata = {
  title: 'Play | Zugklang',
  description:
    'Choose your game mode. Play against the computer or challenge a friend locally.'
};

export default function PlayPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.play}
        title='Play Chess'
        description='Choose how you want to play. Challenge the computer or play with a friend.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {playModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
