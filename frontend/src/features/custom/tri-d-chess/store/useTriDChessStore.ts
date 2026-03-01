'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type TriDSquare,
  type AttackBoardId,
  type AttackBoardSlot,
  type PieceType,
  type Color,
  squareKey,
  BOARD_SIZES
} from '../engine/types';
import {
  type TriDGameState,
  createInitialState,
  applyPieceMove,
  applyBoardMove,
  getLegalMoves,
  getLegalBoardMoves,
  getCurrentCheck,
  getKingSquare,
  requiresPromotion
} from '../engine/gameEngine';
import { GAME_THREE_D_CHESS_KEY } from '@/lib/storage/keys';
import { createLazyStorage } from '@/lib/storage/lazyStorage';
import type { TimeControl } from '@/features/game/types/rules';
export type SelectionMode = 'piece' | 'board';
interface PendingPromotion {
  from: TriDSquare;
  to: TriDSquare;
}
interface PendingBoardArrival {
  boardId: AttackBoardId;
  toSlot: AttackBoardSlot;
  identityKey: string;
  rot180Key: string;
}
interface TriDChessStore {
  gameState: TriDGameState;
  gameStarted: boolean;
  viewingIndex: number;
  selected: TriDSquare | null;
  selectedBoardId: AttackBoardId | null;
  selectionMode: SelectionMode;
  highlightedSquares: Set<string>;
  highlightedSlots: Set<AttackBoardSlot>;
  pendingPromotion: PendingPromotion | null;
  pendingBoardArrival: PendingBoardArrival | null;
  inCheck: boolean;
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;
  startNewGame: (timeControl?: TimeControl) => void;
  selectSquare: (sq: TriDSquare) => void;
  selectAttackBoard: (boardId: AttackBoardId) => void;
  moveAttackBoard: (boardId: AttackBoardId, toSlot: AttackBoardSlot) => void;
  chooseBoardArrival: (choice: 'identity' | 'rot180') => void;
  completePromotion: (piece: PieceType) => void;
  cancelPromotion: () => void;
  setSelectionMode: (mode: SelectionMode) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (index: number) => void;
  tickTimer: () => void;
  setGameOver: (over: boolean) => void;
  setGameResult: (result: string | null) => void;
}
function computeInCheck(state: TriDGameState): boolean {
  return getCurrentCheck(state);
}
export const useTriDChessStore = create<TriDChessStore>()(
  persist(
    (set, get) => ({
      gameState: createInitialState(),
      gameStarted: false,
      viewingIndex: 0,
      selected: null,
      selectedBoardId: null,
      selectionMode: 'piece',
      highlightedSquares: new Set(),
      highlightedSlots: new Set(),
      pendingPromotion: null,
      pendingBoardArrival: null,
      inCheck: false,
      timeControl: { mode: 'unlimited', minutes: 0, increment: 0 },
      whiteTime: null,
      blackTime: null,
      activeTimer: null,
      lastActiveTimestamp: null,
      startNewGame: (timeControl) => {
        const tc = timeControl ?? {
          mode: 'unlimited',
          minutes: 0,
          increment: 0
        };
        const newState = createInitialState();
        set({
          gameState: newState,
          gameStarted: true,
          viewingIndex: 0,
          selected: null,
          selectedBoardId: null,
          selectionMode: 'piece',
          highlightedSquares: new Set(),
          highlightedSlots: new Set(),
          pendingPromotion: null,
          pendingBoardArrival: null,
          inCheck: false,
          timeControl: tc,
          whiteTime: tc.mode === 'timed' ? tc.minutes * 60 : null,
          blackTime: tc.mode === 'timed' ? tc.minutes * 60 : null,
          activeTimer: tc.mode === 'timed' ? 'white' : null,
          lastActiveTimestamp: tc.mode === 'timed' ? Date.now() : null
        });
      },
      selectSquare: (sq) => {
        const {
          gameState,
          selected,
          viewingIndex,
          gameStarted,
          pendingBoardArrival
        } = get();
        if (!gameStarted || gameState.isOver) return;
        if (viewingIndex !== gameState.snapshots.length - 1) return;
        if (pendingBoardArrival) {
          const key = squareKey(sq);
          if (
            key === pendingBoardArrival.identityKey ||
            key === pendingBoardArrival.rot180Key
          ) {
            const choice =
              key === pendingBoardArrival.rot180Key ? 'rot180' : 'identity';
            get().chooseBoardArrival(choice);
          } else {
            set({
              pendingBoardArrival: null,
              highlightedSquares: new Set(),
              selected: null
            });
          }
          return;
        }
        const piece = gameState.pieces[squareKey(sq)];
        if (selected) {
          const sqKey = squareKey(sq);
          if (
            piece &&
            piece.color === gameState.turn &&
            !get().highlightedSquares.has(sqKey)
          ) {
            const legal = getLegalMoves(sq, gameState);
            set({
              selected: sq,
              highlightedSquares: new Set(legal.map(squareKey)),
              selectedBoardId: null,
              highlightedSlots: new Set()
            });
            return;
          }
          const needs = requiresPromotion(selected, sq, gameState);
          if (needs) {
            set({
              pendingPromotion: { from: selected, to: sq },
              selected: null,
              highlightedSquares: new Set()
            });
            return;
          }
          const result = applyPieceMove(gameState, selected, sq);
          if (result) {
            const { nextState } = result;
            const newCheck = computeInCheck(nextState);
            const tc = get().timeControl;
            let { whiteTime, blackTime, activeTimer } = get();
            if (tc.mode === 'timed') {
              const inc = tc.increment;
              if (gameState.turn === 'w' && whiteTime !== null)
                whiteTime = whiteTime + inc;
              else if (gameState.turn === 'b' && blackTime !== null)
                blackTime = blackTime + inc;
              activeTimer = nextState.turn === 'w' ? 'white' : 'black';
            }
            set({
              gameState: nextState,
              viewingIndex: nextState.snapshots.length - 1,
              selected: null,
              selectedBoardId: null,
              highlightedSquares: new Set(),
              highlightedSlots: new Set(),
              inCheck: newCheck,
              whiteTime,
              blackTime,
              activeTimer: nextState.isOver ? null : activeTimer,
              lastActiveTimestamp:
                activeTimer && !nextState.isOver ? Date.now() : null
            });
            return;
          }
          set({ selected: null, highlightedSquares: new Set() });
          return;
        }
        if (piece && piece.color === gameState.turn) {
          const legal = getLegalMoves(sq, gameState);
          set({
            selected: sq,
            selectedBoardId: null,
            highlightedSquares: new Set(legal.map(squareKey)),
            highlightedSlots: new Set()
          });
        }
      },
      selectAttackBoard: (boardId) => {
        const { gameState, viewingIndex, gameStarted } = get();
        if (!gameStarted || gameState.isOver) return;
        if (viewingIndex !== gameState.snapshots.length - 1) return;
        const legalSlots = getLegalBoardMoves(boardId, gameState);
        if (legalSlots.length === 0) return;
        set({
          selectedBoardId: boardId,
          selected: null,
          highlightedSlots: new Set(legalSlots),
          highlightedSquares: new Set()
        });
      },
      moveAttackBoard: (boardId, toSlot) => {
        const { gameState, highlightedSlots } = get();
        if (!highlightedSlots.has(toSlot)) return;
        const size = BOARD_SIZES[boardId];
        let passengerRow = -1;
        let passengerCol = -1;
        let pieceCount = 0;
        for (let r = 0; r < size.rows; r++) {
          for (let c = 0; c < size.cols; c++) {
            if (gameState.pieces[squareKey({ boardId, row: r, col: c })]) {
              pieceCount++;
              passengerRow = r;
              passengerCol = c;
            }
          }
        }
        if (pieceCount === 1) {
          const identityKey = squareKey({
            boardId,
            row: passengerRow,
            col: passengerCol
          });
          const rot180Key = squareKey({
            boardId,
            row: size.rows - 1 - passengerRow,
            col: size.cols - 1 - passengerCol
          });
          set({
            pendingBoardArrival: { boardId, toSlot, identityKey, rot180Key },
            highlightedSquares: new Set([identityKey, rot180Key]),
            highlightedSlots: new Set(),
            selectedBoardId: null,
            selected: null
          });
          return;
        }
        const result = applyBoardMove(gameState, boardId, toSlot);
        if (!result) return;
        const { nextState } = result;
        const newCheck = computeInCheck(nextState);
        const tc = get().timeControl;
        let { whiteTime, blackTime, activeTimer } = get();
        if (tc.mode === 'timed') {
          const inc = tc.increment;
          if (gameState.turn === 'w' && whiteTime !== null)
            whiteTime = whiteTime + inc;
          else if (gameState.turn === 'b' && blackTime !== null)
            blackTime = blackTime + inc;
          activeTimer = nextState.turn === 'w' ? 'white' : 'black';
        }
        set({
          gameState: nextState,
          viewingIndex: nextState.snapshots.length - 1,
          selected: null,
          selectedBoardId: null,
          highlightedSquares: new Set(),
          highlightedSlots: new Set(),
          inCheck: newCheck,
          whiteTime,
          blackTime,
          activeTimer: nextState.isOver ? null : activeTimer,
          lastActiveTimestamp:
            activeTimer && !nextState.isOver ? Date.now() : null
        });
      },
      chooseBoardArrival: (choice) => {
        const { gameState, pendingBoardArrival } = get();
        if (!pendingBoardArrival) return;
        const result = applyBoardMove(
          gameState,
          pendingBoardArrival.boardId,
          pendingBoardArrival.toSlot,
          choice
        );
        if (!result) {
          set({ pendingBoardArrival: null, highlightedSquares: new Set() });
          return;
        }
        const { nextState } = result;
        const newCheck = computeInCheck(nextState);
        const tc = get().timeControl;
        let { whiteTime, blackTime, activeTimer } = get();
        if (tc.mode === 'timed') {
          const inc = tc.increment;
          if (gameState.turn === 'w' && whiteTime !== null)
            whiteTime = whiteTime + inc;
          else if (gameState.turn === 'b' && blackTime !== null)
            blackTime = blackTime + inc;
          activeTimer = nextState.turn === 'w' ? 'white' : 'black';
        }
        set({
          gameState: nextState,
          viewingIndex: nextState.snapshots.length - 1,
          selected: null,
          selectedBoardId: null,
          highlightedSquares: new Set(),
          highlightedSlots: new Set(),
          pendingBoardArrival: null,
          inCheck: newCheck,
          whiteTime,
          blackTime,
          activeTimer: nextState.isOver ? null : activeTimer,
          lastActiveTimestamp:
            activeTimer && !nextState.isOver ? Date.now() : null
        });
      },
      completePromotion: (piece) => {
        const { gameState, pendingPromotion } = get();
        if (!pendingPromotion) return;
        const result = applyPieceMove(
          gameState,
          pendingPromotion.from,
          pendingPromotion.to,
          piece
        );
        if (result) {
          const { nextState } = result;
          set({
            gameState: nextState,
            viewingIndex: nextState.snapshots.length - 1,
            pendingPromotion: null,
            inCheck: computeInCheck(nextState)
          });
        } else {
          set({ pendingPromotion: null });
        }
      },
      cancelPromotion: () => set({ pendingPromotion: null }),
      setSelectionMode: (mode) =>
        set({
          selectionMode: mode,
          selected: null,
          selectedBoardId: null,
          highlightedSquares: new Set(),
          highlightedSlots: new Set(),
          pendingBoardArrival: null
        }),
      goToStart: () => {
        const { gameState } = get();
        const snap = gameState.snapshots[0];
        set({
          viewingIndex: 0,
          selected: null,
          selectedBoardId: null,
          highlightedSquares: new Set(),
          highlightedSlots: new Set()
        });
        void snap;
      },
      goToEnd: () => {
        const { gameState } = get();
        const last = gameState.snapshots.length - 1;
        set({
          viewingIndex: last,
          selected: null,
          selectedBoardId: null,
          highlightedSquares: new Set(),
          highlightedSlots: new Set()
        });
      },
      goToPrev: () => {
        const { viewingIndex } = get();
        if (viewingIndex > 0) {
          set({
            viewingIndex: viewingIndex - 1,
            selected: null,
            selectedBoardId: null,
            highlightedSquares: new Set(),
            highlightedSlots: new Set()
          });
        }
      },
      goToNext: () => {
        const { viewingIndex, gameState } = get();
        if (viewingIndex < gameState.snapshots.length - 1) {
          set({
            viewingIndex: viewingIndex + 1,
            selected: null,
            selectedBoardId: null,
            highlightedSquares: new Set(),
            highlightedSlots: new Set()
          });
        }
      },
      goToMove: (index) => {
        const { gameState } = get();
        const posIdx = Math.min(index + 1, gameState.snapshots.length - 1);
        set({
          viewingIndex: posIdx,
          selected: null,
          selectedBoardId: null,
          highlightedSquares: new Set(),
          highlightedSlots: new Set()
        });
      },
      tickTimer: () => {
        const { activeTimer, whiteTime, blackTime, gameState } = get();
        if (!activeTimer || gameState.isOver) return;
        if (activeTimer === 'white' && whiteTime !== null) {
          const newTime = Math.max(0, whiteTime - 1);
          if (newTime === 0) {
            set({
              whiteTime: 0,
              activeTimer: null,
              gameState: {
                ...gameState,
                isOver: true,
                result: 'Black wins on time'
              }
            });
          } else {
            set({ whiteTime: newTime });
          }
        } else if (activeTimer === 'black' && blackTime !== null) {
          const newTime = Math.max(0, blackTime - 1);
          if (newTime === 0) {
            set({
              blackTime: 0,
              activeTimer: null,
              gameState: {
                ...gameState,
                isOver: true,
                result: 'White wins on time'
              }
            });
          } else {
            set({ blackTime: newTime });
          }
        }
      },
      setGameOver: (over) => {
        const { gameState } = get();
        set({ gameState: { ...gameState, isOver: over } });
      },
      setGameResult: (result) => {
        const { gameState } = get();
        set({ gameState: { ...gameState, result } });
      }
    }),
    {
      name: GAME_THREE_D_CHESS_KEY,
      storage: createLazyStorage((state: unknown) => {
        const s = state as {
          gameStarted?: boolean;
        };
        return s.gameStarted === true;
      }),
      partialize: (state) => ({
        gameState: {
          pieces: state.gameState.pieces,
          slots: state.gameState.slots,
          turn: state.gameState.turn,
          moveHistory: state.gameState.moveHistory,
          isOver: state.gameState.isOver,
          result: state.gameState.result,
          enPassantTarget: state.gameState.enPassantTarget,
          snapshots: state.gameState.snapshots
        },
        gameStarted: state.gameStarted,
        viewingIndex: state.viewingIndex,
        timeControl: state.timeControl,
        whiteTime: state.whiteTime,
        blackTime: state.blackTime,
        activeTimer: state.activeTimer,
        lastActiveTimestamp: state.lastActiveTimestamp
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.highlightedSquares = new Set();
        state.highlightedSlots = new Set();
        state.selected = null;
        state.selectedBoardId = null;
        state.pendingPromotion = null;
        state.pendingBoardArrival = null;
        state.selectionMode = 'piece';
        if (!state.gameState) state.gameState = createInitialState();
        if (state.gameState.enPassantTarget === undefined)
          (state.gameState as TriDGameState).enPassantTarget = null;
        state.inCheck = computeInCheck(state.gameState);
        if (
          state.activeTimer &&
          state.lastActiveTimestamp &&
          !state.gameState.isOver
        ) {
          const elapsed = Math.floor(
            (Date.now() - state.lastActiveTimestamp) / 1000
          );
          if (state.activeTimer === 'white' && state.whiteTime !== null) {
            state.whiteTime = Math.max(0, state.whiteTime - elapsed);
            if (state.whiteTime === 0) {
              state.gameState = {
                ...state.gameState,
                isOver: true,
                result: 'Black wins on time'
              };
              state.activeTimer = null;
            }
          } else if (
            state.activeTimer === 'black' &&
            state.blackTime !== null
          ) {
            state.blackTime = Math.max(0, state.blackTime - elapsed);
            if (state.blackTime === 0) {
              state.gameState = {
                ...state.gameState,
                isOver: true,
                result: 'White wins on time'
              };
              state.activeTimer = null;
            }
          }
          if (!state.gameState.isOver) state.lastActiveTimestamp = Date.now();
        }
      }
    }
  )
);
export { getKingSquare };
