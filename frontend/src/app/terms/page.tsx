import type { Metadata } from 'next';
import TermsPage from '@/pages-content/terms/TermsPage';
export const metadata: Metadata = {
  title: 'Terms of Service | Zugklang',
  description:
    'Terms of Service for Zugklang — an online chess platform offering variants, puzzles, game review, and real-time multiplayer.'
};
export default function Terms() {
  return <TermsPage />;
}
