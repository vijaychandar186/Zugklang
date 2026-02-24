'use client';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../store/gameStore';

const BOARDS = ['WQL', 'WKL', 'BQL', 'BKL'] as const;
const PINS = [
  'QL1',
  'QL2',
  'QL3',
  'QL4',
  'QL5',
  'QL6',
  'KL1',
  'KL2',
  'KL3',
  'KL4',
  'KL5',
  'KL6'
] as const;

const BOARD_LABELS: Record<string, string> = {
  WQL: 'W-QL',
  WKL: 'W-KL',
  BQL: 'B-QL',
  BKL: 'B-KL'
};

export function ThreeDimensionalChessAttackBoardPanel() {
  const selectedBoardId = useGameStore((s) => s.selectedBoardId);
  const selectBoard = useGameStore((s) => s.selectBoard);
  const canMoveBoard = useGameStore((s) => s.canMoveBoard);
  const moveAttackBoard = useGameStore((s) => s.moveAttackBoard);
  const canRotate = useGameStore((s) => s.canRotate);
  const rotateAttackBoard = useGameStore((s) => s.rotateAttackBoard);
  const attackBoardPositions = useGameStore((s) => s.attackBoardPositions);
  const errorMessage = useGameStore((s) => s.errorMessage);
  const clearErrorMessage = useGameStore((s) => s.clearErrorMessage);

  const eligiblePins = useMemo(() => {
    if (!selectedBoardId) return new Set<string>();
    const set = new Set<string>();
    for (const pin of PINS) {
      const res = canMoveBoard(selectedBoardId, pin);
      if (res.allowed) set.add(pin);
    }
    return set;
  }, [selectedBoardId, canMoveBoard, attackBoardPositions]);

  const canRotate180 = useMemo(() => {
    if (!selectedBoardId) return false;
    return canRotate(selectedBoardId, 180).allowed;
  }, [selectedBoardId, canRotate, attackBoardPositions]);

  return (
    <div className='space-y-3 p-3'>
      <div className='space-y-1.5'>
        <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
          Attack Boards
        </p>
        <div className='flex flex-wrap gap-1.5'>
          {BOARDS.map((id) => (
            <Button
              key={id}
              size='sm'
              variant={selectedBoardId === id ? 'default' : 'outline'}
              className='h-7 px-2 font-mono text-xs'
              onClick={() => selectBoard(selectedBoardId === id ? null : id)}
            >
              {BOARD_LABELS[id]}
            </Button>
          ))}
        </div>
      </div>

      {selectedBoardId && (
        <>
          <div className='space-y-1.5'>
            <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
              Move to Pin
            </p>
            <div className='grid grid-cols-6 gap-1'>
              {PINS.map((pin) => {
                const eligible = eligiblePins.has(pin);
                const result = canMoveBoard(selectedBoardId, pin);
                return (
                  <Button
                    key={pin}
                    size='sm'
                    variant={eligible ? 'secondary' : 'ghost'}
                    className='h-6 px-1 font-mono text-xs'
                    disabled={!eligible}
                    title={
                      !eligible
                        ? result.reason || 'Illegal destination'
                        : undefined
                    }
                    onClick={() =>
                      eligible && moveAttackBoard(selectedBoardId, pin)
                    }
                  >
                    {pin}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className='space-y-1.5'>
            <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
              Rotation
            </p>
            <div className='flex gap-1.5'>
              <Button
                size='sm'
                variant='outline'
                className='h-7 px-2 text-xs'
                onClick={() => rotateAttackBoard(selectedBoardId, 0)}
              >
                0°
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='h-7 px-2 text-xs'
                disabled={!canRotate180}
                onClick={() =>
                  canRotate180 && rotateAttackBoard(selectedBoardId, 180)
                }
              >
                180°
              </Button>
            </div>
          </div>
        </>
      )}

      {errorMessage && (
        <div
          className='bg-destructive/10 text-destructive cursor-pointer rounded-md p-2 text-xs'
          onClick={clearErrorMessage}
        >
          {errorMessage} <span className='opacity-60'>(click to dismiss)</span>
        </div>
      )}

      {!selectedBoardId && (
        <p className='text-muted-foreground text-xs italic'>
          Select an attack board above or click its label on the board
        </p>
      )}
    </div>
  );
}
