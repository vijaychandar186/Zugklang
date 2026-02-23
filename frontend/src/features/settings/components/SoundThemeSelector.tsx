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
  SOUND_THEME_OPTIONS,
  type SoundThemeName
} from '@/features/chess/config/media-themes';

type SoundThemeSelectorProps = {
  currentTheme: SoundThemeName;
  onThemeChange: (theme: SoundThemeName) => void;
};

export function SoundThemeSelector({
  currentTheme,
  onThemeChange
}: SoundThemeSelectorProps) {
  return (
    <div className='space-y-3'>
      <Label htmlFor='sound-theme-selector'>Sound Theme</Label>
      <Select
        value={currentTheme}
        onValueChange={(value) => onThemeChange(value as SoundThemeName)}
      >
        <SelectTrigger id='sound-theme-selector'>
          <SelectValue placeholder='Select a sound theme' />
        </SelectTrigger>
        <SelectContent align='end'>
          <SelectGroup>
            <SelectLabel>Sound Packs</SelectLabel>
            {SOUND_THEME_OPTIONS.map((theme) => (
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
