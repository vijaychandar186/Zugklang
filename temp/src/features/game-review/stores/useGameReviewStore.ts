import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type {
  Position,
  GameReport,
  LiveEvaluation,
  ReviewStatus
} from '@/features/game-review/types';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type GameReviewStore = {
  pgn: string;
  depth: number;
  status: ReviewStatus;
  progress: number;
  errorMsg: string;
  report: GameReport | null;
  livePositions: Position[];
  liveEvaluations: (LiveEvaluation | null)[];
  currentMoveIndex: number;
  boardFlipped: boolean;

  setPgn: (pgn: string) => void;
  setDepth: (depth: number) => void;
  setStatus: (status: ReviewStatus) => void;
  setProgress: (progress: number) => void;
  setErrorMsg: (msg: string) => void;
  setReport: (report: GameReport | null) => void;
  setLivePositions: (positions: Position[]) => void;
  setLiveEvaluations: (evals: (LiveEvaluation | null)[]) => void;
  updateLiveEvaluation: (index: number, evaluation: LiveEvaluation) => void;
  navigate: (delta: number) => void;
  goToMove: (index: number) => void;
  toggleBoardFlip: () => void;
  resetReview: () => void;
  getCurrentPosition: () => Position | undefined;
  getCurrentFen: () => string;
  getTotalMoves: () => number;
};

export const useGameReviewStore = create<GameReviewStore>()(
  persist(
    (set, get) => ({
      pgn: '',
      depth: 16,
      status: 'idle',
      progress: 0,
      errorMsg: '',
      report: null,
      livePositions: [],
      liveEvaluations: [],
      currentMoveIndex: 0,
      boardFlipped: false,

      setPgn: (pgn) => set({ pgn }),
      setDepth: (depth) => set({ depth }),
      setStatus: (status) => set({ status }),
      setProgress: (progress) => set({ progress }),
      setErrorMsg: (msg) => set({ errorMsg: msg }),
      setReport: (report) =>
        set({
          report,
          livePositions: [],
          currentMoveIndex: 0
        }),
      setLivePositions: (positions) => set({ livePositions: positions }),
      setLiveEvaluations: (evals) => set({ liveEvaluations: evals }),

      updateLiveEvaluation: (index, evaluation) =>
        set((state) => {
          const newEvals = [...state.liveEvaluations];
          newEvals[index] = evaluation;
          return { liveEvaluations: newEvals };
        }),

      navigate: (delta) =>
        set((state) => {
          const { report, livePositions, currentMoveIndex } = state;
          const positions = report?.positions || livePositions;
          if (positions.length === 0) return state;

          const maxIndex = positions.length - 1;
          let newIndex: number;

          if (delta === Infinity) {
            newIndex = maxIndex;
          } else if (delta === -Infinity) {
            newIndex = 0;
          } else {
            newIndex = Math.max(
              0,
              Math.min(currentMoveIndex + delta, maxIndex)
            );
          }

          if (newIndex === currentMoveIndex) return state;
          return { currentMoveIndex: newIndex };
        }),

      goToMove: (index) =>
        set((state) => {
          const { report, livePositions } = state;
          const positions = report?.positions || livePositions;
          if (positions.length === 0) return { currentMoveIndex: index };

          const maxIndex = positions.length - 1;
          const clampedIndex = Math.max(0, Math.min(index, maxIndex));
          return { currentMoveIndex: clampedIndex };
        }),

      toggleBoardFlip: () =>
        set((state) => ({ boardFlipped: !state.boardFlipped })),

      resetReview: () =>
        set({
          status: 'idle',
          progress: 0,
          errorMsg: '',
          report: null,
          livePositions: [],
          liveEvaluations: [],
          currentMoveIndex: 0
        }),

      getCurrentPosition: () => {
        const { report, livePositions, currentMoveIndex } = get();
        const positions = report?.positions || livePositions;
        return positions[currentMoveIndex];
      },

      getCurrentFen: () => {
        const position = get().getCurrentPosition();
        return position?.fen || STARTING_FEN;
      },

      getTotalMoves: () => {
        const { report, livePositions } = get();
        return report ? report.positions.length : livePositions.length;
      }
    }),
    {
      name: 'zugklang-game-review',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        pgn: state.pgn,
        depth: state.depth,
        report: state.report,
        currentMoveIndex: state.currentMoveIndex,
        boardFlipped: state.boardFlipped
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.report) {
          state.status = 'complete';
        }
      }
    }
  )
);

export const useGameReviewState = () =>
  useGameReviewStore(
    useShallow((s) => ({
      pgn: s.pgn,
      depth: s.depth,
      status: s.status,
      progress: s.progress,
      errorMsg: s.errorMsg,
      report: s.report,
      livePositions: s.livePositions,
      liveEvaluations: s.liveEvaluations,
      currentMoveIndex: s.currentMoveIndex,
      boardFlipped: s.boardFlipped
    }))
  );

export const useGameReviewActions = () =>
  useGameReviewStore(
    useShallow((s) => ({
      setPgn: s.setPgn,
      setDepth: s.setDepth,
      setStatus: s.setStatus,
      setProgress: s.setProgress,
      setErrorMsg: s.setErrorMsg,
      setReport: s.setReport,
      setLivePositions: s.setLivePositions,
      setLiveEvaluations: s.setLiveEvaluations,
      updateLiveEvaluation: s.updateLiveEvaluation,
      navigate: s.navigate,
      goToMove: s.goToMove,
      toggleBoardFlip: s.toggleBoardFlip,
      resetReview: s.resetReview,
      getCurrentPosition: s.getCurrentPosition,
      getCurrentFen: s.getCurrentFen,
      getTotalMoves: s.getTotalMoves
    }))
  );

export const useCurrentPositionData = () =>
  useGameReviewStore(
    useShallow((s) => {
      const positions = s.report?.positions || s.livePositions;
      const position = positions[s.currentMoveIndex];
      const topLine = position?.topLines?.find((l) => l.id === 1);

      return {
        position,
        classification: position?.classification,
        topLine,
        currentFen: position?.fen || STARTING_FEN,
        evaluation: topLine?.evaluation || null
      };
    })
  );
