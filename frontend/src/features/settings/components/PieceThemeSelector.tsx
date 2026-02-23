'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  PIECE_THEME_OPTIONS,
  type PieceThemeName
} from '@/features/chess/config/media-themes';

type PieceThemeSelectorProps = {
  currentTheme: PieceThemeName;
  onThemeChange: (theme: PieceThemeName) => void;
};

export function PieceThemeSelector({
  currentTheme,
  onThemeChange
}: PieceThemeSelectorProps) {
  return (
    <div className='space-y-3'>
      <Label htmlFor='piece-theme-selector'>Piece Theme</Label>
      <Select
        value={currentTheme}
        onValueChange={(value) => onThemeChange(value as PieceThemeName)}
      >
        <SelectTrigger id='piece-theme-selector'>
          <SelectValue placeholder='Select a piece theme' />
        </SelectTrigger>
        <SelectContent align='end'>
          <SelectGroup>
            <SelectLabel>Piece Sets</SelectLabel>
            {PIECE_THEME_OPTIONS.map((theme) => (
              <SelectItem key={theme.name} value={theme.name}>
                {theme.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
