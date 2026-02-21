'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export interface FlipBoardButtonProps {
  onFlip: () => void;
}

export function FlipBoardButton({ onFlip }: FlipBoardButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon' onClick={onFlip}>
          <Icons.flipBoard className='h-4 w-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Flip Board</TooltipContent>
    </Tooltip>
  );
}
