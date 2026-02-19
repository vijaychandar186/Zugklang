import { StateCreator } from 'zustand';
import { TimeControl } from '@/features/game/types/rules';
import { initializeTimers, hasTimer, getIncrement } from '@/lib/chess/timeControl';
import { getEngineName } from '@/features/chess/config/variants';

export interface TimerSlice {
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;

  setTimeControl: (timeControl: TimeControl) => void;
  tickTimer: (color: 'white' | 'black') => void;
  switchTimer: (toColor: 'white' | 'black') => void;
  stopTimer: () => void;
  onTimeout: (color: 'white' | 'black') => void;
}

export type TimerSliceState = Pick<
  TimerSlice,
  | 'timeControl'
  | 'whiteTime'
  | 'blackTime'
  | 'activeTimer'
  | 'lastActiveTimestamp'
>;

const DEFAULT_TIME_CONTROL: TimeControl = {
  mode: 'unlimited',
  minutes: 0,
  increment: 0
};

type TimerSliceStore = TimerSlice & {
  gameOver: boolean;
  gameResult?: string | null;
  playAs: 'white' | 'black';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variant: any;
};

export const createTimerSlice: StateCreator<
  TimerSliceStore,
  [],
  [],
  TimerSlice
> = (set, get) => ({
  timeControl: DEFAULT_TIME_CONTROL,
  whiteTime: null,
  blackTime: null,
  activeTimer: null,
  lastActiveTimestamp: null,

  setTimeControl: (timeControl) => set({ timeControl }),

  tickTimer: (color) =>
    set((state) => {
      if (state.activeTimer !== color || state.gameOver) return {};
      const timeKey = color === 'white' ? 'whiteTime' : 'blackTime';
      const currentTime = state[timeKey];
      if (currentTime === null || currentTime <= 0) return {};
      return {
        [timeKey]: currentTime - 1,
        lastActiveTimestamp: Date.now()
      };
    }),

  switchTimer: (toColor) =>
    set((state) => {
      if (state.gameOver || state.timeControl.mode === 'unlimited') return {};
      const movedColor = toColor === 'white' ? 'black' : 'white';
      const movedTimeKey = movedColor === 'white' ? 'whiteTime' : 'blackTime';
      const currentTime = state[movedTimeKey];
      const increment = getIncrement(state.timeControl, movedColor);
      const newTime = currentTime !== null ? currentTime + increment : null;
      return {
        activeTimer: toColor,
        [movedTimeKey]: newTime,
        lastActiveTimestamp: Date.now()
      };
    }),

  stopTimer: () => set({ activeTimer: null, lastActiveTimestamp: null }),

  onTimeout: (color) => {
    const state = get();
    const isPlayerTimeout = color === state.playAs;
    const engineName = getEngineName(state.variant);
    set({
      gameOver: true,
      gameResult: isPlayerTimeout
        ? `${engineName} wins on time!`
        : 'You win on time!',
      activeTimer: null,
      lastActiveTimestamp: null
    });
  }
});

export { DEFAULT_TIME_CONTROL, initializeTimers, hasTimer };
