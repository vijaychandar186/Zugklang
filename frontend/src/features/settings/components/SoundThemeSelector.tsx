'use client';
import { useEffect, useRef, useState } from 'react';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
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
import { THEME_AUDIO_BASE } from '@/lib/public-paths';
type SoundThemeSelectorProps = {
  currentTheme: SoundThemeName;
  onThemeChange: (theme: SoundThemeName) => void;
};
export function SoundThemeSelector({
  currentTheme,
  onThemeChange
}: SoundThemeSelectorProps) {
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewPathRef = useRef<string>('');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);
  const handlePreviewPlay = () => {
    const path = `${THEME_AUDIO_BASE}/${currentTheme}/move-self.mp3`;
    if (!previewAudioRef.current || previewPathRef.current !== path) {
      previewAudioRef.current = new Audio(path);
      previewPathRef.current = path;
    }
    const audio = previewAudioRef.current;
    audio.currentTime = 0;
    setIsPreviewPlaying(true);
    audio
      .play()
      .catch(() => setIsPreviewPlaying(false))
      .finally(() => {
        audio.onended = () => setIsPreviewPlaying(false);
      });
  };
  return (
    <div className='space-y-3'>
      <Label htmlFor='sound-theme-selector'>Sound Theme</Label>
      <div className='flex items-center gap-2'>
        <Select
          value={currentTheme}
          onValueChange={(value) => onThemeChange(value as SoundThemeName)}
        >
          <SelectTrigger id='sound-theme-selector' className='flex-1'>
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
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='h-10 w-10'
          onClick={handlePreviewPlay}
          aria-label='Play sound theme preview'
        >
          <Icons.play className={isPreviewPlaying ? 'opacity-60' : ''} />
        </Button>
      </div>
    </div>
  );
}
