import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
export const metadata: Metadata = {
  title: 'Crazyhouse vs Computer | Zugklang',
  description:
    'Play Crazyhouse against Fairy-Stockfish. Captured pieces switch sides and can be dropped back!'
};
export default async function CrazyhouseComputerPage() {
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
        variant='crazyhouse'
      />
    </PageContainer>
  );
}
