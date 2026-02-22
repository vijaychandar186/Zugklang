'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { SCHEMES } from '@/components/layout/Scheme/constants';
import { useSchemeConfig } from '@/components/providers/scheme-provider';
import { SchemeModal } from '@/components/layout/Scheme/SchemeModal';

export default function SchemeButton() {
  const { activeScheme, setActiveScheme, customColor } = useSchemeConfig();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const currentSchemeName =
    SCHEMES.find((scheme) => scheme.value === activeScheme)?.name || 'Select';

  return (
    <SchemeModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      activeScheme={activeScheme}
      setActiveScheme={setActiveScheme}
      customColor={customColor}
      currentSchemeName={currentSchemeName}
      DialogTriggerButton={
        <Button
          variant='outline'
          size='sm'
          className='bg-background text-muted-foreground hover:text-muted-foreground active:text-muted-foreground h-9 gap-2 rounded-[0.5rem] font-normal shadow-none'
        >
          <Icons.palette className='h-4 w-4' />
          <span className='hidden sm:inline'>Scheme</span>
        </Button>
      }
    />
  );
}
