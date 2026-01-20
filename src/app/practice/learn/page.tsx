import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'Learn Openings | Zugklang',
  description:
    'Study chess openings and build your repertoire. Learn theory, key variations, and master the opening phase.'
};

export default function LearnPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Opening Explorer</h1>
          <p className='text-muted-foreground mt-2'>Coming soon...</p>
        </div>
      </div>
    </PageContainer>
  );
}
