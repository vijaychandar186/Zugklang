import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { CheckersChessView } from '@/features/custom/checkers-chess/components/CheckersChessView';

export const metadata: Metadata = {
  title: 'Checkers Chess | Zugklang',
  description:
    'All pieces are styled as checkers but move and function as regular chess pieces. Capture the enemy King to win!'
};

export default function CheckersChessPage() {
  return (
    <PageContainer scrollable={true}>
      <CheckersChessView />
    </PageContainer>
  );
}
