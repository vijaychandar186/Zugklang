import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess, type ChessJSMove } from '@/lib/chess/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';
import { GAME_DICE_CHESS_KEY } from '@/lib/storage/keys';
import { createLazyStorage, hasGameStarted } from '@/lib/storage/lazyStorage';
import { TimeControl } from '@/features/game/types/rules';
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
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;
  dice: DiceResult[] | null;
  isRolling: boolean;
  needsRoll: boolean;
  diceRollHistory: DicePiece[];
  highlightedSquares: Record<string, import('react').CSSProperties>;
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
  rollDice: (turnColor: 'w' | 'b') => void;
  setNeedsRoll: (needs: boolean) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (index: number) => void;
  calculateHighlights: () => void;
}
export const useDiceChessStore = create<DiceChessStore>()(
  persist(
    (set, get) => ({
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
      timeControl: { mode: 'unlimited', minutes: 0, increment: 0 },
      whiteTime: null,
      blackTime: null,
      activeTimer: null,
      lastActiveTimestamp: null,
      dice: null,
      isRolling: false,
      needsRoll: true,
      diceRollHistory: [],
      highlightedSquares: {},
      makeMove: (from, to, promotion) => {
        const {
          game,
          dice,
          needsRoll,
          isRolling,
          gameOver,
          moves,
          positionHistory,
          viewingIndex,
          timeControl,
          whiteTime,
          blackTime
        } = get();
        if (gameOver || needsRoll || isRolling) return null;
        const piece = game.get(from);
        if (!piece) return null;
        if (dice) {
          const pieceType = piece.type as DicePiece;
          const allowed = dice.some(
            (d) => d.piece === pieceType && d.hasValidMoves
          );
          if (!allowed) return null;
        }
        const move = game.move({ from, to, promotion });
        if (!move) return null;
        const newFEN = game.fen();
        const newHistory = [
          ...positionHistory.slice(0, viewingIndex + 1),
          newFEN
        ];
        const isOver = game.isGameOver();
        const result = isOver ? getGameResult(game) : null;
        const playerWhoMoved = move.color === 'w' ? 'white' : 'black';
        const nextPlayer = playerWhoMoved === 'white' ? 'black' : 'white';
        let newWhiteTime = whiteTime;
        let newBlackTime = blackTime;
        let newActiveTimer: 'white' | 'black' | null = null;
        if (timeControl.mode === 'timed' && !isOver) {
          const increment = timeControl.increment;
          if (playerWhoMoved === 'white' && whiteTime !== null) {
            newWhiteTime = whiteTime + increment;
          } else if (playerWhoMoved === 'black' && blackTime !== null) {
            newBlackTime = blackTime + increment;
          }
          newActiveTimer = nextPlayer;
        }
        set({
          currentFEN: newFEN,
          turn: game.turn(),
          moves: [...moves, move.san],
          positionHistory: newHistory,
          viewingIndex: newHistory.length - 1,
          dice: null,
          needsRoll: !isOver,
          highlightedSquares: {},
          gameOver: isOver,
          gameResult: result,
          whiteTime: newWhiteTime,
          blackTime: newBlackTime,
          activeTimer: newActiveTimer,
          lastActiveTimestamp: newActiveTimer ? Date.now() : null
        });
        return move;
      },
      calculateHighlights: () => {
        const { game, dice } = get();
        if (!dice) {
          set({ highlightedSquares: {} });
          return;
        }
        const validPieces = new Set(
          dice.filter((d) => d.hasValidMoves).map((d) => d.piece)
        );
        const squares: Record<string, import('react').CSSProperties> = {};
        const board = game.board();
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (
              piece &&
              piece.color === game.turn() &&
              validPieces.has(piece.type as DicePiece)
            ) {
              const square = String.fromCharCode(97 + c) + (8 - r);
              squares[square] = {
                boxShadow: 'var(--highlight-piece-indicator)',
                borderRadius: '4px'
              };
            }
          }
        }
        set({ highlightedSquares: squares });
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
          dice: null,
          isRolling: false,
          needsRoll: true,
          diceRollHistory: [],
          timeControl: tc,
          whiteTime,
          blackTime,
          activeTimer,
          lastActiveTimestamp
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
      rollDice: (_turnColor) => {
        const { game, diceRollHistory } = get();
        set({ isRolling: true });
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
            needsRoll: false,
            diceRollHistory: [...diceRollHistory, ...rolled.map((d) => d.piece)]
          });
          get().calculateHighlights();
          if (!anyValid) {
            setTimeout(() => {
              get().rollDice(_turnColor);
            }, 1200);
          }
        }, 800);
      },
      setNeedsRoll: (needs) => set({ needsRoll: needs }),
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
      name: GAME_DICE_CHESS_KEY,
      storage: createLazyStorage((state: unknown) => {
        const s = state as {
          moves?: unknown[];
          gameStarted?: boolean;
        };
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
