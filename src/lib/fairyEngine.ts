import type { ChessVariant } from '@/features/chess/utils/chess960';

/**
 * FairyStockfishEngine - Uses the actual Fairy Stockfish NNUE UCI engine
 * for variant chess (atomic, etc.).
 *
 * The fairy-stockfish WASM is NOT a simple Worker script. It's a module
 * that exposes a Stockfish() factory function which internally manages
 * its own threads. The API is:
 *   - instance.postMessage(command) to send UCI commands
 *   - instance.addMessageListener(fn) where fn receives plain strings
 */

// The Stockfish factory function exposed by the loaded script
interface FairyStockfishInstance {
  postMessage(command: string): void;
  addMessageListener(listener: (line: string) => void): void;
  removeMessageListener(listener: (line: string) => void): void;
  terminate(): void;
}

// Declared on window after script loads
declare global {
  // eslint-disable-next-line no-var
  var Stockfish:
    | ((params?: Record<string, unknown>) => Promise<FairyStockfishInstance>)
    | undefined;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Don't load twice
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export class FairyStockfishEngine {
  private engine: FairyStockfishInstance | null = null;
  private currentHandler: ((line: string) => void) | null = null;
  private isDestroyed = false;
  private isReady = false;
  private readyPromise: Promise<void>;
  private resolveReady: (() => void) | null = null;
  private currentVariant: string = '';

  private static instance: FairyStockfishEngine | null = null;

  static getInstance(): FairyStockfishEngine {
    if (
      !FairyStockfishEngine.instance ||
      FairyStockfishEngine.instance.isDestroyed
    ) {
      FairyStockfishEngine.instance = new FairyStockfishEngine();
    }
    return FairyStockfishEngine.instance;
  }

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.initializeEngine();
  }

  private async initializeEngine(): Promise<void> {
    if (typeof window === 'undefined') {
      this.resolveReady?.();
      return;
    }

    try {
      // Load the fairy-stockfish script which exposes global Stockfish()
      await loadScript('/fairy-stockfish/stockfish.js');

      if (!window.Stockfish) {
        throw new Error('Stockfish factory not found after script load');
      }

      // Create the engine instance via the factory
      const engine = await window.Stockfish();
      this.engine = engine;

      // Wait for readyok
      await new Promise<void>((resolve) => {
        const initHandler = (line: string) => {
          if (line.includes('readyok')) {
            this.isReady = true;
            engine.removeMessageListener(initHandler);
            resolve();
          }
        };
        engine.addMessageListener(initHandler);

        // Initialize UCI protocol
        engine.postMessage('uci');
        engine.postMessage('isready');
      });

      console.log('Fairy-Stockfish engine ready');
      this.resolveReady?.();
    } catch (e) {
      console.error('Failed to initialize Fairy-Stockfish:', e);
      this.resolveReady?.();
    }
  }

  async waitUntilReady(): Promise<void> {
    return this.readyPromise;
  }

  private getUciVariant(variant: ChessVariant): string {
    switch (variant) {
      case 'atomic':
        return 'atomic';
      case 'fischerRandom':
        return 'chess';
      case 'standard':
      default:
        return 'chess';
    }
  }

  setVariant(variant: ChessVariant): void {
    const uciVariant = this.getUciVariant(variant);
    if (this.currentVariant !== uciVariant) {
      this.currentVariant = uciVariant;
      this.sendCommand(`setoption name UCI_Variant value ${uciVariant}`);
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void): void {
    if (this.engine && !this.isDestroyed) {
      this.clearCurrentHandler();

      const handler = (line: string) => {
        const bestMove = line.match(/bestmove\s+(\S+)/)?.[1];
        if (bestMove) {
          this.clearCurrentHandler();
          if (!this.isDestroyed) {
            callback({ bestMove });
          }
        }
      };
      this.currentHandler = handler;
      this.engine.addMessageListener(handler);
    }
  }

  private clearCurrentHandler(): void {
    if (this.currentHandler && this.engine) {
      this.engine.removeMessageListener(this.currentHandler);
      this.currentHandler = null;
    }
  }

  async evaluatePosition(
    fen: string,
    depth: number,
    variant?: ChessVariant
  ): Promise<void> {
    if (this.engine && !this.isDestroyed) {
      await this.readyPromise;
      if (!this.isDestroyed) {
        if (variant) {
          this.setVariant(variant);
        }

        this.sendCommand(`position fen ${fen}`);
        this.sendCommand(`go depth ${depth}`);
      }
    }
  }

  async newGame(variant?: ChessVariant): Promise<void> {
    if (this.engine && !this.isDestroyed) {
      await this.readyPromise;

      this.sendCommand('ucinewgame');

      // Set variant AFTER ucinewgame since it resets engine state
      if (variant) {
        // Force re-send by clearing cached variant
        this.currentVariant = '';
        this.setVariant(variant);
      }

      this.sendCommand('isready');

      return new Promise((resolve) => {
        const handler = (line: string) => {
          if (line.includes('readyok')) {
            this.engine?.removeMessageListener(handler);
            resolve();
          }
        };
        this.engine?.addMessageListener(handler);
      });
    }
  }

  stop(): void {
    this.clearCurrentHandler();
    if (this.isReady && this.engine) {
      this.sendCommand('stop');
    }
  }

  quit(): void {
    if (this.engine) {
      this.sendCommand('quit');
    }
  }

  destroy(): void {
    this.isDestroyed = true;
    this.clearCurrentHandler();
    this.stop();
    this.quit();
    if (this.engine) {
      this.engine.terminate();
      this.engine = null;
    }
    FairyStockfishEngine.instance = null;
  }

  sendCommand(command: string): void {
    this.engine?.postMessage(command);
  }
}
