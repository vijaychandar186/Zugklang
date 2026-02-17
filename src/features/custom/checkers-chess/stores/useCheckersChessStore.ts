import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess, type ChessJSMove } from '@/lib/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';
import { GAME_CHECKERS_CHESS_KEY } from '@/lib/storage/keys';
import { createLazyStorage, hasGameStarted } from '@/lib/storage/lazyStorage';
import { TimeControl } from '@/features/game/types/rules';

function getGameResult(game: Chess): string | null {
  if (game.isCheckmate()) {
    const winner = game.turn() === 'w' ? 'Black' : 'White';
    return `${winner} wins by checkmate`;
  }
  if (game.isStalemate()) return 'Draw by stalemate';
  if (game.isDraw()) return 'Draw';
  if (game.isInsufficientMaterial()) return 'Draw — insufficient material';
  return null;
}

interface CheckersChessStore {
  // Game state
  game: Chess;
  currentFEN: string;
  turn: 'w' | 'b';
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameResult: string | null;
  hasHydrated: boolean;

  // Timer state
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;

  // Game actions
  makeMove: (
    from: string,
    to: string,
    promotion?: string
  ) => ChessJSMove | null;
  startNewGame: (timeControl?: TimeControl) => void;
  reset: () => void;
  setGameStarted: (started: boolean) => void;
  setGameOver: (over: boolean) => void;
  setGameResult: (result: string | null) => void;

  // Navigation
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (index: number) => void;
}

export const useCheckersChessStore = create<CheckersChessStore>()(
  persist(
    (set, get) => ({
      // Initial state
      game: new Chess(),
      currentFEN: STARTING_FEN,
      turn: 'w',
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      gameStarted: false,
      gameOver: false,
      gameResult: null,
      hasHydrated: false,

      // Timer state
      timeControl: { mode: 'unlimited', minutes: 0, increment: 0 },
      whiteTime: null,
      blackTime: null,
      activeTimer: null,
      lastActiveTimestamp: null,

      // ── Game actions ───────────────────────────────────────────────────

      makeMove: (from, to, promotion) => {
        const {
          game,
          gameOver,
          moves,
          positionHistory,
          viewingIndex,
          timeControl,
          whiteTime,
          blackTime
        } = get();
        if (gameOver) return null;

        // Try to make the move
        const move = game.move({ from, to, promotion });
        if (!move) return null;

        const newFEN = game.fen();
        const newHistory = [
          ...positionHistory.slice(0, viewingIndex + 1),
          newFEN
        ];

        // Check game over
        const isOver = game.isGameOver();
        const result = isOver ? getGameResult(game) : null;

        // Handle timers
        const playerWhoMoved = move.color === 'w' ? 'white' : 'black';
        const nextPlayer = playerWhoMoved === 'white' ? 'black' : 'white';
        let newWhiteTime = whiteTime;
        let newBlackTime = blackTime;
        let newActiveTimer: 'white' | 'black' | null = null;

        if (timeControl.mode === 'timed' && !isOver) {
          // Add increment to the player who just moved
          const increment = timeControl.increment;
          if (playerWhoMoved === 'white' && whiteTime !== null) {
            newWhiteTime = whiteTime + increment;
          } else if (playerWhoMoved === 'black' && blackTime !== null) {
            newBlackTime = blackTime + increment;
          }
          // Set active timer to next player
          newActiveTimer = nextPlayer;
        }

        set({
          currentFEN: newFEN,
          turn: game.turn(),
          moves: [...moves, move.san],
          positionHistory: newHistory,
          viewingIndex: newHistory.length - 1,
          gameOver: isOver,
          gameResult: result,
          whiteTime: newWhiteTime,
          blackTime: newBlackTime,
          activeTimer: newActiveTimer,
          lastActiveTimestamp: newActiveTimer ? Date.now() : null
        });

        return move;
      },

      startNewGame: (timeControl) => {
        const newGame = new Chess();
        const tc = timeControl || {
          mode: 'unlimited',
          minutes: 0,
          increment: 0
        };
        const whiteTime = tc.mode === 'timed' ? tc.minutes * 60 : null;
        const blackTime = tc.mode === 'timed' ? tc.minutes * 60 : null;
        const activeTimer = tc.mode === 'timed' ? 'white' : null;
        const lastActiveTimestamp = tc.mode === 'timed' ? Date.now() : null;

        set({
          game: newGame,
          currentFEN: STARTING_FEN,
          turn: 'w',
          moves: [],
          positionHistory: [STARTING_FEN],
          viewingIndex: 0,
          gameStarted: true,
          gameOver: false,
          gameResult: null,
          timeControl: tc,
          whiteTime,
          blackTime,
          activeTimer,
          lastActiveTimestamp
        });
      },

      reset: () => {
        set({
          gameStarted: false,
          gameOver: false,
          gameResult: null
        });
      },

      setGameStarted: (started) => set({ gameStarted: started }),
      setGameOver: (over) => set({ gameOver: over }),
      setGameResult: (result) => set({ gameResult: result }),

      // ── Navigation ─────────────────────────────────────────────────────

      goToStart: () => {
        const { positionHistory } = get();
        set({ viewingIndex: 0, currentFEN: positionHistory[0] });
      },

      goToEnd: () => {
        const { positionHistory } = get();
        const last = positionHistory.length - 1;
        set({ viewingIndex: last, currentFEN: positionHistory[last] });
      },

      goToPrev: () => {
        const { viewingIndex, positionHistory } = get();
        if (viewingIndex > 0) {
          const idx = viewingIndex - 1;
          set({ viewingIndex: idx, currentFEN: positionHistory[idx] });
        }
      },

      goToNext: () => {
        const { viewingIndex, positionHistory } = get();
        if (viewingIndex < positionHistory.length - 1) {
          const idx = viewingIndex + 1;
          set({ viewingIndex: idx, currentFEN: positionHistory[idx] });
        }
      },

      goToMove: (index) => {
        const { positionHistory } = get();
        const posIdx = Math.min(index + 1, positionHistory.length - 1);
        set({ viewingIndex: posIdx, currentFEN: positionHistory[posIdx] });
      }
    }),
    {
      name: GAME_CHECKERS_CHESS_KEY,
      storage: createLazyStorage((state: unknown) => {
        const s = state as { moves?: unknown[]; gameStarted?: boolean };
        return hasGameStarted({
          moves: s.moves,
          gameStarted: s.gameStarted
        });
      }),
      partialize: (state) => ({
        currentFEN: state.currentFEN,
        turn: state.turn,
        moves: state.moves,
        positionHistory: state.positionHistory,
        viewingIndex: state.viewingIndex,
        gameStarted: state.gameStarted,
        gameOver: state.gameOver,
        gameResult: state.gameResult,
        timeControl: state.timeControl,
        whiteTime: state.whiteTime,
        blackTime: state.blackTime,
        activeTimer: state.activeTimer,
        lastActiveTimestamp: state.lastActiveTimestamp
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
          state.turn = state.game.turn();

          // Handle timer state on reload
          if (
            state.activeTimer &&
            state.lastActiveTimestamp &&
            !state.gameOver
          ) {
            const now = Date.now();
            const elapsedSeconds = Math.floor(
              (now - state.lastActiveTimestamp) / 1000
            );

            if (state.activeTimer === 'white' && state.whiteTime !== null) {
              state.whiteTime = Math.max(0, state.whiteTime - elapsedSeconds);
              if (state.whiteTime === 0) {
                state.gameOver = true;
                state.gameResult = 'Black wins on time';
                state.activeTimer = null;
              }
            } else if (
              state.activeTimer === 'black' &&
              state.blackTime !== null
            ) {
              state.blackTime = Math.max(0, state.blackTime - elapsedSeconds);
              if (state.blackTime === 0) {
                state.gameOver = true;
                state.gameResult = 'White wins on time';
                state.activeTimer = null;
              }
            }

            // Update timestamp to now for continued countdown
            if (!state.gameOver) {
              state.lastActiveTimestamp = now;
            }
          }

          state.hasHydrated = true;
        }
      }
    }
  )
);
