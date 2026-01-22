import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import {
  Chess,
  ChessJSSquare as Square,
  ChessJSMove as Move
} from '@/lib/chess';
import { createModeStorage } from '@/features/chess/stores/gameStorage';
import { STARTING_FEN } from '@/features/chess/config/constants';
import {
  createNavigationSlice,
  NavigationSlice,
  createBoardOrientationSlice,
  BoardOrientationSlice
} from '@/features/chess/stores/slices';

import { ChessSession } from '@/features/chess/logic/ChessSession';

interface AnalysisBoardState extends NavigationSlice, BoardOrientationSlice {
  session: ChessSession;
  moves: string[];
  playingAgainstStockfish: boolean;
  playerColor: 'white' | 'black';
  stockfishLevel: number;
}

interface AnalysisBoardActions {
  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  addMove: (move: string, fen: string) => void;
  loadPGN: (pgn: string) => boolean;
  loadFEN: (fen: string) => boolean;
  resetToStarting: () => void;
  startPlayingFromPosition: (color: 'white' | 'black', level?: number) => void;
  stopPlayingFromPosition: () => void;
}

type AnalysisBoardStore = AnalysisBoardState & AnalysisBoardActions;

export const useAnalysisBoardStore = create<AnalysisBoardStore>()(
  persist(
    (set, get) => {
      const session = new ChessSession();

      return {
        session,
        currentFEN: session.fen,
        moves: [],
        positionHistory: [session.fen],
        viewingIndex: 0,
        boardOrientation: 'white',
        boardFlipped: false,
        playingAgainstStockfish: false,
        playerColor: 'white',
        stockfishLevel: 10,

        ...createNavigationSlice(set, get),
        ...createBoardOrientationSlice(set),

        makeMove: (from, to, promotion = 'q') => {
          const { session } = get();
          const move = session.makeMove(from, to, promotion);

          if (!move) return null;

          set((state) => ({
            currentFEN: session.fen,
            moves: [...session.moves],
            positionHistory: [...state.positionHistory, session.fen],
            viewingIndex: state.positionHistory.length // history length increased by 1, so this points to last
          }));

          return move;
        },

        addMove: (move, fen) => {
          const { session } = get();
          // Attempt to sync session
          session.addMove(move, fen);
          set((state) => ({
            moves: [...state.moves, move],
            positionHistory: [...state.positionHistory, fen],
            viewingIndex: state.positionHistory.length,
            currentFEN: fen
          }));
        },

        loadPGN: (pgn) => {
          const { session } = get();
          const success = session.loadPgn(pgn);

          if (success) {
            set({
              currentFEN: session.fen,
              moves: [...session.moves],
              // Reconstruction of full history array if needed
              // session.history might be just [FEN] if loadPgn doesn't fill it.
              // My ChessSession.loadPgn implementation tried to fill _moves, but history?
              // Let's rely on standard session behavior or what we implemented.
              // If session.history is incomplete, we might need a better impl in session.
              // For now, let's assume session provides a reasonable state or we init history
              positionHistory:
                session.history.length > 1 ? session.history : [session.fen],
              viewingIndex:
                session.history.length > 1 ? session.history.length - 1 : 0,
              playingAgainstStockfish: false
            });
            return true;
          }
          return false;
        },

        loadFEN: (fen) => {
          const { session } = get();
          const success = session.loadFen(fen);

          if (success) {
            set({
              currentFEN: fen,
              moves: [],
              positionHistory: [fen],
              viewingIndex: 0,
              playingAgainstStockfish: false
            });
            return true;
          }
          return false;
        },

        resetToStarting: () => {
          const { session } = get();
          session.reset();
          set({
            currentFEN: STARTING_FEN,
            moves: [],
            positionHistory: [STARTING_FEN],
            viewingIndex: 0,
            playingAgainstStockfish: false,
            boardOrientation: 'white'
          });
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
      };
    },
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
        if (state && state.session) {
          try {
            const fen = state.currentFEN || STARTING_FEN;
            state.session.loadFen(fen);
            // Ideally we should sync history too, but rehydrating simple FEN is baseline safety.
            // If moves exist, we could try to replay them if we derived session state from moves,
            // but for now relying on stored props + synced FEN in session.
          } catch {
            state.session.reset();
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
      game: s.session.instance,
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
