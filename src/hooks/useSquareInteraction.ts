import { useState, useMemo, useCallback, CSSProperties } from 'react';
import { SquareStyles } from '@/types';
import { BOARD_STYLES } from '@/constants/board-themes';

type UseSquareInteractionOptions = {
  /** Called when a square is selected */
  onSquareSelect?: (square: string) => void;
  /** Called when selection is cleared */
  onSquareDeselect?: () => void;
  /** Additional styles to merge (e.g., move options, premoves) */
  additionalStyles?: SquareStyles;
  /** Whether to use the default highlight for selection */
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

/**
 * Get move option styles for legal move squares.
 * Used by both game and analysis boards.
 */
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

// Theme hook for consistent board styling
export function useBoardTheme() {
  return useMemo(
    () => ({
      darkSquareStyle: { backgroundColor: 'var(--board-square-dark)' },
      lightSquareStyle: { backgroundColor: 'var(--board-square-light)' }
    }),
    []
  );
}
