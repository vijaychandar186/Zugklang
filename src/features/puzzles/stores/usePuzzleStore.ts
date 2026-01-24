'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import { ChessopsMove as Move } from '@/lib/chess';
import {
  createNavigationSlice,
  NavigationSlice,
  createBoardOrientationSlice,
  BoardOrientationSlice
} from '@/features/chess/stores/slices';

import { PuzzleSession } from '@/features/chess/logic/PuzzleSession';
import { Puzzle, PuzzleDifficulty, PuzzleStatus } from '../types';

interface PuzzleState extends NavigationSlice, BoardOrientationSlice {
  session: PuzzleSession;
  currentPuzzle: Puzzle | null;
  puzzleIndex: number;
  difficulty: PuzzleDifficulty;
  status: PuzzleStatus;
  moves: string[];
  playerTurn: boolean;
  showHint: boolean;
  puzzlesSolved: number;
  puzzlesFailed: number;
  currentStreak: number;
  bestStreak: number;
}

interface PuzzleActions {
  loadPuzzle: (puzzle: Puzzle, index: number) => void;
  setDifficulty: (difficulty: PuzzleDifficulty) => void;
  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  resetPuzzle: () => void;
  toggleHint: () => void;
}

type PuzzleStore = PuzzleState & PuzzleActions;

export const usePuzzleStore = create<PuzzleStore>()(
  persist(
    (set, get) => {
      const session = new PuzzleSession();

      return {
        session,
        currentPuzzle: null,
        puzzleIndex: 0,
        difficulty: 'beginner',
        status: 'idle',
        moves: [],
        playerTurn: true,
        currentFEN: session.fen,
        positionHistory: [session.fen],
        viewingIndex: 0,
        boardOrientation: 'white',
        boardFlipped: false,
        showHint: false,
        puzzlesSolved: 0,
        puzzlesFailed: 0,
        currentStreak: 0,
        bestStreak: 0,

        ...createNavigationSlice(set, get),
        ...createBoardOrientationSlice(set),

        loadPuzzle: (puzzle, index) => {
          const { session } = get();
          session.loadPuzzle(puzzle);

          const fenTurn = puzzle.FEN.split(' ')[1];
          const playerColor = fenTurn === 'w' ? 'black' : 'white';

          set({
            currentPuzzle: puzzle,
            puzzleIndex: index,
            currentFEN: session.fen,
            moves: [],
            positionHistory: [session.fen],
            viewingIndex: 0,
            status: session.status,
            playerTurn: session.playerTurn,
            boardOrientation: playerColor,
            showHint: false
          });

          setTimeout(() => {
            const { session, status, playerTurn } = get();

            if (status === 'playing' && !playerTurn) {
              const move = session.makeOpponentMove();
              if (move) {
                set((state) => ({
                  currentFEN: session.fen,
                  moves: [...state.moves, move.san],
                  positionHistory: [...state.positionHistory, session.fen],
                  viewingIndex: state.positionHistory.length,
                  playerTurn: session.playerTurn,
                  status: session.status
                }));
              }
            }
          }, 500);
        },

        setDifficulty: (difficulty) => set({ difficulty }),

        makeMove: (from, to, promotion) => {
          const { session, status, playerTurn, viewingIndex, positionHistory } =
            get();

          if (status !== 'playing' || !playerTurn) return null;
          if (viewingIndex < positionHistory.length - 1) return null;

          const { move, outcome } = session.makePlayerMove(from, to, promotion);

          if (!move) return null;

          set((state) => {
            const newMoves = [...state.moves, move.san];
            const newHistory = [...state.positionHistory, session.fen];

            const newState: Partial<PuzzleState> = {
              currentFEN: session.fen,
              moves: newMoves,
              positionHistory: newHistory,
              viewingIndex: newHistory.length - 1,
              status: session.status,
              playerTurn: session.playerTurn
            };

            if (outcome === 'success') {
              const newStreak = state.currentStreak + 1;
              newState.puzzlesSolved = state.puzzlesSolved + 1;
              newState.currentStreak = newStreak;
              newState.bestStreak = Math.max(state.bestStreak, newStreak);
            } else if (outcome === 'failed') {
              newState.puzzlesFailed = state.puzzlesFailed + 1;
              newState.currentStreak = 0;
            }

            return newState;
          });

          if (outcome === 'continue') {
            setTimeout(() => {
              const { session: currentSession, status: currentStatus } = get();
              if (currentStatus === 'playing' && !currentSession.playerTurn) {
                const opMove = currentSession.makeOpponentMove();
                if (opMove) {
                  set((s) => ({
                    currentFEN: currentSession.fen,
                    moves: [...s.moves, opMove.san],
                    positionHistory: [...s.positionHistory, currentSession.fen],
                    viewingIndex: s.positionHistory.length,
                    playerTurn: currentSession.playerTurn,
                    status: currentSession.status
                  }));
                }
              }
            }, 300);
          }

          return move;
        },

        resetPuzzle: () => {
          const { currentPuzzle, puzzleIndex, loadPuzzle } = get();
          if (currentPuzzle) {
            loadPuzzle(currentPuzzle, puzzleIndex);
          }
        },

        toggleHint: () => set((state) => ({ showHint: !state.showHint }))
      };
    },
    {
      name: 'puzzle-store',
      partialize: (state) => ({
        difficulty: state.difficulty,
        puzzlesSolved: state.puzzlesSolved,
        puzzlesFailed: state.puzzlesFailed,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak
      })
    }
  )
);

export function usePuzzleState() {
  return usePuzzleStore(
    useShallow((state) => ({
      currentPuzzle: state.currentPuzzle,
      puzzleIndex: state.puzzleIndex,
      difficulty: state.difficulty,
      currentFEN: state.currentFEN,
      moves: state.moves,
      positionHistory: state.positionHistory,
      viewingIndex: state.viewingIndex,
      boardOrientation: state.boardOrientation,
      status: state.status,
      solutionMoves: state.session.solutionMoves,
      currentMoveIndex: state.session.currentMoveIndex,
      playerTurn: state.playerTurn,
      showHint: state.showHint
    }))
  );
}

export function usePuzzleStats() {
  return usePuzzleStore(
    useShallow((state) => ({
      puzzlesSolved: state.puzzlesSolved,
      puzzlesFailed: state.puzzlesFailed,
      currentStreak: state.currentStreak,
      bestStreak: state.bestStreak
    }))
  );
}

export function usePuzzleActions() {
  return usePuzzleStore(
    useShallow((state) => ({
      loadPuzzle: state.loadPuzzle,
      setDifficulty: state.setDifficulty,
      makeMove: state.makeMove,
      resetPuzzle: state.resetPuzzle,
      toggleHint: state.toggleHint,
      toggleBoardOrientation: state.toggleBoardOrientation,
      goToStart: state.goToStart,
      goToEnd: state.goToEnd,
      goToPrev: state.goToPrev,
      goToNext: state.goToNext,
      goToMove: state.goToMove
    }))
  );
}
