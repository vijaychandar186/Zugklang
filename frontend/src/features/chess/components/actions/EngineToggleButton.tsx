'use client';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
export interface EngineToggleButtonProps {
  isOn: boolean;
  disabled?: boolean;
  onToggle: () => void;
  /** Override the default tooltip text. */
  tooltip?: string;
}
export function EngineToggleButton({
  isOn,
  disabled = false,
  onToggle,
  tooltip
}: EngineToggleButtonProps) {
  const label = tooltip ?? (isOn ? 'Disable Engine' : 'Enable Engine');
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isOn ? 'default' : 'ghost'}
          size='icon'
          onClick={onToggle}
          disabled={disabled}
        >
          <Icons.engine className='h-4 w-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
