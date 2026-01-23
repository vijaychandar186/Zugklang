'use client';

import { useState, useCallback, useMemo } from 'react';

export interface UseBoardControlsOptions {
  initialOrientation?: 'white' | 'black';
}

export interface UseBoardControlsReturn {
  orientation: 'white' | 'black';
  flip: () => void;
  setOrientation: (orientation: 'white' | 'black') => void;
}

export function useBoardControls({
  initialOrientation = 'white'
}: UseBoardControlsOptions = {}): UseBoardControlsReturn {
  const [orientation, setOrientation] = useState<'white' | 'black'>(
    initialOrientation
  );

  const flip = useCallback(() => {
    setOrientation((current) => (current === 'white' ? 'black' : 'white'));
  }, []);

  return useMemo(
    () => ({
      orientation,
      flip,
      setOrientation
    }),
    [orientation, flip]
  );
}
