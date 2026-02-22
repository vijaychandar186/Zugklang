import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { cognitiveModes } from '@/constants/cognitive-modes';

export const metadata: Metadata = {
  title: 'Cognitive | Zugklang',
  description: 'Train your chess memory and board vision.'
};

export default function CognitivePage() {
  return (
    <PageContainer scrollable={true}>
      <Navbar />
      <MenuPageLayout
        icon={Icons.brainCog}
        title='Cognitive'
        description='Build board awareness and memory with targeted drills.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {cognitiveModes.map((mode) => (
            <GameModeCard key={mode.href} {...mode} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
