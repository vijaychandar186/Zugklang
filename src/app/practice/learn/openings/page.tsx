import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { OpeningsView } from '@/features/openings/components/OpeningsView';

export const metadata: Metadata = {
  title: 'Opening Explorer | Zugklang',
  description:
    'Browse and study thousands of chess openings. Learn the key positions and variations to improve your opening repertoire.'
};

export default function OpeningsPage() {
  return (
    <PageContainer scrollable={true}>
      <OpeningsView />
    </PageContainer>
  );
}
