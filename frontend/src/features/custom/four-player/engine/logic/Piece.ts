import type { PieceType, Team, BoardPosition } from '../types/core';
import { toSquare } from '../utils/board-utils';
export class Piece {
  private _x: number;
  private _y: number;
  private _type: PieceType;
  private readonly _team: Team;
  private _hasMoved: boolean;
  private _possibleMoves: BoardPosition[] = [];
  private _isPromoted: boolean = false;
  constructor(
    x: number,
    y: number,
    type: PieceType,
    team: Team,
    hasMoved: boolean = false,
    isPromoted: boolean = false
  ) {
    this._x = x;
    this._y = y;
    this._type = type;
    this._team = team;
    this._hasMoved = hasMoved;
    this._isPromoted = isPromoted;
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  get type(): PieceType {
    return this._type;
  }
  get team(): Team {
    return this._team;
  }
  get hasMoved(): boolean {
    return this._hasMoved;
  }
  get isPromoted(): boolean {
    return this._isPromoted;
  }
  get possibleMoves(): readonly BoardPosition[] {
    return this._possibleMoves;
  }
  get pieceType(): string {
    return this._team + this._type;
  }
  get square(): string {
    return toSquare(this._x, this._y);
  }
  isAtPosition(x: number, y: number): boolean {
    return this._x === x && this._y === y;
  }
  moveTo(x: number, y: number): void {
    this._x = x;
    this._y = y;
    this._hasMoved = true;
  }
  promote(newType: PieceType): void {
    this._type = newType;
    this._hasMoved = true;
    this._isPromoted = true;
  }
  setPossibleMoves(moves: BoardPosition[]): void {
    this._possibleMoves = moves;
  }
  clearPossibleMoves(): void {
    this._possibleMoves = [];
  }
  clone(): Piece {
    const cloned = new Piece(
      this._x,
      this._y,
      this._type,
      this._team,
      this._hasMoved,
      this._isPromoted
    );
    cloned._possibleMoves = this._possibleMoves.map((move) => ({ ...move }));
    return cloned;
  }
}
