export const NOTIFY_SOUND_PATH = '/audio/notify.mp3';
export const DICE_SOUND_PATH = '/audio/custom/dice.mp3';
export const CARD_SOUND_PATH = '/audio/custom/cards.mp3';
export const ATOMIC_IMPACT_SOUND = '/variant/atomic/impact.mp3';
export const ATOMIC_THREAT_SOUND = '/variant/atomic/threat.mp3';
export const THEME_AUDIO_BASE = '/theme/audio';
export const THEME_PIECES_BASE = '/theme/pieces';
export const PIECE_3D_BASE = `${THEME_PIECES_BASE}/3d`;
export const WOOD_TEXTURE_PATH = '/theme/boards/wood-texture.svg';
export const CHECKERS_PIECE = {
  white: `${THEME_PIECES_BASE}/checkers/white-large.svg`,
  black: `${THEME_PIECES_BASE}/checkers/black-large.svg`
} as const;
export const FALLBACK_FLAG_SRC =
  '/miscellaneous/flags/international-300x100.svg';
const _STAUNTON = `${THEME_PIECES_BASE}/staunton`;
const _FACE_ORDER = [
  'king',
  'queen',
  'bishop',
  'knight',
  'rook',
  'pawn'
] as const;
export const DICE_FACES = {
  white: _FACE_ORDER.map((p) => `${_STAUNTON}/white-${p}.svg`),
  black: _FACE_ORDER.map((p) => `${_STAUNTON}/black-${p}.svg`)
} as const;
