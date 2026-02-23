import { useChessStore } from '@/features/chess/stores/useChessStore';
import { DEFAULT_SOUND_THEME } from '@/features/chess/config/media-themes';

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
  | 'tenseconds'
  | 'draw-offer';
const SOUND_FILES: Record<SoundType, string> = {
  'game-start': 'game-start.mp3',
  'game-end': 'game-end.mp3',
  'move-self': 'move-self.mp3',
  'move-opponent': 'move-opponent.mp3',
  capture: 'capture.mp3',
  check: 'move-check.mp3',
  castle: 'castle.mp3',
  promote: 'promote.mp3',
  premove: 'pre-move.mp3',
  notify: 'notify.mp3',
  illegal: 'illegal.mp3',
  tenseconds: 'ten-seconds.mp3',
  'draw-offer': 'draw-offer.mp3'
};
const audioCache: Record<string, HTMLAudioElement> = {};

function getSoundThemeName() {
  if (typeof window === 'undefined') return DEFAULT_SOUND_THEME;
  return useChessStore.getState().soundThemeName ?? DEFAULT_SOUND_THEME;
}

function getThemedSoundPath(type: SoundType) {
  if (type === 'notify') return '/audio/sounds/notify.mp3';
  return `/theme/assets/${getSoundThemeName()}/${SOUND_FILES[type]}`;
}

function preloadSounds() {
  if (typeof window === 'undefined') return;
  const themeName = getSoundThemeName();
  (Object.keys(SOUND_FILES) as SoundType[]).forEach((type) => {
    const path =
      type === 'notify'
        ? '/audio/sounds/notify.mp3'
        : `/theme/assets/${themeName}/${SOUND_FILES[type]}`;
    if (audioCache[path]) return;
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.load();
    audioCache[path] = audio;
  });
}
if (typeof window !== 'undefined') {
  preloadSounds();
}
export function playSound(type: SoundType) {
  try {
    const path = getThemedSoundPath(type);
    const audio =
      audioCache[path] ??
      (() => {
        const created = new Audio(path);
        created.preload = 'auto';
        created.load();
        audioCache[path] = created;
        return created;
      })();
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
const rawAudioCache: Record<string, HTMLAudioElement> = {};
export function playRawSound(path: string) {
  try {
    let audio = rawAudioCache[path];
    if (!audio) {
      audio = new Audio(path);
      audio.preload = 'auto';
      audio.load();
      rawAudioCache[path] = audio;
    }
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.play().catch((error) => {
      console.warn(`Failed to play raw sound: ${path}`, error);
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
