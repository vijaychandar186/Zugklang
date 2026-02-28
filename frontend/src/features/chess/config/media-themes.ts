const formatThemeLabel = (name: string) =>
  name
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/^3d\b/i, '3D');

export const PIECE_THEME_NAMES = [
  '3d_chesskid',
  '3d_plastic',
  '3d_staunton',
  '3d_wood',
  '8_bit',
  'alpha',
  'bases',
  'blindfold',
  'book',
  'bubblegum',
  'cases',
  'classic',
  'club',
  'condal',
  'dash',
  'game_room',
  'glass',
  'gothic',
  'graffiti',
  'icy_sea',
  'light',
  'lolz',
  'marble',
  'maya',
  'metal',
  'modern',
  'nature',
  'neo',
  'neo_wood',
  'neon',
  'newspaper',
  'ocean',
  'sky',
  'space',
  'staunton',
  'tigers',
  'tournament',
  'vintage',
  'wood'
] as const;

export type PieceThemeName = (typeof PIECE_THEME_NAMES)[number];

export const SOUND_THEME_NAMES = [
  'beat',
  'comedy',
  'default',
  'marble',
  'metal',
  'nature',
  'newspaper',
  'playful',
  'space'
] as const;

export type SoundThemeName = (typeof SOUND_THEME_NAMES)[number];

export const DEFAULT_PIECE_THEME: PieceThemeName = 'neo';
export const DEFAULT_SOUND_THEME: SoundThemeName = 'default';

export const PIECE_THEME_OPTIONS = PIECE_THEME_NAMES.map((name) => ({
  name,
  label: formatThemeLabel(name)
}));

export const SOUND_THEME_OPTIONS = SOUND_THEME_NAMES.map((name) => ({
  name,
  label: formatThemeLabel(name)
}));

export function normalizePieceThemeName(
  value: string | null | undefined
): PieceThemeName {
  if (!value) return DEFAULT_PIECE_THEME;
  return PIECE_THEME_NAMES.includes(value as PieceThemeName)
    ? (value as PieceThemeName)
    : DEFAULT_PIECE_THEME;
}

export function normalizeSoundThemeName(
  value: string | null | undefined
): SoundThemeName {
  if (!value) return DEFAULT_SOUND_THEME;
  return SOUND_THEME_NAMES.includes(value as SoundThemeName)
    ? (value as SoundThemeName)
    : DEFAULT_SOUND_THEME;
}

const STAUNTON_PIECE_NAMES: Record<string, string> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king'
};

export function getPieceAssetPath(
  themeName: string,
  pieceCode: string
): string {
  const normalizedCode = pieceCode.toLowerCase();

  if (themeName === 'staunton') {
    const colorKey = normalizedCode[0];
    const pieceKey = normalizedCode[1];
    const color = colorKey === 'w' ? 'white' : colorKey === 'b' ? 'black' : '';
    const piece = pieceKey ? STAUNTON_PIECE_NAMES[pieceKey] : undefined;

    if (color && piece) {
      return `/theme/pieces/staunton/${color}-${piece}.svg`;
    }
  }

  return `/theme/pieces/${themeName}/${normalizedCode}.png`;
}
