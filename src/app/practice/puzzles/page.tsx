import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'Puzzles | Zugklang',
  description:
    'Solve tactical puzzles to sharpen your pattern recognition and calculation skills.'
};

export default function PuzzlesPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Tactical Puzzles</h1>
          <p className='text-muted-foreground mt-2'>Coming soon...</p>
        </div>
      </div>
    </PageContainer>
  );
}
