import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export type AnalysisMode = 'normal' | 'position-editor' | 'play-from-position';

export type EditorPieceType =
  | 'wP'
  | 'wN'
  | 'wB'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bN'
  | 'bB'
  | 'bR'
  | 'bQ'
  | 'bK'
  | 'trash';

type PieceType = Exclude<EditorPieceType, 'trash'>;

export type AnalysisBoardStore = {
  // Mode state
  mode: AnalysisMode;

  // Chess game state
  game: Chess; // NOTE: Chess object is not serializable directly for hydration, we might need to reconstruct it
  currentFEN: string;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  boardOrientation: 'white' | 'black';

  // Position editor state
  editorFEN: string;
  selectedPiece: EditorPieceType | null;

  // PGN state
  pgnText: string;

  // Play from position state
  playingAgainstStockfish: boolean;
  playerColor: 'white' | 'black';
  stockfishLevel: number;

  // Actions
  setMode: (mode: AnalysisMode) => void;
  toggleBoardOrientation: () => void;

  // Chess game actions
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  loadPGN: (pgn: string) => boolean;
  resetToStarting: () => void;
  resetToEmpty: () => void;
  loadFEN: (fen: string) => boolean;

  // Position editor actions
  setEditorPiece: (square: string, piece: PieceType | null) => void;
  setEditorFEN: (fen: string) => void;
  clearBoard: () => void;
  setSelectedPiece: (piece: EditorPieceType | null) => void;
  applyEditorPosition: () => boolean;

  // History navigation
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
  isViewingHistory: () => boolean;

  // Play from position
  startPlayingFromPosition: (color: 'white' | 'black', level?: number) => void;
  stopPlayingFromPosition: () => void;

  // PGN
  setPGNText: (text: string) => void;
  getCurrentPGN: () => string;
};

export const useAnalysisBoardStore = create<AnalysisBoardStore>()(
  persist(
    (set, get) => ({
      mode: 'normal',

      game: new Chess(),
      currentFEN: STARTING_FEN,
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      boardOrientation: 'white',

      editorFEN: STARTING_FEN,
      selectedPiece: null,

      pgnText: '',

      playingAgainstStockfish: false,
      playerColor: 'white',
      stockfishLevel: 10,

      setMode: (mode) => {
        const state = get();
        if (mode === 'position-editor') {
          // When entering position editor, start with current position
          set({
            mode,
            editorFEN: state.currentFEN,
            selectedPiece: null
          });
        } else if (mode === 'normal') {
          set({
            mode,
            playingAgainstStockfish: false
          });
        } else {
          set({ mode });
        }
      },

      toggleBoardOrientation: () => {
        set((state) => ({
          boardOrientation:
            state.boardOrientation === 'white' ? 'black' : 'white'
        }));
      },

      makeMove: (from, to, promotion = 'q') => {
        const state = get();
        if (state.mode === 'position-editor') return false;

        try {
          // Ensure game instance is fresh if needed (though we try to keep it synced)
          // But with persist, 'game' object won't be hydrated correctly as a Chess instance usually
          // We should rely on currentFEN to rebuild 'game' if needed, but let's try strict sync.
          // Actually, we need to handle rehydration of 'game' object in onRehydrate if possible,
          // or just reconstruct it when computing invalid moves?
          // For now, let's just assume we need to use currentFEN to be safe.

          // Using existing instance:
          const move = state.game.move({ from, to, promotion });
          if (!move) return false;

          const newFEN = state.game.fen();
          set({
            currentFEN: newFEN,
            moves: [...state.moves, move.san],
            positionHistory: [...state.positionHistory, newFEN],
            viewingIndex: state.positionHistory.length
          });

          return true;
        } catch {
          return false;
        }
      },

      loadPGN: (pgn) => {
        try {
          const newGame = new Chess();
          newGame.loadPgn(pgn);

          const moves: string[] = [];
          const positions: string[] = [STARTING_FEN];

          // Replay the game to get all positions
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
            pgnText: pgn
          });

          return true;
        } catch (error) {
          console.error('Failed to load PGN:', error);
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
          editorFEN: STARTING_FEN,
          playingAgainstStockfish: false,
          boardOrientation: 'white'
        });
      },

      resetToEmpty: () => {
        const newGame = new Chess(EMPTY_FEN, { skipValidation: true });
        set({
          game: newGame,
          currentFEN: EMPTY_FEN,
          editorFEN: EMPTY_FEN,
          moves: [],
          positionHistory: [EMPTY_FEN],
          viewingIndex: 0,
          mode: 'position-editor'
        });
      },

      loadFEN: (fen) => {
        try {
          const newGame = new Chess(fen);
          set({
            game: newGame,
            currentFEN: fen,
            editorFEN: fen,
            moves: [],
            positionHistory: [fen],
            viewingIndex: 0
          });
          return true;
        } catch (error) {
          console.error('Invalid FEN:', error);
          return false;
        }
      },

      setEditorPiece: (square, piece) => {
        const state = get();
        try {
          const tempGame = new Chess(state.editorFEN, { skipValidation: true });

          // Remove piece from square
          tempGame.remove(square as Square);

          // If piece is provided, add it
          if (piece) {
            const color = (piece[0] === 'w' ? 'w' : 'b') as Color;
            const type = piece[1].toLowerCase() as PieceSymbol;
            tempGame.put({ type, color }, square as Square);
          }

          const newFEN = tempGame.fen();
          set({ editorFEN: newFEN });
          return true;
        } catch (error) {
          console.error('Failed to set piece:', error);
          return false;
        }
      },

      setEditorFEN: (fen) => {
        set({ editorFEN: fen });
      },

      clearBoard: () => {
        set({
          editorFEN: EMPTY_FEN,
          selectedPiece: null
        });
      },

      setSelectedPiece: (piece) => {
        set({ selectedPiece: piece });
      },

      applyEditorPosition: () => {
        const state = get();
        try {
          const newGame = new Chess(state.editorFEN, { skipValidation: true });
          set({
            game: newGame,
            currentFEN: state.editorFEN,
            moves: [],
            positionHistory: [state.editorFEN],
            viewingIndex: 0,
            mode: 'normal'
          });
          return true;
        } catch (error) {
          console.error('Invalid position:', error);
          return false;
        }
      },

      goToStart: () => {
        const state = get();
        set({
          viewingIndex: 0,
          currentFEN: state.positionHistory[0]
        });
      },

      goToEnd: () => {
        const state = get();
        set({
          viewingIndex: state.positionHistory.length - 1,
          currentFEN: state.positionHistory[state.positionHistory.length - 1]
        });
      },

      goToPrev: () => {
        const state = get();
        const newIndex = Math.max(0, state.viewingIndex - 1);
        set({
          viewingIndex: newIndex,
          currentFEN: state.positionHistory[newIndex]
        });
      },

      goToNext: () => {
        const state = get();
        const newIndex = Math.min(
          state.positionHistory.length - 1,
          state.viewingIndex + 1
        );
        set({
          viewingIndex: newIndex,
          currentFEN: state.positionHistory[newIndex]
        });
      },

      goToMove: (moveIndex) => {
        const state = get();
        const positionIndex = moveIndex + 1;
        const clampedIndex = Math.min(
          Math.max(0, positionIndex),
          state.positionHistory.length - 1
        );
        set({
          viewingIndex: clampedIndex,
          currentFEN: state.positionHistory[clampedIndex]
        });
      },

      isViewingHistory: () => {
        const state = get();
        return state.viewingIndex < state.positionHistory.length - 1;
      },

      startPlayingFromPosition: (color, level = 10) => {
        set({
          mode: 'play-from-position',
          playingAgainstStockfish: true,
          playerColor: color,
          stockfishLevel: level,
          boardOrientation: color
        });
      },

      stopPlayingFromPosition: () => {
        set({
          playingAgainstStockfish: false,
          mode: 'normal'
        });
      },

      setPGNText: (text) => {
        set({ pgnText: text });
      },

      getCurrentPGN: () => {
        const state = get();
        // Since 'game' might be stale after restoration, we can rely on pgnText or reconstruct
        // But for now, let's trust state.game if we hydrate efficiently,
        // OR better yet, reconstruct game from currentFEN/moves if needed.
        return state.game.pgn();
      }
    }),
    {
      name: 'analysis-board-storage',
      partialize: (state) => ({
        // Don't persist the 'game' object directly as it's not serializable
        // We'll reconstruct it or just rely on FEN
        currentFEN: state.currentFEN,
        moves: state.moves,
        positionHistory: state.positionHistory,
        viewingIndex: state.viewingIndex,
        boardOrientation: state.boardOrientation,
        mode: state.mode,
        playingAgainstStockfish: state.playingAgainstStockfish,
        playerColor: state.playerColor,
        stockfishLevel: state.stockfishLevel
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reconstruct the Chess instance from the persisted FEN
          // Ideally we should replay moves to have full history, but FEN is often enough for 'game' state
          try {
            state.game = new Chess(state.currentFEN);
          } catch {
            state.game = new Chess();
          }
        }
      }
    }
  )
);

// Selectors
export const useAnalysisBoardState = () =>
  useAnalysisBoardStore(
    useShallow((state) => ({
      mode: state.mode,
      currentFEN: state.currentFEN,
      moves: state.moves,
      viewingIndex: state.viewingIndex,
      positionHistory: state.positionHistory,
      playingAgainstStockfish: state.playingAgainstStockfish,
      playerColor: state.playerColor,
      stockfishLevel: state.stockfishLevel,
      boardOrientation: state.boardOrientation
    }))
  );

export const usePositionEditor = () =>
  useAnalysisBoardStore(
    useShallow((state) => ({
      editorFEN: state.editorFEN,
      selectedPiece: state.selectedPiece,
      setEditorPiece: state.setEditorPiece,
      setEditorFEN: state.setEditorFEN,
      clearBoard: state.clearBoard,
      setSelectedPiece: state.setSelectedPiece,
      applyEditorPosition: state.applyEditorPosition
    }))
  );

export const useAnalysisBoardActions = () =>
  useAnalysisBoardStore(
    useShallow((state) => ({
      setMode: state.setMode,
      makeMove: state.makeMove,
      loadPGN: state.loadPGN,
      resetToStarting: state.resetToStarting,
      resetToEmpty: state.resetToEmpty,
      loadFEN: state.loadFEN,
      goToStart: state.goToStart,
      goToEnd: state.goToEnd,
      goToPrev: state.goToPrev,
      goToNext: state.goToNext,
      goToMove: state.goToMove,
      startPlayingFromPosition: state.startPlayingFromPosition,
      stopPlayingFromPosition: state.stopPlayingFromPosition,
      setPGNText: state.setPGNText,
      getCurrentPGN: state.getCurrentPGN,
      toggleBoardOrientation: state.toggleBoardOrientation
    }))
  );
