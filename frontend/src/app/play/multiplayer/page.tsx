import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { multiplayerModes } from '@/constants/multiplayer-modes';
export const metadata: Metadata = {
  title: 'Online Multiplayer | Zugklang',
  description:
    'Play chess online against a random opponent. Standard chess and all variants available.'
};
export default function MultiplayerMenuPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.usersRound}
        title='Online Multiplayer'
        description='Get matched with a random online opponent instantly. Choose your variant and find a game.'
        backHref='/play'
        backLabel='Back to Play'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {multiplayerModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
