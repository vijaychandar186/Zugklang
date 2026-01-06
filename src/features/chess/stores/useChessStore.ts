import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Chess, Square, Move } from 'chess.js';
import { BoardThemeName } from '@/features/chess/types/theme';
import { DEFAULT_BOARD_THEME } from '@/features/chess/config/board-themes';
import { STARTING_FEN } from '@/features/chess/config/constants';
import { COOKIE_CONFIG } from '@/features/chess/config/board';
import { TimeControl } from '@/features/game/types/rules';

const BOARD_SCHEME_COOKIE = 'boardScheme';
const SOUND_ENABLED_COOKIE = 'soundEnabled';
const PLAY_AS_COOKIE = 'playAs';

export type ChessMode = 'play' | 'analysis';
export type GameType = 'computer' | 'local';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
}

function getInitialSoundEnabled(): boolean {
  if (typeof document === 'undefined') return true;
  const value = getCookie(SOUND_ENABLED_COOKIE);
  return value !== 'false';
}

type ChessStore = {
  mode: ChessMode;
  gameType: GameType;
  hasHydrated: boolean;

  game: Chess;
  currentFEN: string;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  boardOrientation: 'white' | 'black';

  playAs: 'white' | 'black';
  stockfishLevel: number;
  gameOver: boolean;
  gameResult: string | null;
  gameStarted: boolean;
  gameId: number;

  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;

  playingAgainstStockfish: boolean;
  playerColor: 'white' | 'black';

  boardThemeName: BoardThemeName;
  soundEnabled: boolean;
  boardFlipped: boolean;
  autoFlipBoard: boolean;
  fullscreenEnabled: boolean;

  onNewGame: () => void;

  setMode: (mode: ChessMode) => void;

  setBoardTheme: (name: BoardThemeName) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setFullscreenEnabled: (enabled: boolean) => void;
  flipBoard: () => void;
  toggleBoardOrientation: () => void;

  addMove: (move: string, fen: string) => void;
  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  setMoves: (moves: string[]) => void;
  setCurrentFEN: (fen: string) => void;
  setOnNewGame: (onNewGame: () => void) => void;

  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
  isViewingHistory: () => boolean;

  setGameResult: (result: string | null) => void;
  setGameOver: (gameOver: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setStockfishLevel: (level: number) => void;
  setPlayAs: (color: 'white' | 'black') => void;
  startGame: (
    level: number,
    color: 'white' | 'black',
    timeControl?: TimeControl
  ) => void;
  startLocalGame: (timeControl?: TimeControl) => void;
  resetGame: () => void;
  setGameType: (gameType: GameType) => void;
  setAutoFlipBoard: (enabled: boolean) => void;

  setTimeControl: (timeControl: TimeControl) => void;
  tickTimer: (color: 'white' | 'black') => void;
  switchTimer: (toColor: 'white' | 'black') => void;
  stopTimer: () => void;
  onTimeout: (color: 'white' | 'black') => void;

  loadPGN: (pgn: string) => boolean;
  loadFEN: (fen: string) => boolean;
  resetToStarting: () => void;
  startPlayingFromPosition: (color: 'white' | 'black', level?: number) => void;
  stopPlayingFromPosition: () => void;
};

export const useChessStore = create<ChessStore>()(
  persist(
    (set, get) => ({
      mode: 'play',
      gameType: 'computer' as GameType,
      hasHydrated: false,

      game: new Chess(),
      currentFEN: STARTING_FEN,
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      boardOrientation: 'white',

      playAs: 'white',
      stockfishLevel: 10,
      gameOver: false,
      gameResult: null,
      gameStarted: false,
      gameId: 0,

      timeControl: { mode: 'unlimited', minutes: 0, increment: 0 },
      whiteTime: null,
      blackTime: null,
      activeTimer: null,
      lastActiveTimestamp: null,

      playingAgainstStockfish: false,
      playerColor: 'white',

      boardThemeName: DEFAULT_BOARD_THEME,
      soundEnabled: getInitialSoundEnabled(),
      boardFlipped: false,
      autoFlipBoard: false,
      fullscreenEnabled: false,

      onNewGame: () => {},

      setMode: (mode) => {
        if (mode === 'analysis') {
          set({
            mode,
            gameOver: false,
            gameStarted: false,
            playingAgainstStockfish: false,
            activeTimer: null
          });
        } else {
          set({
            mode,
            playingAgainstStockfish: false
          });
        }
      },

      setBoardTheme: (name) => {
        setCookie(BOARD_SCHEME_COOKIE, name);
        set({ boardThemeName: name });
      },

      setSoundEnabled: (enabled) => {
        setCookie(SOUND_ENABLED_COOKIE, String(enabled));
        set({ soundEnabled: enabled });
      },

      setFullscreenEnabled: (enabled) => {
        set({ fullscreenEnabled: enabled });
      },

      flipBoard: () => set((state) => ({ boardFlipped: !state.boardFlipped })),

      toggleBoardOrientation: () => {
        set((state) => ({
          boardOrientation:
            state.boardOrientation === 'white' ? 'black' : 'white'
        }));
      },

      addMove: (move, fen) =>
        set((state) => ({
          moves: [...state.moves, move],
          positionHistory: [...state.positionHistory, fen],
          viewingIndex: state.positionHistory.length,
          currentFEN: fen
        })),

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

      setMoves: (moves) => set({ moves }),
      setCurrentFEN: (fen) => set({ currentFEN: fen }),
      setOnNewGame: (onNewGame) => set({ onNewGame }),

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

      setGameResult: (result) => set({ gameResult: result }),
      setGameOver: (gameOver) =>
        set({ gameOver, activeTimer: null, lastActiveTimestamp: null }),
      setGameStarted: (started) => set({ gameStarted: started }),
      setStockfishLevel: (level) => set({ stockfishLevel: level }),

      setPlayAs: (color) => {
        setCookie(PLAY_AS_COOKIE, color);
        set({ playAs: color });
      },

      startGame: (
        level,
        color,
        timeControl = { mode: 'unlimited', minutes: 0, increment: 0 }
      ) => {
        setCookie(PLAY_AS_COOKIE, color);

        let whiteInitialTime: number | null = null;
        let blackInitialTime: number | null = null;

        if (timeControl.mode === 'timed') {
          whiteInitialTime = timeControl.minutes * 60;
          blackInitialTime = timeControl.minutes * 60;
        } else if (timeControl.mode === 'custom') {
          whiteInitialTime = (timeControl.whiteMinutes ?? 10) * 60;
          blackInitialTime = (timeControl.blackMinutes ?? 10) * 60;
        }

        const hasTimer = timeControl.mode !== 'unlimited';
        const newGame = new Chess();

        set({
          mode: 'play',
          gameType: 'computer',
          game: newGame,
          stockfishLevel: level,
          playAs: color,
          boardFlipped: false,
          boardOrientation: color,
          gameStarted: true,
          gameOver: false,
          moves: [],
          positionHistory: [STARTING_FEN],
          viewingIndex: 0,
          gameResult: null,
          currentFEN: STARTING_FEN,
          gameId: get().gameId + 1,
          timeControl,
          whiteTime: whiteInitialTime,
          blackTime: blackInitialTime,
          activeTimer: hasTimer ? 'white' : null,
          lastActiveTimestamp: hasTimer ? Date.now() : null,
          playingAgainstStockfish: false
        });
      },

      startLocalGame: (
        timeControl = { mode: 'unlimited', minutes: 0, increment: 0 }
      ) => {
        let whiteInitialTime: number | null = null;
        let blackInitialTime: number | null = null;

        if (timeControl.mode === 'timed') {
          whiteInitialTime = timeControl.minutes * 60;
          blackInitialTime = timeControl.minutes * 60;
        } else if (timeControl.mode === 'custom') {
          whiteInitialTime = (timeControl.whiteMinutes ?? 10) * 60;
          blackInitialTime = (timeControl.blackMinutes ?? 10) * 60;
        }

        const hasTimer = timeControl.mode !== 'unlimited';
        const newGame = new Chess();
        const state = get();

        set({
          mode: 'play',
          gameType: 'local',
          game: newGame,
          playAs: 'white',
          boardFlipped: false,
          boardOrientation: state.autoFlipBoard ? 'white' : 'white',
          gameStarted: true,
          gameOver: false,
          moves: [],
          positionHistory: [STARTING_FEN],
          viewingIndex: 0,
          gameResult: null,
          currentFEN: STARTING_FEN,
          gameId: state.gameId + 1,
          timeControl,
          whiteTime: whiteInitialTime,
          blackTime: blackInitialTime,
          activeTimer: hasTimer ? 'white' : null,
          lastActiveTimestamp: hasTimer ? Date.now() : null,
          playingAgainstStockfish: false
        });
      },

      setGameType: (gameType) => set({ gameType }),
      setAutoFlipBoard: (enabled) => set({ autoFlipBoard: enabled }),

      resetGame: () => {
        const state = get();
        let whiteInitialTime: number | null = null;
        let blackInitialTime: number | null = null;

        if (state.timeControl.mode === 'timed') {
          whiteInitialTime = state.timeControl.minutes * 60;
          blackInitialTime = state.timeControl.minutes * 60;
        } else if (state.timeControl.mode === 'custom') {
          whiteInitialTime = (state.timeControl.whiteMinutes ?? 10) * 60;
          blackInitialTime = (state.timeControl.blackMinutes ?? 10) * 60;
        }

        const hasTimer = state.timeControl.mode !== 'unlimited';
        const newGame = new Chess();

        set({
          game: newGame,
          gameOver: false,
          moves: [],
          positionHistory: [STARTING_FEN],
          viewingIndex: 0,
          gameResult: null,
          currentFEN: STARTING_FEN,
          gameId: state.gameId + 1,
          whiteTime: whiteInitialTime,
          blackTime: blackInitialTime,
          activeTimer: hasTimer && state.playAs === 'white' ? 'white' : null,
          lastActiveTimestamp: hasTimer ? Date.now() : null,
          playingAgainstStockfish: false
        });
      },

      setTimeControl: (timeControl) => set({ timeControl }),

      tickTimer: (color) =>
        set((state) => {
          if (state.activeTimer !== color || state.gameOver) return {};
          const timeKey = color === 'white' ? 'whiteTime' : 'blackTime';
          const currentTime = state[timeKey];
          if (currentTime === null || currentTime <= 0) return {};
          const newTime = currentTime - 1;
          return { [timeKey]: newTime, lastActiveTimestamp: Date.now() };
        }),

      switchTimer: (toColor) =>
        set((state) => {
          if (state.gameOver || state.timeControl.mode === 'unlimited')
            return {};
          const movedColor = toColor === 'white' ? 'black' : 'white';
          const movedTimeKey =
            movedColor === 'white' ? 'whiteTime' : 'blackTime';
          const currentTime = state[movedTimeKey];
          let increment = state.timeControl.increment;
          if (state.timeControl.mode === 'custom') {
            increment =
              movedColor === 'white'
                ? (state.timeControl.whiteIncrement ?? 0)
                : (state.timeControl.blackIncrement ?? 0);
          }
          const newTime = currentTime !== null ? currentTime + increment : null;
          return {
            activeTimer: toColor,
            [movedTimeKey]: newTime,
            lastActiveTimestamp: Date.now()
          };
        }),

      stopTimer: () => set({ activeTimer: null, lastActiveTimestamp: null }),

      onTimeout: (color) => {
        const state = get();
        const isPlayerTimeout = color === state.playAs;
        set({
          gameOver: true,
          gameResult: isPlayerTimeout
            ? 'Stockfish wins on time!'
            : 'You win on time!',
          activeTimer: null,
          lastActiveTimestamp: null
        });
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
            viewingIndex: positions.length - 1
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
            viewingIndex: 0
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
          boardOrientation: 'white',
          gameOver: false,
          gameResult: null
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
    }),
    {
      name: 'zugklang-chess-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        gameType: state.gameType,
        moves: state.moves,
        positionHistory: state.positionHistory,
        viewingIndex: state.viewingIndex,
        currentFEN: state.currentFEN,
        playAs: state.playAs,
        stockfishLevel: state.stockfishLevel,
        gameStarted: state.gameStarted,
        gameOver: state.gameOver,
        gameResult: state.gameResult,
        timeControl: state.timeControl,
        whiteTime: state.whiteTime,
        blackTime: state.blackTime,
        activeTimer: state.activeTimer,
        lastActiveTimestamp: state.lastActiveTimestamp,
        boardOrientation: state.boardOrientation,
        autoFlipBoard: state.autoFlipBoard
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            const fen = state.currentFEN || STARTING_FEN;
            state.game = new Chess(fen);
          } catch (e) {
            console.error('Failed to rehydrate chess game:', e);
            state.game = new Chess();
            state.currentFEN = STARTING_FEN;
          }

          // Calculate elapsed time since last tick and subtract from active timer
          if (
            state.activeTimer &&
            state.lastActiveTimestamp &&
            !state.gameOver &&
            state.timeControl.mode !== 'unlimited'
          ) {
            const elapsedMs = Date.now() - state.lastActiveTimestamp;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);

            if (elapsedSeconds > 0) {
              const timeKey =
                state.activeTimer === 'white' ? 'whiteTime' : 'blackTime';
              const currentTime = state[timeKey];
              if (currentTime !== null) {
                const newTime = Math.max(0, currentTime - elapsedSeconds);
                state[timeKey] = newTime;
              }
            }
            state.lastActiveTimestamp = Date.now();
          }

          state.hasHydrated = true;
        }
      }
    }
  )
);

export const useChessMode = () => useChessStore((s) => s.mode);

export const useChessState = () =>
  useChessStore(
    useShallow((s) => ({
      mode: s.mode,
      gameType: s.gameType,
      hasHydrated: s.hasHydrated,
      game: s.game,
      currentFEN: s.currentFEN,
      moves: s.moves,
      viewingIndex: s.viewingIndex,
      positionHistory: s.positionHistory,
      boardOrientation: s.boardOrientation,
      playAs: s.playAs,
      stockfishLevel: s.stockfishLevel,
      gameOver: s.gameOver,
      gameResult: s.gameResult,
      gameStarted: s.gameStarted,
      gameId: s.gameId,
      playingAgainstStockfish: s.playingAgainstStockfish,
      playerColor: s.playerColor,
      soundEnabled: s.soundEnabled,
      boardFlipped: s.boardFlipped,
      autoFlipBoard: s.autoFlipBoard
    }))
  );

export const useChessSettings = () =>
  useChessStore(
    useShallow((s) => ({
      boardThemeName: s.boardThemeName,
      soundEnabled: s.soundEnabled,
      boardFlipped: s.boardFlipped,
      fullscreenEnabled: s.fullscreenEnabled,
      setBoardTheme: s.setBoardTheme,
      setSoundEnabled: s.setSoundEnabled,
      setFullscreenEnabled: s.setFullscreenEnabled,
      flipBoard: s.flipBoard
    }))
  );

export const useChessNavigation = () =>
  useChessStore(
    useShallow((s) => ({
      moves: s.moves,
      viewingIndex: s.viewingIndex,
      positionHistory: s.positionHistory,
      goToStart: s.goToStart,
      goToEnd: s.goToEnd,
      goToPrev: s.goToPrev,
      goToNext: s.goToNext,
      goToMove: s.goToMove,
      isViewingHistory: s.isViewingHistory
    }))
  );

export const useChessActions = () =>
  useChessStore(
    useShallow((s) => ({
      setMode: s.setMode,
      addMove: s.addMove,
      makeMove: s.makeMove,
      setOnNewGame: s.setOnNewGame,
      startGame: s.startGame,
      startLocalGame: s.startLocalGame,
      resetGame: s.resetGame,
      setGameOver: s.setGameOver,
      setGameResult: s.setGameResult,
      setGameType: s.setGameType,
      setAutoFlipBoard: s.setAutoFlipBoard,
      loadPGN: s.loadPGN,
      loadFEN: s.loadFEN,
      resetToStarting: s.resetToStarting,
      startPlayingFromPosition: s.startPlayingFromPosition,
      stopPlayingFromPosition: s.stopPlayingFromPosition,
      toggleBoardOrientation: s.toggleBoardOrientation,
      flipBoard: s.flipBoard,
      onNewGame: s.onNewGame,
      goToEnd: s.goToEnd,
      goToStart: s.goToStart,
      goToPrev: s.goToPrev,
      goToNext: s.goToNext,
      goToMove: s.goToMove
    }))
  );

export const useTimerState = () =>
  useChessStore(
    useShallow((s) => ({
      timeControl: s.timeControl,
      whiteTime: s.whiteTime,
      blackTime: s.blackTime,
      activeTimer: s.activeTimer,
      playAs: s.playAs,
      gameOver: s.gameOver,
      tickTimer: s.tickTimer,
      switchTimer: s.switchTimer,
      stopTimer: s.stopTimer,
      onTimeout: s.onTimeout
    }))
  );
