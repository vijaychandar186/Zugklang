'use client';

import type { ReactNode } from 'react';
import { BoardContainer } from '../BoardContainer';

export interface GameViewLayoutProps {
  topPlayerInfo?: ReactNode;
  bottomPlayerInfo?: ReactNode;
  board: ReactNode;
  showEvaluation?: boolean;
  sidebar: ReactNode;
  secondarySidebar?: ReactNode;
  className?: string;
}

export function GameViewLayout({
  topPlayerInfo,
  bottomPlayerInfo,
  board,
  showEvaluation = false,
  sidebar,
  secondarySidebar,
  className = ''
}: GameViewLayoutProps) {
  return (
    <div
      className={`flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6 ${className}`}
    >
      <div className='flex flex-col items-center gap-2'>
        {topPlayerInfo && (
          <div className='flex w-full items-center py-2'>{topPlayerInfo}</div>
        )}

        <BoardContainer showEvaluation={showEvaluation}>{board}</BoardContainer>

        {bottomPlayerInfo && (
          <div className='flex w-full items-center py-2'>
            {bottomPlayerInfo}
          </div>
        )}
      </div>

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {sidebar}
      </div>

      {secondarySidebar && (
        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
          {secondarySidebar}
        </div>
      )}
    </div>
  );
}
