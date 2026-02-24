'use client';
import { ThreeDimensionalBoard3D } from './Board3D';
import { ThreeDimensionalChessSidebar } from './ThreeDimensionalChessSidebar';
import { ThreeDimensionalChessPromotionDialog } from './ThreeDimensionalChessPromotionDialog';

function ThreeDimensionalChessView() {
  const desktopStageSizeClass =
    'lg:h-[min(70vw,calc(100dvh-180px),820px)] lg:w-[min(70vw,calc(100dvh-180px),820px)] xl:h-[min(68vw,calc(100dvh-180px),920px)] xl:w-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)] 2xl:w-[min(66vw,calc(100dvh-180px),1020px)]';

  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        {/* 3D Board */}
        <div className='flex flex-col items-center'>
          <div
            className={`h-[min(88vw,560px)] min-h-[320px] w-[min(88vw,560px)] min-w-[320px] overflow-hidden rounded-lg border ${desktopStageSizeClass}`}
          >
            <ThreeDimensionalBoard3D />
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`flex w-full flex-col gap-2 sm:h-[400px] lg:h-auto lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden ${desktopStageSizeClass}`}
        >
          <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
            <ThreeDimensionalChessSidebar />
          </div>
        </div>
      </div>

      {/* Promotion Dialog — rendered outside layout to avoid z-index issues */}
      <ThreeDimensionalChessPromotionDialog />
    </>
  );
}

export { ThreeDimensionalChessView };
export default ThreeDimensionalChessView;
