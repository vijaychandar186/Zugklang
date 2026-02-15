import type {
  Team,
  PieceType,
  GameStatus,
  MoveRecord,
  BoardPositionMap,
  PendingPromotion
} from '../types/core';
import { Piece } from './Piece';
import { createInitialPieces } from './initial-position';
import { generateRawMoves, generateCastlingMoves } from './move-generation';
import { pieceAt } from '../utils/piece-utils';
import { toSquare, fromSquare } from '../utils/board-utils';
import { TURN_ORDER, TEAM_PAWN_CONFIG, isVerticalTeam } from '../config/teams';

// ── Constructor config ─────────────────────────────────────────────

interface GameConfig {
  readonly pieces?: Piece[];
  readonly currentTeam?: Team;
  readonly loseOrder?: Team[];
  readonly totalMoves?: number;
  readonly status?: GameStatus;
  readonly moveHistory?: MoveRecord[];
}

// ── Game class ─────────────────────────────────────────────────────

export class FourPlayerGame {
  private _pieces: Piece[];
  private _currentTeam: Team;
  private _loseOrder: Team[];
  private _totalMoves: number;
  private _status: GameStatus;
  private _pendingPromotion: { piece: Piece; x: number; y: number } | null;
  private _moveHistory: MoveRecord[];

  constructor(config: GameConfig = {}) {
    this._pieces = config.pieces ?? createInitialPieces();
    this._currentTeam = config.currentTeam ?? 'r';
    this._loseOrder = config.loseOrder ?? [];
    this._totalMoves = config.totalMoves ?? 0;
    this._status = config.status ?? 'playing';
    this._pendingPromotion = null;
    this._moveHistory = config.moveHistory ?? [];
    this.calculateAllMoves();
  }

  // ── Read-only accessors ──────────────────────────────────────────

  get pieces(): readonly Piece[] {
    return this._pieces;
  }

  get currentTeam(): Team {
    return this._currentTeam;
  }

  get loseOrder(): readonly Team[] {
    return this._loseOrder;
  }

  get totalMoves(): number {
    return this._totalMoves;
  }

  get status(): GameStatus {
    return this._status;
  }

  get pendingPromotion(): PendingPromotion | null {
    return this._pendingPromotion;
  }

  get moveHistory(): readonly MoveRecord[] {
    return this._moveHistory;
  }

  get winner(): Team | null {
    if (this._loseOrder.length === 3) {
      return TURN_ORDER.find((team) => !this._loseOrder.includes(team)) ?? null;
    }
    return null;
  }

  get isChecked(): boolean {
    const king = this._pieces.find(
      (piece) => piece.type === 'K' && piece.team === this._currentTeam
    );
    if (!king) return false;

    for (const enemy of this._pieces.filter(
      (piece) => piece.team !== this._currentTeam
    )) {
      const enemyMoves = generateRawMoves(enemy, this._pieces);
      if (enemyMoves.some((move) => move.x === king.x && move.y === king.y)) {
        return true;
      }
    }
    return false;
  }

  // ── Public methods ───────────────────────────────────────────────

  /** Get valid move target squares for a piece at the given square */
  getMovesForSquare(square: string): string[] {
    const { x, y } = fromSquare(square);
    const piece = this._pieces.find(
      (p) => p.isAtPosition(x, y) && p.team === this._currentTeam
    );
    if (!piece) return [];
    return piece.possibleMoves.map((move) => toSquare(move.x, move.y));
  }

  /** Play a move. Returns true if successful. */
  playMove(fromSq: string, toSq: string): boolean {
    if (this._status !== 'playing' || this._pendingPromotion) return false;

    const from = fromSquare(fromSq);
    const to = fromSquare(toSq);

    const piece = this._pieces.find(
      (p) => p.isAtPosition(from.x, from.y) && p.team === this._currentTeam
    );
    if (!piece) return false;

    if (
      !piece.possibleMoves.some((move) => move.x === to.x && move.y === to.y)
    ) {
      return false;
    }

    const destPiece = pieceAt(this._pieces, to.x, to.y);
    const team = this._currentTeam;

    // Castling: king moves to own rook's square
    if (
      piece.type === 'K' &&
      destPiece?.type === 'R' &&
      destPiece.team === piece.team
    ) {
      this._moveHistory.push({ from: fromSq, to: toSq, team, notation: 'O-O' });
      this.executeCastling(piece, destPiece);
      return true;
    }

    const notation = this.buildNotation(piece, fromSq, toSq, destPiece);

    // Capture
    if (destPiece) {
      this._pieces = this._pieces.filter((p) => p !== destPiece);
    }

    // Move
    piece.moveTo(to.x, to.y);

    // Check pawn promotion
    if (piece.type === 'P' && this.isPawnPromotion(piece)) {
      this._pendingPromotion = { piece, x: to.x, y: to.y };
      this._moveHistory.push({
        from: fromSq,
        to: toSq,
        team,
        notation,
        captured: destPiece?.pieceType
      });
      return true; // Caller must call completePromotion
    }

    this._moveHistory.push({
      from: fromSq,
      to: toSq,
      team,
      notation,
      captured: destPiece?.pieceType
    });

    this._totalMoves++;
    this._currentTeam = this.getNextTeam();
    this.calculateAllMoves();
    return true;
  }

  /** Complete a pending pawn promotion */
  completePromotion(promoteTo: PieceType): void {
    if (!this._pendingPromotion) return;

    const { piece } = this._pendingPromotion;
    piece.promote(promoteTo);
    this._pendingPromotion = null;

    // Append promotion suffix to last recorded move
    const lastMove = this._moveHistory[this._moveHistory.length - 1];
    if (lastMove) lastMove.notation += `=${promoteTo}`;

    this._totalMoves++;
    this._currentTeam = this.getNextTeam();
    this.calculateAllMoves();
  }

  /** Convert to react-chessboard position object */
  toPosition(): BoardPositionMap {
    const position: BoardPositionMap = {};
    for (const piece of this._pieces) {
      position[piece.square] = { pieceType: piece.pieceType };
    }
    return position;
  }

  /** Create a deep copy of this game */
  clone(): FourPlayerGame {
    return new FourPlayerGame({
      pieces: this._pieces.map((piece) => piece.clone()),
      currentTeam: this._currentTeam,
      loseOrder: [...this._loseOrder],
      totalMoves: this._totalMoves,
      status: this._status,
      moveHistory: this._moveHistory.map((move) => ({ ...move }))
    });
  }

  // ── Private methods ──────────────────────────────────────────────

  private getNextTeam(): Team {
    const active = TURN_ORDER.filter((team) => !this._loseOrder.includes(team));
    return active[(active.indexOf(this._currentTeam) + 1) % active.length];
  }

  private calculateAllMoves(): void {
    // Calculate raw moves for all pieces
    for (const piece of this._pieces) {
      piece.setPossibleMoves(generateRawMoves(piece, this._pieces));
    }

    // Add castling for current team's king(s)
    for (const king of this._pieces.filter(
      (piece) => piece.type === 'K' && piece.team === this._currentTeam
    )) {
      king.setPossibleMoves([
        ...king.possibleMoves,
        ...generateCastlingMoves(king, this._pieces)
      ]);
    }

    // Filter out moves that leave own king in check
    this.filterIllegalMoves();

    // Clear moves for non-current teams
    for (const piece of this._pieces) {
      if (piece.team !== this._currentTeam) {
        piece.clearPossibleMoves();
      }
    }

    // Check if current team has any legal moves — if not, they're checkmated
    const hasLegalMoves = this._pieces
      .filter((piece) => piece.team === this._currentTeam)
      .some((piece) => piece.possibleMoves.length > 0);

    if (!hasLegalMoves && this._status === 'playing') {
      const eliminatedTeam = this._currentTeam;
      this._currentTeam = this.getNextTeam();
      this._loseOrder.push(eliminatedTeam);

      if (this._loseOrder.length === 3) {
        this._status = 'gameover';
      } else {
        this.calculateAllMoves();
      }
    }
  }

  private filterIllegalMoves(): void {
    for (const piece of this._pieces.filter(
      (p) => p.team === this._currentTeam
    )) {
      const legalMoves = piece.possibleMoves.filter((move) => {
        // Simulate the move
        const simPieces = this._pieces.map((p) => p.clone());

        // Remove captured piece
        const capturedIndex = simPieces.findIndex((p) =>
          p.isAtPosition(move.x, move.y)
        );
        if (capturedIndex !== -1) simPieces.splice(capturedIndex, 1);

        // Move piece
        const simPiece = simPieces.find(
          (p) => p.isAtPosition(piece.x, piece.y) && p.team === piece.team
        )!;
        simPiece.moveTo(move.x, move.y);

        // Find own king
        const king = simPieces.find(
          (p) => p.type === 'K' && p.team === this._currentTeam
        );
        if (!king) return false;

        // Check if any enemy can attack the king
        for (const enemy of simPieces.filter(
          (p) => p.team !== this._currentTeam
        )) {
          const enemyMoves = generateRawMoves(enemy, simPieces);
          if (enemyMoves.some((m) => m.x === king.x && m.y === king.y)) {
            return false;
          }
        }
        return true;
      });

      piece.setPossibleMoves([...legalMoves]);
    }
  }

  private isPawnPromotion(pawn: Piece): boolean {
    const config = TEAM_PAWN_CONFIG[pawn.team];
    const position = config.axis === 'vertical' ? pawn.y : pawn.x;
    return position === config.promotionRank;
  }

  private executeCastling(king: Piece, rook: Piece): void {
    const isVertical = isVerticalTeam(king.team);
    const direction = isVertical
      ? rook.x - king.x > 0
        ? 1
        : -1
      : rook.y - king.y > 0
        ? 1
        : -1;

    if (isVertical) {
      const newKingX = king.x + direction * 2;
      king.moveTo(newKingX, king.y);
      rook.moveTo(newKingX - direction, rook.y);
    } else {
      const newKingY = king.y + direction * 2;
      king.moveTo(king.x, newKingY);
      rook.moveTo(rook.x, newKingY - direction);
    }

    this._totalMoves++;
    this._currentTeam = this.getNextTeam();
    this.calculateAllMoves();
  }

  private buildNotation(
    piece: Piece,
    fromSq: string,
    toSq: string,
    captured: Piece | undefined
  ): string {
    const pieceChar = piece.type === 'P' ? '' : piece.type;
    const captureChar = captured ? 'x' : '';
    const fromFile = piece.type === 'P' && captured ? fromSq[0] : '';
    return `${pieceChar}${fromFile}${captureChar}${toSq}`;
  }
}
