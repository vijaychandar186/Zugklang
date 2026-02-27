import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { TriDChessView } from '@/features/custom/tri-d-chess/components/TriDChessView';

export const metadata: Metadata = {
  title: 'Tri-Dimensional Chess | Zugklang',
  description:
    'Play the Star Trek-inspired Tri-Dimensional Chess: three fixed 4×4 boards and four movable 2×2 attack boards, rendered flat.'
};

export default async function TriDChessPage() {
  const cookieStore = await cookies();
  const initialPieceTheme = cookieStore.get('pieceTheme')?.value ?? 'classic';
  return (
    <PageContainer scrollable={true}>
      <TriDChessView initialPieceTheme={initialPieceTheme} />
    </PageContainer>
  );
}
