'use client';
import type { ReactNode } from 'react';
export const PANEL_HEIGHT =
  'lg:h-[min(70vw,calc(100dvh-180px),820px)] xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)]';
export interface GameShellProps {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  boardArea: ReactNode;
  sidebar: ReactNode;
  analysisBar?: ReactNode;
  overlays?: ReactNode;
}
export function GameShell({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  boardArea,
  sidebar,
  analysisBar,
  overlays
}: GameShellProps) {
  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        <div className='flex min-w-0 flex-col items-center gap-2'>
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>{topLeft}</div>
            {topRight != null && (
              <div className='flex items-center gap-2'>{topRight}</div>
            )}
          </div>

          {boardArea}

          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>{bottomLeft}</div>
            {bottomRight != null && (
              <div className='flex items-center gap-2'>{bottomRight}</div>
            )}
          </div>
        </div>

        <div
          className={`flex w-full flex-col gap-2 sm:h-[400px] lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden ${PANEL_HEIGHT}`}
        >
          {analysisBar != null && (
            <div className='bg-card shrink-0 rounded-lg border'>
              {analysisBar}
            </div>
          )}
          <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
            {sidebar}
          </div>
        </div>
      </div>

      {overlays}
    </>
  );
}
