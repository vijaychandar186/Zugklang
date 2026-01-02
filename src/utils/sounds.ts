// Chess sound effects using audio files

type SoundType = 'move' | 'capture' | 'check' | 'castle' | 'promote' | 'notify';

const SOUND_FILES: Record<SoundType, string> = {
  move: '/audio/chess-moves/move.mp3',
  capture: '/audio/chess-moves/capture.mp3',
  check: '/audio/chess-moves/check.mp3',
  castle: '/audio/chess-moves/castle.mp3',
  promote: '/audio/chess-moves/promote.mp3',
  notify: '/audio/chess-moves/notify.mp3'
};

// Preloaded audio elements
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};
let preloaded = false;

// Preload all audio files
function preloadSounds() {
  if (preloaded || typeof window === 'undefined') return;

  (Object.keys(SOUND_FILES) as SoundType[]).forEach((type) => {
    const audio = new Audio(SOUND_FILES[type]);
    audio.preload = 'auto';
    // Load the audio file
    audio.load();
    audioCache[type] = audio;
  });

  preloaded = true;
}

// Initialize preloading
if (typeof window !== 'undefined') {
  // Preload immediately
  preloadSounds();
}

export function playSound(type: SoundType) {
  try {
    // Ensure sounds are preloaded
    if (!preloaded) preloadSounds();

    const audio = audioCache[type];
    if (!audio) return;

    // Clone the audio to allow overlapping sounds
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.play().catch(() => {
      // Audio playback failed, fail silently
    });
  } catch {
    // Audio not supported, fail silently
  }
}

// Determine sound type from chess move
export function getSoundType(
  isCapture: boolean,
  isCheck: boolean,
  isCastle: boolean,
  isPromotion: boolean
): SoundType {
  if (isCheck) return 'check';
  if (isCastle) return 'castle';
  if (isPromotion) return 'promote';
  if (isCapture) return 'capture';
  return 'move';
}
