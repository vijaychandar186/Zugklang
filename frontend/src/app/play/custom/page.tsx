import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { customModes } from '@/constants/custom-modes';
export const metadata: Metadata = {
  title: 'Custom Games | Zugklang',
  description:
    'Play unique chess variants including 4-Player Chess and Dice Chess. Experience chess in exciting new ways!'
};
export default function CustomPlayMenuPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.sparkles}
        title='Custom'
        description='Unique chess variants that break the traditional mold. Experience chess in exciting new ways!'
        backHref='/play'
        backLabel='Back to Play'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {customModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
