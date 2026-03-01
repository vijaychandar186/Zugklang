'use client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/app/_trpc/client';
import {
  BoardThemeName,
  DEFAULT_BOARD_THEME
} from '@/features/chess/config/board-themes';
import {
  BoardSchemeSyncProvider,
  ThemeCookieSyncProvider
} from '@/components/providers/theme-sync-provider';
import { ChessStoreInitializer } from '@/components/providers/chess-store-initializer';
import { KbarProvider } from '@/components/providers/kbar-provider';
import { SchemeSyncProvider } from '@/components/providers/scheme-sync-provider';
import { SCHEMES, type SchemeName } from '@/components/layout/Scheme/constants';
const DEFAULT_CUSTOM_COLOR = '#52525b';
const DEFAULT_CUSTOM_FOREGROUND = '#ffffff';
type SchemeContextValue = {
  scheme: SchemeName;
  setScheme: (scheme: SchemeName) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  customForeground: string;
  setCustomForeground: (color: string) => void;
};
const SchemeContext = createContext<SchemeContextValue | null>(null);
export function useScheme() {
  const context = useContext(SchemeContext);
  if (!context) {
    throw new Error('useScheme must be used within Providers.');
  }
  return context;
}
interface ProvidersProps {
  children: React.ReactNode;
  initialBoardTheme?: string;
  initialPieceTheme?: string;
  initialPlayAs?: string;
  initialSession?: React.ComponentProps<typeof SessionProvider>['session'];
  initialScheme?: string;
  initialCustomColor?: string;
  initialCustomForeground?: string;
}
function isValidHexColor(color: string | undefined): color is string {
  return !!color && /^#[0-9A-Fa-f]{6}$/.test(color);
}
export function Providers({
  children,
  initialBoardTheme,
  initialPieceTheme,
  initialPlayAs,
  initialSession,
  initialScheme,
  initialCustomColor,
  initialCustomForeground
}: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: '/api/trpc' })]
    })
  );
  const [scheme, setScheme] = useState<SchemeName>(() => {
    const candidate = initialScheme as SchemeName | undefined;
    return SCHEMES.some((item) => item.value === candidate)
      ? (candidate as SchemeName)
      : 'default';
  });
  const [customColor, setCustomColor] = useState(() =>
    isValidHexColor(initialCustomColor)
      ? initialCustomColor
      : DEFAULT_CUSTOM_COLOR
  );
  const [customForeground, setCustomForeground] = useState(() =>
    isValidHexColor(initialCustomForeground)
      ? initialCustomForeground
      : DEFAULT_CUSTOM_FOREGROUND
  );
  const schemeValue = useMemo(
    () => ({
      scheme,
      setScheme,
      customColor,
      setCustomColor,
      customForeground,
      setCustomForeground
    }),
    [scheme, customColor, customForeground]
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={initialSession}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <ChessStoreInitializer
              initialBoardTheme={
                (initialBoardTheme as BoardThemeName) || DEFAULT_BOARD_THEME
              }
              initialPieceTheme={initialPieceTheme}
              initialPlayAs={
                initialPlayAs === 'white' || initialPlayAs === 'black'
                  ? initialPlayAs
                  : undefined
              }
            />
            <ThemeCookieSyncProvider />
            <BoardSchemeSyncProvider />
            <SchemeSyncProvider
              scheme={scheme}
              customColor={customColor}
              customForeground={customForeground}
            />
            <Toaster position='bottom-right' richColors duration={2000} />
            <SchemeContext.Provider value={schemeValue}>
              <KbarProvider>{children}</KbarProvider>
            </SchemeContext.Provider>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
