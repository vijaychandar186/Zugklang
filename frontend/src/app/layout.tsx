import type { Metadata, Viewport } from 'next';
import type { CSSProperties } from 'react';
import {
  Architects_Daughter,
  Geist,
  Geist_Mono,
  Outfit
} from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import './theme.css';
import { Providers } from '@/components/layout/Providers';
import { auth } from '@/lib/auth/auth';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});
const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin']
});
const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  subsets: ['latin'],
  weight: '400'
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
  const [cookieStore, session] = await Promise.all([cookies(), auth()]);
  const theme = cookieStore.get('theme')?.value;
  const boardScheme = cookieStore.get('boardScheme')?.value;
  const scheme = cookieStore.get('scheme')?.value;
  const customColor = cookieStore.get('custom_color')?.value;
  const customForeground = cookieStore.get('custom_foreground')?.value;
  const playAs = cookieStore.get('playAs')?.value;
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${architectsDaughter.variable}`}
      data-board-scheme={boardScheme}
      data-scheme={scheme || 'default'}
      style={
        {
          '--custom-color': customColor || '#52525b',
          '--custom-foreground': customForeground || '#ffffff'
        } as CSSProperties
      }
    >
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
      <body className='overflow-hidden antialiased' data-theme={theme}>
        <Providers
          initialBoardTheme={boardScheme}
          initialPlayAs={playAs}
          initialSession={session}
          initialScheme={scheme}
          initialCustomColor={customColor}
          initialCustomForeground={customForeground}
        >
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
