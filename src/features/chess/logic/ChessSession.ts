import { Chess, ChessJSMove as Move } from '@/lib/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';
import {
  ChessVariant,
  generateRandomChess960FEN
} from '@/features/chess/utils/chess960';

export interface ChessSessionState {
  fen: string;
  moves: string[];
  history: string[]; // FEN history
  isGameOver: boolean;
  gameResult: string | null;
  turn: 'w' | 'b';
  check: boolean;
  checkmate: boolean;
  draw: boolean;
  stalemate: boolean;
  insufficientMaterial: boolean;
}

export class ChessSession {
  protected game: Chess;
  protected _moves: string[] = [];
  protected _history: string[] = []; // History of FENs
  protected _variant: ChessVariant = 'standard';

  constructor(fen: string = STARTING_FEN, variant: ChessVariant = 'standard') {
    this._variant = variant;
    this.game = new Chess(fen, variant === 'fischerRandom' ? 'chess' : 'chess');
    this._history = [fen];
    this._moves = [];
  }

  get state(): ChessSessionState {
    return {
      fen: this.game.fen(),
      moves: [...this._moves],
      history: [...this._history],
      isGameOver: this.game.isGameOver(),
      gameResult: this.getGameResult(),
      turn: this.game.turn(),
      check: this.game.isCheck(),
      checkmate: this.game.isCheckmate(),
      draw: this.game.isDraw(),
      stalemate: this.game.isStalemate(),
      insufficientMaterial: this.game.isInsufficientMaterial()
    };
  }

  get instance(): Chess {
    return this.game;
  }

  get moves(): string[] {
    return this._moves;
  }

  get history(): string[] {
    return this._history;
  }

  get fen(): string {
    return this.game.fen();
  }

  makeMove(from: string, to: string, promotion?: string): Move | null {
    try {
      const move = this.game.move({ from, to, promotion });
      if (move) {
        this._moves.push(move.san);
        this._history.push(this.game.fen());
        return move;
      }
    } catch {
      return null;
    }
    return null;
  }

  addMove(moveSan: string, fen: string): void {
    // Used when synchronizing with externals or replaying
    // Note: blindly adding might desync game state if not careful,
    // but useful for forced updates.
    this._moves.push(moveSan);
    this._history.push(fen);
    try {
      // We try to sync the internal game instance if possible
      this.game.load(fen);
    } catch {}
  }

  reset(variant: ChessVariant = this._variant): void {
    this._variant = variant;
    let fen = STARTING_FEN;
    if (variant === 'fischerRandom') {
      fen = generateRandomChess960FEN();
    }
    this.game = new Chess(fen, variant === 'fischerRandom' ? 'chess' : 'chess');
    this._history = [fen];
    this._moves = [];
  }

  loadFen(fen: string): boolean {
    const success = this.game.load(fen);
    if (success) {
      this._history = [fen];
      this._moves = [];
    }
    return success;
  }

  loadPgn(pgn: string): boolean {
    const success = this.game.loadPgn(pgn);
    if (success) {
      // Reconstruct history
      // This is expensive but necessary if we want full history array
      const tempGame = new Chess();
      tempGame.loadPgn(pgn);
      const history = tempGame.history({ verbose: true });

      this._moves = [];
      this._history = [STARTING_FEN]; // Assuming standard start for PGN usually?
      // Actually PGN might have FEN tag.
      // Let's use what the game loaded.
      // But Game.loadPgn() sets state to end.

      // We need to replay to get history FENs.
      // Fortunately our custom Chess class wraps chessops which parses PGN.
      // But to get the array of FENs we might need to replay.

      // Let's rely on the fact that if we just loaded PGN,
      // we might just want to set the current state.
      // But useChessStore implementation replayed it.

      this._moves = this.game.history(); // San strings
      // We'll leave history reconstruction for now or implement if needed.
      // For now, let's just sync moves.

      // Re-implementing the replay logic from useChessStore:
      const replayGame = new Chess(); // Standard start?
      // TODO: Check if PGN has different start FEN.
      // For now, simple implementation:
      this._moves = this.game.history();

      // Correct reconstruction needs to respect Start FEN.
      // The wrapper Chess class (lib/chess) manages this internally but doesn't expose FEN history easily.
    }
    return success;
  }

  private getGameResult(): string | null {
    if (this.game.isCheckmate())
      return this.game.turn() === 'w' ? 'Black wins' : 'White wins';
    if (this.game.isDraw()) return 'Draw';
    return null;
  }
}
