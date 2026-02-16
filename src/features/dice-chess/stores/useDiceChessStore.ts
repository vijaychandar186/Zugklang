import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess, type ChessJSMove } from '@/lib/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';

export type DicePiece = 'k' | 'q' | 'b' | 'n' | 'r' | 'p';

export const PIECE_NAMES: Record<DicePiece, string> = {
  k: 'King',
  q: 'Queen',
  b: 'Bishop',
  n: 'Knight',
  r: 'Rook',
  p: 'Pawn'
};

const ALL_PIECES: DicePiece[] = ['k', 'q', 'b', 'n', 'r', 'p'];

export interface DiceResult {
  piece: DicePiece;
  hasValidMoves: boolean;
}

function rollRandomPiece(): DicePiece {
  return ALL_PIECES[Math.floor(Math.random() * ALL_PIECES.length)];
}

function checkPieceHasValidMoves(game: Chess, piece: DicePiece): boolean {
  const moves = game.moves({ verbose: true }) as ChessJSMove[];
  return moves.some((m) => m.piece === piece);
}

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

interface DiceChessStore {
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

  // Dice state
  dice: DiceResult[] | null;
  isRolling: boolean;
  needsRoll: boolean;

  // Game actions
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  startNewGame: () => void;
  reset: () => void;
  setGameStarted: (started: boolean) => void;
  setGameOver: (over: boolean) => void;
  setGameResult: (result: string | null) => void;

  // Dice actions
  rollDice: (turnColor: 'w' | 'b') => void;
  setNeedsRoll: (needs: boolean) => void;

  // Navigation
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (index: number) => void;
}

export const useDiceChessStore = create<DiceChessStore>()(
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

      dice: null,
      isRolling: false,
      needsRoll: true,

      // ── Game actions ───────────────────────────────────────────────────

      makeMove: (from, to, promotion) => {
        const {
          game,
          dice,
          needsRoll,
          isRolling,
          gameOver,
          moves,
          positionHistory,
          viewingIndex
        } = get();
        if (gameOver || needsRoll || isRolling) return false;

        // Get the piece at the source square
        const piece = game.get(from);
        if (!piece) return false;

        // Validate against dice — the piece type must match at least one die with valid moves
        if (dice) {
          const pieceType = piece.type as DicePiece;
          const allowed = dice.some(
            (d) => d.piece === pieceType && d.hasValidMoves
          );
          if (!allowed) return false;
        }

        // Try to make the move
        const move = game.move({ from, to, promotion });
        if (!move) return false;

        const newFEN = game.fen();
        const newHistory = [
          ...positionHistory.slice(0, viewingIndex + 1),
          newFEN
        ];

        // Check game over
        const isOver = game.isGameOver();
        const result = isOver ? getGameResult(game) : null;

        set({
          currentFEN: newFEN,
          turn: game.turn(),
          moves: [...moves, move.san],
          positionHistory: newHistory,
          viewingIndex: newHistory.length - 1,
          dice: null,
          needsRoll: !isOver,
          gameOver: isOver,
          gameResult: result
        });

        return true;
      },

      startNewGame: () => {
        const newGame = new Chess();
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
          dice: null,
          isRolling: false,
          needsRoll: true
        });
      },

      reset: () => {
        set({
          dice: null,
          isRolling: false,
          needsRoll: true
        });
      },

      setGameStarted: (started) => set({ gameStarted: started }),
      setGameOver: (over) => set({ gameOver: over }),
      setGameResult: (result) => set({ gameResult: result }),

      // ── Dice actions ───────────────────────────────────────────────────

      rollDice: (_turnColor) => {
        const { game } = get();
        set({ isRolling: true });

        // Simulate rolling animation delay
        setTimeout(() => {
          const rolled: DiceResult[] = [];
          for (let i = 0; i < 3; i++) {
            const piece = rollRandomPiece();
            const hasValidMoves = checkPieceHasValidMoves(game, piece);
            rolled.push({ piece, hasValidMoves });
          }

          const anyValid = rolled.some((d) => d.hasValidMoves);

          set({
            dice: rolled,
            isRolling: false,
            needsRoll: false
          });

          // Auto re-roll if no valid moves after a short delay
          if (!anyValid) {
            setTimeout(() => {
              set({ needsRoll: true });
            }, 1500);
          }
        }, 800);
      },

      setNeedsRoll: (needs) => set({ needsRoll: needs }),

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
      name: 'zugklang-dice-chess',
      partialize: (state) => ({
        currentFEN: state.currentFEN,
        turn: state.turn,
        moves: state.moves,
        positionHistory: state.positionHistory,
        viewingIndex: state.viewingIndex,
        gameStarted: state.gameStarted,
        gameOver: state.gameOver,
        gameResult: state.gameResult
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
          state.hasHydrated = true;
        }
      }
    }
  )
);
