import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';

export const metadata: Metadata = {
  title: 'Local Game | Zugklang',
  description:
    'Play chess with a friend on the same device. Take turns and enjoy a classic pass-and-play experience.'
};

export default function LocalPlayPage() {
  return (
    <PageContainer scrollable={true}>
      <GameView gameType='local' />
    </PageContainer>
  );
}
