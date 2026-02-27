'use client';
import { useTriDChessStore } from '../store/useTriDChessStore';
import { TwoPlayerCustomSetupDialog } from '@/features/custom/shared/components/TwoPlayerCustomSetupDialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TriDChessSetupDialog({ open, onOpenChange }: Props) {
  const startNewGame = useTriDChessStore((s) => s.startNewGame);
  return (
    <TwoPlayerCustomSetupDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Tri-Dimensional Chess'
      onStartNewGame={startNewGame}
      rules={
        <p className='text-muted-foreground text-center text-sm'>
          Star Trek&rsquo;s classic 3D variant — played flat.
          <br />
          Three 4×4 fixed boards + four movable 2×2 attack boards.
          <br />
          On your turn: move a piece OR reposition an attack board.
        </p>
      }
    />
  );
}
