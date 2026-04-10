export interface BoardOrientationState {
  boardOrientation: 'white' | 'black';
  boardFlipped: boolean;
}

export interface BoardOrientationActions {
  setBoardOrientation: (orientation: 'white' | 'black') => void;
  toggleBoardOrientation: () => void;
  flipBoard: () => void;
  setBoardFlipped: (flipped: boolean) => void;
}

export type BoardOrientationSlice = BoardOrientationState &
  BoardOrientationActions;

export const createBoardOrientationSlice = <T extends BoardOrientationSlice>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void
): BoardOrientationActions => ({
  setBoardOrientation: (orientation) =>
    set({ boardOrientation: orientation } as Partial<T>),

  toggleBoardOrientation: () =>
    set(
      (state) =>
        ({
          boardOrientation:
            state.boardOrientation === 'white' ? 'black' : 'white'
        }) as Partial<T>
    ),

  flipBoard: () =>
    set(
      (state) =>
        ({
          boardFlipped: !state.boardFlipped
        }) as Partial<T>
    ),

  setBoardFlipped: (flipped) => set({ boardFlipped: flipped } as Partial<T>)
});
