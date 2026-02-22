'use client';

import React, { useCallback, useState } from 'react';
import { Contrast } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { ThemeModal } from './ThemeModal';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  trigger?: React.ReactNode;
}

export default function ThemeToggle({ trigger }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = useCallback(
    (newTheme: ThemeMode, e?: React.MouseEvent) => {
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newTheme);
        setIsOpen(false);
        return;
      }

      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      } else {
        root.style.setProperty('--x', '50%');
        root.style.setProperty('--y', '50%');
      }

      document.startViewTransition(() => {
        setTheme(newTheme);
        setIsOpen(false);
      });
    },
    [setTheme]
  );

  return (
    <ThemeModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      currentTheme={theme}
      onTransition={handleThemeChange}
      DialogTriggerButton={
        trigger || (
          <Button
            variant='ghost'
            size='icon'
            className='group text-muted-foreground hover:text-foreground active:text-foreground h-9 w-9'
          >
            <Contrast className='group-hover:text-foreground h-4 w-4' />
            <span className='sr-only'>Select Theme</span>
          </Button>
        )
      }
    />
  );
}
