'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/Icons';
import { SCHEMES, type SchemeName } from '@/components/layout/Scheme/constants';

type SchemeSelectorProps = {
  currentScheme: SchemeName;
  onSchemeChange: (scheme: SchemeName) => void;
};

export function SchemeSelector({
  currentScheme,
  onSchemeChange
}: SchemeSelectorProps) {
  return (
    <div className='space-y-3'>
      <Label htmlFor='scheme-selector'>Scheme</Label>
      <Select
        value={currentScheme}
        onValueChange={(value) => onSchemeChange(value as SchemeName)}
      >
        <SelectTrigger
          id='scheme-selector'
          className='justify-start *:data-[slot=select-value]:w-28'
        >
          <span className='text-muted-foreground'>
            <Icons.palette className='h-4 w-4' />
          </span>
          <SelectValue placeholder='Select a scheme' />
        </SelectTrigger>
        <SelectContent align='end'>
          <SelectGroup>
            <SelectLabel>Schemes</SelectLabel>
            {SCHEMES.map((scheme) => (
              <SelectItem key={scheme.value} value={scheme.value}>
                {scheme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
