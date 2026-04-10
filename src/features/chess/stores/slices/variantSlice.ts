import { StateCreator } from 'zustand';
import { Chess } from '@/lib/chess';
import {
  ChessVariant,
  variantToRules,
  getStartingFEN
} from '@/features/chess/config/variants';
import { TimeControl } from '@/features/game/types/rules';
import { saveToModeStorage, loadFromModeStorage } from '../gameStorage';

export interface VariantSlice {
  variant: ChessVariant;
  setVariant: (variant: ChessVariant) => void;
}

type PersistedPlayState = {
  mode: 'play' | 'analysis';
  gameType: 'computer' | 'local';
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

const DEFAULT_TIME_CONTROL: TimeControl = {
  mode: 'unlimited',
  minutes: 0,
  increment: 0
};

export const createVariantSlice: StateCreator<
  VariantSlice & {
    mode: 'play' | 'analysis';
    gameType: 'computer' | 'local';
    game: Chess;
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
    playingAgainstStockfish: boolean;
  },
  [],
  [],
  VariantSlice
> = (set, get) => ({
  variant: 'standard',

  setVariant: (variant) => {
    const state = get();
    if (state.variant !== variant) {
      // Save current variant's state
      const currentState: PersistedPlayState = {
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
      };
      saveToModeStorage(`${state.gameType}-${state.variant}`, currentState);

      // Try to load saved state for the new variant
      const savedState = loadFromModeStorage<PersistedPlayState>(
        `${state.gameType}-${variant}`
      );
      if (savedState) {
        try {
          const game = new Chess(
            savedState.currentFEN || getStartingFEN(variant),
            variantToRules(variant)
          );
          set({
            variant,
            game,
            moves: savedState.moves || [],
            positionHistory: savedState.positionHistory || [
              getStartingFEN(variant)
            ],
            viewingIndex: savedState.viewingIndex || 0,
            currentFEN: savedState.currentFEN || getStartingFEN(variant),
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
            playingAgainstStockfish: false
          });
          return;
        } catch {
          // Fall through to fresh state
        }
      }

      // No saved state or load failed - start fresh
      const startingFEN = getStartingFEN(variant);
      const newGame = new Chess(startingFEN, variantToRules(variant));
      set({
        variant,
        game: newGame,
        currentFEN: startingFEN,
        moves: [],
        positionHistory: [startingFEN],
        viewingIndex: 0,
        gameStarted: false,
        gameOver: false,
        gameResult: null,
        playingAgainstStockfish: false,
        activeTimer: null,
        lastActiveTimestamp: null
      });
    }
  }
});
