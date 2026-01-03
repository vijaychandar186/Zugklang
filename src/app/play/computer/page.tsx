import { GameView } from '@/components/view/GameView';
import { PageContainer } from '@/components/layout/PageContainer';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const playAs = cookieStore.get('playAs')?.value as
    | 'white'
    | 'black'
    | undefined;

  return (
    <PageContainer scrollable={true}>
      <GameView serverOrientation={playAs} />
    </PageContainer>
  );
}
