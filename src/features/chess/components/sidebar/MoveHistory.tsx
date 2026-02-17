'use client';

import { memo, useCallback } from 'react';
import { MoveHistoryBase, MoveData } from './MoveHistoryBase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

type MoveHistoryProps = {
  moves: string[];
  moveDepths?: (number | null)[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
  showDepthTooltips?: boolean;
};

export const MoveHistory = memo(function MoveHistory({
  moves,
  moveDepths,
  viewingIndex,
  onMoveClick,
  showDepthTooltips = false
}: MoveHistoryProps) {
  const getWhiteMove = useCallback(
    (move: string): MoveData => ({ san: move }),
    []
  );

  const getBlackMove = useCallback(
    (items: string[], whiteIndex: number): MoveData | null => {
      const blackMove = items[whiteIndex + 1];
      return blackMove ? { san: blackMove } : null;
    },
    []
  );

  const renderMoveContent = useCallback(
    (move: MoveData) => {
      const moveIndex = moves.indexOf(move.san);
      const depth = moveDepths?.[moveIndex];

      // Only show tooltip if we have depth data and showDepthTooltips is enabled
      if (!showDepthTooltips || depth === undefined || depth === null) {
        return <span>{move.san}</span>;
      }

      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{move.san}</span>
            </TooltipTrigger>
            <TooltipContent side='top' className='text-xs'>
              <p>Stockfish Level: {depth}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    [moves, moveDepths, showDepthTooltips]
  );

  return (
    <MoveHistoryBase
      items={moves}
      viewingIndex={viewingIndex}
      onMoveClick={onMoveClick}
      getWhiteMove={getWhiteMove}
      getBlackMove={getBlackMove}
      renderMoveContent={showDepthTooltips ? renderMoveContent : undefined}
    />
  );
});
