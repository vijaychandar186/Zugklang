import { CSSProperties } from 'react';

export type BoardThemeName =
  | 'default'
  | 'blue'
  | 'teal'
  | 'gold'
  | 'orange'
  | 'mono';

export type BoardTheme = {
  name: BoardThemeName;
  label: string;
  dark: CSSProperties;
  light: CSSProperties;
};
