import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { CardChessMultiplayerView } from '@/features/custom/card-chess/components/CardChessMultiplayerView';

export const metadata: Metadata = {
  title: 'Card Chess Multiplayer | Zugklang',
  description:
    'Play Card Chess in custom multiplayer mode with card-constrained move selection.'
};

export default function CardChessMultiplayerPage() {
  return (
    <PageContainer scrollable={true}>
      <CardChessMultiplayerView />
    </PageContainer>
  );
}
