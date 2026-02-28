'use client';
import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ChessArrow } from '@/features/chess/types/visualization';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { getPieceAssetPath } from '@/features/chess/config/media-themes';
type PositionObject = Record<
  string,
  {
    pieceType: string;
  }
>;
export type UnifiedChessBoardProps = {
  position: string | PositionObject;
  boardOrientation?: 'white' | 'black';
  canDrag?: boolean;
  squareStyles?: Record<string, CSSProperties | undefined>;
  darkSquareStyle?: CSSProperties;
  lightSquareStyle?: CSSProperties;
  onPieceDrop?: (args: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
  onSquareClick?: (args: { square: string }) => void;
  onSquareRightClick?: (args: { square: string }) => void;
  arrows?: ChessArrow[];
  animationDuration?: number;
  loserColor?: 'w' | 'b' | null;
  pieces?: Record<string, () => React.JSX.Element>;
};
const PIECE_KEYS = ['P', 'R', 'N', 'B', 'Q', 'K'] as const;
const COLORS = ['w', 'b'] as const;

function buildThemedPieces(
  pieceThemeName: string,
  loserColor: 'w' | 'b' | null
): Record<string, () => React.JSX.Element> {
  const pieces: Record<string, () => React.JSX.Element> = {};
  for (const color of COLORS) {
    for (const key of PIECE_KEYS) {
      const pieceKey = `${color}${key}`;
      const fileName = `${color}${key.toLowerCase()}`;
      const src = getPieceAssetPath(pieceThemeName, fileName);
      const isLoserPiece = loserColor === color;
      pieces[pieceKey] = () => (
        <Image
          src={src}
          alt={pieceKey}
          width={64}
          height={64}
          unoptimized
          draggable={false}
          className='h-full w-full object-contain'
          style={
            isLoserPiece ? { filter: 'grayscale(100%)', opacity: 0.45 } : {}
          }
        />
      );
    }
  }
  return pieces;
}

export function UnifiedChessBoard({
  position,
  boardOrientation = 'white',
  canDrag = true,
  squareStyles = {},
  darkSquareStyle,
  lightSquareStyle,
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  arrows = [],
  animationDuration = ANIMATION_CONFIG.durationMs,
  loserColor = null,
  pieces
}: UnifiedChessBoardProps) {
  const pieceThemeName = useChessStore((s) => s.pieceThemeName);
  const themedPieces = useMemo(
    () => buildThemedPieces(pieceThemeName, loserColor),
    [pieceThemeName, loserColor]
  );
  const finalPieces = pieces ?? themedPieces;
  const options = useMemo(
    () => ({
      position,
      boardOrientation,
      allowDragging: canDrag,
      animationDurationInMs: animationDuration,
      boardStyle: BOARD_STYLES.boardStyle,
      squareStyles: Object.fromEntries(
        Object.entries(squareStyles).filter(([, v]) => v !== undefined)
      ) as Record<string, CSSProperties>,
      darkSquareStyle,
      lightSquareStyle,
      dropSquareStyle: {
        boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
      },
      arrows: arrows.map((a) => ({
        startSquare: a.startSquare,
        endSquare: a.endSquare,
        color: a.color
      })),
      onSquareClick,
      onSquareRightClick,
      onPieceDrop,
      ...(finalPieces ? { pieces: finalPieces } : {})
    }),
    [
      position,
      boardOrientation,
      canDrag,
      animationDuration,
      squareStyles,
      darkSquareStyle,
      lightSquareStyle,
      arrows,
      onSquareClick,
      onSquareRightClick,
      onPieceDrop,
      finalPieces
    ]
  );
  return (
    <div className='w-full'>
      <Chessboard options={options} />
    </div>
  );
}
