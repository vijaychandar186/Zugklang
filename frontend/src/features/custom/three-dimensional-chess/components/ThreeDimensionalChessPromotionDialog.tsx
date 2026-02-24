'use client';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../store/gameStore';

const PROMOTION_CHOICES = [
  { type: 'queen' as const, label: 'Queen', symbol: '♕', key: 'Q' },
  { type: 'rook' as const, label: 'Rook', symbol: '♖', key: 'R' },
  { type: 'bishop' as const, label: 'Bishop', symbol: '♗', key: 'B' },
  { type: 'knight' as const, label: 'Knight', symbol: '♘', key: 'N' }
];

export function ThreeDimensionalChessPromotionDialog() {
  const promotionPending = useGameStore((state) => state.promotionPending);
  const executePromotion = useGameStore((state) => state.executePromotion);
  const pieces = useGameStore((state) => state.pieces);

  useEffect(() => {
    if (!promotionPending) return;
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const choice = PROMOTION_CHOICES.find((c) => c.key === key);
      if (choice) executePromotion(choice.type);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [promotionPending, executePromotion]);

  if (!promotionPending) return null;
  const piece = pieces.find((p) => p.id === promotionPending.pieceId);
  if (!piece) return null;

  const isForced = promotionPending.isForced;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        className='sm:max-w-[320px]'
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isForced ? 'Forced Promotion' : 'Pawn Promotion'}
          </DialogTitle>
          <DialogDescription>
            {isForced
              ? 'Your pawn must promote before continuing.'
              : 'Choose a piece to promote to.'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-3 pt-2'>
          {PROMOTION_CHOICES.map((choice) => (
            <Button
              key={choice.type}
              variant='outline'
              className='flex h-16 flex-col items-center gap-1'
              onClick={() => executePromotion(choice.type)}
            >
              <span className='text-2xl'>{choice.symbol}</span>
              <span className='text-xs'>{choice.label}</span>
            </Button>
          ))}
        </div>

        <p className='text-muted-foreground text-center text-xs'>
          Press Q, R, B, or N
        </p>
      </DialogContent>
    </Dialog>
  );
}
