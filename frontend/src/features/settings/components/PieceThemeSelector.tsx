'use client';

import Image from 'next/image';
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
  const knightPreviewSrc = `/theme/pieces/${currentTheme}/wn.png`;

  return (
    <div className='space-y-3'>
      <Label htmlFor='piece-theme-selector'>Piece Theme</Label>
      <div className='flex items-center gap-2'>
        <Select
          value={currentTheme}
          onValueChange={(value) => onThemeChange(value as PieceThemeName)}
        >
          <SelectTrigger id='piece-theme-selector' className='flex-1'>
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
        <div className='bg-muted/40 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border'>
          <Image
            src={knightPreviewSrc}
            alt='Selected knight preview'
            width={28}
            height={28}
            unoptimized
            className='h-7 w-7 object-contain'
          />
        </div>
      </div>
    </div>
  );
}
