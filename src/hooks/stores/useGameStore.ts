import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { BoardThemeName, DEFAULT_BOARD_THEME } from '@/constants/board-themes';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const BOARD_SCHEME_COOKIE = 'boardScheme';
const SOUND_ENABLED_COOKIE = 'soundEnabled';
const GAME_STATE_COOKIE = 'gameState';

// Time control modes
export type TimeControlMode = 'unlimited' | 'timed' | 'custom';

// Time control: supports both symmetric (same for both) and asymmetric (custom per player)
export type TimeControl = {
  mode: TimeControlMode;
  // For 'timed' mode: same for both players
  minutes: number; // 0-180, 0 means unlimited
  increment: number; // 0-180 seconds
  // For 'custom' mode: different for each player
  whiteMinutes?: number;
  whiteIncrement?: number;
  blackMinutes?: number;
  blackIncrement?: number;
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=31536000`;
}

type PersistedGameState = {
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
  increment: number;
};

function getPersistedGameState(): Partial<PersistedGameState> | null {
  try {
    const value = getCookie(GAME_STATE_COOKIE);
    if (!value) return null;
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

function persistGameState(state: PersistedGameState) {
  try {
    const encoded = encodeURIComponent(JSON.stringify(state));
    setCookie(GAME_STATE_COOKIE, encoded);
  } catch {
    // Cookie too large or other error, skip persistence
  }
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
  // Timer state
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;

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
  startGame: (
    level: number,
    color: 'white' | 'black',
    timeControl?: TimeControl
  ) => void;
  resetGame: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
  isViewingHistory: () => boolean;
  // Timer actions
  setTimeControl: (timeControl: TimeControl) => void;
  tickTimer: (color: 'white' | 'black') => void;
  switchTimer: (toColor: 'white' | 'black') => void;
  stopTimer: () => void;
  onTimeout: (color: 'white' | 'black') => void;
};

// Helper to persist current game state
function persistCurrentState(state: GameStore) {
  persistGameState({
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
    increment: state.timeControl.increment
  });
}

// Load persisted state
const persistedState = getPersistedGameState();

export const useGameStore = create<GameStore>((set, get) => ({
  boardThemeName: getInitialBoardTheme(),
  soundEnabled: getInitialSoundEnabled(),
  moves: persistedState?.moves ?? [],
  positionHistory: persistedState?.positionHistory ?? [STARTING_FEN],
  viewingIndex: persistedState?.viewingIndex ?? 0,
  gameResult: persistedState?.gameResult ?? null,
  currentFEN: persistedState?.currentFEN ?? STARTING_FEN,
  gameOver: persistedState?.gameOver ?? false,
  gameStarted: persistedState?.gameStarted ?? false,
  gameId: 0,
  stockfishLevel: persistedState?.stockfishLevel ?? 10,
  playAs: persistedState?.playAs ?? 'white',
  boardFlipped: false,
  onNewGame: () => {},
  // Timer state
  timeControl: persistedState?.timeControl ?? {
    mode: 'unlimited',
    minutes: 0,
    increment: 0
  },
  whiteTime: persistedState?.whiteTime ?? null,
  blackTime: persistedState?.blackTime ?? null,
  activeTimer: null,

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
    set((state) => {
      const newState = {
        moves: [...state.moves, move],
        positionHistory: [...state.positionHistory, fen],
        viewingIndex: state.positionHistory.length,
        currentFEN: fen
      };
      // Persist after state update
      setTimeout(() => persistCurrentState(get()), 0);
      return newState;
    }),
  setMoves: (moves) => set({ moves }),
  setGameResult: (result) => {
    set({ gameResult: result });
    setTimeout(() => persistCurrentState(get()), 0);
  },
  setOnNewGame: (onNewGame) => set({ onNewGame }),
  setCurrentFEN: (fen) => set({ currentFEN: fen }),
  setGameOver: (gameOver) => {
    set({ gameOver, activeTimer: null });
    setTimeout(() => persistCurrentState(get()), 0);
  },
  setGameStarted: (started) => set({ gameStarted: started }),
  setStockfishLevel: (level) => set({ stockfishLevel: level }),
  setPlayAs: (color) => set({ playAs: color }),
  startGame: (
    level,
    color,
    timeControl = { mode: 'unlimited', minutes: 0, increment: 0 }
  ) => {
    // Calculate initial time in seconds based on mode
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
    const newState = {
      stockfishLevel: level,
      playAs: color,
      boardFlipped: false,
      gameStarted: true,
      gameOver: false,
      moves: [] as string[],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      gameResult: null,
      currentFEN: STARTING_FEN,
      gameId: get().gameId + 1,
      timeControl,
      whiteTime: whiteInitialTime,
      blackTime: blackInitialTime,
      activeTimer: (hasTimer ? 'white' : null) as 'white' | 'black' | null
    };
    set(newState);
    setTimeout(() => persistCurrentState(get()), 0);
  },
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
    const newState = {
      gameOver: false,
      moves: [] as string[],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      gameResult: null,
      currentFEN: STARTING_FEN,
      gameId: state.gameId + 1,
      whiteTime: whiteInitialTime,
      blackTime: blackInitialTime,
      activeTimer: (hasTimer && state.playAs === 'white' ? 'white' : null) as
        | 'white'
        | 'black'
        | null
    };
    set(newState);
    setTimeout(() => persistCurrentState(get()), 0);
  },
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
  },
  // Timer actions
  setTimeControl: (timeControl) => set({ timeControl }),
  tickTimer: (color) =>
    set((state) => {
      if (state.activeTimer !== color || state.gameOver) return {};
      const timeKey = color === 'white' ? 'whiteTime' : 'blackTime';
      const currentTime = state[timeKey];
      if (currentTime === null || currentTime <= 0) return {};
      const newTime = currentTime - 1;
      const update = { [timeKey]: newTime };
      // Persist timer state periodically (every 5 seconds)
      if (newTime % 5 === 0) {
        setTimeout(() => persistCurrentState(get()), 0);
      }
      return update;
    }),
  switchTimer: (toColor) =>
    set((state) => {
      if (state.gameOver || state.timeControl.mode === 'unlimited') return {};
      // Add increment to the player who just moved (opposite of toColor)
      const movedColor = toColor === 'white' ? 'black' : 'white';
      const movedTimeKey = movedColor === 'white' ? 'whiteTime' : 'blackTime';
      const currentTime = state[movedTimeKey];
      // Get increment based on mode
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
        [movedTimeKey]: newTime
      };
    }),
  stopTimer: () => set({ activeTimer: null }),
  onTimeout: (color) => {
    const state = get();
    const isPlayerTimeout = color === state.playAs;
    set({
      gameOver: true,
      gameResult: isPlayerTimeout
        ? 'Stockfish wins on time!'
        : 'You win on time!',
      activeTimer: null
    });
    setTimeout(() => persistCurrentState(get()), 0);
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

export const useTimerState = () =>
  useGameStore(
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
