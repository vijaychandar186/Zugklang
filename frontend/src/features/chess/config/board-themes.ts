import { CSSProperties } from 'react';
import { BoardThemeName } from '@/features/chess/types/theme';
export type { BoardThemeName } from '@/features/chess/types/theme';
export type BoardTheme = {
  dark: CSSProperties;
  light: CSSProperties;
  label: string;
  name: BoardThemeName;
};
export const BOARD_THEMES: BoardTheme[] = [
  {
    name: 'default',
    dark: { backgroundColor: 'var(--board-default-dark)' },
    light: { backgroundColor: 'var(--board-default-light)' },
    label: 'Default'
  },
  {
    name: 'blue',
    dark: { backgroundColor: 'var(--board-blue-dark)' },
    light: { backgroundColor: 'var(--board-blue-light)' },
    label: 'Blue'
  },
  {
    name: 'teal',
    dark: { backgroundColor: 'var(--board-teal-dark)' },
    light: { backgroundColor: 'var(--board-teal-light)' },
    label: 'Teal'
  },
  {
    name: 'gold',
    dark: { backgroundColor: 'var(--board-gold-dark)' },
    light: { backgroundColor: 'var(--board-gold-light)' },
    label: 'Gold'
  },
  {
    name: 'orange',
    dark: { backgroundColor: 'var(--board-orange-dark)' },
    light: { backgroundColor: 'var(--board-orange-light)' },
    label: 'Orange'
  },
  {
    name: 'mono',
    dark: { backgroundColor: 'var(--board-mono-dark)' },
    light: { backgroundColor: 'var(--board-mono-light)' },
    label: 'Mono'
  },
  {
    name: 'walnut',
    dark: { backgroundColor: 'var(--board-walnut-dark)' },
    light: { backgroundColor: 'var(--board-walnut-light)' },
    label: 'Walnut'
  },
  {
    name: 'fog',
    dark: { backgroundColor: 'var(--board-fog-dark)' },
    light: { backgroundColor: 'var(--board-fog-light)' },
    label: 'Fog'
  },
  {
    name: 'granite',
    dark: { backgroundColor: 'var(--board-granite-dark)' },
    light: { backgroundColor: 'var(--board-granite-light)' },
    label: 'Granite'
  },
  {
    name: 'charcoal',
    dark: { backgroundColor: 'var(--board-charcoal-dark)' },
    light: { backgroundColor: 'var(--board-charcoal-light)' },
    label: 'Charcoal'
  },
  {
    name: 'maple',
    dark: { backgroundColor: 'var(--board-maple-dark)' },
    light: { backgroundColor: 'var(--board-maple-light)' },
    label: 'Maple'
  },
  {
    name: 'olive',
    dark: { backgroundColor: 'var(--board-olive-dark)' },
    light: { backgroundColor: 'var(--board-olive-light)' },
    label: 'Olive'
  },
  {
    name: 'stone',
    dark: { backgroundColor: 'var(--board-stone-dark)' },
    light: { backgroundColor: 'var(--board-stone-light)' },
    label: 'Stone'
  },
  {
    name: 'violet',
    dark: { backgroundColor: 'var(--board-violet-dark)' },
    light: { backgroundColor: 'var(--board-violet-light)' },
    label: 'Violet'
  },
  {
    name: 'graphite',
    dark: { backgroundColor: 'var(--board-graphite-dark)' },
    light: { backgroundColor: 'var(--board-graphite-light)' },
    label: 'Graphite'
  },
  {
    name: 'steel',
    dark: { backgroundColor: 'var(--board-steel-dark)' },
    light: { backgroundColor: 'var(--board-steel-light)' },
    label: 'Steel'
  },
  {
    name: 'forest',
    dark: { backgroundColor: 'var(--board-forest-dark)' },
    light: { backgroundColor: 'var(--board-forest-light)' },
    label: 'Forest'
  },
  {
    name: 'mahogany',
    dark: { backgroundColor: 'var(--board-mahogany-dark)' },
    light: { backgroundColor: 'var(--board-mahogany-light)' },
    label: 'Mahogany'
  },
  {
    name: 'navy',
    dark: { backgroundColor: 'var(--board-navy-dark)' },
    light: { backgroundColor: 'var(--board-navy-light)' },
    label: 'Navy'
  },
  {
    name: 'rose',
    dark: { backgroundColor: 'var(--board-rose-dark)' },
    light: { backgroundColor: 'var(--board-rose-light)' },
    label: 'Rose'
  },
  {
    name: 'coral',
    dark: { backgroundColor: 'var(--board-coral-dark)' },
    light: { backgroundColor: 'var(--board-coral-light)' },
    label: 'Coral'
  },
  {
    name: 'bronze',
    dark: { backgroundColor: 'var(--board-bronze-dark)' },
    light: { backgroundColor: 'var(--board-bronze-light)' },
    label: 'Bronze'
  },
  {
    name: 'ash',
    dark: { backgroundColor: 'var(--board-ash-dark)' },
    light: { backgroundColor: 'var(--board-ash-light)' },
    label: 'Ash'
  },
  {
    name: 'mist',
    dark: { backgroundColor: 'var(--board-mist-dark)' },
    light: { backgroundColor: 'var(--board-mist-light)' },
    label: 'Mist'
  },
  {
    name: 'amber',
    dark: { backgroundColor: 'var(--board-amber-dark)' },
    light: { backgroundColor: 'var(--board-amber-light)' },
    label: 'Amber'
  },
  {
    name: 'slate',
    dark: { backgroundColor: 'var(--board-slate-dark)' },
    light: { backgroundColor: 'var(--board-slate-light)' },
    label: 'Slate'
  },
  {
    name: 'sand',
    dark: { backgroundColor: 'var(--board-sand-dark)' },
    light: { backgroundColor: 'var(--board-sand-light)' },
    label: 'Sand'
  },
  {
    name: 'cobalt',
    dark: { backgroundColor: 'var(--board-cobalt-dark)' },
    light: { backgroundColor: 'var(--board-cobalt-light)' },
    label: 'Cobalt'
  },
  {
    name: 'blossom',
    dark: { backgroundColor: 'var(--board-blossom-dark)' },
    light: { backgroundColor: 'var(--board-blossom-light)' },
    label: 'Blossom'
  },
  {
    name: 'pewter',
    dark: { backgroundColor: 'var(--board-pewter-dark)' },
    light: { backgroundColor: 'var(--board-pewter-light)' },
    label: 'Pewter'
  }
];

export const CORE_BOARD_THEME_NAMES: BoardThemeName[] = [
  'default',
  'blue',
  'teal',
  'gold',
  'orange',
  'mono'
];
export const DEFAULT_BOARD_THEME: BoardThemeName = 'default';
export function getBoardTheme(name: BoardThemeName): BoardTheme {
  return BOARD_THEMES.find((t) => t.name === name) ?? BOARD_THEMES[0];
}
export const BOARD_STYLES = {
  boardStyle: {
    borderRadius: '4px',
    boxShadow: '0 2px 10px var(--board-shadow)'
  } as CSSProperties,
  getMoveOptionStyle: (isCapture: boolean): CSSProperties => ({
    background: isCapture
      ? 'radial-gradient(circle, var(--highlight-move-option) 85%, transparent 85%)'
      : 'radial-gradient(circle, var(--highlight-move-option) 25%, transparent 25%)',
    borderRadius: '50%'
  }),
  selectedSquare: {
    background: 'var(--highlight-selected)'
  } as CSSProperties,
  premoveSquare: {
    background: 'var(--highlight-premove)'
  } as CSSProperties,
  rightClickSquare: {
    backgroundColor: 'var(--highlight-right-click)'
  } as CSSProperties,
  dropSquareStyle: {
    boxShadow: 'inset 0 0 1px 6px var(--highlight-drop-alt)'
  } as CSSProperties
};
