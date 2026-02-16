import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { DiceChessView } from '@/features/dice-chess/components/DiceChessView';

export const metadata: Metadata = {
  title: 'Dice Chess | Zugklang',
  description:
    'Roll 3 dice to determine which pieces you can move. Capture the enemy King to win!'
};

export default function DiceChessPage() {
  return (
    <PageContainer scrollable={true}>
      <DiceChessView />
    </PageContainer>
  );
}
