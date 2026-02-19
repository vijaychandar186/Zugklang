const getStockfishPath = () => {
  const supportsWasm = typeof WebAssembly === 'object';
  return supportsWasm
    ? '/stockfish/stockfish.wasm.js'
    : '/stockfish/stockfish.js';
};

export class StockfishEngine {
  private worker: Worker | null = null;
  private currentHandler: ((e: MessageEvent) => void) | null = null;
  private isDestroyed = false;
  private isReady = false;
  private readyPromise: Promise<void>;
  private resolveReady: (() => void) | null = null;

  private static instance: StockfishEngine | null = null;

  static getInstance(): StockfishEngine {
    if (!StockfishEngine.instance || StockfishEngine.instance.isDestroyed) {
      StockfishEngine.instance = new StockfishEngine();
    }
    return StockfishEngine.instance;
  }

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(getStockfishPath());
        this.worker.onerror = (e) => {
          console.error('Stockfish Worker Error:', e);
        };

        const initHandler = (e: MessageEvent) => {
          const data = String(e.data || '');
          if (data.includes('readyok')) {
            this.isReady = true;
            this.worker?.removeEventListener('message', initHandler);
            this.resolveReady?.();
          }
        };
        this.worker.addEventListener('message', initHandler);

        this.sendCommand('uci');
        this.sendCommand('isready');
      } catch (e) {
        console.error('Failed to create Stockfish worker:', e);
        this.resolveReady?.();
      }
    } else {
      this.resolveReady?.();
    }
  }

  async waitUntilReady(): Promise<void> {
    return this.readyPromise;
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.worker && !this.isDestroyed) {
      this.clearCurrentHandler();

      const handler = (e: MessageEvent) => {
        const data = String(e.data || '');
        const bestMove = data.match(/bestmove\s+(\S+)/)?.[1];
        if (bestMove) {
          this.clearCurrentHandler();
          if (!this.isDestroyed) {
            callback({ bestMove });
          }
        }
      };
      this.currentHandler = handler;
      this.worker.addEventListener('message', handler);
    }
  }

  private clearCurrentHandler() {
    if (this.currentHandler && this.worker) {
      this.worker.removeEventListener('message', this.currentHandler);
      this.currentHandler = null;
    }
  }

  async evaluatePosition(fen: string, depth: number): Promise<void> {
    if (this.worker && !this.isDestroyed) {
      await this.readyPromise;
      if (!this.isDestroyed) {
        this.sendCommand(`position fen ${fen}`);
        this.sendCommand(`go depth ${depth}`);
      }
    }
  }

  async newGame(): Promise<void> {
    if (this.worker && !this.isDestroyed) {
      await this.readyPromise;
      this.sendCommand('ucinewgame');
      this.sendCommand('isready');
      return new Promise((resolve) => {
        const handler = (e: MessageEvent) => {
          const data = String(e.data || '');
          if (data.includes('readyok')) {
            this.worker?.removeEventListener('message', handler);
            resolve();
          }
        };
        this.worker?.addEventListener('message', handler);
      });
    }
  }

  stop() {
    this.clearCurrentHandler();
    if (this.isReady && this.worker) {
      this.sendCommand('stop');
    }
  }

  quit() {
    if (this.worker) {
      this.sendCommand('quit');
    }
  }

  destroy() {
    this.isDestroyed = true;
    this.clearCurrentHandler();
    this.stop();
    this.quit();
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  sendCommand(command: string) {
    this.worker?.postMessage(command);
  }

  addEventListener(type: 'message', listener: (e: MessageEvent) => void) {
    this.worker?.addEventListener(type, listener);
  }

  removeEventListener(type: 'message', listener: (e: MessageEvent) => void) {
    this.worker?.removeEventListener(type, listener);
  }
}
