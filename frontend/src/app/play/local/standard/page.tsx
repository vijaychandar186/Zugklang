import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Local Game | Zugklang',
  description:
    'Play chess with a friend on the same device. Take turns and enjoy a classic pass-and-play experience.'
};

export default async function LocalStandardPage() {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <GameView gameType='local' initialBoard3dEnabled={board3dEnabled} />
    </PageContainer>
  );
}
