import { useEffect, useRef } from 'react';
import { useDiceChessStore } from '../stores/useDiceChessStore';

export function useDiceChessTimer() {
  const {
    timeControl,
    whiteTime,
    blackTime,
    activeTimer,
    gameOver,
    setGameOver,
    setGameResult
  } = useDiceChessStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only run timer if game is timed and not over
    if (timeControl.mode !== 'timed' || gameOver || !activeTimer) {
      return;
    }

    // Start countdown interval - decrement by 1 second every second
    intervalRef.current = setInterval(() => {
      const currentTime = activeTimer === 'white' ? whiteTime : blackTime;

      if (currentTime === null) return;

      const newTime = currentTime - 1;

      if (newTime <= 0) {
        // Time ran out
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        const winner = activeTimer === 'white' ? 'Black' : 'White';
        setGameResult(`${winner} wins on time`);
        setGameOver(true);

        useDiceChessStore.setState({
          [activeTimer === 'white' ? 'whiteTime' : 'blackTime']: 0,
          activeTimer: null,
          lastActiveTimestamp: null
        });
      } else {
        // Decrement time by 1 second
        useDiceChessStore.setState({
          [activeTimer === 'white' ? 'whiteTime' : 'blackTime']: newTime,
          lastActiveTimestamp: Date.now()
        });
      }
    }, 1000); // Update every 1 second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
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
