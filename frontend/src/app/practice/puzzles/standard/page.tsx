import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { PuzzleView } from '@/features/puzzles/components/PuzzleView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Standard Puzzles | Zugklang',
  description:
    'Solve tactical puzzles to sharpen your pattern recognition and calculation skills.'
};

export default async function StandardPuzzlesPage() {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <PuzzleView initialBoard3dEnabled={board3dEnabled} />
    </PageContainer>
  );
}
