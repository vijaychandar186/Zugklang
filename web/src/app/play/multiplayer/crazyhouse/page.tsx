import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { MultiplayerGameView } from '@/features/multiplayer/components/MultiplayerGameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Crazyhouse — Online | Zugklang',
  description: 'Play Crazyhouse online. Drop captured pieces back on the board!'
};

export default async function MultiplayerCrazyhousePage({
  searchParams
}: {
  searchParams: Promise<{ challenge?: string }>;
}) {
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <MultiplayerGameView
        variant='crazyhouse'
        initialBoard3dEnabled={board3dEnabled}
        challengeId={params.challenge}
      />
    </PageContainer>
  );
}
