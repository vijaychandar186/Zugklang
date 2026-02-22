'use client';

import * as React from 'react';
import { Icons } from '@/components/Icons';
import { SCHEMES } from '@/components/layout/Scheme/constants';
import { useSchemeConfig } from '@/components/providers/scheme-provider';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { SchemeModal } from '@/components/layout/Scheme/SchemeModal';

export default function SidebarSchemeButton() {
  const { activeScheme, setActiveScheme, customColor } = useSchemeConfig();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const currentSchemeName =
    SCHEMES.find((scheme) => scheme.value === activeScheme)?.name || 'Select';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
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
            <SidebarMenuButton
              size='sm'
              tooltip='Select Scheme'
              className='text-sidebar-foreground hover:text-sidebar-foreground active:text-sidebar-foreground data-[active=true]:text-sidebar-foreground data-[state=open]:hover:text-sidebar-foreground'
            >
              <Icons.palette className='h-4 w-4' />
              <span>Scheme</span>
            </SidebarMenuButton>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
