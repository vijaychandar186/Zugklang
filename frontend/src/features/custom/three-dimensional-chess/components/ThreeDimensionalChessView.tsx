'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FlatChessView } from './FlatChessView';
import { ThreeDimensionalChessSidebar } from './ThreeDimensionalChessSidebar';
import { ThreeDimensionalChessPromotionDialog } from './ThreeDimensionalChessPromotionDialog';

function ThreeDimensionalChessView() {
  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-start lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        {/* Board area */}
        <ScrollArea className='flex-1 lg:h-screen lg:pt-4'>
          <div className='flex justify-center pb-8'>
            <FlatChessView />
          </div>
        </ScrollArea>

        {/* Sidebar */}
        <div className='flex w-full flex-col gap-2 lg:h-screen lg:w-[clamp(20rem,22vw,28rem)] lg:py-4'>
          <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
            <ThreeDimensionalChessSidebar />
          </div>
        </div>
      </div>

      <ThreeDimensionalChessPromotionDialog />
    </>
  );
}

export { ThreeDimensionalChessView };
export default ThreeDimensionalChessView;
