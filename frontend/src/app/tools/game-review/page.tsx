import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameReviewView } from '@/features/game-review/components/GameReviewView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
export const metadata: Metadata = {
  title: 'Game Review | Zugklang',
  description:
    'Analyse your chess games with Stockfish. Get accuracy scores, move classifications, and detailed insights.'
};
export default async function GameReviewPage({
  searchParams
}: {
  searchParams: Promise<{
    pgn?: string;
  }>;
}) {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';
  const params = await searchParams;
  const initialPgn = params.pgn ? decodeURIComponent(params.pgn) : undefined;
  return (
    <PageContainer scrollable={true}>
      <GameReviewView
        initialBoard3dEnabled={board3dEnabled}
        initialPgn={initialPgn}
      />
    </PageContainer>
  );
}
