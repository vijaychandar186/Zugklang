'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';
import { CardDisplay } from './CardDisplay';
import type { CardResult } from '../stores/useCardChessStore';
export interface CardMultiplayerPanelProps {
  drawnCard: CardResult | null;
  isDrawing: boolean;
  needsDraw: boolean;
  onDraw: () => void;
  turnColor: 'w' | 'b';
  isMyTurn: boolean;
  gameStarted: boolean;
  gameOver: boolean;
  isInCheck: boolean;
  drawCount: number;
}
export function CardMultiplayerPanel({
  drawnCard,
  isDrawing,
  needsDraw,
  onDraw,
  turnColor,
  isMyTurn,
  gameStarted,
  gameOver,
  isInCheck,
  drawCount
}: CardMultiplayerPanelProps) {
  const CARD_SIZE = 100;
  if (!gameStarted || gameOver) return null;
  if (!isMyTurn && !drawnCard && !isDrawing) {
    return (
      <div className='border-b px-4 py-3'>
        <p className='text-muted-foreground text-center text-sm'>
          Waiting for opponent…
        </p>
      </div>
    );
  }
  return (
    <div className='border-b px-4 py-3'>
      <div className='flex flex-col items-center gap-3'>
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
                    card={drawnCard?.card ?? null}
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
            {isMyTurn && (
              <button
                onClick={onDraw}
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
            )}
          </>
        )}

        {isDrawing && <Skeleton className='h-5 w-24' />}

        {drawnCard && !isDrawing && !needsDraw && (
          <p className='text-muted-foreground text-center text-xs'>
            {drawnCard.hasValidMoves
              ? isMyTurn
                ? 'Move the highlighted piece on the board'
                : 'Opponent is moving…'
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
