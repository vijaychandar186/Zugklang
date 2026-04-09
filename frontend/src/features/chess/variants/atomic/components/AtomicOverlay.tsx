'use client';
import Image from 'next/image';
import { useAtomicThreats } from '../hooks/useAtomicThreats';
import type { Chess, ChessJSColor } from '@/lib/chess/chess';
import type { ChessVariant } from '@/features/chess/config/variants';
interface AtomicOverlayProps {
  game: Chess;
  variant: ChessVariant;
  playerColor: ChessJSColor;
  boardFlipped: boolean;
  selectedSquare: string | null;
  captureTargets: string[];
  currentFEN: string;
}
export function AtomicOverlay({
  game,
  variant,
  playerColor,
  boardFlipped,
  selectedSquare,
  captureTargets,
  currentFEN
}: AtomicOverlayProps) {
  const overlays = useAtomicThreats({
    game,
    variant,
    playerColor,
    boardFlipped,
    selectedSquare,
    captureTargets,
    currentFEN
  });
  if (overlays.length === 0) return null;
  return (
    <>
      {overlays.map(({ square, type, left, top }) => (
        <Image
          key={`${type}-${square}`}
          src={`/variant/atomic/${type}.svg`}
          alt={type}
          width={28}
          height={28}
          className='pointer-events-none absolute z-40'
          style={{ left, top }}
        />
      ))}
    </>
  );
}
