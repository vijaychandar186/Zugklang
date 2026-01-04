'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { MoveHistory } from '@/components/sidebar/MoveHistory';
import { NavigationControls } from '@/components/sidebar/NavigationControls';
import { ReactNode } from 'react';

export type SidebarProps = {
  // Data
  moves: string[];
  viewingIndex: number;
  totalPositions: number;

  // Navigation State
  canGoBack: boolean;
  canGoForward: boolean;
  isPlaying: boolean;

  // Handlers
  onMoveClick: (index: number) => void;
  onTogglePlay: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;

  // Content Slots
  headerContent?: ReactNode;
  bottomContent?: ReactNode;
};

export function Sidebar({
  moves,
  viewingIndex,
  totalPositions,
  canGoBack,
  canGoForward,
  isPlaying,
  onMoveClick,
  onTogglePlay,
  onGoToStart,
  onGoToEnd,
  onGoToPrev,
  onGoToNext,
  headerContent,
  bottomContent
}: SidebarProps) {
  return (
    <div className='bg-card flex h-full flex-col rounded-lg border'>
      {/* Header */}
      <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
        <h3 className='font-semibold'>Moves</h3>
        <div className='flex items-center gap-1'>{headerContent}</div>
      </div>

      {/* Moves List */}
      <ScrollArea className='h-0 flex-grow'>
        <div className='px-4 py-2'>
          <MoveHistory
            moves={moves}
            viewingIndex={viewingIndex}
            onMoveClick={onMoveClick}
          />
        </div>
      </ScrollArea>

      {/* Navigation Controls */}
      <NavigationControls
        viewingIndex={viewingIndex}
        totalPositions={totalPositions}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        onGoToStart={onGoToStart}
        onGoToEnd={onGoToEnd}
        onGoToPrev={onGoToPrev}
        onGoToNext={onGoToNext}
      />

      {/* Bottom Actions */}
      {bottomContent && (
        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {bottomContent}
        </div>
      )}
    </div>
  );
}
