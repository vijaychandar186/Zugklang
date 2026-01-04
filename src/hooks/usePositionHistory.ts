import { useCallback } from 'react';

type PositionHistoryState = {
  positionHistory: string[];
  viewingIndex: number;
};

type PositionHistoryActions = {
  setViewingIndex: (index: number) => void;
  setCurrentFEN: (fen: string) => void;
};

/**
 * Shared hook for position history navigation.
 * Provides consistent navigation logic for both game and analysis modes.
 */
export function usePositionHistory(
  state: PositionHistoryState,
  actions: PositionHistoryActions
) {
  const { positionHistory, viewingIndex } = state;
  const { setViewingIndex, setCurrentFEN } = actions;

  const goToStart = useCallback(() => {
    setViewingIndex(0);
    setCurrentFEN(positionHistory[0]);
  }, [positionHistory, setViewingIndex, setCurrentFEN]);

  const goToEnd = useCallback(() => {
    const lastIndex = positionHistory.length - 1;
    setViewingIndex(lastIndex);
    setCurrentFEN(positionHistory[lastIndex]);
  }, [positionHistory, setViewingIndex, setCurrentFEN]);

  const goToPrev = useCallback(() => {
    const newIndex = Math.max(0, viewingIndex - 1);
    setViewingIndex(newIndex);
    setCurrentFEN(positionHistory[newIndex]);
  }, [positionHistory, viewingIndex, setViewingIndex, setCurrentFEN]);

  const goToNext = useCallback(() => {
    const newIndex = Math.min(positionHistory.length - 1, viewingIndex + 1);
    setViewingIndex(newIndex);
    setCurrentFEN(positionHistory[newIndex]);
  }, [positionHistory, viewingIndex, setViewingIndex, setCurrentFEN]);

  const goToMove = useCallback(
    (moveIndex: number) => {
      const positionIndex = moveIndex + 1;
      const clampedIndex = Math.min(
        Math.max(0, positionIndex),
        positionHistory.length - 1
      );
      setViewingIndex(clampedIndex);
      setCurrentFEN(positionHistory[clampedIndex]);
    },
    [positionHistory, setViewingIndex, setCurrentFEN]
  );

  const isViewingHistory = viewingIndex < positionHistory.length - 1;

  return {
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    isViewingHistory
  };
}
