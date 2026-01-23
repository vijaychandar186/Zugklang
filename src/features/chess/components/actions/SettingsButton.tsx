'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';

export interface SettingsButtonProps {
  show3dToggle?: boolean;
}

export function SettingsButton({ show3dToggle = true }: SettingsButtonProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSettingsOpen(true)}
          >
            <Icons.settings className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        show3dToggle={show3dToggle}
      />
    </>
  );
}
