import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameReviewView } from '@/features/game-review/components/GameReviewView';

export const metadata: Metadata = {
  title: 'Game Review | Zugklang',
  description:
    'Analyse your chess games with Stockfish. Get accuracy scores, move classifications, and detailed insights.'
};

export default function GameReviewPage() {
  return (
    <PageContainer scrollable={true}>
      <GameReviewView />
    </PageContainer>
  );
}
