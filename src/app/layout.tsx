import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import './theme.css';
import { Providers } from '@/components/layout/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Zugklang',
  description: 'Play chess where the position speaks through sound'
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;
  const boardScheme = cookieStore.get('boardScheme')?.value;
  const playAs = cookieStore.get('playAs')?.value;

  return (
    <html lang='en' suppressHydrationWarning data-board-scheme={boardScheme}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-hidden antialiased`}
        data-theme={theme}
      >
        <Providers initialBoardTheme={boardScheme} initialPlayAs={playAs}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
