import { create } from 'zustand';
import {
  FourPlayerGame,
  type Team,
  type PieceType,
  type MoveRecord
} from './engine';

const TEAM_ROTATIONS: Record<Team, number> = {
  r: 0,
  b: 270,
  y: 180,
  g: 90
};

interface FourPlayerStore {
  game: FourPlayerGame;
  position: Record<string, { pieceType: string }>;
  currentTeam: Team;
  orientation: number;
  gameId: number;
  selectedSquare: string | null;
  validMoves: string[];
  pendingPromotion: boolean;
  moves: MoveRecord[];
  viewingMoveIndex: number;
  isGameOver: boolean;
  winner: Team | null;
  loseOrder: Team[];

  selectSquare: (square: string) => void;
  movePiece: (from: string, to: string) => boolean;
  completePromotion: (piece: PieceType) => void;
  resetGame: () => void;
  setOrientation: (degrees: number) => void;
  goToMove: (index: number) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
}

function syncFromGame(game: FourPlayerGame) {
  return {
    game,
    position: game.toPosition(),
    currentTeam: game.currentTeam,
    pendingPromotion: !!game.pendingPromotion,
    moves: [...game.moveHistory],
    viewingMoveIndex: game.moveHistory.length - 1,
    isGameOver: game.status === 'gameover',
    winner: game.winner,
    loseOrder: [...game.loseOrder]
  };
}

export const useFourPlayerStore = create<FourPlayerStore>()((set, get) => {
  const initialGame = new FourPlayerGame();
  return {
    ...syncFromGame(initialGame),
    orientation: 0,
    gameId: 0,
    selectedSquare: null,
    validMoves: [],

    selectSquare: (square) => {
      const state = get();
      const { game } = state;

      if (state.selectedSquare && state.validMoves.includes(square)) {
        state.movePiece(state.selectedSquare, square);
        return;
      }

      const moves = game.getMovesForSquare(square);
      if (moves.length > 0) {
        set({ selectedSquare: square, validMoves: moves });
      } else {
        set({ selectedSquare: null, validMoves: [] });
      }
    },

    movePiece: (from, to) => {
      const { game } = get();

      const success = game.playMove(from, to);
      if (!success) return false;

      set({
        ...syncFromGame(game),
        selectedSquare: null,
        validMoves: []
      });

      return true;
    },

    completePromotion: (piece) => {
      const { game } = get();
      game.completePromotion(piece);
      set({
        ...syncFromGame(game),
        selectedSquare: null,
        validMoves: []
      });
    },

    resetGame: () => {
      const newGame = new FourPlayerGame();
      set((state) => ({
        ...syncFromGame(newGame),
        selectedSquare: null,
        validMoves: [],
        gameId: state.gameId + 1
      }));
    },

    setOrientation: (degrees) => {
      set({ orientation: degrees });
    },

    goToMove: (index) => {
      set({ viewingMoveIndex: index });
    },

    goToStart: () => {
      set({ viewingMoveIndex: -1 });
    },

    goToEnd: () => {
      const { moves } = get();
      set({ viewingMoveIndex: moves.length - 1 });
    },

    goToPrev: () => {
      const { viewingMoveIndex } = get();
      if (viewingMoveIndex > -1) {
        set({ viewingMoveIndex: viewingMoveIndex - 1 });
      }
    },

    goToNext: () => {
      const { viewingMoveIndex, moves } = get();
      if (viewingMoveIndex < moves.length - 1) {
        set({ viewingMoveIndex: viewingMoveIndex + 1 });
      }
    }
  };
});

export { TEAM_ROTATIONS };
