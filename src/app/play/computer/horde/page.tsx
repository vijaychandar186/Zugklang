import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Horde Chess vs Computer | Zugklang',
  description:
    'Play Horde Chess against Fairy-Stockfish. A massive pawn army vs a full set of pieces!'
};

export default async function HordeComputerPage() {
  const cookieStore = await cookies();
  const playAs = cookieStore.get('playAs')?.value as
    | 'white'
    | 'black'
    | undefined;
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <GameView
        gameType='computer'
        serverOrientation={playAs}
        initialBoard3dEnabled={board3dEnabled}
        variant='horde'
      />
    </PageContainer>
  );
}
