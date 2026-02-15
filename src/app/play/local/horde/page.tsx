import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Horde Chess Local | Zugklang',
  description:
    'Play Horde Chess with a friend on the same device. A massive pawn army vs a full set of pieces!'
};

export default async function HordeLocalPage() {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <GameView
        gameType='local'
        initialBoard3dEnabled={board3dEnabled}
        variant='horde'
      />
    </PageContainer>
  );
}
