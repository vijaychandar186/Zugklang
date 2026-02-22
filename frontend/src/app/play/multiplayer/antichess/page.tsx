import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { MultiplayerGameView } from '@/features/multiplayer/components/MultiplayerGameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
export const metadata: Metadata = {
  title: 'Antichess — Online | Zugklang',
  description: 'Play Antichess online. Lose all your pieces to win!'
};
export default async function MultiplayerAntichessPage({
  searchParams
}: {
  searchParams: Promise<{
    challenge?: string;
  }>;
}) {
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';
  return (
    <PageContainer scrollable={true}>
      <MultiplayerGameView
        variant='antichess'
        initialBoard3dEnabled={board3dEnabled}
        challengeId={params.challenge}
      />
    </PageContainer>
  );
}
