import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { PuzzleRushView } from '@/features/puzzles/components/PuzzleRushView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Puzzle Rush | Zugklang',
  description:
    'Race against the clock or survive as long as you can in this fast-paced puzzle challenge.'
};

export default async function PuzzleRushPage() {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <PuzzleRushView initialBoard3dEnabled={board3dEnabled} />
    </PageContainer>
  );
}
