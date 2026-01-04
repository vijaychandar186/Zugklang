export type SoundType =
  | 'game-start'
  | 'game-end'
  | 'move-self'
  | 'move-opponent'
  | 'capture'
  | 'check'
  | 'castle'
  | 'promote'
  | 'premove'
  | 'notify'
  | 'illegal'
  | 'tenseconds';

const SOUND_FILES: Record<SoundType, string> = {
  'game-start': '/audio/chess-moves/game-start.mp3',
  'game-end': '/audio/chess-moves/game-end.mp3',
  'move-self': '/audio/chess-moves/move-self.mp3',
  'move-opponent': '/audio/chess-moves/move-opponent.mp3',
  capture: '/audio/chess-moves/capture.mp3',
  check: '/audio/chess-moves/move-check.mp3',
  castle: '/audio/chess-moves/castle.mp3',
  promote: '/audio/chess-moves/promote.mp3',
  premove: '/audio/chess-moves/premove.mp3',
  notify: '/audio/chess-moves/notify.mp3',
  illegal: '/audio/chess-moves/illegal.mp3',
  tenseconds: '/audio/chess-moves/tenseconds.mp3'
};

const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};
let preloaded = false;

function preloadSounds() {
  if (preloaded || typeof window === 'undefined') return;

  (Object.keys(SOUND_FILES) as SoundType[]).forEach((type) => {
    const audio = new Audio(SOUND_FILES[type]);
    audio.preload = 'auto';
    audio.load();
    audioCache[type] = audio;
  });

  preloaded = true;
}

if (typeof window !== 'undefined') {
  preloadSounds();
}

export function playSound(type: SoundType) {
  try {
    if (!preloaded) preloadSounds();

    const audio = audioCache[type];
    if (!audio) return;

    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.play().catch((error) => {
      console.warn(`Failed to play sound: ${type}`, error);
    });
  } catch (error) {
    console.warn('Audio playback error', error);
  }
}

export function getSoundType(
  isCapture: boolean,
  isCheck: boolean,
  isCastle: boolean,
  isPromotion: boolean,
  isPlayerMove: boolean
): SoundType {
  if (isCheck) return 'check';
  if (isCastle) return 'castle';
  if (isPromotion) return 'promote';
  if (isCapture) return 'capture';
  return isPlayerMove ? 'move-self' : 'move-opponent';
}
