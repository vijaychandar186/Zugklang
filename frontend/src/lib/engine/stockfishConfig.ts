export type StockfishVersion = '16' | '18';
export const STOCKFISH_VERSION: StockfishVersion = '18';
const STOCKFISH_ASSETS = {
  '16': {
    basePath: '/engines/stockfish16',
    wasmWorker: 'stockfish.wasm.js',
    jsWorker: 'stockfish.js'
  },
  '18': {
    basePath: '/engines/stockfish18',
    wasmWorker: 'stockfish-18-single.js',
    jsWorker: 'stockfish-18-asm.js'
  }
} as const;
export const getStockfishWorkerPath = (supportsWasm: boolean): string => {
  const selected = STOCKFISH_ASSETS[STOCKFISH_VERSION];
  const workerFile = supportsWasm ? selected.wasmWorker : selected.jsWorker;
  return `${selected.basePath}/${workerFile}`;
};
