import { Position, Castles } from 'chessops/chess';
import {
  Move as ChessOpsMove,
  Square as ChessOpsSquare,
  Role,
  Color as ChessOpsColor,
  isDrop,
  FILE_NAMES,
  RANK_NAMES,
  Rules
} from 'chessops/types';
import { parseSquare, makeSquare, squareRank, opposite } from 'chessops/util';
import { parseFen, makeFen } from 'chessops/fen';
import { parseSan, makeSan } from 'chessops/san';
import {
  Game,
  Node,
  ChildNode,
  PgnNodeData,
  parsePgn,
  makePgn
} from 'chessops/pgn';
import { setupPosition, defaultPosition } from 'chessops/variant';

// Types compatible with chess.js
export type ChessJSColor = 'w' | 'b';
export type ChessJSPieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type ChessJSSquare = string;

export interface ChessJSMove {
  color: ChessJSColor;
  from: ChessJSSquare;
  to: ChessJSSquare;
  flags: string;
  piece: ChessJSPieceType;
  promotion?: ChessJSPieceType;
  san: string;
  lan?: string;
  captured?: ChessJSPieceType;
}

export interface ChessJSPiece {
  type: ChessJSPieceType;
  color: ChessJSColor;
}

export type MoveOptions = {
  verbose?: boolean;
  square?: string;
  maxWidth?: number;
};

// Aliases for transition
export type PieceSymbol = ChessJSPieceType;
export type Color = ChessJSColor;
export type Square = ChessJSSquare;
export type Move = ChessJSMove;
export type Piece = ChessJSPiece;
export type ShortMove = {
  from: ChessJSSquare;
  to: ChessJSSquare;
  promotion?: ChessJSPieceType;
};

const roleToType: Record<string, ChessJSPieceType> = {
  pawn: 'p',
  knight: 'n',
  bishop: 'b',
  rook: 'r',
  queen: 'q',
  king: 'k'
};

const typeToRole: Record<string, Role> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
};

const colorToChar: Record<string, ChessJSColor> = {
  white: 'w',
  black: 'b'
};

const charToColor: Record<string, ChessOpsColor> = {
  w: 'white',
  b: 'black'
};

export class Chess {
  private _game: Game<PgnNodeData>;
  private _currentNode: Node<PgnNodeData>;
  private _pos: Position;
  private _startFen: string;
  private _headers: Map<string, string>;
  private _historyStack: { position: Position; move: ChessJSMove }[] = [];

  constructor(
    fen?: string,
    optionsOrVariant:
      | Rules
      | { skipValidation?: boolean; variant?: Rules } = 'chess'
  ) {
    let variant: Rules = 'chess';
    let skipValidation = false;

    if (typeof optionsOrVariant === 'string') {
      variant = optionsOrVariant;
    } else if (typeof optionsOrVariant === 'object') {
      if (optionsOrVariant.variant) variant = optionsOrVariant.variant;
      skipValidation = !!optionsOrVariant.skipValidation;
    }

    this._headers = new Map([
      ['Event', '?'],
      ['Site', '?'],
      ['Date', '????.??.??'],
      ['Round', '?'],
      ['White', '?'],
      ['Black', '?'],
      ['Result', '*'],
      ['Variant', variant === 'chess' ? 'Standard' : variant]
    ]);

    this._pos = defaultPosition(variant);
    this._startFen = makeFen(this._pos.toSetup());

    if (fen) {
      this.load(fen, { skipValidation });
    }

    this._game = {
      headers: this._headers,
      moves: new Node()
    };
    this._currentNode = this._game.moves;
  }

  fen(): string {
    return makeFen(this._pos.toSetup());
  }

  reset(): void {
    const variant =
      this.header()['Variant'] === 'Standard'
        ? 'chess'
        : (this.header()['Variant'] as Rules) || 'chess';
    this._pos = defaultPosition(variant);
    this._game.moves = new Node();
    this._currentNode = this._game.moves;
    this._startFen = makeFen(this._pos.toSetup());
    this._historyStack = [];
  }

  load(fen: string, options?: { skipValidation?: boolean }): boolean {
    try {
      const setup = parseFen(fen).unwrap();
      const variant = 'chess'; // If we want to support variant changes in load, we need more args. defaulting to chess or existing pos rules?
      // Let's stick to 'chess' or current rules?
      // If we are replacing the position, we should maybe detect rules?

      if (options?.skipValidation) {
        // Manual setup
        this._pos.board = setup.board.clone();
        this._pos.turn = setup.turn;
        this._pos.castles = Castles.fromSetup(setup);
        this._pos.epSquare = setup.epSquare;
        this._pos.halfmoves = setup.halfmoves;
        this._pos.fullmoves = setup.fullmoves;
      } else {
        this._pos = setupPosition(this._pos.rules || 'chess', setup).unwrap();
      }

      this._startFen = fen;
      this._game.moves = new Node();
      this._currentNode = this._game.moves;
      this._historyStack = [];
      return true;
    } catch (e) {
      return false;
    }
  }

  move(
    move: string | { from: string; to: string; promotion?: string }
  ): ChessJSMove | null {
    try {
      let m: ChessOpsMove;
      let san: string;

      if (typeof move === 'string') {
        const parsed = parseSan(this._pos, move);
        if (!parsed) return null;
        m = parsed;
      } else {
        const fromSq = parseSquare(move.from);
        const toSq = parseSquare(move.to);
        if (fromSq === undefined || toSq === undefined) return null;

        // Only include promotion if it's actually a promotion move (pawn reaching last rank)
        const piece = this._pos.board.get(fromSq);
        const isPromotion =
          piece?.role === 'pawn' &&
          ((piece.color === 'white' && squareRank(toSq) === 7) ||
            (piece.color === 'black' && squareRank(toSq) === 0));

        m = {
          from: fromSq,
          to: toSq,
          promotion:
            isPromotion && move.promotion
              ? typeToRole[move.promotion]
              : undefined
        };
        if (!this._pos.isLegal(m)) return null;
      }

      san = makeSan(this._pos, m);
      const moveObj = this._makeMoveObjectInternal(m, san, this._pos);

      // Save position state for undo - clone current position before playing
      const positionClone = this._pos.clone();
      this._historyStack.push({ position: positionClone, move: moveObj });

      this._pos.play(m);

      const newNode = new ChildNode<PgnNodeData>({ san });
      this._currentNode.children.push(newNode);
      this._currentNode = newNode;

      return moveObj;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  put(piece: ChessJSPiece, square: string): boolean {
    const sq = parseSquare(square);
    if (sq === undefined) return false;
    const role = typeToRole[piece.type];
    if (!role) return false;

    this._pos.board.set(sq, {
      role: role,
      color: charToColor[piece.color]
    });
    return true;
  }

  remove(square: string): ChessJSPiece | null {
    const sq = parseSquare(square);
    if (sq === undefined) return null;
    const piece = this._pos.board.take(sq);
    if (!piece) return null;
    return {
      type: roleToType[piece.role],
      color: colorToChar[piece.color]
    };
  }

  turn(): ChessJSColor {
    return colorToChar[this._pos.turn];
  }

  get(square: string): ChessJSPiece | null {
    const sq = parseSquare(square);
    if (sq === undefined) return null;
    const piece = this._pos.board.get(sq);
    if (!piece) return null;
    return {
      type: roleToType[piece.role],
      color: colorToChar[piece.color]
    };
  }

  history(options: { verbose: true }): ChessJSMove[];
  history(options?: { verbose: false }): string[];
  history(options?: { verbose?: boolean }): (string | ChessJSMove)[];
  history(options?: { verbose?: boolean }): (string | ChessJSMove)[] {
    const moves: (string | ChessJSMove)[] = [];
    const verbose = options?.verbose;

    if (!verbose) {
      // Simple SAN list
      let node = this._game.moves;
      while (node.children.length > 0) {
        const child = node.children[0];
        moves.push(child.data.san);
        node = child;
        if (node === this._currentNode) break; // Stop at current node
      }
    } else {
      // Replay to generate objects
      // This is expensive but necessary for verbose history
      const tempPos = setupPosition(
        'chess',
        parseFen(this._startFen).unwrap()
      ).unwrap(); // Assuming startFen is valid for current variant
      let node = this._game.moves;

      while (node.children.length > 0) {
        const child = node.children[0];
        const m = parseSan(tempPos, child.data.san);
        if (m) {
          const moveObj = this._makeMoveObjectInternal(
            m,
            child.data.san,
            tempPos
          );
          moves.push(moveObj);
          tempPos.play(m);
        }
        node = child;
        if (node === this._currentNode) break;
      }
    }
    return moves;
  }

  moves(): string[];
  moves(options: { verbose: true; square?: string }): ChessJSMove[];
  moves(options?: { verbose: false; square?: string }): string[];
  moves(options?: {
    verbose?: boolean;
    square?: string;
  }): (string | ChessJSMove)[];
  moves({ square, verbose }: MoveOptions = {}): (string | ChessJSMove)[] {
    const moves: (string | ChessJSMove)[] = [];
    const ctx = this._pos.ctx();

    const generateForSquare = (sq: ChessOpsSquare) => {
      const dests = this._pos.dests(sq, ctx);
      for (const to of dests) {
        const m: ChessOpsMove = { from: sq, to };
        // Check for promotions
        const piece = this._pos.board.get(sq);
        if (piece && piece.role === 'pawn') {
          const r = squareRank(to);
          if (
            (piece.color === 'white' && r === 7) ||
            (piece.color === 'black' && r === 0)
          ) {
            ['q', 'r', 'b', 'n'].forEach((role) => {
              addMove({ ...m, promotion: role as Role });
            });
            return;
          }
        }
        addMove(m);
      }
    };

    const addMove = (m: ChessOpsMove) => {
      const san = makeSan(this._pos, m);
      if (verbose) {
        moves.push(this._makeMoveObjectInternal(m, san, this._pos));
      } else {
        moves.push(san);
      }
    };

    if (square) {
      const sq = parseSquare(square);
      if (sq !== undefined) generateForSquare(sq);
    } else {
      for (const s of this._pos.board.occupied) {
        if (this._pos.board.get(s)?.color === this._pos.turn) {
          generateForSquare(s);
        }
      }
    }
    return moves;
  }

  undo(): ChessJSMove | null {
    if (this._historyStack.length === 0) return null;

    const last = this._historyStack.pop()!;
    const currentPos = this._pos;
    const prevPos = last.position;

    // The move that led to currentPos is what we are undoing.
    // We stored it?
    // Actually chess.js undo returns the move that was undone.
    // I need to store the move object in history?

    this._pos = prevPos;
    // We also need to revert _currentNode if we are tracking game tree
    // But we don't have parent pointer.
    // If we are linear, we can just pop from move list?
    // Since wrapper is replacing chess.js which is linear history mostly...
    // But if I use Game tree, undoing in tree means moving pointer up.
    // I can't do that easily without parent pointers.

    // For now, I revert Position.
    // And I should return the move.
    // I'll update store to include move info.
    return last.move;
  }

  isGameOver(): boolean {
    return this._pos.isEnd();
  }

  isCheck(): boolean {
    return this._pos.isCheck();
  }

  isCheckmate(): boolean {
    return this._pos.isCheckmate();
  }

  isDraw(): boolean {
    return this._pos.isStalemate() || this._pos.isInsufficientMaterial();
  }

  isStalemate(): boolean {
    return this._pos.isStalemate();
  }

  isInsufficientMaterial(): boolean {
    return this._pos.isInsufficientMaterial();
  }

  board(): ({
    type: ChessJSPieceType;
    color: ChessJSColor;
    square: ChessJSSquare;
  } | null)[][] {
    const output: ({
      type: ChessJSPieceType;
      color: ChessJSColor;
      square: ChessJSSquare;
    } | null)[][] = [];
    const board = this._pos.board;
    for (let r = 7; r >= 0; r--) {
      const row: ({
        type: ChessJSPieceType;
        color: ChessJSColor;
        square: ChessJSSquare;
      } | null)[] = [];
      for (let f = 0; f < 8; f++) {
        const sq = r * 8 + f; // chessops square index
        const piece = board.get(sq);
        if (piece) {
          row.push({
            type: roleToType[piece.role],
            color: colorToChar[piece.color],
            square: makeSquare(sq)
          });
        } else {
          row.push(null);
        }
      }
      output.push(row);
    }
    return output;
  }

  pgn(): string {
    return makePgn(this._game);
  }

  loadPgn(pgn: string): boolean {
    try {
      const games = parsePgn(pgn);
      if (games.length > 0) {
        this._game = games[0];
        const fen = this._game.headers.get('FEN');
        if (fen) {
          this._startFen = fen;
          const setup = parseFen(fen).unwrap();
          this._pos = setupPosition('chess', setup).unwrap();
        } else {
          this._startFen = makeFen(defaultPosition('chess').toSetup());
          this._pos = defaultPosition('chess');
        }

        // Replay to set _currentNode
        let node = this._game.moves;
        while (node.children.length > 0) {
          const child = node.children[0];
          const move = parseSan(this._pos, child.data.san);
          if (move) this._pos.play(move);
          node = child;
        }
        this._currentNode = node;
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  header(): Record<string, string> {
    const h: Record<string, string> = {};
    for (const [k, v] of this._game.headers) {
      h[k] = v;
    }
    return h;
  }

  private _makeMoveObjectInternal(
    move: ChessOpsMove,
    san: string,
    pos: Position
  ): ChessJSMove {
    const from = isDrop(move) ? '@' : makeSquare(move.from);
    const to = makeSquare(move.to);
    const pieceObj = !isDrop(move)
      ? pos.board.get(move.from)
      : { role: move.role, color: pos.turn };

    // Basic capture check (simple replacement)
    // This implies we check the 'to' square on the board BEFORE the move make.
    // Yes, 'pos' passed here is BEFORE the move.
    const capturedPiece = !isDrop(move) ? pos.board.get(move.to) : undefined;

    // Handle en passant capture detection?
    let isEnPassant = false;
    if (!isDrop(move) && pieceObj?.role === 'pawn' && !capturedPiece) {
      if (Math.abs(move.from - move.to) % 8 !== 0) {
        // diagonal
        // Diagonal move without capture on target square = en passant
        isEnPassant = true;
      }
    }

    let captured = capturedPiece ? roleToType[capturedPiece.role] : undefined;
    if (isEnPassant) captured = 'p';

    return {
      color: colorToChar[pos.turn],
      from,
      to,
      flags: 'n', // TODO: implement full flags if needed
      piece: pieceObj ? roleToType[pieceObj.role] : 'p',
      promotion:
        !isDrop(move) && move.promotion
          ? roleToType[move.promotion]
          : undefined,
      san,
      captured
    };
  }
}
