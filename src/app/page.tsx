import { GameView } from '@/components/game-view';
import PageContainer from '@/components/page-container';

export default function Home() {
  return (
    <PageContainer scrollable={true}>
      <GameView />
    </PageContainer>
  );
}
