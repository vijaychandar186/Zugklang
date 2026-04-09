'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';
import { DiceChess } from './DiceChess';
import type { DiceValue } from './DiceChess';
import {
  type DicePiece,
  type DiceResult,
  PIECE_NAMES
} from '../stores/useDiceChessStore';
import { DICE_FACES } from '@/lib/public-paths';
const PIECE_TO_DICE_VALUE: Record<DicePiece, DiceValue> = {
  k: 1,
  q: 2,
  b: 3,
  n: 4,
  r: 5,
  p: 6
};
export interface DiceMultiplayerPanelProps {
  dice: DiceResult[] | null;
  isRolling: boolean;
  needsRoll: boolean;
  onRoll: () => void;
  turnColor: 'w' | 'b';
  isMyTurn: boolean;
  gameStarted: boolean;
  gameOver: boolean;
}
export function DiceMultiplayerPanel({
  dice,
  isRolling,
  needsRoll,
  onRoll,
  turnColor,
  isMyTurn,
  gameStarted,
  gameOver
}: DiceMultiplayerPanelProps) {
  const faces = turnColor === 'w' ? DICE_FACES.white : DICE_FACES.black;
  const rolledValues: [DiceValue, DiceValue, DiceValue] = dice
    ? [
        PIECE_TO_DICE_VALUE[dice[0]!.piece],
        PIECE_TO_DICE_VALUE[dice[1]!.piece],
        PIECE_TO_DICE_VALUE[dice[2]!.piece]
      ]
    : [6, 6, 6];
  const DICE_SIZE = 70;
  if (!gameStarted || gameOver) return null;
  if (!isMyTurn && !dice && !isRolling) {
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
        {(dice || isRolling) && (
          <div className='flex items-center justify-center gap-4'>
            {([0, 1, 2] as const).map((i) => {
              const hasDice = dice !== null;
              const hasValidMoves = hasDice && dice[i]!.hasValidMoves;
              return (
                <div key={i} className='flex flex-col items-center gap-1'>
                  <div
                    className={cn(
                      'relative rounded-xl border-2 p-1 transition-all duration-300',
                      hasDice &&
                        !isRolling &&
                        hasValidMoves &&
                        'border-primary/50 shadow-[0_0_8px_rgba(var(--primary-rgb,59,130,246),0.3)]',
                      hasDice &&
                        !isRolling &&
                        !hasValidMoves &&
                        'border-destructive/30',
                      (!hasDice || isRolling) && 'border-transparent'
                    )}
                    style={{
                      width: DICE_SIZE + 12,
                      height: DICE_SIZE + 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DiceChess
                      size={DICE_SIZE}
                      faces={faces}
                      defaultValue={rolledValues[i]}
                      targetValue={hasDice ? rolledValues[i] : undefined}
                      rolling={isRolling}
                      disabled={hasDice && !isRolling && !hasValidMoves}
                    />
                    {hasDice && !isRolling && !hasValidMoves && (
                      <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/25'>
                        <span className='text-destructive text-xl font-bold drop-shadow'>
                          ✗
                        </span>
                      </div>
                    )}
                  </div>
                  {hasDice && !isRolling && (
                    <span
                      className={cn(
                        'text-[10px] font-medium tracking-wider uppercase',
                        hasValidMoves
                          ? 'text-primary'
                          : 'text-muted-foreground line-through opacity-60'
                      )}
                    >
                      {PIECE_NAMES[dice[i]!.piece]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {needsRoll && !isRolling && (
          <>
            <p className='text-muted-foreground text-sm'>
              {turnColor === 'w' ? 'White' : 'Black'}&apos;s turn — Roll the
              dice!
            </p>
            {isMyTurn && (
              <button
                onClick={onRoll}
                className={cn(
                  'group flex items-center justify-center gap-3 rounded-xl px-8 py-3',
                  'bg-primary text-primary-foreground font-semibold',
                  'transition-all duration-200 hover:opacity-90 active:scale-95',
                  'shadow-lg hover:shadow-xl'
                )}
              >
                <Icons.dices className='h-5 w-5 transition-transform group-hover:rotate-12' />
                <span>Roll Dice</span>
              </button>
            )}
          </>
        )}

        {isRolling && <Skeleton className='h-5 w-24' />}

        {dice && !isRolling && !needsRoll && (
          <p className='text-muted-foreground text-center text-xs'>
            {dice.some((d) => d.hasValidMoves)
              ? isMyTurn
                ? 'Move any highlighted piece on the board'
                : 'Opponent is moving…'
              : 'No valid moves — re-rolling…'}
          </p>
        )}
      </div>
    </div>
  );
}
