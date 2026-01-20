import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Fischer Random vs Computer | Zugklang',
  description:
    'Play Fischer Random (Chess960) against Stockfish. Test your skills without opening preparation.'
};

export default async function FischerRandomComputerPage() {
  const cookieStore = await cookies();
  const board3dEnabled = cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <GameView gameType='computer' initialBoard3dEnabled={board3dEnabled} variant='fischerRandom' />
    </PageContainer>
  );
}
