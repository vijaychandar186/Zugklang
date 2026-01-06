import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';

export const metadata: Metadata = {
  title: 'Play vs Computer | Zugklang',
  description:
    'Challenge Stockfish 16 at various difficulty levels. Test your chess skills against one of the strongest engines.'
};

export default async function ComputerPage() {
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
