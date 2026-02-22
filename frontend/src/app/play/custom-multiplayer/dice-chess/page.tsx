import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { DiceChessMultiplayerView } from '@/features/custom/dice-chess/components/DiceChessMultiplayerView';

export const metadata: Metadata = {
  title: 'Dice Chess Multiplayer | Zugklang',
  description:
    'Play Dice Chess in custom multiplayer mode with roll-based move constraints.'
};

export default function DiceChessMultiplayerPage() {
  return (
    <PageContainer scrollable={true}>
      <DiceChessMultiplayerView />
    </PageContainer>
  );
}
