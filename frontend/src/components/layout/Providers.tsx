'use client';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/app/_trpc/client';
import KBar from '@/components/layout/Kbar';
import { InfoSidebar } from '@/components/layout/InfoSidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import {
  BoardThemeName,
  DEFAULT_BOARD_THEME
} from '@/features/chess/config/board-themes';
import { COOKIE_CONFIG } from '@/features/chess/config/board';

const SCHEME_COOKIE = 'scheme';
const CUSTOM_COLOR_COOKIE = 'custom_color';
const CUSTOM_FOREGROUND_COOKIE = 'custom_foreground';
const DEFAULT_CUSTOM_COLOR = '#52525b';
const DEFAULT_CUSTOM_FOREGROUND = '#ffffff';

export const SCHEMES = [
  { name: 'Default', value: 'default' },
  { name: 'Claude', value: 'claude' },
  { name: 'Supabase', value: 'supabase' },
  { name: 'Vercel', value: 'vercel' },
  { name: 'Mono', value: 'mono' },
  { name: 'Notebook', value: 'notebook' },
  { name: 'Custom', value: 'custom' }
] as const;

export type SchemeName = (typeof SCHEMES)[number]['value'];

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
function ThemeCookieSync() {
  const { theme } = useTheme();
  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
    }
  }, [theme]);
  return null;
}
function BoardSchemeSync() {
  const boardThemeName = useChessStore((s) => s.boardThemeName);
  useEffect(() => {
    document.documentElement.setAttribute('data-board-scheme', boardThemeName);
  }, [boardThemeName]);
  return null;
}
function StoreInitializer({
  initialBoardTheme,
  initialPlayAs
}: {
  initialBoardTheme: BoardThemeName;
  initialPlayAs: 'white' | 'black' | undefined;
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useChessStore.setState({
      boardThemeName: initialBoardTheme,
      ...(initialPlayAs && { playAs: initialPlayAs })
    });
    initialized.current = true;
  }
  return null;
}
interface ProvidersProps {
  children: React.ReactNode;
  initialBoardTheme?: string;
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

  useEffect(() => {
    document.documentElement.setAttribute('data-scheme', scheme);
    document.cookie = `${SCHEME_COOKIE}=${scheme};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
  }, [scheme]);
  useEffect(() => {
    document.documentElement.style.setProperty('--custom-color', customColor);
    document.documentElement.style.setProperty(
      '--custom-foreground',
      customForeground
    );
    document.cookie = `${CUSTOM_COLOR_COOKIE}=${customColor};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
    document.cookie = `${CUSTOM_FOREGROUND_COOKIE}=${customForeground};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
  }, [customColor, customForeground]);

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
            <StoreInitializer
              initialBoardTheme={
                (initialBoardTheme as BoardThemeName) || DEFAULT_BOARD_THEME
              }
              initialPlayAs={
                initialPlayAs === 'white' || initialPlayAs === 'black'
                  ? initialPlayAs
                  : undefined
              }
            />
            <ThemeCookieSync />
            <BoardSchemeSync />
            <Toaster position='bottom-right' richColors duration={2000} />
            <SchemeContext.Provider value={schemeValue}>
              <InfobarProvider defaultOpen={false}>
                <KBar>
                  <div className='flex min-h-svh w-full flex-1 flex-col'>
                    {children}
                  </div>
                  <InfoSidebar side='right' />
                </KBar>
              </InfobarProvider>
            </SchemeContext.Provider>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
