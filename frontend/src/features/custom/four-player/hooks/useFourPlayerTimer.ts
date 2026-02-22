import { useEffect, useRef } from 'react';
import { useFourPlayerStore } from '../store';
import { playSound } from '@/features/game/utils/sounds';
import type { Team } from '../engine';
export function useFourPlayerTimer() {
  const timeControl = useFourPlayerStore((s) => s.timeControl);
  const teamTimes = useFourPlayerStore((s) => s.teamTimes);
  const activeTimer = useFourPlayerStore((s) => s.activeTimer);
  const isGameOver = useFourPlayerStore((s) => s.isGameOver);
  const tickTimer = useFourPlayerStore((s) => s.tickTimer);
  const onTimeout = useFourPlayerStore((s) => s.onTimeout);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTenSecondsRef = useRef<Record<Team, boolean>>({
    r: false,
    b: false,
    y: false,
    g: false
  });
  useEffect(() => {
    if (
      timeControl.mode === 'unlimited' ||
      isGameOver ||
      activeTimer === null
    ) {
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
  }, [timeControl, isGameOver, activeTimer, tickTimer]);
  useEffect(() => {
    if (timeControl.mode === 'unlimited') return;
    const teams: Team[] = ['r', 'b', 'y', 'g'];
    for (const team of teams) {
      const time = teamTimes[team];
      if (time !== null) {
        if (time <= 0 && activeTimer === team) {
          onTimeout(team);
        } else if (time <= 10 && time > 0 && !lastTenSecondsRef.current[team]) {
          lastTenSecondsRef.current[team] = true;
          playSound('tenseconds');
        }
      }
    }
  }, [teamTimes, activeTimer, onTimeout, timeControl]);
  useEffect(() => {
    const teams: Team[] = ['r', 'b', 'y', 'g'];
    for (const team of teams) {
      const time = teamTimes[team];
      if (time !== null && time > 10) {
        lastTenSecondsRef.current[team] = false;
      }
    }
  }, [teamTimes]);
  return {
    timeControl,
    teamTimes,
    activeTimer,
    hasTimer: timeControl.mode !== 'unlimited'
  };
}
