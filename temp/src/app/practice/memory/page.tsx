import { MemoryView } from '@/features/memory/components/MemoryView';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata = {
  title: 'Memory Training | Zugklang',
  description:
    'Train your board vision by memorizing and recreating chess positions'
};

export default function MemoryPage() {
  return (
    <PageContainer scrollable={true}>
      <MemoryView />
    </PageContainer>
  );
}
