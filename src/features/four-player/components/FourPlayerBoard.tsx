'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { defaultPieces, defaultDraggingPieceStyle } from 'react-chessboard';
import { useFourPlayerStore } from '../store';
import { TEAM_CSS_VARS } from '../config/teams';
import { isCorner, toSquare } from '../engine';
import type { CSSProperties } from 'react';

const BOARD_ID = 'four-player-chess';

export function FourPlayerBoard() {
  const position = useFourPlayerStore((s) => s.position);
  const orientation = useFourPlayerStore((s) => s.orientation);
  const selectedSquare = useFourPlayerStore((s) => s.selectedSquare);
  const validMoves = useFourPlayerStore((s) => s.validMoves);
  const loseOrder = useFourPlayerStore((s) => s.loseOrder);
  const movePiece = useFourPlayerStore((s) => s.movePiece);
  const selectSquare = useFourPlayerStore((s) => s.selectSquare);

  const eliminatedSet = useMemo(() => new Set(loseOrder), [loseOrder]);

  const fourPlayerPieces = useMemo(() => {
    const pieces: Record<
      string,
      (props?: { fill?: string; svgStyle?: CSSProperties }) => React.JSX.Element
    > = {};

    for (const [prefix, cssColor] of Object.entries(TEAM_CSS_VARS)) {
      const fill = eliminatedSet.has(prefix as keyof typeof TEAM_CSS_VARS)
        ? 'var(--team-eliminated)'
        : cssColor;
      const style = {
        fill,
        svgStyle: { transform: `rotate(${-orientation}deg)` }
      };

      pieces[`${prefix}P`] = () => defaultPieces.wP(style);
      pieces[`${prefix}R`] = () => defaultPieces.wR(style);
      pieces[`${prefix}N`] = () => defaultPieces.wN(style);
      pieces[`${prefix}B`] = () => defaultPieces.wB(style);
      pieces[`${prefix}Q`] = () => defaultPieces.wQ(style);
      pieces[`${prefix}K`] = () => defaultPieces.wK(style);
    }

    return pieces;
  }, [orientation, eliminatedSet]);

  // Hide corner squares via DOM
  useEffect(() => {
    for (let x = 0; x < 14; x++) {
      for (let y = 0; y < 14; y++) {
        if (isCorner(x, y)) {
          const el = document.getElementById(
            `${BOARD_ID}-square-${toSquare(x, y)}`
          );
          if (el) el.style.display = 'none';
        }
      }
    }
  }, []);

  // Square styles for selection + valid move highlights
  const squareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};

    if (selectedSquare) {
      styles[selectedSquare] = {
        background: 'rgba(255, 255, 0, 0.4)'
      };
    }

    for (const sq of validMoves) {
      const isOccupied = !!position[sq];
      styles[sq] = isOccupied
        ? {
            background:
              'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.2) 60%)',
            borderRadius: '50%'
          }
        : {
            background:
              'radial-gradient(circle, rgba(0,0,0,0.15) 25%, transparent 25%)',
            borderRadius: '50%'
          };
    }

    return styles;
  }, [selectedSquare, validMoves, position]);

  const handleDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      return movePiece(sourceSquare, targetSquare);
    },
    [movePiece]
  );

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      selectSquare(square);
    },
    [selectSquare]
  );

  const options = useMemo(
    () => ({
      chessboardRows: 14,
      chessboardColumns: 14,
      position,
      id: BOARD_ID,
      pieces: fourPlayerPieces,
      showNotation: false,
      squareStyles,
      boardStyle: {
        transform: `rotate(${orientation}deg)`
      },
      draggingPieceStyle: {
        ...defaultDraggingPieceStyle,
        transform: `rotate(${orientation}deg)`
      },
      onPieceDrop: handleDrop,
      onSquareClick: handleSquareClick
    }),
    [
      position,
      fourPlayerPieces,
      orientation,
      squareStyles,
      handleDrop,
      handleSquareClick
    ]
  );

  return (
    <div className='w-full'>
      <Chessboard options={options} />
    </div>
  );
}
