'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsContent } from './SettingsContent';
import { FlagPicker } from './FlagPicker';
import {
  DEFAULT_FLAG_CODE,
  normalizeFlagCode
} from '@/features/settings/flags';

type UserSettingsResponse = {
  name: string;
  email: string;
  flagCode: string;
};

export function SettingsPageView() {
  const [activePane, setActivePane] = useState<'game' | 'personal'>('game');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('');
  const [flagCode, setFlagCode] = useState(DEFAULT_FLAG_CODE);
  const [savedFlagCode, setSavedFlagCode] = useState(DEFAULT_FLAG_CODE);
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  useEffect(() => {
    let mounted = true;
    fetch('/api/user/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: UserSettingsResponse | null) => {
        if (!mounted || !data) return;
        const normalized = normalizeFlagCode(data.flagCode);
        setName(data.name || 'User');
        setEmail(data.email || '');
        setFlagCode(normalized);
        setSavedFlagCode(normalized);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const hasUnsavedChanges = useMemo(
    () => normalizeFlagCode(flagCode) !== normalizeFlagCode(savedFlagCode),
    [flagCode, savedFlagCode]
  );

  const handleSave = async () => {
    setIsSaving(true);
    setSaveState('saving');
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagCode: normalizeFlagCode(flagCode) })
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const data = (await res.json()) as {
        flagCode: string;
      };
      const normalized = normalizeFlagCode(data.flagCode);
      setFlagCode(normalized);
      setSavedFlagCode(normalized);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-4 w-72' />
        </div>
        <div className='grid gap-4 md:grid-cols-[220px_1fr]'>
          <section className='space-y-2 rounded-xl border p-3'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </section>
          <section className='space-y-6 rounded-xl border p-5'>
            <Skeleton className='h-6 w-36' />
            <div className='space-y-4'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          </section>
        </div>
      </div>
    );
  }

  const normalizedFlagCode = normalizeFlagCode(flagCode);
  const buttonText = (() => {
    if (saveState === 'saving') return 'Saving…';
    if (saveState === 'saved' && !hasUnsavedChanges) return 'Saved';
    if (saveState === 'error') return 'Retry save';
    return 'Save changes';
  })();

  const navButtonClass = (pane: 'game' | 'personal') =>
    `w-full justify-start transition-colors ${
      activePane === pane
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground active:text-foreground'
    }`;

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight'>Settings</h1>
        <p className='text-muted-foreground text-sm'>
          Manage your game preferences and personal profile options.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-[220px_1fr]'>
        <aside className='bg-card h-fit rounded-xl border p-2'>
          <div className='space-y-1'>
            <Button
              variant={activePane === 'game' ? 'secondary' : 'ghost'}
              className={navButtonClass('game')}
              onClick={() => setActivePane('game')}
            >
              Game Settings
            </Button>
            <Button
              variant={activePane === 'personal' ? 'secondary' : 'ghost'}
              className={navButtonClass('personal')}
              onClick={() => setActivePane('personal')}
            >
              Personal Settings
            </Button>
          </div>
        </aside>

        <section className='bg-card min-h-[520px] space-y-6 rounded-xl border p-5'>
          {activePane === 'game' ? (
            <>
              <h2 className='text-lg font-semibold'>Game Settings</h2>
              <SettingsContent
                show3dToggle={true}
                showThemeAssetSelectors={true}
              />
            </>
          ) : (
            <>
              <h2 className='text-lg font-semibold'>Personal Settings</h2>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Display name</Label>
                  <div className='text-muted-foreground rounded-md border px-3 py-2 text-sm'>
                    {name}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Email</Label>
                  <div className='text-muted-foreground rounded-md border px-3 py-2 text-sm'>
                    {email}
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Country Flag</Label>
                <FlagPicker
                  value={normalizedFlagCode}
                  onValueChange={(nextValue) => {
                    setFlagCode(nextValue);
                    if (saveState !== 'idle') setSaveState('idle');
                  }}
                  disabled={isSaving}
                />
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className='min-w-28'
                >
                  {buttonText}
                </Button>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='outline' asChild>
                  <Link href='/profile'>Go to profile</Link>
                </Button>
                <Button variant='outline' asChild>
                  <Link href='/games'>View game history</Link>
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
