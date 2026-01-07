import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnalysisView } from '@/features/analysis/components/AnalysisView';

export const metadata: Metadata = {
  title: 'Analysis Board | Zugklang',
  description:
    'Analyze chess positions with Stockfish 16. Set up your own positions, import PGN/FEN, and continue games against the computer.'
};

export default function AnalysisPage() {
  return (
    <PageContainer scrollable={true}>
      <AnalysisView />
    </PageContainer>
  );
}
