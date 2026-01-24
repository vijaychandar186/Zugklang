'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Opening, SortOption, TabOption } from '../types';

interface OpeningsStore {
  // Current selection
  selectedOpening: Opening | null;
  selectedIndex: number;

  // UI state
  searchQuery: string;
  sortOption: SortOption;
  activeTab: TabOption;
  boardOrientation: 'white' | 'black';

  // Favorites (stored as eco+name key for uniqueness)
  favorites: string[];

  // Actions
  setSelectedOpening: (opening: Opening | null, index: number) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  setActiveTab: (tab: TabOption) => void;
  toggleBoardOrientation: () => void;
  toggleFavorite: (opening: Opening) => void;
  removeFavorite: (key: string) => void;
  isFavorite: (opening: Opening) => boolean;
  getFavoriteKey: (opening: Opening) => string;
}

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

      favorites: [],

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

      toggleBoardOrientation: () => {
        set((state) => ({
          boardOrientation:
            state.boardOrientation === 'white' ? 'black' : 'white'
        }));
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
