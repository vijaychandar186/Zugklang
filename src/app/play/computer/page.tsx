import { GameView } from '@/components/view/GameView';
import { PageContainer } from '@/components/layout/PageContainer';

export default function Home() {
  return (
    <PageContainer scrollable={true}>
      <GameView />
    </PageContainer>
  );
}
