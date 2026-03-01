import {
  Chess,
  ChessJSColor,
  ChessJSMove as Move,
  MoveOptions,
  ChessJSPieceType,
  PieceSymbol,
  ShortMove
} from '@/lib/chess/chess';
import { ChessVariant } from '@/features/chess/config/variants';
import { VariantCapabilities } from './types';
import type { Rules } from 'chessops/types';
export abstract class ChessGameSession {
  protected game: Chess;
  constructor(fen: string, rules: Rules) {
    this.game = new Chess(fen, rules);
  }
  abstract get capabilities(): VariantCapabilities;
  abstract get variant(): ChessVariant;
  move(move: string | ShortMove): Move | null {
    return this.game.move(move);
  }
  fen(): string {
    return this.game.fen();
  }
  reset(): void {
    return this.game.reset();
  }
  load(
    fen: string,
    options?: {
      skipValidation?: boolean;
    }
  ): boolean {
    return this.game.load(fen, options);
  }
  undo(): Move | null {
    return this.game.undo();
  }
  turn(): ChessJSColor {
    return this.game.turn();
  }
  moves(options?: MoveOptions): string[] | Move[] {
    return this.game.moves(options);
  }
  history(options?: { verbose?: boolean }): string[] | Move[] {
    return this.game.history(options);
  }
  isGameOver(): boolean {
    return this.game.isGameOver();
  }
  isCheck(): boolean {
    return this.game.isCheck();
  }
  isCheckmate(): boolean {
    return this.game.isCheckmate();
  }
  isDraw(): boolean {
    return this.game.isDraw();
  }
  isStalemate(): boolean {
    return this.game.isStalemate();
  }
  isInsufficientMaterial(): boolean {
    return this.game.isInsufficientMaterial();
  }
  outcome():
    | {
        winner: 'w' | 'b' | undefined;
      }
    | undefined {
    return this.game.outcome();
  }
  get(square: string) {
    return this.game.get(square);
  }
  put(
    piece: {
      type: ChessJSPieceType;
      color: ChessJSColor;
    },
    square: string
  ): boolean {
    return this.game.put(piece, square);
  }
  remove(square: string) {
    return this.game.remove(square);
  }
  board() {
    return this.game.board();
  }
  pgn(): string {
    return this.game.pgn();
  }
  loadPgn(pgn: string): boolean {
    return this.game.loadPgn(pgn);
  }
  header(): Record<string, string> {
    return this.game.header();
  }
  getSquaresAttackedBy?(color: ChessJSColor): string[];
  getPocket?(color: ChessJSColor): Record<PieceSymbol, number>;
  getDropSquares?(): string[];
  getAdjacentOccupied?(square: string, excludePawns?: boolean): string[];
  protected onMovePlayed(_move: Move): void {
    void _move;
  }
  getUnderlyingGame(): Chess {
    return this.game;
  }
}
