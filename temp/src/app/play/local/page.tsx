import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { localModes } from '@/constants/local-modes';

export const metadata: Metadata = {
  title: 'Local Play | Zugklang',
  description:
    'Choose your local game mode. Play standard chess or try variants like Fischer Random with a friend.'
};

export default function LocalPlayMenuPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.users}
        title='Local Play'
        description='Play with a friend on the same device. Take turns and enjoy chess together.'
        backHref='/play'
        backLabel='Back to Play'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {localModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
