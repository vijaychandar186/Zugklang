import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnalysisView } from '@/features/analysis/components/AnalysisView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
export const metadata: Metadata = {
  title: 'Analysis Board | Zugklang',
  description:
    'Analyze chess positions with Stockfish 16. Set up your own positions, import PGN/FEN, and continue games against the computer.'
};
export default async function AnalysisPage({
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
      <AnalysisView
        initialBoard3dEnabled={board3dEnabled}
        initialPgn={initialPgn}
      />
    </PageContainer>
  );
}
