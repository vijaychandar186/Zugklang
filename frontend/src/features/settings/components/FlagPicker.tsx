'use client';

import { useMemo } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  DEFAULT_FLAG_CODE,
  FLAG_OPTIONS,
  getCountryDisplayName,
  normalizeFlagCode
} from '@/features/settings/flags';

type FlagPickerProps = {
  value: string;
  onValueChange: (flagCode: string) => void;
  disabled?: boolean;
};

export function FlagPicker({
  value,
  onValueChange,
  disabled = false
}: FlagPickerProps) {
  const normalizedValue = normalizeFlagCode(value);
  const flagItems = useMemo(
    () => [
      { code: DEFAULT_FLAG_CODE, label: 'International (Default)' },
      ...FLAG_OPTIONS.map((code) => ({
        code,
        label: `${getCountryDisplayName(code)} (${code})`
      }))
    ],
    []
  );
  const selectedItem = flagItems.find((item) => item.code === normalizedValue);

  return (
    <Combobox
      items={flagItems}
      value={selectedItem ?? null}
      onValueChange={(nextValue) => {
        if (!nextValue) return;
        onValueChange(nextValue.code);
      }}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.code}
      autoHighlight={true}
    >
      <ComboboxInput
        className='w-full [&_[data-slot=input-group-control]]:pl-11'
        placeholder='Search country or code...'
        disabled={disabled}
        showClear={true}
      >
        <div className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'>
          {selectedItem && (
            <CountryFlag
              code={selectedItem.code}
              className='h-4 w-6 rounded-[2px] border border-black/10'
            />
          )}
        </div>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No matching countries.</ComboboxEmpty>
        <ComboboxList className='max-h-72'>
          {flagItems.map((item) => (
            <ComboboxItem key={item.code} value={item}>
              <div className='flex items-center gap-2'>
                <CountryFlag
                  code={item.code}
                  className='h-4 w-6 rounded-[2px] border border-black/10'
                />
                <span className='text-sm'>{item.label}</span>
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
