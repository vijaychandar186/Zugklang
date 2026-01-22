export interface NavigationState {
  viewingIndex: number;
  positionHistory: string[];
  currentFEN: string;
}

export interface NavigationActions {
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
  isViewingHistory: () => boolean;
}

export type NavigationSlice = NavigationState & NavigationActions;

export const createNavigationSlice = <T extends NavigationSlice>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
): NavigationActions => ({
  goToStart: () =>
    set(
      (state) =>
        ({
          viewingIndex: 0,
          currentFEN: state.positionHistory[0]
        }) as Partial<T>
    ),

  goToEnd: () =>
    set(
      (state) =>
        ({
          viewingIndex: state.positionHistory.length - 1,
          currentFEN: state.positionHistory[state.positionHistory.length - 1]
        }) as Partial<T>
    ),

  goToPrev: () =>
    set((state) => {
      const newIndex = Math.max(0, state.viewingIndex - 1);
      return {
        viewingIndex: newIndex,
        currentFEN: state.positionHistory[newIndex]
      } as Partial<T>;
    }),

  goToNext: () =>
    set((state) => {
      const newIndex = Math.min(
        state.positionHistory.length - 1,
        state.viewingIndex + 1
      );
      return {
        viewingIndex: newIndex,
        currentFEN: state.positionHistory[newIndex]
      } as Partial<T>;
    }),

  goToMove: (moveIndex) =>
    set((state) => {
      const positionIndex = moveIndex + 1;
      const clampedIndex = Math.min(
        Math.max(0, positionIndex),
        state.positionHistory.length - 1
      );
      return {
        viewingIndex: clampedIndex,
        currentFEN: state.positionHistory[clampedIndex]
      } as Partial<T>;
    }),

  isViewingHistory: () => {
    const state = get();
    return state.viewingIndex < state.positionHistory.length - 1;
  }
});
