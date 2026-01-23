import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { STARTING_FEN } from '@/features/chess/config/constants';
import { ANALYSIS_DEFAULTS } from '@/features/analysis/config/defaults';

export type Advantage = 'white' | 'black' | 'equal';

export type AnalysisLine = {
  multiPvIndex: number;
  cp: number;
  mate: number | null;
  advantage: Advantage;
  pvMoves: string[];
  depth: number;
};

export type LineEvaluation = {
  advantage: Advantage;
  cp: number;
  mate: number | null;
  formattedEvaluation: string;
};

type ProcessedAnalysis = {
  advantage: Advantage;
  cp: number | null;
  mate: number | null;
  formattedEvaluation: string;
  uciLines: string[][];
  lineEvaluations: LineEvaluation[];
};

const processLines = (
  currentLines: (AnalysisLine | null)[]
): ProcessedAnalysis => {
  const validLines = currentLines.filter(
    (line): line is AnalysisLine => line !== null
  );

  const processedLines = validLines.map((line) => {
    let formattedEvaluation: string;

    if (line.mate !== null) {
      formattedEvaluation = `#${line.mate}`;
    } else {
      formattedEvaluation = `${line.advantage === 'black' ? '-' : '+'}${(line.cp / 100).toFixed(2)}`;
    }

    return {
      uciMoves: line.pvMoves,
      evaluation: {
        advantage: line.advantage,
        cp: line.cp,
        mate: line.mate,
        formattedEvaluation
      }
    };
  });

  const uciLines = processedLines.map((line) => line.uciMoves);
  const lineEvaluations = processedLines.map((line) => line.evaluation);

  const bestEval = processedLines[0]?.evaluation || {
    advantage: 'equal' as Advantage,
    cp: null,
    mate: null,
    formattedEvaluation: '0.00'
  };

  return {
    advantage: bestEval.advantage,
    cp: bestEval.cp,
    mate: bestEval.mate,
    formattedEvaluation: bestEval.formattedEvaluation,
    uciLines,
    lineEvaluations
  };
};

type AnalysisStore = {
  isInitialized: boolean;
  worker: Worker | null;

  multiPV: number;
  searchTime: number;
  threads: number;
  hashSize: number;
  showBestMoveArrow: boolean;
  showThreatArrow: boolean;

  isAnalyzing: boolean;
  isAnalysisOn: boolean;
  currentSearchDepth: number;
  currentLines: (AnalysisLine | null)[];

  currentFen: string;
  turn: 'w' | 'b';

  initializeEngine: () => Promise<void>;
  setMultiPV: (value: number) => void;
  setSearchTime: (value: number) => void;
  setThreads: (value: number) => void;
  setHashSize: (value: number) => void;
  setShowBestMoveArrow: (value: boolean) => void;
  setShowThreatArrow: (value: boolean) => void;
  startAnalysis: () => void;
  endAnalysis: () => void;
  setPosition: (fen: string, turn: 'w' | 'b') => void;
  handleEngineMessage: (message: string) => void;
  cleanup: () => void;
};

const UPDATE_INTERVAL = ANALYSIS_DEFAULTS.updateInterval;
let lastUpdate = 0;
let pendingTimeout: NodeJS.Timeout | null = null;
let pendingLines: (AnalysisLine | null)[] | null = null;
let pendingDepth: number | null = null;

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      worker: null,

      multiPV: ANALYSIS_DEFAULTS.multiPV,
      searchTime: ANALYSIS_DEFAULTS.searchTime,
      threads: ANALYSIS_DEFAULTS.threads,
      hashSize: ANALYSIS_DEFAULTS.hashSize,
      showBestMoveArrow: true,
      showThreatArrow: false,

      isAnalyzing: false,
      isAnalysisOn: false,
      currentSearchDepth: 0,
      currentLines: Array(ANALYSIS_DEFAULTS.multiPV).fill(null),

      currentFen: STARTING_FEN,
      turn: 'w',

      initializeEngine: async () => {
        const { worker: existingWorker } = get();
        if (existingWorker) return;

        if (typeof Worker === 'undefined') {
          console.error('Web Workers not supported');
          return;
        }

        try {
          const stockfishPath =
            typeof WebAssembly === 'object'
              ? '/stockfish/stockfish.wasm.js'
              : '/stockfish/stockfish.js';
          const worker = new Worker(stockfishPath);

          worker.onerror = (e) => {
            console.error('Stockfish Worker Error:', e);
          };

          const handleMessage = (e: MessageEvent) => {
            const message = String(e.data || '');
            get().handleEngineMessage(message);
          };

          worker.addEventListener('message', handleMessage);

          set({ worker });

          worker.postMessage('uci');

          await new Promise<void>((resolve) => {
            const initHandler = (e: MessageEvent) => {
              const data = String(e.data || '');
              if (data.includes('uciok')) {
                worker.removeEventListener('message', initHandler);
                resolve();
              }
            };
            worker.addEventListener('message', initHandler);
          });

          const { multiPV, threads, hashSize } = get();
          worker.postMessage(`setoption name MultiPV value ${multiPV}`);
          worker.postMessage(`setoption name Threads value ${threads}`);
          worker.postMessage(`setoption name Hash value ${hashSize}`);
          worker.postMessage('isready');

          await new Promise<void>((resolve) => {
            const readyHandler = (e: MessageEvent) => {
              const data = String(e.data || '');
              if (data.includes('readyok')) {
                worker.removeEventListener('message', readyHandler);
                resolve();
              }
            };
            worker.addEventListener('message', readyHandler);
          });

          set({ isInitialized: true });
        } catch (e) {
          console.error('Failed to create Stockfish worker:', e);
        }
      },

      setMultiPV: (value) => {
        const { worker } = get();

        set((state) => {
          const newLines =
            value > state.multiPV
              ? [
                  ...state.currentLines,
                  ...Array(value - state.multiPV).fill(null)
                ]
              : state.currentLines.slice(0, value);

          return {
            multiPV: value,
            currentLines: newLines
          };
        });

        if (worker) {
          worker.postMessage(`setoption name MultiPV value ${value}`);
        }
      },

      setSearchTime: (value) => {
        set({ searchTime: value });
      },

      setThreads: (value) => {
        const { worker } = get();
        set({ threads: value });

        if (worker) {
          worker.postMessage(`setoption name Threads value ${value}`);
        }
      },

      setHashSize: (value) => {
        const { worker } = get();
        set({ hashSize: value });

        if (worker) {
          worker.postMessage(`setoption name Hash value ${value}`);
        }
      },

      setShowBestMoveArrow: (value) => set({ showBestMoveArrow: value }),
      setShowThreatArrow: (value) => set({ showThreatArrow: value }),

      startAnalysis: () => {
        const { worker, isInitialized, currentFen, searchTime, multiPV } =
          get();
        if (!worker || !isInitialized) {
          console.error('Engine not ready');
          return;
        }

        set({
          isAnalysisOn: true,
          isAnalyzing: true,
          currentSearchDepth: 0,
          currentLines: Array(multiPV).fill(null)
        });

        pendingLines = null;
        pendingDepth = null;
        if (pendingTimeout) clearTimeout(pendingTimeout);

        worker.postMessage('stop');
        worker.postMessage(`position fen ${currentFen}`);
        worker.postMessage(`go movetime ${searchTime * 1000}`);
      },

      endAnalysis: () => {
        const { worker, multiPV } = get();

        set({
          isAnalysisOn: false,
          isAnalyzing: false,
          currentLines: Array(multiPV).fill(null)
        });

        if (worker) {
          worker.postMessage('stop');
        }
      },

      setPosition: (fen, turn) => {
        const { worker, isAnalysisOn, searchTime, multiPV } = get();

        set({
          currentFen: fen,
          turn,
          currentSearchDepth: 0,
          currentLines: Array(multiPV).fill(null)
        });

        pendingLines = null;
        pendingDepth = null;
        if (pendingTimeout) clearTimeout(pendingTimeout);

        if (worker && isAnalysisOn) {
          set({ isAnalyzing: true });
          worker.postMessage('stop');
          worker.postMessage(`position fen ${fen}`);
          worker.postMessage(`go movetime ${searchTime * 1000}`);
        }
      },

      handleEngineMessage: (message) => {
        const { isAnalysisOn, turn, multiPV, currentLines: stateLines } = get();

        if (!message || typeof message !== 'string') return;

        if (message.startsWith('info')) {
          if (!isAnalysisOn) return;

          const depthMatch = message.match(/depth (\d+)/);
          const currentDepth = depthMatch ? parseInt(depthMatch[1], 10) : 0;

          if (!pendingLines) {
            pendingLines = [...stateLines];
          }

          if (currentDepth > 0) {
            pendingDepth = currentDepth;
          }

          const hasPv = message.includes(' pv ');
          const hasMultiPv = message.includes(' multipv ');
          const hasScore = message.includes(' score ');

          if (hasPv && hasMultiPv && hasScore) {
            try {
              const multiPvMatch = message.match(/multipv (\d+)/);
              const multiPvIndex = multiPvMatch
                ? parseInt(multiPvMatch[1], 10)
                : 1;

              if (multiPvIndex > multiPV) return;

              let scoreValue = 0;
              let cp = 0;
              let mate: number | null = null;

              const mateMatch = message.match(/score mate (-?\d+)/);
              const cpMatch = message.match(/score cp (-?\d+)/);

              if (mateMatch) {
                scoreValue = parseInt(mateMatch[1], 10);
                mate = Math.abs(scoreValue);
                cp = Infinity;
              } else if (cpMatch) {
                scoreValue = parseInt(cpMatch[1], 10);
                cp = Math.abs(scoreValue);
                mate = null;
              }

              const [selfColor, opponentColor] =
                turn === 'w'
                  ? (['white', 'black'] as const)
                  : (['black', 'white'] as const);
              const advantage: Advantage =
                mate === 0
                  ? opponentColor
                  : scoreValue > 0
                    ? selfColor
                    : scoreValue < 0
                      ? opponentColor
                      : 'equal';

              const pvMatch = message.match(/ pv ([^$]*)/);
              const pvMoves = pvMatch ? pvMatch[1].trim().split(' ') : [];

              const analysisLine: AnalysisLine = {
                multiPvIndex,
                cp,
                mate,
                advantage,
                pvMoves,
                depth: currentDepth
              };

              pendingLines[multiPvIndex - 1] = analysisLine;
            } catch (error) {
              console.error('Error parsing engine message:', error, message);
            }
          }

          const now = Date.now();
          const timeSinceLastUpdate = now - lastUpdate;

          const applyUpdate = () => {
            set((state) => ({
              currentLines: pendingLines
                ? [...pendingLines]
                : state.currentLines,
              currentSearchDepth: pendingDepth || state.currentSearchDepth
            }));
            lastUpdate = Date.now();
            pendingTimeout = null;
          };

          if (timeSinceLastUpdate > UPDATE_INTERVAL) {
            if (pendingTimeout) clearTimeout(pendingTimeout);
            applyUpdate();
          } else if (!pendingTimeout) {
            pendingTimeout = setTimeout(
              applyUpdate,
              UPDATE_INTERVAL - timeSinceLastUpdate
            );
          }
        } else if (message.startsWith('bestmove')) {
          if (pendingTimeout) {
            clearTimeout(pendingTimeout);
            set((state) => ({
              currentLines: pendingLines
                ? [...pendingLines]
                : state.currentLines,
              currentSearchDepth: pendingDepth || state.currentSearchDepth
            }));
            lastUpdate = Date.now();
            pendingTimeout = null;
          }
          set({ isAnalyzing: false });
        }
      },

      cleanup: () => {
        const { worker } = get();
        if (worker) {
          worker.postMessage('quit');
          worker.terminate();
        }
        set({
          worker: null,
          isInitialized: false,
          isAnalysisOn: false,
          isAnalyzing: false
        });
      }
    }),
    {
      name: 'zugklang-analysis-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        multiPV: state.multiPV,
        searchTime: state.searchTime,
        threads: state.threads,
        hashSize: state.hashSize,
        showBestMoveArrow: state.showBestMoveArrow,
        showThreatArrow: state.showThreatArrow
      })
    }
  )
);

export const useAnalysisState = () =>
  useAnalysisStore(
    useShallow((state) => ({
      isAnalyzing: state.isAnalyzing,
      isAnalysisOn: state.isAnalysisOn,
      currentSearchDepth: state.currentSearchDepth,
      isInitialized: state.isInitialized
    }))
  );

export const useAnalysisConfig = () =>
  useAnalysisStore(
    useShallow((state) => ({
      multiPV: state.multiPV,
      searchTime: state.searchTime,
      threads: state.threads,
      hashSize: state.hashSize,
      showBestMoveArrow: state.showBestMoveArrow,
      showThreatArrow: state.showThreatArrow
    }))
  );

export const useAnalysisActions = () =>
  useAnalysisStore(
    useShallow((state) => ({
      initializeEngine: state.initializeEngine,
      setMultiPV: state.setMultiPV,
      setSearchTime: state.setSearchTime,
      setThreads: state.setThreads,
      setHashSize: state.setHashSize,
      setShowBestMoveArrow: state.setShowBestMoveArrow,
      setShowThreatArrow: state.setShowThreatArrow,
      startAnalysis: state.startAnalysis,
      endAnalysis: state.endAnalysis,
      setPosition: state.setPosition,
      cleanup: state.cleanup
    }))
  );

export const useEngineAnalysis = (): ProcessedAnalysis => {
  const currentLines = useAnalysisStore((state) => state.currentLines);
  return processLines(currentLines);
};

export const useAnalysisPosition = () =>
  useAnalysisStore(
    useShallow((state) => ({
      currentFen: state.currentFen,
      turn: state.turn
    }))
  );
