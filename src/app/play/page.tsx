import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlayMenuView } from '@/pages-content/play-menu/components/PlayMenuView';

export const metadata: Metadata = {
  title: 'Play | Zugklang',
  description:
    'Choose your game mode. Play against the computer, challenge a friend locally, or analyze positions.'
};

export default function PlayPage() {
  return (
    <PageContainer scrollable={true}>
      <PlayMenuView />
    </PageContainer>
  );
}
