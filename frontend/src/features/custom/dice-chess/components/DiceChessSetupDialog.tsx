'use client';
import { useDiceChessStore } from '../stores/useDiceChessStore';
import { TwoPlayerCustomSetupDialog } from '@/features/custom/shared/components/TwoPlayerCustomSetupDialog';
type DiceChessSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function DiceChessSetupDialog({
  open,
  onOpenChange
}: DiceChessSetupDialogProps) {
  const startNewGame = useDiceChessStore((s) => s.startNewGame);
  return (
    <TwoPlayerCustomSetupDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Dice Chess'
      onStartNewGame={startNewGame}
      rules={
        <p className='text-muted-foreground text-center text-sm'>
          Roll 3 dice each turn. Move only the pieces shown!
          <br />
          If no valid moves, dice automatically re-roll.
        </p>
      }
    />
  );
}
