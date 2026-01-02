import { CSSProperties } from 'react';

export type BoardThemeName =
  | 'default'
  | 'blue'
  | 'teal'
  | 'gold'
  | 'orange'
  | 'mono';

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
  }
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
  } as CSSProperties
};
