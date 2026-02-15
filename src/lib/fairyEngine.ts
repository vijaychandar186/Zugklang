import type { ChessVariant } from '@/features/chess/utils/chess960';

// Type definitions for ffish-es6
interface FfishBoard {
  delete(): void;
  legalMoves(): string;
  legalMovesSan(): string;
  numberLegalMoves(): number;
  push(uciMove: string): boolean;
  pop(): void;
  fen(): string;
  setFen(fen: string): void;
  turn(): boolean; // true = white, false = black
  isGameOver(): boolean;
  isCheck(): boolean;
  isCapture(uciMove: string): boolean;
  result(): string;
}

interface FfishBoardConstructor {
  new (uciVariant?: string, fen?: string, is960?: boolean): FfishBoard;
}

interface FfishModule {
  Board: FfishBoardConstructor;
  variants(): string;
  startingFen(uciVariant: string): string;
}

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

export class FairyStockfishEngine {
  private ffish: FfishModule | null = null;
  private board: FfishBoard | null = null;
  private isDestroyed = false;
  private isReady = false;
  private readyPromise: Promise<void>;
  private resolveReady: (() => void) | null = null;
  private currentVariant: string = 'atomic';
  private currentHandler: ((data: { bestMove: string }) => void) | null = null;
  private searchDepth = 4; // Default search depth

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
      // Dynamic import of ffish-es6
      const Module = (await import('ffish-es6')).default;

      // Create a promise that resolves when WASM runtime is initialized
      const ffish = await new Promise<FfishModule>((resolve, reject) => {
        let resolved = false;

        const moduleOpts = {
          locateFile: (file: string) => `/fairy-stockfish/${file}`,
          onRuntimeInitialized: function (this: FfishModule) {
            if (!resolved) {
              resolved = true;
              resolve(this);
            }
          }
        };

        Module(moduleOpts)
          .then((instance: FfishModule) => {
            // Module resolved directly (some versions)
            if (!resolved && instance && instance.Board) {
              resolved = true;
              resolve(instance);
            }
          })
          .catch((err: Error) => {
            if (!resolved) {
              resolved = true;
              reject(err);
            }
          });
      });

      this.ffish = ffish;
      this.isReady = true;
      console.log(
        'Fairy-Stockfish initialized, variants:',
        ffish.variants?.() || 'N/A'
      );
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
    this.currentVariant = this.getUciVariant(variant);
  }

  onMessage(callback: (data: { bestMove: string }) => void): void {
    this.currentHandler = callback;
  }

  private clearCurrentHandler(): void {
    this.currentHandler = null;
  }

  async evaluatePosition(
    fen: string,
    depth: number,
    variant?: ChessVariant
  ): Promise<void> {
    if (this.isDestroyed) return;

    await this.readyPromise;
    if (this.isDestroyed || !this.ffish) return;

    if (variant) {
      this.setVariant(variant);
    }

    this.searchDepth = Math.min(depth, 6); // Cap depth for performance

    try {
      // Create a new board for this position
      if (this.board) {
        this.board.delete();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const BoardClass = this.ffish.Board as any;
      this.board = new BoardClass(this.currentVariant, fen) as FfishBoard;

      console.log('Board created for variant:', this.currentVariant);
      console.log('Legal moves:', this.board.legalMoves());

      // Find best move using minimax with alpha-beta pruning
      const bestMove = this.findBestMove();
      console.log('Best move found:', bestMove);

      if (bestMove && this.currentHandler) {
        // Small delay to simulate engine thinking
        setTimeout(
          () => {
            if (!this.isDestroyed && this.currentHandler) {
              this.currentHandler({ bestMove });
              this.clearCurrentHandler();
            }
          },
          200 + Math.random() * 300
        );
      }
    } catch (e) {
      console.error('Error evaluating position:', e);
    }
  }

  private findBestMove(): string | null {
    if (!this.board) return null;

    const legalMoves = this.board
      .legalMoves()
      .split(' ')
      .filter((m) => m);
    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) return legalMoves[0];

    let bestMove = legalMoves[0];
    let bestScore = -Infinity;
    const isMaximizing = this.board.turn(); // true = white

    for (const move of legalMoves) {
      this.board.push(move);
      const score = this.minimax(
        this.searchDepth - 1,
        -Infinity,
        Infinity,
        !isMaximizing
      );
      this.board.pop();

      const adjustedScore = isMaximizing ? score : -score;
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private minimax(
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (!this.board) return 0;

    if (depth === 0 || this.board.isGameOver()) {
      return this.evaluate();
    }

    const legalMoves = this.board
      .legalMoves()
      .split(' ')
      .filter((m) => m);
    if (legalMoves.length === 0) {
      return this.evaluate();
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        this.board.push(move);
        const evalScore = this.minimax(depth - 1, alpha, beta, false);
        this.board.pop();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        this.board.push(move);
        const evalScore = this.minimax(depth - 1, alpha, beta, true);
        this.board.pop();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  private evaluate(): number {
    if (!this.board) return 0;

    // Check for game over conditions
    if (this.board.isGameOver()) {
      const result = this.board.result();
      if (result === '1-0') return 100000;
      if (result === '0-1') return -100000;
      return 0; // Draw
    }

    // Simple material evaluation from FEN
    const fen = this.board.fen();
    const piecePlacement = fen.split(' ')[0];

    let score = 0;
    for (const char of piecePlacement) {
      const lowerChar = char.toLowerCase();
      if (PIECE_VALUES[lowerChar]) {
        const pieceValue = PIECE_VALUES[lowerChar];
        // Uppercase = white (positive), lowercase = black (negative)
        score += char === char.toUpperCase() ? pieceValue : -pieceValue;
      }
    }

    // Bonus for being in check (opponent is weak)
    if (this.board.isCheck()) {
      score += this.board.turn() ? -50 : 50;
    }

    return score;
  }

  async newGame(variant?: ChessVariant): Promise<void> {
    if (this.isDestroyed) return;

    await this.readyPromise;

    if (variant) {
      this.setVariant(variant);
    }

    if (this.board) {
      this.board.delete();
      this.board = null;
    }
  }

  stop(): void {
    this.clearCurrentHandler();
  }

  quit(): void {
    // No-op for ffish-based engine
  }

  destroy(): void {
    this.isDestroyed = true;
    this.clearCurrentHandler();
    if (this.board) {
      this.board.delete();
      this.board = null;
    }
    FairyStockfishEngine.instance = null;
  }

  sendCommand(command: string): void {
    // No-op - ffish doesn't use UCI commands
    console.debug('FairyStockfish command (no-op):', command);
  }

  addEventListener(
    _type: 'message',
    _listener: (e: MessageEvent) => void
  ): void {
    // No-op - using callback pattern instead
  }

  removeEventListener(
    _type: 'message',
    _listener: (e: MessageEvent) => void
  ): void {
    // No-op - using callback pattern instead
  }
}
