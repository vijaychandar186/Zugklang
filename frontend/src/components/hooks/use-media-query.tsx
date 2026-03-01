import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery() {
  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return { isOpen };
}
