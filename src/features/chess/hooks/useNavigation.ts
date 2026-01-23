'use client';

import { useCallback, useMemo } from 'react';
import { usePlayback } from './usePlayback';

export interface UseNavigationOptions {
  viewingIndex: number;
  totalPositions: number;
  onIndexChange: (index: number) => void;
  playbackEnabled?: boolean;
  playbackIntervalMs?: number;
}

export interface UseNavigationReturn {
  canGoBack: boolean;
  canGoForward: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (index: number) => void;
}

export function useNavigation({
  viewingIndex,
  totalPositions,
  onIndexChange,
  playbackEnabled = true,
  playbackIntervalMs = 600
}: UseNavigationOptions): UseNavigationReturn {
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < totalPositions - 1;

  const goToStart = useCallback(() => {
    onIndexChange(0);
  }, [onIndexChange]);

  const goToEnd = useCallback(() => {
    onIndexChange(totalPositions - 1);
  }, [onIndexChange, totalPositions]);

  const goToPrev = useCallback(() => {
    if (viewingIndex > 0) {
      onIndexChange(viewingIndex - 1);
    }
  }, [viewingIndex, onIndexChange]);

  const goToNext = useCallback(() => {
    if (viewingIndex < totalPositions - 1) {
      onIndexChange(viewingIndex + 1);
    }
  }, [viewingIndex, totalPositions, onIndexChange]);

  const goToMove = useCallback(
    (index: number) => {
      onIndexChange(index);
    },
    [onIndexChange]
  );

  const { isPlaying, togglePlay, play, pause } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: totalPositions,
    onNext: goToNext,
    enabled: playbackEnabled,
    intervalMs: playbackIntervalMs
  });

  return useMemo(
    () => ({
      canGoBack,
      canGoForward,
      isPlaying,
      togglePlay,
      play,
      pause,
      goToStart,
      goToEnd,
      goToPrev,
      goToNext,
      goToMove
    }),
    [
      canGoBack,
      canGoForward,
      isPlaying,
      togglePlay,
      play,
      pause,
      goToStart,
      goToEnd,
      goToPrev,
      goToNext,
      goToMove
    ]
  );
}
