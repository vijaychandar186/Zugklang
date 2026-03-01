'use client';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/Icons';
import { ABANDON_TIMEOUT_MS } from '../config';
export function SignalIndicator({
  wsStatus,
  latencyMs
}: {
  wsStatus: string;
  latencyMs: number | null;
}) {
  if (wsStatus === 'error' || wsStatus === 'idle' || latencyMs === null)
    return null;
  if (latencyMs <= 80)
    return (
      <Icons.signal
        className='h-4 w-4 text-green-500'
        aria-label={`${latencyMs}ms`}
      />
    );
  if (latencyMs <= 150)
    return (
      <Icons.signalHigh
        className='h-4 w-4 text-green-400'
        aria-label={`${latencyMs}ms`}
      />
    );
  if (latencyMs <= 300)
    return (
      <Icons.signalMedium
        className='h-4 w-4 text-yellow-500'
        aria-label={`${latencyMs}ms`}
      />
    );
  return (
    <Icons.signalLow
      className='h-4 w-4 text-red-500'
      aria-label={`${latencyMs}ms`}
    />
  );
}
export function AbandonCountdown({
  disconnectedAt
}: {
  disconnectedAt: number;
}) {
  const [secsLeft, setSecsLeft] = useState(() =>
    Math.max(
      0,
      Math.ceil((ABANDON_TIMEOUT_MS - (Date.now() - disconnectedAt)) / 1000)
    )
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSecsLeft(
        Math.max(
          0,
          Math.ceil((ABANDON_TIMEOUT_MS - (Date.now() - disconnectedAt)) / 1000)
        )
      );
    }, 500);
    return () => clearInterval(id);
  }, [disconnectedAt]);
  return (
    <span className='animate-pulse text-xs text-yellow-500'>
      Reconnecting… Auto-abandon in {secsLeft}s
    </span>
  );
}
