import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import {
  Chess,
  ChessJSSquare as Square,
  ChessJSMove as Move
} from '@/lib/chess';
import { BoardThemeName } from '@/features/chess/types/theme';
import { DEFAULT_BOARD_THEME } from '@/features/chess/config/board-themes';
import { STARTING_FEN } from '@/features/chess/config/constants';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
import { TimeControl } from '@/features/game/types/rules';
import {
  createMultiModeStorage,
  saveToModeStorage,
  loadFromModeStorage
} from './gameStorage';
import {
  ChessVariant,
  generateRandomChess960FEN
} from '@/features/chess/utils/chess960';
import {
  createNavigationSlice,
  NavigationSlice,
  createBoardOrientationSlice,
  BoardOrientationSlice
} from './slices';
import { setCookie, getBooleanCookie } from '@/lib/settings';
import { initializeTimers, hasTimer, getIncrement } from '@/lib/timeControl';
import * as gameLoader from '@/lib/gameLoader';

const BOARD_SCHEME_COOKIE = 'boardScheme';
const SOUND_ENABLED_COOKIE = 'soundEnabled';
const PLAY_AS_COOKIE = 'playAs';

type PlayMode = 'computer' | 'local';

type PersistedPlayState = {
  mode: ChessMode;
  gameType: PlayMode;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  currentFEN: string;
  playAs: 'white' | 'black';
  stockfishLevel: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameResult: string | null;
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;
  boardOrientation: 'white' | 'black';
  autoFlipBoard: boolean;
  variant: ChessVariant;
};

export type ChessMode = 'play' | 'analysis';
export type GameType = 'computer' | 'local';

function getInitialSoundEnabled(): boolean {
  return getBooleanCookie(SOUND_ENABLED_COOKIE, true);
}

function getInitialBoard3dEnabled(): boolean {
  return getBooleanCookie(BOARD_3D_ENABLED_COOKIE, false);
}

interface ChessStore extends NavigationSlice, BoardOrientationSlice {
  mode: ChessMode;
  gameType: GameType;
  hasHydrated: boolean;
  game: Chess;
  moves: string[];
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
  board3dEnabled: boolean;
  autoFlipBoard: boolean;
  fullscreenEnabled: boolean;
  variant: ChessVariant;
  onNewGame: () => void;
  setMode: (mode: ChessMode) => void;
  setBoardTheme: (name: BoardThemeName) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setBoard3dEnabled: (enabled: boolean) => void;
  setFullscreenEnabled: (enabled: boolean) => void;
  addMove: (move: string, fen: string) => void;
  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  setMoves: (moves: string[]) => void;
  setCurrentFEN: (fen: string) => void;
  setOnNewGame: (onNewGame: () => void) => void;
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
  setVariant: (variant: ChessVariant) => void;
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
}

const DEFAULT_TIME_CONTROL: TimeControl = {
  mode: 'unlimited',
  minutes: 0,
  increment: 0
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
      boardFlipped: false,
      playAs: 'white',
      stockfishLevel: 10,
      gameOver: false,
      gameResult: null,
      gameStarted: false,
      gameId: 0,
      timeControl: DEFAULT_TIME_CONTROL,
      whiteTime: null,
      blackTime: null,
      activeTimer: null,
      lastActiveTimestamp: null,
      playingAgainstStockfish: false,
      playerColor: 'white',
      boardThemeName: DEFAULT_BOARD_THEME,
      soundEnabled: getInitialSoundEnabled(),
      board3dEnabled: getInitialBoard3dEnabled(),
      autoFlipBoard: false,
      fullscreenEnabled: false,
      variant: 'standard' as ChessVariant,
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
          set({ mode, playingAgainstStockfish: false });
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

      setBoard3dEnabled: (enabled) => {
        setCookie(BOARD_3D_ENABLED_COOKIE, String(enabled));
        set({ board3dEnabled: enabled });
      },

      setFullscreenEnabled: (enabled) => set({ fullscreenEnabled: enabled }),

      ...createBoardOrientationSlice(set),

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

      ...createNavigationSlice(set, get),

      setGameResult: (result) => set({ gameResult: result }),
      setGameOver: (gameOver) =>
        set({ gameOver, activeTimer: null, lastActiveTimestamp: null }),
      setGameStarted: (started) => set({ gameStarted: started }),
      setStockfishLevel: (level) => set({ stockfishLevel: level }),

      setPlayAs: (color) => {
        setCookie(PLAY_AS_COOKIE, color);
        set({ playAs: color });
      },

      startGame: (level, color, timeControl = DEFAULT_TIME_CONTROL) => {
        setCookie(PLAY_AS_COOKIE, color);
        const timers = initializeTimers(timeControl);
        const state = get();
        const startingFEN =
          state.variant === 'fischerRandom'
            ? generateRandomChess960FEN()
            : STARTING_FEN;
        const newGame = new Chess(startingFEN);

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
          positionHistory: [startingFEN],
          viewingIndex: 0,
          gameResult: null,
          currentFEN: startingFEN,
          gameId: state.gameId + 1,
          timeControl,
          whiteTime: timers.whiteTime,
          blackTime: timers.blackTime,
          activeTimer: hasTimer(timeControl) ? 'white' : null,
          lastActiveTimestamp: hasTimer(timeControl) ? Date.now() : null,
          playingAgainstStockfish: false
        });
      },

      startLocalGame: (timeControl = DEFAULT_TIME_CONTROL) => {
        const timers = initializeTimers(timeControl);
        const state = get();
        const startingFEN =
          state.variant === 'fischerRandom'
            ? generateRandomChess960FEN()
            : STARTING_FEN;
        const newGame = new Chess(startingFEN);

        set({
          mode: 'play',
          gameType: 'local',
          game: newGame,
          playAs: 'white',
          boardFlipped: false,
          boardOrientation: 'white',
          gameStarted: true,
          gameOver: false,
          moves: [],
          positionHistory: [startingFEN],
          viewingIndex: 0,
          gameResult: null,
          currentFEN: startingFEN,
          gameId: state.gameId + 1,
          timeControl,
          whiteTime: timers.whiteTime,
          blackTime: timers.blackTime,
          activeTimer: hasTimer(timeControl) ? 'white' : null,
          lastActiveTimestamp: hasTimer(timeControl) ? Date.now() : null,
          playingAgainstStockfish: false
        });
      },

      setGameType: (newGameType) => {
        const state = get();
        const oldGameType = state.gameType;

        if (oldGameType !== newGameType) {
          const currentState: PersistedPlayState = {
            mode: state.mode,
            gameType: oldGameType,
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
            autoFlipBoard: state.autoFlipBoard,
            variant: state.variant
          };
          saveToModeStorage(oldGameType, currentState);

          const savedState =
            loadFromModeStorage<PersistedPlayState>(newGameType);
          if (savedState) {
            try {
              const game = new Chess(savedState.currentFEN || STARTING_FEN);
              set({
                gameType: newGameType,
                game,
                moves: savedState.moves || [],
                positionHistory: savedState.positionHistory || [STARTING_FEN],
                viewingIndex: savedState.viewingIndex || 0,
                currentFEN: savedState.currentFEN || STARTING_FEN,
                playAs: savedState.playAs || 'white',
                stockfishLevel: savedState.stockfishLevel || 10,
                gameStarted: savedState.gameStarted || false,
                gameOver: savedState.gameOver || false,
                gameResult: savedState.gameResult || null,
                timeControl: savedState.timeControl || DEFAULT_TIME_CONTROL,
                whiteTime: savedState.whiteTime,
                blackTime: savedState.blackTime,
                activeTimer: savedState.activeTimer,
                lastActiveTimestamp: savedState.lastActiveTimestamp,
                boardOrientation: savedState.boardOrientation || 'white',
                autoFlipBoard: savedState.autoFlipBoard || false,
                variant: savedState.variant || 'standard'
              });
            } catch {
              set({
                gameType: newGameType,
                game: new Chess(),
                moves: [],
                positionHistory: [STARTING_FEN],
                viewingIndex: 0,
                currentFEN: STARTING_FEN,
                gameStarted: false,
                gameOver: false,
                gameResult: null
              });
            }
          } else {
            set({
              gameType: newGameType,
              game: new Chess(),
              moves: [],
              positionHistory: [STARTING_FEN],
              viewingIndex: 0,
              currentFEN: STARTING_FEN,
              gameStarted: false,
              gameOver: false,
              gameResult: null
            });
          }
        } else {
          set({ gameType: newGameType });
        }
      },

      setAutoFlipBoard: (enabled) => set({ autoFlipBoard: enabled }),
      setVariant: (variant) => set({ variant }),

      resetGame: () => {
        const state = get();
        const timers = initializeTimers(state.timeControl);
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
          whiteTime: timers.whiteTime,
          blackTime: timers.blackTime,
          activeTimer:
            hasTimer(state.timeControl) && state.playAs === 'white'
              ? 'white'
              : null,
          lastActiveTimestamp: hasTimer(state.timeControl) ? Date.now() : null,
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
          return {
            [timeKey]: currentTime - 1,
            lastActiveTimestamp: Date.now()
          };
        }),

      switchTimer: (toColor) =>
        set((state) => {
          if (state.gameOver || state.timeControl.mode === 'unlimited')
            return {};
          const movedColor = toColor === 'white' ? 'black' : 'white';
          const movedTimeKey =
            movedColor === 'white' ? 'whiteTime' : 'blackTime';
          const currentTime = state[movedTimeKey];
          const increment = getIncrement(state.timeControl, movedColor);
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
        const result = gameLoader.loadPGN(pgn);
        if (!result) return false;
        set({
          game: result.game,
          currentFEN: result.currentFEN,
          moves: result.moves,
          positionHistory: result.positionHistory,
          viewingIndex: result.viewingIndex
        });
        return true;
      },

      loadFEN: (fen) => {
        const result = gameLoader.loadFEN(fen);
        if (!result) return false;
        set({
          game: result.game,
          currentFEN: result.currentFEN,
          moves: result.moves,
          positionHistory: result.positionHistory,
          viewingIndex: result.viewingIndex
        });
        return true;
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

      stopPlayingFromPosition: () => set({ playingAgainstStockfish: false })
    }),
    {
      name: 'zugklang-play-storage',
      storage: createMultiModeStorage(
        (state) => (state as { gameType?: PlayMode })?.gameType,
        'computer'
      ),
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
        autoFlipBoard: state.autoFlipBoard,
        variant: state.variant
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
                state[timeKey] = Math.max(0, currentTime - elapsedSeconds);
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
      board3dEnabled: s.board3dEnabled,
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
