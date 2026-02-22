'use client';
import { useCardChessStore } from '../stores/useCardChessStore';
import { TwoPlayerCustomSetupDialog } from '@/features/custom/shared/components/TwoPlayerCustomSetupDialog';
type CardChessSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function CardChessSetupDialog({
  open,
  onOpenChange
}: CardChessSetupDialogProps) {
  const startNewGame = useCardChessStore((s) => s.startNewGame);
  return (
    <TwoPlayerCustomSetupDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Card Chess'
      onStartNewGame={startNewGame}
      rules={
        <p className='text-muted-foreground text-center text-sm leading-relaxed'>
          Draw a card each turn to determine which piece to move!
          <br />
          <strong className='text-foreground'>2-9</strong> = Pawns (by file),{' '}
          <strong className='text-foreground'>10</strong> = Knight
          <br />
          <strong className='text-foreground'>J</strong> = Bishop,{' '}
          <strong className='text-foreground'>Q</strong> = Queen,{' '}
          <strong className='text-foreground'>K</strong> = King,{' '}
          <strong className='text-foreground'>A</strong> = Rook
          <br />
          <br />
          If in check: max 5 card draws to escape!
        </p>
      }
    />
  );
}
