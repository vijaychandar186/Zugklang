import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { MenuPageLayout } from '@/components/layout/MenuPageLayout';
import { GameModeCard } from '@/pages-content/play-menu/components/GameModeCard';
import { Icons } from '@/components/Icons';
import { tools } from '@/constants/tools';

export const metadata: Metadata = {
  title: 'Chess Tools | Zugklang',
  description:
    'Powerful chess analysis and review tools. Analyze positions with Stockfish and review your games.'
};

export default function ToolsPage() {
  return (
    <PageContainer scrollable={true}>
      <MenuPageLayout
        icon={Icons.engine}
        title='Chess Tools'
        description='Powerful analysis and review tools to improve your game.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {tools.map((tool) => (
            <GameModeCard key={tool.href} {...tool} />
          ))}
        </div>
      </MenuPageLayout>
    </PageContainer>
  );
}
