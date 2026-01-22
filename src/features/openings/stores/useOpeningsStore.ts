'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Opening, SortOption, TabOption } from '../types';
import {
  createBoardOrientationSlice,
  BoardOrientationSlice
} from '@/features/chess/stores/slices';

interface OpeningsState extends BoardOrientationSlice {
  selectedOpening: Opening | null;
  selectedIndex: number;
  searchQuery: string;
  sortOption: SortOption;
  activeTab: TabOption;
  favorites: string[];
}

interface OpeningsActions {
  setSelectedOpening: (opening: Opening | null, index: number) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  setActiveTab: (tab: TabOption) => void;
  toggleFavorite: (opening: Opening) => void;
  removeFavorite: (key: string) => void;
  isFavorite: (opening: Opening) => boolean;
  getFavoriteKey: (opening: Opening) => string;
}

type OpeningsStore = OpeningsState & OpeningsActions;

const getFavoriteKey = (opening: Opening): string => {
  return `${opening.eco}::${opening.name}::${opening.pgn}`;
};

export const useOpeningsStore = create<OpeningsStore>()(
  persist(
    (set, get) => ({
      selectedOpening: null,
      selectedIndex: -1,

      searchQuery: '',
      sortOption: 'eco',
      activeTab: 'all',
      boardOrientation: 'white',
      boardFlipped: false,

      favorites: [],

      ...createBoardOrientationSlice(set),

      setSelectedOpening: (opening, index) => {
        set({ selectedOpening: opening, selectedIndex: index });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSortOption: (option) => {
        set({ sortOption: option });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab, selectedIndex: -1, selectedOpening: null });
      },

      toggleFavorite: (opening) => {
        const key = getFavoriteKey(opening);
        set((state) => {
          const isFav = state.favorites.includes(key);
          return {
            favorites: isFav
              ? state.favorites.filter((f) => f !== key)
              : [...state.favorites, key]
          };
        });
      },

      removeFavorite: (key) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== key)
        }));
      },

      isFavorite: (opening) => {
        const key = getFavoriteKey(opening);
        return get().favorites.includes(key);
      },

      getFavoriteKey: (opening) => getFavoriteKey(opening)
    }),
    {
      name: 'zugklang-openings',
      partialize: (state) => ({
        favorites: state.favorites,
        sortOption: state.sortOption
      })
    }
  )
);
