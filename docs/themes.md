# Theme System Guide

This project has **four independent theme layers**:

1. **Appearance mode** (`light` / `dark` / `system`) via `next-themes`.
2. **UI scheme** (`default`, `claude`, `supabase`, etc.) via `data-scheme`.
3. **Board scheme** (`default`, `blue`, `teal`, etc.) via `data-board-scheme`.
4. **Asset themes** (piece images + sound packs) via files under `public/theme/`.

## Source of Truth

- Appearance provider: `frontend/src/components/layout/Providers.tsx`
- Global CSS tokens: `frontend/src/app/globals.css`
- Board color tokens: `frontend/src/app/styles/theme.css`
- UI scheme imports: `frontend/src/app/styles/schemes.css`
- Individual scheme files: `frontend/src/app/styles/themes/*.css`
- Scheme list: `frontend/src/components/layout/Scheme/constants.ts`
- Board theme list: `frontend/src/features/chess/config/board-themes.ts`
- Board theme type union: `frontend/src/features/chess/types/theme.ts`
- Piece + sound theme lists: `frontend/src/features/chess/config/media-themes.ts`

## How State Is Applied

- Appearance mode writes the `.dark` class to the document (`next-themes`).
- UI scheme writes `data-scheme` on `<html>` (`SchemeSyncProvider`).
- Board scheme writes `data-board-scheme` on `<html>` (`BoardSchemeSyncProvider`).
- `RootLayout` (`frontend/src/app/layout.tsx`) hydrates initial values from cookies.

## Add a New Board Theme

Example: add `mint`.

1. Add token variables in `frontend/src/app/styles/theme.css`:

```css
:root {
  --board-mint-dark: #4a9d7e;
  --board-mint-light: #d7efe7;
}

[data-board-scheme='mint'] {
  --board-square-dark: var(--board-mint-dark);
  --board-square-light: var(--board-mint-light);
}
```

2. Add to board theme type in `frontend/src/features/chess/types/theme.ts`:

```ts
| 'mint'
```

3. Register in `frontend/src/features/chess/config/board-themes.ts`:

```ts
{
  name: 'mint',
  dark: { backgroundColor: 'var(--board-mint-dark)' },
  light: { backgroundColor: 'var(--board-mint-light)' },
  label: 'Mint'
}
```

4. Optional: add to `CORE_BOARD_THEME_NAMES` if you want it shown in compact selectors.

## Add a New UI Scheme

Example: add `aurora`.

1. Create `frontend/src/app/styles/themes/aurora.css`:

```css
:root[data-scheme='aurora'] {
  --app-font-sans: var(--font-geist-sans);
  --app-font-mono: var(--font-geist-mono);
  --background: oklch(...);
  --foreground: oklch(...);
  --primary: oklch(...);
  --primary-foreground: oklch(...);
  --secondary: oklch(...);
  --muted: oklch(...);
  --accent: oklch(...);
  --border: oklch(...);
  --input: oklch(...);
  --ring: oklch(...);
  --sidebar: oklch(...);
  --sidebar-foreground: oklch(...);
  --sidebar-primary: oklch(...);
  --sidebar-primary-foreground: oklch(...);
  --sidebar-accent: oklch(...);
  --sidebar-accent-foreground: oklch(...);
}

:root[data-scheme='aurora'].dark {
  /* dark variants for the same tokens */
}
```

2. Import it in `frontend/src/app/styles/schemes.css`:

```css
@import './themes/aurora.css';
```

3. Add it to `SCHEMES` in `frontend/src/components/layout/Scheme/constants.ts`:

```ts
{ name: 'Aurora', value: 'aurora' }
```

## Add a New Piece Theme

1. Add assets under `frontend/public/theme/pieces/<theme_name>/`:

- `wp.png`, `wr.png`, `wn.png`, `wb.png`, `wq.png`, `wk.png`
- `bp.png`, `br.png`, `bn.png`, `bb.png`, `bq.png`, `bk.png`

2. Register the name in `PIECE_THEME_NAMES` inside `frontend/src/features/chess/config/media-themes.ts`.

No extra wiring is needed; board rendering already resolves piece paths as:

`/theme/pieces/${pieceThemeName}/${fileName}.png`

## Add a New Sound Theme

1. Add assets under `frontend/public/theme/assets/<theme_name>/`:

- `move-self.mp3`
- `move-opponent.mp3`
- `move-check.mp3`
- `capture.mp3`
- `castle.mp3`
- `promote.mp3`
- `game-start.mp3`
- `game-end.mp3`
- `draw-offer.mp3`
- `illegal.mp3`
- `pre-move.mp3`
- `ten-seconds.mp3`

2. Register the name in `SOUND_THEME_NAMES` inside `frontend/src/features/chess/config/media-themes.ts`.

## Defaults and Persistence

- Default appearance mode: `defaultTheme='dark'` in `Providers.tsx`.
- Default board scheme: `DEFAULT_BOARD_THEME` in `board-themes.ts`.
- Default piece/sound: `DEFAULT_PIECE_THEME` + `DEFAULT_SOUND_THEME` in `media-themes.ts`.
- Persisted cookies include: `theme`, `scheme`, `boardScheme`, `pieceTheme`, `soundTheme`.

## Quick Verification Checklist

1. Open Settings and switch appearance mode, scheme, board theme, piece theme, and sound theme.
2. Refresh the page and confirm selections persist.
3. Confirm no missing piece images (broken icons) and no missing audio files (preview/play errors).
