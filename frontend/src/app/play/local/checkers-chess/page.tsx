import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
export const metadata: Metadata = {
  title: 'Chess with Checkers Local | Zugklang',
  description:
    'Play chess with checkers pieces locally. All pieces look like checkers but move as regular chess pieces!'
};
export default async function CheckersChessLocalPage() {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';
  return (
    <PageContainer scrollable={true}>
      <GameView
        gameType='local'
        initialBoard3dEnabled={board3dEnabled}
        variant='checkersChess'
      />
    </PageContainer>
  );
}
