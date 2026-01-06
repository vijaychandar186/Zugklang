import { GameView } from '@/features/game/components/GameView';
import { PageContainer } from '@/components/layout/PageContainer';

export default function LocalPlayPage() {
  return (
    <PageContainer scrollable={true}>
      <GameView gameType='local' />
    </PageContainer>
  );
}
