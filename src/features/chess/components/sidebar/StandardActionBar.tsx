'use client';

import type { ReactNode } from 'react';
import { SidebarActionBar } from './SidebarActionBar';
import {
  SettingsButton,
  FlipBoardButton,
  EngineToggleButton
} from '../actions';

export interface StandardActionBarProps {
  onFlipBoard: () => void;
  showSettings?: boolean;
  show3dToggle?: boolean;
  showEngine?: boolean;
  isEngineOn?: boolean;
  isEngineDisabled?: boolean;
  onToggleEngine?: () => void;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  className?: string;
}

export function StandardActionBar({
  onFlipBoard,
  showSettings = true,
  show3dToggle = true,
  showEngine = false,
  isEngineOn = false,
  isEngineDisabled = false,
  onToggleEngine,
  leftActions,
  rightActions,
  className
}: StandardActionBarProps) {
  return (
    <SidebarActionBar
      className={className}
      leftActions={
        <>
          {showSettings && <SettingsButton show3dToggle={show3dToggle} />}
          <FlipBoardButton onFlip={onFlipBoard} />
          {showEngine && onToggleEngine && (
            <EngineToggleButton
              isOn={isEngineOn}
              disabled={isEngineDisabled}
              onToggle={onToggleEngine}
            />
          )}
          {leftActions}
        </>
      }
      rightActions={rightActions}
    />
  );
}
