'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { SettingsContent } from './SettingsContent';
type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  show3dToggle?: boolean;
};
export function SettingsDialog({
  open,
  onOpenChange,
  show3dToggle = true
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingsContent
          show3dToggle={show3dToggle}
          hideFullscreenOnMobile={true}
        />
      </DialogContent>
    </Dialog>
  );
}
