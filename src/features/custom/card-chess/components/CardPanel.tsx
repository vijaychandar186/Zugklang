'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import { CardDisplay } from './CardDisplay';
import { useCardChessStore } from '../stores/useCardChessStore';
import { Skeleton } from '@/components/ui/skeleton';

interface CardPanelProps {
  turnColor: 'w' | 'b';
}

export function CardPanel({ turnColor }: CardPanelProps) {
  const { drawnCard, isDrawing, needsDraw, drawCard, drawCount, game } =
    useCardChessStore();

  const handleDraw = useCallback(() => {
    if (!needsDraw || isDrawing) return;
    drawCard(turnColor);
  }, [needsDraw, isDrawing, drawCard, turnColor]);

  const isInCheck = game.isCheck();
  const CARD_SIZE = 100;

  return (
    <div className='border-b px-4 py-3'>
      <div className='flex flex-col items-center gap-3'>
        {/* Always reserve space for the card to prevent layout shift */}
        <div className='flex items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            {drawnCard || isDrawing ? (
              <>
                <div
                  className={cn(
                    'relative rounded-xl border-2 p-2 transition-all duration-300',
                    drawnCard &&
                      !isDrawing &&
                      drawnCard.hasValidMoves &&
                      'border-primary/50 shadow-[0_0_12px_rgba(var(--primary-rgb,59,130,246),0.4)]',
                    drawnCard &&
                      !isDrawing &&
                      !drawnCard.hasValidMoves &&
                      'border-destructive/30',
                    (!drawnCard || isDrawing) && 'border-transparent'
                  )}
                  style={{
                    width: CARD_SIZE + 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CardDisplay
                    card={drawnCard?.card || null}
                    size={CARD_SIZE}
                    isDrawing={isDrawing}
                    disabled={drawnCard ? !drawnCard.hasValidMoves : false}
                  />

                  {drawnCard && !isDrawing && !drawnCard.hasValidMoves && (
                    <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/25'>
                      <span className='text-destructive text-2xl font-bold drop-shadow'>
                        ✗
                      </span>
                    </div>
                  )}
                </div>

                {drawnCard && !isDrawing && (
                  <div className='flex flex-col items-center gap-1'>
                    <span
                      className={cn(
                        'text-sm font-medium tracking-wide',
                        drawnCard.hasValidMoves
                          ? 'text-primary'
                          : 'text-muted-foreground line-through opacity-60'
                      )}
                    >
                      {drawnCard.pieceName}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {drawnCard.card.rank}
                      {drawnCard.card.suit === 'H'
                        ? '♥'
                        : drawnCard.card.suit === 'D'
                          ? '♦'
                          : drawnCard.card.suit === 'C'
                            ? '♣'
                            : '♠'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              // Show skeleton when no card to prevent layout jump
              <div className='flex flex-col items-center gap-2'>
                <Skeleton
                  className='rounded-xl'
                  style={{
                    width: CARD_SIZE + 20,
                    height: CARD_SIZE * 1.4 + 20
                  }}
                />
                <Skeleton className='h-5 w-20' />
                <Skeleton className='h-4 w-12' />
              </div>
            )}
          </div>
        </div>

        {needsDraw && !isDrawing && (
          <>
            <div className='flex flex-col items-center gap-1'>
              <p className='text-muted-foreground text-sm'>
                {turnColor === 'w' ? 'White' : 'Black'}&apos;s turn — Draw a
                card!
              </p>
              {isInCheck && drawCount > 0 && (
                <p className='text-destructive text-xs font-medium'>
                  In Check — Draw {drawCount}/5
                </p>
              )}
            </div>
            <button
              onClick={handleDraw}
              className={cn(
                'group flex items-center justify-center gap-3 rounded-xl px-8 py-3',
                'bg-primary text-primary-foreground font-semibold',
                'transition-all duration-200 hover:opacity-90 active:scale-95',
                'shadow-lg hover:shadow-xl'
              )}
            >
              <Icons.spade className='h-5 w-5' />
              <span>Draw Card</span>
            </button>
          </>
        )}

        {isDrawing && <Skeleton className='h-5 w-24' />}

        {drawnCard && !isDrawing && !needsDraw && (
          <p className='text-muted-foreground text-center text-xs'>
            {drawnCard.hasValidMoves
              ? 'Move the highlighted piece on the board'
              : isInCheck && drawCount < 5
                ? 'No valid moves — drawing another card...'
                : !isInCheck
                  ? 'No valid moves — drawing another card...'
                  : 'Game over!'}
          </p>
        )}
      </div>
    </div>
  );
}
