import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { FourPlayerView } from '@/features/custom/four-player/components/FourPlayerView';
export const metadata: Metadata = {
  title: '4-Player Chess | Zugklang',
  description:
    'Play 4-player chess on a 14×14 board with friends on the same device.'
};
export default function FourPlayerPage() {
  return (
    <PageContainer scrollable={true}>
      <FourPlayerView />
    </PageContainer>
  );
}
