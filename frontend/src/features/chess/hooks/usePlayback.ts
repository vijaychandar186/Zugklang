'use client';

import { useState, useEffect, useCallback } from 'react';

export type UsePlaybackOptions = {
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  intervalMs?: number;
  enabled?: boolean;
};

export function usePlayback({
  currentIndex,
  totalItems,
  onNext,
  intervalMs = 600,
  enabled = true
}: UsePlaybackOptions) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsPlaying(false);
      return;
    }

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentIndex < totalItems - 1) {
          onNext();
        } else {
          setIsPlaying(false);
        }
      }, intervalMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, totalItems, onNext, intervalMs, enabled]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    togglePlay,
    play,
    pause,
    setIsPlaying
  };
}
