import { create } from 'zustand';
import { BoardTheme } from '@/utils/types';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type BoardStore = {
  theme: BoardTheme;
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
  onNewGame: () => void;
  setTheme: (theme: BoardTheme) => void;
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

export const useBoardStore = create<BoardStore>((set, get) => ({
  theme: {
    darkSquareStyle: { backgroundColor: 'var(--chart-3)' },
    lightSquareStyle: { backgroundColor: 'var(--secondary)' }
  },
  moves: [],
  positionHistory: [STARTING_FEN],
  viewingIndex: 0,
  gameResult: null,
  currentFEN: STARTING_FEN,
  gameOver: false,
  gameStarted: false,
  gameId: 0,
  stockfishLevel: 2,
  playAs: 'white',
  onNewGame: () => {},
  setTheme: (theme) => set({ theme }),
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
      // moveIndex is 0-based index in moves array
      // positionHistory[0] is starting position, positionHistory[1] is after first move, etc.
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
