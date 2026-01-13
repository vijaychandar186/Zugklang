import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import type {
  Position,
  GameReport,
  LiveEvaluation,
  ReviewStatus
} from '@/features/game-review/types';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type GameReviewStore = {
  // Review state
  pgn: string;
  depth: number;
  status: ReviewStatus;
  progress: number;
  errorMsg: string;
  report: GameReport | null;
  liveEvaluations: (LiveEvaluation | null)[];

  // Navigation state
  currentMoveIndex: number;
  boardFlipped: boolean;
  showArrows: boolean;

  // Actions
  setPgn: (pgn: string) => void;
  setDepth: (depth: number) => void;
  setStatus: (status: ReviewStatus) => void;
  setProgress: (progress: number) => void;
  setErrorMsg: (msg: string) => void;
  setReport: (report: GameReport | null) => void;
  setLiveEvaluations: (evals: (LiveEvaluation | null)[]) => void;
  updateLiveEvaluation: (index: number, evaluation: LiveEvaluation) => void;

  // Navigation actions
  navigate: (delta: number) => void;
  goToMove: (index: number) => void;
  toggleBoardFlip: () => void;
  toggleArrows: () => void;

  // Reset
  resetReview: () => void;

  // Computed
  getCurrentPosition: () => Position | undefined;
  getCurrentFen: () => string;
  getTotalMoves: () => number;
};

export const useGameReviewStore = create<GameReviewStore>()((set, get) => ({
  // Initial state
  pgn: '',
  depth: 16,
  status: 'idle',
  progress: 0,
  errorMsg: '',
  report: null,
  liveEvaluations: [],

  currentMoveIndex: 0,
  boardFlipped: false,
  showArrows: true,

  // Setters
  setPgn: (pgn) => set({ pgn }),
  setDepth: (depth) => set({ depth }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setErrorMsg: (msg) => set({ errorMsg: msg }),
  setReport: (report) =>
    set({
      report,
      currentMoveIndex: 0
    }),
  setLiveEvaluations: (evals) => set({ liveEvaluations: evals }),

  updateLiveEvaluation: (index, evaluation) =>
    set((state) => {
      const newEvals = [...state.liveEvaluations];
      newEvals[index] = evaluation;
      return { liveEvaluations: newEvals };
    }),

  // Navigation
  navigate: (delta) =>
    set((state) => {
      const { report, currentMoveIndex } = state;
      if (!report) return state;

      const maxIndex = report.positions.length - 1;
      let newIndex: number;

      if (delta === Infinity) {
        newIndex = maxIndex;
      } else if (delta === -Infinity) {
        newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(currentMoveIndex + delta, maxIndex));
      }

      if (newIndex === currentMoveIndex) return state;
      return { currentMoveIndex: newIndex };
    }),

  goToMove: (index) =>
    set((state) => {
      const { report } = state;
      if (!report) return state;

      const maxIndex = report.positions.length - 1;
      const clampedIndex = Math.max(0, Math.min(index, maxIndex));
      return { currentMoveIndex: clampedIndex };
    }),

  toggleBoardFlip: () =>
    set((state) => ({ boardFlipped: !state.boardFlipped })),

  toggleArrows: () => set((state) => ({ showArrows: !state.showArrows })),

  // Reset
  resetReview: () =>
    set({
      status: 'idle',
      progress: 0,
      errorMsg: '',
      report: null,
      liveEvaluations: [],
      currentMoveIndex: 0
    }),

  // Computed
  getCurrentPosition: () => {
    const { report, currentMoveIndex } = get();
    return report?.positions[currentMoveIndex];
  },

  getCurrentFen: () => {
    const position = get().getCurrentPosition();
    return position?.fen || STARTING_FEN;
  },

  getTotalMoves: () => {
    const { report, liveEvaluations } = get();
    return report ? report.positions.length : liveEvaluations.length;
  }
}));

// State selector
export const useGameReviewState = () =>
  useGameReviewStore(
    useShallow((s) => ({
      pgn: s.pgn,
      depth: s.depth,
      status: s.status,
      progress: s.progress,
      errorMsg: s.errorMsg,
      report: s.report,
      liveEvaluations: s.liveEvaluations,
      currentMoveIndex: s.currentMoveIndex,
      boardFlipped: s.boardFlipped,
      showArrows: s.showArrows
    }))
  );

// Actions selector
export const useGameReviewActions = () =>
  useGameReviewStore(
    useShallow((s) => ({
      setPgn: s.setPgn,
      setDepth: s.setDepth,
      setStatus: s.setStatus,
      setProgress: s.setProgress,
      setErrorMsg: s.setErrorMsg,
      setReport: s.setReport,
      setLiveEvaluations: s.setLiveEvaluations,
      updateLiveEvaluation: s.updateLiveEvaluation,
      navigate: s.navigate,
      goToMove: s.goToMove,
      toggleBoardFlip: s.toggleBoardFlip,
      toggleArrows: s.toggleArrows,
      resetReview: s.resetReview,
      getCurrentPosition: s.getCurrentPosition,
      getCurrentFen: s.getCurrentFen,
      getTotalMoves: s.getTotalMoves
    }))
  );

// Derived state selector for current position data
export const useCurrentPositionData = () =>
  useGameReviewStore(
    useShallow((s) => {
      const position = s.report?.positions[s.currentMoveIndex];
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
