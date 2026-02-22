'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSchemeConfig } from '@/components/providers/scheme-provider';
import { Button } from '@/components/ui/button';

interface CustomSchemePickerProps {
  customColor: string;
  activeScheme: string;
  disabled?: boolean;
}

function computeForeground(color: string) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function CustomSchemePicker({
  customColor,
  disabled = false
}: CustomSchemePickerProps) {
  const { setCustomColor, setCustomForeground } = useSchemeConfig();
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const newColor = event.target.value;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        try {
          const newForeground = computeForeground(newColor);
          setCustomColor(newColor);
          setCustomForeground(newForeground);
          document.documentElement.style.setProperty(
            '--custom-color',
            newColor
          );
          document.documentElement.style.setProperty(
            '--custom-foreground',
            newForeground
          );
          const secure = window.location.protocol === 'https:' ? ';Secure' : '';
          document.cookie = `custom_color=${newColor};path=/;max-age=31536000;SameSite=Lax${secure}`;
          document.cookie = `custom_foreground=${newForeground};path=/;max-age=31536000;SameSite=Lax${secure}`;
        } catch (error) {
          console.warn('Error handling custom scheme color change:', error);
        }
      }, 100);

      setTimeoutId(newTimeoutId);
    },
    [disabled, timeoutId, setCustomColor, setCustomForeground]
  );

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='icon'
        className={`h-8 w-8 rounded-md border border-neutral-300 transition-all ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label='Select custom scheme color'
        asChild
      >
        <div>
          <input
            id='custom-scheme-color-input'
            type='color'
            value={customColor}
            onChange={handleColorChange}
            className={`absolute inset-0 cursor-pointer opacity-0 ${disabled ? 'pointer-events-none' : ''}`}
            disabled={disabled}
          />
          <div
            className={`m-auto h-[1.2rem] w-[1.2rem] rounded-sm ${disabled ? 'bg-primary' : ''}`}
            style={disabled ? {} : { backgroundColor: customColor }}
          />
        </div>
      </Button>
    </div>
  );
}
