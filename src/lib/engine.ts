export class StockfishEngine {
  private worker: Worker | null = null;
  private currentHandler: ((e: MessageEvent) => void) | null = null;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('/stockfish.js');
      this.sendCommand('uci');
      this.sendCommand('isready');
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.worker) {
      // Remove any existing handler first
      if (this.currentHandler) {
        this.worker.removeEventListener('message', this.currentHandler);
      }

      const handler = (e: MessageEvent) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
        if (bestMove) {
          this.worker?.removeEventListener('message', handler);
          this.currentHandler = null;
          callback({ bestMove });
        }
      };
      this.currentHandler = handler;
      this.worker.addEventListener('message', handler);
    }
  }

  evaluatePosition(fen: string, depth: number) {
    if (this.worker) {
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);
    }
  }

  stop() {
    this.sendCommand('stop');
  }

  quit() {
    this.sendCommand('quit');
  }

  private sendCommand(command: string) {
    this.worker?.postMessage(command);
  }
}
