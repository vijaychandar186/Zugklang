import { CSSProperties } from 'react';
export type BoardThemeName =
  | 'default'
  | 'blue'
  | 'teal'
  | 'gold'
  | 'orange'
  | 'mono'
  | 'walnut'
  | 'fog'
  | 'granite'
  | 'charcoal'
  | 'maple'
  | 'olive'
  | 'stone'
  | 'violet'
  | 'graphite'
  | 'steel'
  | 'forest'
  | 'mahogany'
  | 'navy'
  | 'rose'
  | 'coral'
  | 'bronze'
  | 'ash'
  | 'mist'
  | 'amber'
  | 'slate'
  | 'sand'
  | 'cobalt'
  | 'blossom'
  | 'pewter';
export type BoardTheme = {
  name: BoardThemeName;
  label: string;
  dark: CSSProperties;
  light: CSSProperties;
};
