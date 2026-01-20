'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import { Chess, Move } from 'chess.js';

export type PuzzleDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'master'
  | 'elite';

export interface Puzzle {
  FEN: string;
  Moves: string;
  Rating: number;
  Themes: string;
}

export type PuzzleStatus = 'idle' | 'playing' | 'success' | 'failed';

interface PuzzleStore {
  // Current puzzle
  currentPuzzle: Puzzle | null;
  puzzleIndex: number;
  difficulty: PuzzleDifficulty;

  // Game state
  game: Chess;
  currentFEN: string;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  boardOrientation: 'white' | 'black';

  // Puzzle solving state
  status: PuzzleStatus;
  solutionMoves: string[]; // UCI moves from puzzle
  currentMoveIndex: number; // Which move in the solution we're on
  playerTurn: boolean; // Is it the player's turn to move?
  showHint: boolean;

  // Stats
  puzzlesSolved: number;
  puzzlesFailed: number;
  currentStreak: number;
  bestStreak: number;

  // Actions
  loadPuzzle: (puzzle: Puzzle, index: number) => void;
  setDifficulty: (difficulty: PuzzleDifficulty) => void;
  makeMove: (from: string, to: string, promotion?: string) => Move | null;
  resetPuzzle: () => void;
  toggleHint: () => void;
  toggleBoardOrientation: () => void;

  // Navigation (for reviewing solution)
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (moveIndex: number) => void;
}

export const usePuzzleStore = create<PuzzleStore>()(
  persist(
    (set, get) => ({
      currentPuzzle: null,
      puzzleIndex: 0,
      difficulty: 'beginner',

      game: new Chess(),
      currentFEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      moves: [],
      positionHistory: [
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      ],
      viewingIndex: 0,
      boardOrientation: 'white',

      status: 'idle',
      solutionMoves: [],
      currentMoveIndex: 0,
      playerTurn: true,
      showHint: false,

      puzzlesSolved: 0,
      puzzlesFailed: 0,
      currentStreak: 0,
      bestStreak: 0,

      loadPuzzle: (puzzle, index) => {
        const game = new Chess(puzzle.FEN);
        const solutionMoves = puzzle.Moves.split(' ');

        // Determine board orientation based on who moves first in the puzzle
        // The first move in the solution is the opponent's move (sets up the puzzle)
        // So the player plays as the opposite color
        const fenTurn = puzzle.FEN.split(' ')[1];
        const playerColor = fenTurn === 'w' ? 'black' : 'white';

        set({
          currentPuzzle: puzzle,
          puzzleIndex: index,
          game,
          currentFEN: puzzle.FEN,
          moves: [],
          positionHistory: [puzzle.FEN],
          viewingIndex: 0,
          boardOrientation: playerColor,
          status: 'playing',
          solutionMoves,
          currentMoveIndex: 0,
          playerTurn: false, // Opponent moves first
          showHint: false
        });

        // Make the first move (opponent's move) after a short delay
        setTimeout(() => {
          const state = get();
          if (
            state.status === 'playing' &&
            !state.playerTurn &&
            state.solutionMoves.length > 0
          ) {
            const firstMove = state.solutionMoves[0];
            const from = firstMove.slice(0, 2);
            const to = firstMove.slice(2, 4);
            const promotion = firstMove.length > 4 ? firstMove[4] : undefined;

            try {
              const move = state.game.move({ from, to, promotion });
              if (move) {
                const newFEN = state.game.fen();
                set({
                  currentFEN: newFEN,
                  moves: [...state.moves, move.san],
                  positionHistory: [...state.positionHistory, newFEN],
                  viewingIndex: state.viewingIndex + 1,
                  currentMoveIndex: 1,
                  playerTurn: true
                });
              }
            } catch (e) {
              console.error('Failed to make opponent move:', e);
            }
          }
        }, 500);
      },

      setDifficulty: (difficulty) => set({ difficulty }),

      makeMove: (from, to, promotion) => {
        const state = get();
        if (state.status !== 'playing' || !state.playerTurn) return null;

        // Check if viewing history - if so, can't make moves
        if (state.viewingIndex < state.positionHistory.length - 1) return null;

        try {
          const move = state.game.move({ from, to, promotion });
          if (!move) return null;

          const newFEN = state.game.fen();
          const newMoves = [...state.moves, move.san];
          const newHistory = [...state.positionHistory, newFEN];
          const newViewingIndex = state.viewingIndex + 1;

          // Check if this was the correct move
          const expectedMove = state.solutionMoves[state.currentMoveIndex];
          const playerMove = `${from}${to}${promotion || ''}`;

          if (playerMove === expectedMove) {
            // Correct move!
            const nextMoveIndex = state.currentMoveIndex + 1;

            // Check if puzzle is complete
            if (nextMoveIndex >= state.solutionMoves.length) {
              // Puzzle solved!
              const newStreak = state.currentStreak + 1;
              set({
                currentFEN: newFEN,
                moves: newMoves,
                positionHistory: newHistory,
                viewingIndex: newViewingIndex,
                currentMoveIndex: nextMoveIndex,
                status: 'success',
                puzzlesSolved: state.puzzlesSolved + 1,
                currentStreak: newStreak,
                bestStreak: Math.max(state.bestStreak, newStreak)
              });
            } else {
              // More moves to go - make opponent's response
              set({
                currentFEN: newFEN,
                moves: newMoves,
                positionHistory: newHistory,
                viewingIndex: newViewingIndex,
                currentMoveIndex: nextMoveIndex,
                playerTurn: false
              });

              // Make opponent's response after delay
              setTimeout(() => {
                const currentState = get();
                if (
                  currentState.status === 'playing' &&
                  !currentState.playerTurn
                ) {
                  const opponentMove =
                    currentState.solutionMoves[currentState.currentMoveIndex];
                  const opFrom = opponentMove.slice(0, 2);
                  const opTo = opponentMove.slice(2, 4);
                  const opPromotion =
                    opponentMove.length > 4 ? opponentMove[4] : undefined;

                  try {
                    const opMove = currentState.game.move({
                      from: opFrom,
                      to: opTo,
                      promotion: opPromotion
                    });
                    if (opMove) {
                      const opNewFEN = currentState.game.fen();
                      set({
                        currentFEN: opNewFEN,
                        moves: [...currentState.moves, opMove.san],
                        positionHistory: [
                          ...currentState.positionHistory,
                          opNewFEN
                        ],
                        viewingIndex: currentState.viewingIndex + 1,
                        currentMoveIndex: currentState.currentMoveIndex + 1,
                        playerTurn: true
                      });
                    }
                  } catch (e) {
                    console.error('Failed to make opponent response:', e);
                  }
                }
              }, 300);
            }

            return move;
          } else {
            // Wrong move - puzzle failed
            set({
              currentFEN: newFEN,
              moves: newMoves,
              positionHistory: newHistory,
              viewingIndex: newViewingIndex,
              status: 'failed',
              puzzlesFailed: state.puzzlesFailed + 1,
              currentStreak: 0
            });

            return move;
          }
        } catch {
          return null;
        }
      },

      resetPuzzle: () => {
        const state = get();
        if (!state.currentPuzzle) return;

        // Reload the same puzzle
        get().loadPuzzle(state.currentPuzzle, state.puzzleIndex);
      },

      toggleHint: () => set((state) => ({ showHint: !state.showHint })),

      toggleBoardOrientation: () =>
        set((state) => ({
          boardOrientation:
            state.boardOrientation === 'white' ? 'black' : 'white'
        })),

      goToStart: () => set({ viewingIndex: 0 }),

      goToEnd: () =>
        set((state) => ({
          viewingIndex: state.positionHistory.length - 1
        })),

      goToPrev: () =>
        set((state) => ({
          viewingIndex: Math.max(0, state.viewingIndex - 1)
        })),

      goToNext: () =>
        set((state) => ({
          viewingIndex: Math.min(
            state.positionHistory.length - 1,
            state.viewingIndex + 1
          )
        })),

      goToMove: (moveIndex) =>
        set((state) => ({
          viewingIndex: Math.max(
            0,
            Math.min(moveIndex + 1, state.positionHistory.length - 1)
          )
        }))
    }),
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

// Selectors
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
      solutionMoves: state.solutionMoves,
      currentMoveIndex: state.currentMoveIndex,
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
