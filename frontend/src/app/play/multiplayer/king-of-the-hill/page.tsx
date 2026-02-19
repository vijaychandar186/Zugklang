import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { MultiplayerGameView } from '@/features/multiplayer/components/MultiplayerGameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'King of the Hill — Online | Zugklang',
  description: 'Play King of the Hill online. Get your king to the center!'
};

export default async function MultiplayerKingOfTheHillPage({
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
        variant='kingOfTheHill'
        initialBoard3dEnabled={board3dEnabled}
        challengeId={params.challenge}
      />
    </PageContainer>
  );
}
