import type { Metadata } from 'next';
import PrivacyPage from '@/pages-content/privacy/PrivacyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Zugklang',
  description:
    'Privacy Policy for Zugklang — an online chess platform offering variants, puzzles, game review, and real-time multiplayer.'
};

export default function Privacy() {
  return <PrivacyPage />;
}
