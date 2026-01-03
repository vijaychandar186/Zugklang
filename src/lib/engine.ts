export class StockfishEngine {
  private worker: Worker | null = null;
  private currentHandler: ((e: MessageEvent) => void) | null = null;
  private isDestroyed = false;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('/stockfish.js');
      this.sendCommand('uci');
      this.sendCommand('isready');
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.worker && !this.isDestroyed) {
      // Remove any existing handler first
      this.clearCurrentHandler();

      const handler = (e: MessageEvent) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
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

  evaluatePosition(fen: string, depth: number) {
    if (this.worker && !this.isDestroyed) {
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    }
  }

  stop() {
    this.clearCurrentHandler();
    this.sendCommand('stop');
  }

  quit() {
    this.sendCommand('quit');
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

  private sendCommand(command: string) {
    this.worker?.postMessage(command);
  }
}
