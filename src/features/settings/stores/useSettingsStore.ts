import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BoardThemeName,
  DEFAULT_BOARD_THEME
} from '@/features/chess/config/board-themes';
import { COOKIE_CONFIG } from '@/features/chess/config/board';

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
}

interface SettingsStore {
  boardThemeName: BoardThemeName;
  soundEnabled: boolean;
  board3dEnabled: boolean;
  setBoardTheme: (name: BoardThemeName) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setBoard3dEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      boardThemeName: DEFAULT_BOARD_THEME,
      soundEnabled: true,
      board3dEnabled: false,

      setBoardTheme: (name) => {
        setCookie('board-scheme', name);
        set({ boardThemeName: name });
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      setBoard3dEnabled: (enabled) => set({ board3dEnabled: enabled })
    }),
    {
      name: 'zugklang-settings',
      partialize: (state) => ({
        boardThemeName: state.boardThemeName,
        soundEnabled: state.soundEnabled,
        board3dEnabled: state.board3dEnabled
      })
    }
  )
);
