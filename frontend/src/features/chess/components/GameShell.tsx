'use client';
import type { ReactNode } from 'react';

/**
 * Shared layout shell for every game mode (play/computer, local, online
 * multiplayer, custom variants).  Handles the outer flex structure, board
 * column, player rows, and the sidebar column — nothing else.
 *
 * Each consumer builds its own player-row content and passes it via slots,
 * so mode-specific details (ratings, signal bars, captured pieces, timers,
 * flags…) never bleed into this component.
 */

export const PANEL_HEIGHT =
  'lg:h-[min(70vw,calc(100dvh-180px),820px)] xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)]';

export interface GameShellProps {
  /** Left side of the top player row (PlayerInfo, signal indicator, etc.). */
  topLeft?: ReactNode;
  /** Right side of the top player row (CapturedPieces, Timer, etc.). */
  topRight?: ReactNode;
  /** Left side of the bottom player row. */
  bottomLeft?: ReactNode;
  /** Right side of the bottom player row. */
  bottomRight?: ReactNode;
  /** The board area — include your own BoardContainer. */
  boardArea: ReactNode;
  /** Right-panel sidebar. */
  sidebar: ReactNode;
  /** Content rendered above the sidebar (e.g. AnalysisLines). */
  analysisBar?: ReactNode;
  /** Portals / overlays appended after the layout (dialogs, secondary-tab
   *  banners, matchmaking modals, promotion dialogs, …). */
  overlays?: ReactNode;
}

export function GameShell({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  boardArea,
  sidebar,
  analysisBar,
  overlays
}: GameShellProps) {
  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        {/* ── Board column ─────────────────────────────────────────── */}
        <div className='flex min-w-0 flex-col items-center gap-2'>
          {/* Top player row */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>{topLeft}</div>
            {topRight != null && (
              <div className='flex items-center gap-2'>{topRight}</div>
            )}
          </div>

          {boardArea}

          {/* Bottom player row */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>{bottomLeft}</div>
            {bottomRight != null && (
              <div className='flex items-center gap-2'>{bottomRight}</div>
            )}
          </div>
        </div>

        {/* ── Sidebar column ───────────────────────────────────────── */}
        <div
          className={`flex w-full flex-col gap-2 sm:h-[400px] lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden ${PANEL_HEIGHT}`}
        >
          {analysisBar != null && (
            <div className='bg-card shrink-0 rounded-lg border'>
              {analysisBar}
            </div>
          )}
          <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
            {sidebar}
          </div>
        </div>
      </div>

      {overlays}
    </>
  );
}
