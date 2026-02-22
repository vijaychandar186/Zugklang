'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Paintbrush, Pipette, ChevronRight } from 'lucide-react';
import { CustomSchemePicker } from './CustomSchemePicker';
import { SCHEMES } from '@/components/layout/Providers';

type SchemeKey = (typeof SCHEMES)[number]['value'];

interface SchemeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  activeScheme: SchemeKey;
  setActiveScheme: (scheme: SchemeKey) => void;
  customColor: string;
  currentSchemeName: string;
  DialogTriggerButton: React.ReactNode;
}

const BUILTIN_SCHEMES = SCHEMES.filter((scheme) => scheme.value !== 'custom');

export const SchemeModal: React.FC<SchemeModalProps> = ({
  isOpen,
  setIsOpen,
  isDropdownOpen,
  setIsDropdownOpen,
  activeScheme,
  setActiveScheme,
  customColor,
  currentSchemeName,
  DialogTriggerButton
}) => {
  const handleColorPickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{DialogTriggerButton}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Select Scheme</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='w-full justify-between'>
                <div className='flex items-center'>
                  <Paintbrush className='mr-2 h-4 w-4' />
                  {currentSchemeName}
                </div>
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-90' : ''
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='start'
              className='w-[var(--radix-dropdown-menu-trigger-width)]'
            >
              <DropdownMenuLabel>Schemes</DropdownMenuLabel>
              {BUILTIN_SCHEMES.map((scheme) => (
                <DropdownMenuItem
                  key={scheme.value}
                  onClick={() => {
                    setActiveScheme(scheme.value as SchemeKey);
                    setIsDropdownOpen(false);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer ${activeScheme === scheme.value ? 'bg-accent' : ''}`}
                >
                  {scheme.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setActiveScheme('custom');
                }}
                className={`flex cursor-pointer items-center justify-between ${
                  activeScheme === 'custom' ? 'bg-accent' : ''
                }`}
              >
                <span>Custom</span>
                <div
                  className='flex items-center gap-2'
                  onClick={handleColorPickerClick}
                >
                  <Pipette className='h-4 w-4' />
                  <CustomSchemePicker
                    customColor={customColor}
                    activeScheme={activeScheme}
                    disabled={activeScheme !== 'custom'}
                  />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DialogContent>
    </Dialog>
  );
};
