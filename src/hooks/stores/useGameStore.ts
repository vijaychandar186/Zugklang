import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { BoardThemeName, DEFAULT_BOARD_THEME } from '@/constants/board-themes';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const BOARD_SCHEME_COOKIE = 'boardScheme';
const SOUND_ENABLED_COOKIE = 'soundEnabled';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=31536000`;
}

const VALID_BOARD_THEMES = [
  'default',
  'blue',
  'teal',
  'gold',
  'orange',
  'mono'
];

function getInitialBoardTheme(): BoardThemeName {
  if (typeof document === 'undefined') return DEFAULT_BOARD_THEME;

  // First try data attribute (set by server from cookie, prevents flash)
  const dataValue = document.documentElement?.getAttribute('data-board-scheme');
  if (dataValue && VALID_BOARD_THEMES.includes(dataValue)) {
    return dataValue as BoardThemeName;
  }

  // Fallback to cookie
  const cookieValue = getCookie(BOARD_SCHEME_COOKIE);
  if (cookieValue && VALID_BOARD_THEMES.includes(cookieValue)) {
    return cookieValue as BoardThemeName;
  }

  return DEFAULT_BOARD_THEME;
}

function getInitialSoundEnabled(): boolean {
  const value = getCookie(SOUND_ENABLED_COOKIE);
  return value !== 'false'; // Default to true
}

type GameStore = {
  // State
  boardThemeName: BoardThemeName;
  soundEnabled: boolean;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  gameResult: string | null;
  currentFEN: string;
  gameOver: boolean;
  gameStarted: boolean;
  gameId: number;
  stockfishLevel: number;
  playAs: 'white' | 'black';
  boardFlipped: boolean;
  onNewGame: () => void;

  // Actions
  setBoardTheme: (name: BoardThemeName) => void;
  setSoundEnabled: (enabled: boolean) => void;
  flipBoard: () => void;
  addMove: (move: string, fen: string) => void;
  setMoves: (moves: string[]) => void;
  setGameResult: (result: string | null) => void;
  setOnNewGame: (onNewGame: () => void) => void;
  setCurrentFEN: (fen: string) => void;
  setGameOver: (gameOver: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setStockfishLevel: (level: number) => void;
  setPlayAs: (color: 'white' | 'black') => void;
  startGame: (level: number, color: 'white' | 'black') => void;
  resetGame: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
  isViewingHistory: () => boolean;
};

export const useGameStore = create<GameStore>((set, get) => ({
  boardThemeName: getInitialBoardTheme(),
  soundEnabled: getInitialSoundEnabled(),
  moves: [],
  positionHistory: [STARTING_FEN],
  viewingIndex: 0,
  gameResult: null,
  currentFEN: STARTING_FEN,
  gameOver: false,
  gameStarted: false,
  gameId: 0,
  stockfishLevel: 10,
  playAs: 'white',
  boardFlipped: false,
  onNewGame: () => {},
  setBoardTheme: (name) => {
    setCookie(BOARD_SCHEME_COOKIE, name);
    set({ boardThemeName: name });
  },
  setSoundEnabled: (enabled) => {
    setCookie(SOUND_ENABLED_COOKIE, String(enabled));
    set({ soundEnabled: enabled });
  },
  flipBoard: () => set((state) => ({ boardFlipped: !state.boardFlipped })),
  addMove: (move, fen) =>
    set((state) => ({
      moves: [...state.moves, move],
      positionHistory: [...state.positionHistory, fen],
      viewingIndex: state.positionHistory.length,
      currentFEN: fen
    })),
  setMoves: (moves) => set({ moves }),
  setGameResult: (result) => set({ gameResult: result }),
  setOnNewGame: (onNewGame) => set({ onNewGame }),
  setCurrentFEN: (fen) => set({ currentFEN: fen }),
  setGameOver: (gameOver) => set({ gameOver }),
  setGameStarted: (started) => set({ gameStarted: started }),
  setStockfishLevel: (level) => set({ stockfishLevel: level }),
  setPlayAs: (color) => set({ playAs: color }),
  startGame: (level, color) =>
    set((state) => ({
      stockfishLevel: level,
      playAs: color,
      boardFlipped: false,
      gameStarted: true,
      gameOver: false,
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      gameResult: null,
      currentFEN: STARTING_FEN,
      gameId: state.gameId + 1
    })),
  resetGame: () =>
    set((state) => ({
      gameOver: false,
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      gameResult: null,
      currentFEN: STARTING_FEN,
      gameId: state.gameId + 1
    })),
  goToStart: () =>
    set((state) => ({
      viewingIndex: 0,
      currentFEN: state.positionHistory[0]
    })),
  goToEnd: () =>
    set((state) => ({
      viewingIndex: state.positionHistory.length - 1,
      currentFEN: state.positionHistory[state.positionHistory.length - 1]
    })),
  goToPrev: () =>
    set((state) => {
      const newIndex = Math.max(0, state.viewingIndex - 1);
      return {
        viewingIndex: newIndex,
        currentFEN: state.positionHistory[newIndex]
      };
    }),
  goToNext: () =>
    set((state) => {
      const newIndex = Math.min(
        state.positionHistory.length - 1,
        state.viewingIndex + 1
      );
      return {
        viewingIndex: newIndex,
        currentFEN: state.positionHistory[newIndex]
      };
    }),
  goToMove: (moveIndex: number) =>
    set((state) => {
      const positionIndex = moveIndex + 1;
      const clampedIndex = Math.min(
        Math.max(0, positionIndex),
        state.positionHistory.length - 1
      );
      return {
        viewingIndex: clampedIndex,
        currentFEN: state.positionHistory[clampedIndex]
      };
    }),
  isViewingHistory: () => {
    const state = get();
    return state.viewingIndex < state.positionHistory.length - 1;
  }
}));

// Grouped selectors for better performance and cleaner component code

export const useGameState = () =>
  useGameStore(
    useShallow((s) => ({
      gameId: s.gameId,
      gameStarted: s.gameStarted,
      gameOver: s.gameOver,
      gameResult: s.gameResult,
      currentFEN: s.currentFEN,
      playAs: s.playAs,
      stockfishLevel: s.stockfishLevel
    }))
  );

export const useMoveHistory = () =>
  useGameStore(
    useShallow((s) => ({
      moves: s.moves,
      viewingIndex: s.viewingIndex,
      positionHistory: s.positionHistory,
      goToStart: s.goToStart,
      goToEnd: s.goToEnd,
      goToPrev: s.goToPrev,
      goToNext: s.goToNext,
      goToMove: s.goToMove
    }))
  );

export const useBoardState = () =>
  useGameStore(
    useShallow((s) => ({
      boardThemeName: s.boardThemeName,
      playAs: s.playAs,
      currentFEN: s.currentFEN,
      viewingIndex: s.viewingIndex,
      positionHistory: s.positionHistory,
      stockfishLevel: s.stockfishLevel,
      addMove: s.addMove,
      setOnNewGame: s.setOnNewGame,
      setGameOver: s.setGameOver,
      resetGame: s.resetGame,
      setGameResult: s.setGameResult,
      goToEnd: s.goToEnd
    }))
  );

export const useGameActions = () =>
  useGameStore(
    useShallow((s) => ({
      startGame: s.startGame,
      resetGame: s.resetGame,
      setBoardTheme: s.setBoardTheme,
      setSoundEnabled: s.setSoundEnabled,
      onNewGame: s.onNewGame,
      setGameOver: s.setGameOver,
      setGameResult: s.setGameResult
    }))
  );
