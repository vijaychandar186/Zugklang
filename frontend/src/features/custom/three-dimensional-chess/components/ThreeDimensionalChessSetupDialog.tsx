'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../store/gameStore';

type ThreeDimensionalChessSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ThreeDimensionalChessSetupDialog({
  open,
  onOpenChange
}: ThreeDimensionalChessSetupDialogProps) {
  const resetGame = useGameStore((s) => s.resetGame);

  const handleStart = () => {
    resetGame();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>Three-dimensional Chess</DialogTitle>
          <DialogDescription>
            3D chess played across multiple vertical boards
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='space-y-2 rounded-lg border p-4 text-sm'>
            <p className='font-medium'>How to play:</p>
            <ul className='text-muted-foreground list-inside list-disc space-y-1'>
              <li>Click a piece to select it and see legal moves</li>
              <li>
                Click an attack board disk (or use the sidebar) to select it
              </li>
              <li>Move attack boards to adjacent pins as your turn</li>
              <li>Standard chess rules apply within each level</li>
              <li>Pieces can move between levels via attack boards</li>
            </ul>
          </div>

          <Button onClick={handleStart} className='w-full' size='lg'>
            New Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
