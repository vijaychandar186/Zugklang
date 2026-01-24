import { useState, useMemo, useCallback, CSSProperties } from 'react';
import { SquareStyles } from '@/features/chess/types/core';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

type UseSquareInteractionOptions = {
  onSquareSelect?: (square: string) => void;
  onSquareDeselect?: () => void;
  additionalStyles?: SquareStyles;
  useDefaultHighlight?: boolean;
};

type UseSquareInteractionReturn = {
  selectedSquare: string | null;
  rightClickSquares: SquareStyles;
  squareStyles: SquareStyles;
  handleSquareClick: (args: { square: string }) => void;
  handleSquareRightClick: (args: { square: string }) => void;
  clearSelection: () => void;
  clearRightClicks: () => void;
  setSelectedSquare: (square: string | null) => void;
  setRightClickSquares: React.Dispatch<React.SetStateAction<SquareStyles>>;
};

const HIGHLIGHT_SELECTED: CSSProperties = {
  backgroundColor: 'var(--highlight-selected)'
};

const HIGHLIGHT_RIGHT_CLICK: CSSProperties = {
  backgroundColor: 'var(--highlight-right-click)'
};

export function useSquareInteraction(
  options: UseSquareInteractionOptions = {}
): UseSquareInteractionReturn {
  const {
    onSquareSelect,
    onSquareDeselect,
    additionalStyles = {},
    useDefaultHighlight = true
  } = options;

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [rightClickSquares, setRightClickSquares] = useState<SquareStyles>({});

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        onSquareDeselect?.();
      } else {
        setSelectedSquare(square);
        onSquareSelect?.(square);
      }
    },
    [selectedSquare, onSquareSelect, onSquareDeselect]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      setRightClickSquares((prev) => {
        const newSquares = { ...prev };
        if (newSquares[square as keyof SquareStyles]) {
          delete newSquares[square as keyof SquareStyles];
        } else {
          (newSquares as Record<string, CSSProperties>)[square] =
            HIGHLIGHT_RIGHT_CLICK;
        }
        return newSquares;
      });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
  }, []);

  const clearRightClicks = useCallback(() => {
    setRightClickSquares({});
  }, []);

  const squareStyles = useMemo<SquareStyles>(() => {
    const styles: Record<string, CSSProperties> = {
      ...additionalStyles,
      ...rightClickSquares
    };

    if (selectedSquare && useDefaultHighlight) {
      styles[selectedSquare] = HIGHLIGHT_SELECTED;
    }

    return styles as SquareStyles;
  }, [
    selectedSquare,
    rightClickSquares,
    additionalStyles,
    useDefaultHighlight
  ]);

  return {
    selectedSquare,
    rightClickSquares,
    squareStyles,
    handleSquareClick,
    handleSquareRightClick,
    clearSelection,
    clearRightClicks,
    setSelectedSquare,
    setRightClickSquares
  };
}

export function getMoveOptionStyles(
  moves: Array<{ to: string; captured?: string }>,
  selectedSquare: string
): SquareStyles {
  const styles: Record<string, CSSProperties> = {};

  moves.forEach((move) => {
    const isCapture = !!move.captured;
    styles[move.to] = BOARD_STYLES.getMoveOptionStyle(isCapture);
  });

  styles[selectedSquare] = BOARD_STYLES.selectedSquare;
  return styles as SquareStyles;
}

export function useBoardTheme() {
  return useMemo(
    () => ({
      darkSquareStyle: { backgroundColor: 'var(--board-square-dark)' },
      lightSquareStyle: { backgroundColor: 'var(--board-square-light)' }
    }),
    []
  );
}
