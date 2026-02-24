import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import ThreeDimensionalChessView from '@/features/custom/three-dimensional-chess/components/ThreeDimensionalChessView';

export const metadata: Metadata = {
  title: 'Three-dimensional Chess | Zugklang',
  description:
    'Play 3D chess across multiple vertical boards with movable attack boards. Inspired by Star Trek.'
};

export default function ThreeDChessPage() {
  return (
    <PageContainer scrollable={true}>
      <ThreeDimensionalChessView />
    </PageContainer>
  );
}
