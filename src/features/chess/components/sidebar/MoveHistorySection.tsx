'use client';

import type { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoveHistory } from './MoveHistory';
import { NavigationControls } from './NavigationControls';
import type { UseNavigationReturn } from '../../hooks/useNavigation';

export interface MoveHistorySectionProps {
  moves: string[];
  viewingIndex: number;
  totalPositions: number;
  navigation: UseNavigationReturn;
  scrollClassName?: string;
  emptyMessage?: ReactNode;
}

export function MoveHistorySection({
  moves,
  viewingIndex,
  totalPositions,
  navigation,
  scrollClassName = 'h-[180px] lg:h-0 lg:min-h-0 lg:flex-1',
  emptyMessage
}: MoveHistorySectionProps) {
  return (
    <>
      <ScrollArea className={scrollClassName}>
        <div className='px-4 py-2'>
          {moves.length === 0 && emptyMessage ? (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              {emptyMessage}
            </div>
          ) : (
            <MoveHistory
              moves={moves}
              viewingIndex={viewingIndex}
              onMoveClick={navigation.goToMove}
            />
          )}
        </div>
      </ScrollArea>

      <NavigationControls
        viewingIndex={viewingIndex}
        totalPositions={totalPositions}
        canGoBack={navigation.canGoBack}
        canGoForward={navigation.canGoForward}
        isPlaying={navigation.isPlaying}
        onTogglePlay={navigation.togglePlay}
        onGoToStart={navigation.goToStart}
        onGoToEnd={navigation.goToEnd}
        onGoToPrev={navigation.goToPrev}
        onGoToNext={navigation.goToNext}
      />
    </>
  );
}
