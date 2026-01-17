import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import { Chess, Square, Move } from 'chess.js';
import { createModeStorage } from '@/features/chess/stores/gameStorage';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type AnalysisBoardStore = {
  game: Chess;
  currentFEN: string;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  boardOrientation: 'white' | 'black';
  playingAgainstStockfish: boolean;
  playerColor: 'white' | 'black';
  stockfishLevel: number;

  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  addMove: (move: string, fen: string) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
  isViewingHistory: () => boolean;
  loadPGN: (pgn: string) => boolean;
  loadFEN: (fen: string) => boolean;
  resetToStarting: () => void;
  toggleBoardOrientation: () => void;
  startPlayingFromPosition: (color: 'white' | 'black', level?: number) => void;
  stopPlayingFromPosition: () => void;
};

export const useAnalysisBoardStore = create<AnalysisBoardStore>()(
  persist(
    (set, get) => ({
      game: new Chess(),
      currentFEN: STARTING_FEN,
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      boardOrientation: 'white',
      playingAgainstStockfish: false,
      playerColor: 'white',
      stockfishLevel: 10,

      makeMove: (from, to, promotion = 'q') => {
        const state = get();
        try {
          const move = state.game.move({
            from: from as Square,
            to: to as Square,
            promotion: promotion as 'q' | 'r' | 'b' | 'n'
          });
          if (!move) return null;

          const newFEN = state.game.fen();
          set({
            currentFEN: newFEN,
            moves: [...state.moves, move.san],
            positionHistory: [...state.positionHistory, newFEN],
            viewingIndex: state.positionHistory.length
          });

          return move;
        } catch {
          return null;
        }
      },

      addMove: (move, fen) =>
        set((state) => ({
          moves: [...state.moves, move],
          positionHistory: [...state.positionHistory, fen],
          viewingIndex: state.positionHistory.length,
          currentFEN: fen
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

      goToMove: (moveIndex) =>
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
      },

      loadPGN: (pgn) => {
        try {
          const newGame = new Chess();
          newGame.loadPgn(pgn);

          const moves: string[] = [];
          const positions: string[] = [STARTING_FEN];

          const tempGame = new Chess();
          const history = newGame.history({ verbose: true });

          for (const move of history) {
            tempGame.move(move.san);
            moves.push(move.san);
            positions.push(tempGame.fen());
          }

          set({
            game: newGame,
            currentFEN: newGame.fen(),
            moves,
            positionHistory: positions,
            viewingIndex: positions.length - 1,
            playingAgainstStockfish: false
          });

          return true;
        } catch (error) {
          console.error('Failed to load PGN:', error);
          return false;
        }
      },

      loadFEN: (fen) => {
        try {
          const newGame = new Chess(fen);
          set({
            game: newGame,
            currentFEN: fen,
            moves: [],
            positionHistory: [fen],
            viewingIndex: 0,
            playingAgainstStockfish: false
          });
          return true;
        } catch (error) {
          console.error('Invalid FEN:', error);
          return false;
        }
      },

      resetToStarting: () => {
        const newGame = new Chess();
        set({
          game: newGame,
          currentFEN: STARTING_FEN,
          moves: [],
          positionHistory: [STARTING_FEN],
          viewingIndex: 0,
          playingAgainstStockfish: false,
          boardOrientation: 'white'
        });
      },

      toggleBoardOrientation: () => {
        set((state) => ({
          boardOrientation:
            state.boardOrientation === 'white' ? 'black' : 'white'
        }));
      },

      startPlayingFromPosition: (color, level = 10) => {
        set({
          playingAgainstStockfish: true,
          playerColor: color,
          stockfishLevel: level,
          boardOrientation: color
        });
      },

      stopPlayingFromPosition: () => {
        set({
          playingAgainstStockfish: false
        });
      }
    }),
    {
      name: 'zugklang-analysis-storage',
      storage: createModeStorage('analysis'),
      partialize: (state) => ({
        moves: state.moves,
        positionHistory: state.positionHistory,
        viewingIndex: state.viewingIndex,
        currentFEN: state.currentFEN,
        boardOrientation: state.boardOrientation,
        stockfishLevel: state.stockfishLevel
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            const fen = state.currentFEN || STARTING_FEN;
            state.game = new Chess(fen);
          } catch {
            state.game = new Chess();
            state.currentFEN = STARTING_FEN;
          }
        }
      }
    }
  )
);

export const useAnalysisBoardState = () =>
  useAnalysisBoardStore(
    useShallow((s) => ({
      game: s.game,
      currentFEN: s.currentFEN,
      moves: s.moves,
      viewingIndex: s.viewingIndex,
      positionHistory: s.positionHistory,
      boardOrientation: s.boardOrientation,
      playingAgainstStockfish: s.playingAgainstStockfish,
      playerColor: s.playerColor,
      stockfishLevel: s.stockfishLevel
    }))
  );

export const useAnalysisBoardActions = () =>
  useAnalysisBoardStore(
    useShallow((s) => ({
      makeMove: s.makeMove,
      addMove: s.addMove,
      goToStart: s.goToStart,
      goToEnd: s.goToEnd,
      goToPrev: s.goToPrev,
      goToNext: s.goToNext,
      goToMove: s.goToMove,
      isViewingHistory: s.isViewingHistory,
      loadPGN: s.loadPGN,
      loadFEN: s.loadFEN,
      resetToStarting: s.resetToStarting,
      toggleBoardOrientation: s.toggleBoardOrientation,
      startPlayingFromPosition: s.startPlayingFromPosition,
      stopPlayingFromPosition: s.stopPlayingFromPosition
    }))
  );
