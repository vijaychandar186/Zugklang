import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FourPlayerGame,
  Piece,
  type Team,
  type PieceType,
  type GameStatus,
  type MoveRecord
} from './engine';
import { calculateScores } from './config/scoring';

const TEAM_ROTATIONS: Record<Team, number> = {
  r: 0,
  b: 270,
  y: 180,
  g: 90
};

const STORAGE_KEY = 'zugklang-game-four-player';

type SerializedPiece = {
  x: number;
  y: number;
  type: PieceType;
  team: Team;
  hasMoved: boolean;
};

type PersistedState = {
  gameStarted: boolean;
  isGameOver: boolean;
  orientation: number;
  pieces: SerializedPiece[];
  currentTeam: Team;
  loseOrder: Team[];
  totalMoves: number;
  status: GameStatus;
  moveHistory: MoveRecord[];
  eliminatedBy: Partial<Record<Team, Team>>;
};

function serializePieces(game: FourPlayerGame): SerializedPiece[] {
  return game.pieces.map((p) => ({
    x: p.x,
    y: p.y,
    type: p.type,
    team: p.team,
    hasMoved: p.hasMoved
  }));
}

function deserializePieces(data: SerializedPiece[]): Piece[] {
  return data.map((d) => new Piece(d.x, d.y, d.type, d.team, d.hasMoved));
}

interface FourPlayerStore {
  game: FourPlayerGame;
  position: Record<string, { pieceType: string }>;
  currentTeam: Team;
  orientation: number;
  gameId: number;
  selectedSquare: string | null;
  validMoves: string[];
  pendingPromotion: boolean;
  gameStarted: boolean;
  hasHydrated: boolean;

  moves: MoveRecord[];
  viewingMoveIndex: number;

  isGameOver: boolean;
  winner: Team | null;
  loseOrder: Team[];
  eliminatedBy: Partial<Record<Team, Team>>;
  scores: Record<Team, number>;

  selectSquare: (square: string) => void;
  movePiece: (from: string, to: string) => boolean;
  completePromotion: (piece: PieceType) => void;
  startGame: () => void;
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
    loseOrder: [...game.loseOrder],
    eliminatedBy: { ...game.eliminatedBy },
    scores: calculateScores(game.moveHistory, game.eliminatedBy)
  };
}

export const useFourPlayerStore = create<FourPlayerStore>()(
  persist(
    (set, get) => {
      const initialGame = new FourPlayerGame();
      return {
        ...syncFromGame(initialGame),
        orientation: 0,
        gameId: 0,
        selectedSquare: null,
        validMoves: [],
        gameStarted: false,
        hasHydrated: false,

        selectSquare: (square) => {
          const state = get();
          if (!state.gameStarted) return;
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
          const state = get();
          if (!state.gameStarted) return false;
          const { game } = state;

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

        startGame: () => {
          const newGame = new FourPlayerGame();
          set((state) => ({
            ...syncFromGame(newGame),
            selectedSquare: null,
            validMoves: [],
            gameId: state.gameId + 1,
            gameStarted: true
          }));
        },

        resetGame: () => {
          const newGame = new FourPlayerGame();
          set((state) => ({
            ...syncFromGame(newGame),
            selectedSquare: null,
            validMoves: [],
            gameId: state.gameId + 1,
            gameStarted: false
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
    },
    {
      name: STORAGE_KEY,
      partialize: (state): PersistedState => ({
        gameStarted: state.gameStarted,
        isGameOver: state.isGameOver,
        orientation: state.orientation,
        pieces: serializePieces(state.game),
        currentTeam: state.currentTeam,
        loseOrder: state.loseOrder,
        totalMoves: state.game.totalMoves,
        status: state.game.status,
        moveHistory: [...state.game.moveHistory],
        eliminatedBy: { ...state.eliminatedBy }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
      merge: (persisted, current) => {
        const saved = persisted as PersistedState | undefined;
        if (!saved || !saved.gameStarted) {
          return { ...current, hasHydrated: true };
        }

        try {
          const pieces = deserializePieces(saved.pieces);
          const game = new FourPlayerGame({
            pieces,
            currentTeam: saved.currentTeam,
            loseOrder: saved.loseOrder,
            totalMoves: saved.totalMoves,
            status: saved.status,
            moveHistory: saved.moveHistory,
            eliminatedBy: saved.eliminatedBy as Record<Team, Team>
          });

          return {
            ...current,
            ...syncFromGame(game),
            gameStarted: saved.gameStarted,
            orientation: saved.orientation,
            hasHydrated: true
          };
        } catch {
          return { ...current, hasHydrated: true };
        }
      }
    }
  )
);

export { TEAM_ROTATIONS };
