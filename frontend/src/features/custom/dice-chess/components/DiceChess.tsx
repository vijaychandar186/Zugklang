'use client';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
type DiceChessProps = {
  size?: number;
  defaultValue?: DiceValue;
  targetValue?: DiceValue;
  rolling?: boolean;
  disabled?: boolean;
  faces?: string[];
  className?: string;
};
type DiceChessRef = {
  rollDice: (value?: DiceValue) => void;
};
const WHITE_FACES = [
  '/pieces/white-king.svg',
  '/pieces/white-queen.svg',
  '/pieces/white-bishop.svg',
  '/pieces/white-knight.svg',
  '/pieces/white-rook.svg',
  '/pieces/white-pawn.svg'
];
const BLACK_FACES = [
  '/pieces/black-king.svg',
  '/pieces/black-queen.svg',
  '/pieces/black-bishop.svg',
  '/pieces/black-knight.svg',
  '/pieces/black-rook.svg',
  '/pieces/black-pawn.svg'
];
const BOX_ROTATION: Record<DiceValue, string> = {
  1: 'rotateX(90deg) rotateY(0deg) rotateZ(0deg)',
  2: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
  3: 'rotateX(0deg) rotateY(180deg) rotateZ(0deg)',
  4: 'rotateX(-90deg) rotateY(90deg) rotateZ(90deg)',
  5: 'rotateX(90deg) rotateY(-90deg) rotateZ(90deg)',
  6: 'rotateX(-90deg) rotateY(0deg) rotateZ(0deg)'
};
function getFaceTransform(face: DiceValue, t: number): React.CSSProperties {
  switch (face) {
    case 1:
      return { transform: `rotateX(-90deg) translate3d(0,0,${t}px)` };
    case 2:
      return { transform: `translate3d(0,0,${t}px)` };
    case 3:
      return { transform: `rotateY(180deg) translate3d(0,0,${t}px)` };
    case 4:
      return {
        left: '50%',
        marginLeft: -t,
        transform: `rotateY(-90deg) translate3d(0,0,${t}px)`
      };
    case 5:
      return {
        left: '50%',
        marginLeft: -t,
        transform: `rotateY(90deg) translate3d(0,0,${t}px)`
      };
    case 6:
      return { transform: `rotateX(90deg) translate3d(0,0,${t}px)` };
  }
}
const DiceChess = forwardRef<DiceChessRef, DiceChessProps>(
  (
    {
      size = 250,
      defaultValue = 6,
      targetValue,
      rolling = false,
      disabled = false,
      faces = WHITE_FACES,
      className
    },
    ref
  ) => {
    const [value, setValue] = useState<DiceValue>(defaultValue);
    useEffect(() => {
      if (targetValue && !rolling) {
        setValue(targetValue);
      }
    }, [targetValue, rolling]);
    const t = size / 2;
    useImperativeHandle(ref, () => ({
      rollDice: (forcedValue?: DiceValue) => {
        if (forcedValue) setValue(forcedValue);
      }
    }));
    return (
      <div
        className={cn(
          'inline-block',
          disabled && 'opacity-40 grayscale',
          className
        )}
        style={{
          perspective: 1000,
          width: size,
          height: size
        }}
      >
        <div
          className={cn(
            'relative inline-block h-full w-full',
            !rolling &&
              'transition-all duration-[850ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'
          )}
          style={{
            transformStyle: 'preserve-3d',
            ...(rolling
              ? { animation: 'dice-spin 2s infinite linear' }
              : { transform: BOX_ROTATION[value] })
          }}
        >
          {([1, 2, 3, 4, 5, 6] as DiceValue[]).map((face) => (
            <div
              key={face}
              className='bg-secondary absolute flex items-center justify-center overflow-hidden rounded-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]'
              style={{
                width: size,
                height: size,
                ...getFaceTransform(face, t)
              }}
            >
              <Image
                src={faces[face - 1] || WHITE_FACES[face - 1]}
                alt={`Face ${face}`}
                width={size}
                height={size}
                className='pointer-events-none h-full w-full object-contain p-[15%]'
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);
DiceChess.displayName = 'DiceChess';
export { DiceChess, WHITE_FACES, BLACK_FACES };
export type { DiceChessProps, DiceChessRef, DiceValue };
