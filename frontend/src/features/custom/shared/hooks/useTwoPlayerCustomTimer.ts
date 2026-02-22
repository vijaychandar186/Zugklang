import { useEffect, useRef } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { TimeControl } from '@/features/game/types/rules';
type TimerStoreState = {
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  gameOver: boolean;
  setGameOver: (over: boolean) => void;
  setGameResult: (result: string | null) => void;
  lastActiveTimestamp: number | null;
};
type TimerStore = UseBoundStore<StoreApi<TimerStoreState>>;
export function useTwoPlayerCustomTimer(store: TimerStore) {
  const {
    timeControl,
    whiteTime,
    blackTime,
    activeTimer,
    gameOver,
    setGameOver,
    setGameResult
  } = store();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeControl.mode !== 'timed' || gameOver || !activeTimer) {
      return;
    }
    intervalRef.current = setInterval(() => {
      const currentTime = activeTimer === 'white' ? whiteTime : blackTime;
      if (currentTime === null) return;
      const newTime = currentTime - 1;
      const timerKey = activeTimer === 'white' ? 'whiteTime' : 'blackTime';
      if (newTime <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        const winner = activeTimer === 'white' ? 'Black' : 'White';
        setGameResult(`${winner} wins on time`);
        setGameOver(true);
        store.setState({
          [timerKey]: 0,
          activeTimer: null,
          lastActiveTimestamp: null
        } as Partial<TimerStoreState>);
        return;
      }
      store.setState({
        [timerKey]: newTime,
        lastActiveTimestamp: Date.now()
      } as Partial<TimerStoreState>);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    store,
    timeControl.mode,
    activeTimer,
    gameOver,
    whiteTime,
    blackTime,
    setGameOver,
    setGameResult
  ]);
  return {
    hasTimer: timeControl.mode === 'timed',
    whiteTime,
    blackTime,
    activeTimer
  };
}
