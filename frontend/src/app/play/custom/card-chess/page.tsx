import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { CardChessView } from '@/features/custom/card-chess/components/CardChessView';
export const metadata: Metadata = {
  title: 'Card Chess | Zugklang',
  description:
    'Draw cards to determine which pieces you can move. Each card rank corresponds to a specific chess piece!'
};
export default function CardChessPage() {
  return (
    <PageContainer scrollable={true}>
      <CardChessView />
    </PageContainer>
  );
}
