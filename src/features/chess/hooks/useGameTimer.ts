import { useEffect, useRef } from 'react';
import { useTimerState } from '@/features/chess/stores/useChessStore';
import { playSound } from '@/features/game/utils/sounds';

export function useGameTimer() {
  const {
    timeControl,
    whiteTime,
    blackTime,
    activeTimer,
    playAs,
    gameOver,
    tickTimer,
    onTimeout
  } = useTimerState();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTenSecondsRef = useRef<{ white: boolean; black: boolean }>({
    white: false,
    black: false
  });

  useEffect(() => {
    if (timeControl.mode === 'unlimited' || gameOver || activeTimer === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      tickTimer(activeTimer);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeControl, gameOver, activeTimer, tickTimer]);

  useEffect(() => {
    if (timeControl.mode === 'unlimited') return;

    if (whiteTime !== null) {
      if (whiteTime <= 0 && activeTimer === 'white') {
        onTimeout('white');
      } else if (
        whiteTime <= 10 &&
        whiteTime > 0 &&
        !lastTenSecondsRef.current.white
      ) {
        lastTenSecondsRef.current.white = true;
        if (playAs === 'white') {
          playSound('tenseconds');
        }
      }
    }

    if (blackTime !== null) {
      if (blackTime <= 0 && activeTimer === 'black') {
        onTimeout('black');
      } else if (
        blackTime <= 10 &&
        blackTime > 0 &&
        !lastTenSecondsRef.current.black
      ) {
        lastTenSecondsRef.current.black = true;
        if (playAs === 'black') {
          playSound('tenseconds');
        }
      }
    }
  }, [whiteTime, blackTime, activeTimer, onTimeout, timeControl, playAs]);

  useEffect(() => {
    if (whiteTime !== null && whiteTime > 10) {
      lastTenSecondsRef.current.white = false;
    }
    if (blackTime !== null && blackTime > 10) {
      lastTenSecondsRef.current.black = false;
    }
  }, [whiteTime, blackTime]);

  return {
    timeControl,
    whiteTime,
    blackTime,
    activeTimer,
    hasTimer: timeControl.mode !== 'unlimited'
  };
}
