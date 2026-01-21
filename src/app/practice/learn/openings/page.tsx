import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PageContainer } from '@/components/layout/PageContainer';
import { OpeningsView } from '@/features/openings/components/OpeningsView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';

export const metadata: Metadata = {
  title: 'Opening Explorer | Zugklang',
  description:
    'Browse and study thousands of chess openings. Learn the key positions and variations to improve your opening repertoire.'
};

export default async function OpeningsPage() {
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';

  return (
    <PageContainer scrollable={true}>
      <OpeningsView initialBoard3dEnabled={board3dEnabled} />
    </PageContainer>
  );
}
