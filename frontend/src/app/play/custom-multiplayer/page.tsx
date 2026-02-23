import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { customMultiplayerModes } from '@/constants/custom-multiplayer-modes';

export const metadata: Metadata = {
  title: 'Custom Multiplayer | Zugklang',
  description:
    'Play Dice Chess, Card Chess, or Four Player Chess online with friends.'
};

export default function CustomMultiplayerMenuPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.bookUser}
        title='Custom Multiplayer'
        description='Choose a custom game mode for online play.'
        backHref='/play'
        backLabel='Back to Play'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {customMultiplayerModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
