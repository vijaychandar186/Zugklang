'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    if (!document.startViewTransition) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
    document.startViewTransition(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    });
  };
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={handleToggle}
      className='h-9 w-9'
    >
      <Icons.sun className='h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Icons.moon className='absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
