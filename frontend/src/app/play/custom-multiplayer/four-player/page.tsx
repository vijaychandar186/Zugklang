import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { FourPlayerMultiplayerView } from '@/features/custom/four-player/components/FourPlayerMultiplayerView';

export const metadata: Metadata = {
  title: '4-Player Chess Multiplayer | Zugklang',
  description:
    'Play 4-Player Chess in custom multiplayer mode on the 14x14 board.'
};

export default function FourPlayerMultiplayerPage() {
  return (
    <PageContainer scrollable={true}>
      <FourPlayerMultiplayerView />
    </PageContainer>
  );
}
