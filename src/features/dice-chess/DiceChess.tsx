'use client';

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

type DiceChessProps = {
  size?: number;
  rollingTime?: number;
  defaultValue?: DiceValue;
  disabled?: boolean;
  cheatValue?: DiceValue;
  faces?: string[];
  onRoll?: (value: DiceValue) => void;
  className?: string;
};

type DiceChessRef = {
  rollDice: (value?: DiceValue) => void;
};

const DEFAULT_FACES = [
  '/pieces/white-king.svg',
  '/pieces/white-queen.svg',
  '/pieces/white-bishop.svg',
  '/pieces/white-knight.svg',
  '/pieces/white-rook.svg',
  '/pieces/white-pawn.svg'
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
      rollingTime = 1000,
      defaultValue = 6,
      disabled = false,
      cheatValue,
      faces = DEFAULT_FACES,
      onRoll,
      className
    },
    ref
  ) => {
    const [value, setValue] = useState<DiceValue>(defaultValue);
    const [rolling, setRolling] = useState(false);
    const t = size / 2;

    const handleRoll = useCallback(
      (forcedValue?: DiceValue) => {
        if (disabled || rolling) return;

        setRolling(true);
        setTimeout(() => {
          let rollValue = (Math.floor(Math.random() * 6) + 1) as DiceValue;
          if (forcedValue) rollValue = forcedValue;
          if (cheatValue) rollValue = cheatValue;

          setRolling(false);
          setValue(rollValue);
          onRoll?.(rollValue);
        }, rollingTime);
      },
      [disabled, rolling, cheatValue, rollingTime, onRoll]
    );

    useImperativeHandle(ref, () => ({ rollDice: handleRoll }));

    return (
      <button
        disabled={disabled || rolling}
        onClick={() => handleRoll()}
        className={cn(
          'inline-block cursor-pointer border-none bg-transparent p-0 shadow-none outline-none',
          'disabled:cursor-not-allowed',
          className
        )}
        style={{
          perspective: 1000,
          width: size,
          height: size,
          filter: disabled ? 'grayscale(100%)' : undefined
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
                src={faces[face - 1] || DEFAULT_FACES[face - 1]}
                alt={`Face ${face}`}
                width={size}
                height={size}
                className='pointer-events-none h-full w-full object-contain p-[15%]'
                draggable={false}
              />
            </div>
          ))}
        </div>
      </button>
    );
  }
);

DiceChess.displayName = 'DiceChess';

export { DiceChess };
export type { DiceChessProps, DiceChessRef, DiceValue };
