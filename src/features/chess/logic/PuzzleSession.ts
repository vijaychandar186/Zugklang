import { ChessSession, ChessSessionState } from './ChessSession';
import { ChessJSMove as Move } from '@/lib/chess';
import { Puzzle, PuzzleStatus } from '@/features/puzzles/types';

export interface PuzzleSessionState extends ChessSessionState {
  status: PuzzleStatus;
  currentPuzzle: Puzzle | null;
  solutionMoves: string[];
  currentMoveIndex: number;
  playerTurn: boolean;
}

export class PuzzleSession extends ChessSession {
  status: PuzzleStatus = 'idle';
  solutionMoves: string[] = [];
  currentMoveIndex: number = 0;
  playerTurn: boolean = true;
  currentPuzzle: Puzzle | null = null;

  constructor() {
    super();
  }

  loadPuzzle(puzzle: Puzzle) {
    this.currentPuzzle = puzzle;
    this.solutionMoves = puzzle.Moves.split(' ');
    this.loadFen(puzzle.FEN);

    this.status = 'playing';
    this.currentMoveIndex = 0;
    this.playerTurn = false;
  }

  get puzzleState(): PuzzleSessionState {
    return {
      ...this.state,
      status: this.status,
      currentPuzzle: this.currentPuzzle,
      solutionMoves: [...this.solutionMoves],
      currentMoveIndex: this.currentMoveIndex,
      playerTurn: this.playerTurn
    };
  }

  // Returns the move object if successful
  makeOpponentMove(): Move | null {
    if (this.currentMoveIndex >= this.solutionMoves.length) return null;

    const moveStr = this.solutionMoves[this.currentMoveIndex];
    const from = moveStr.slice(0, 2);
    const to = moveStr.slice(2, 4);
    const promotion = moveStr.length > 4 ? moveStr[4] : undefined;

    const move = super.makeMove(from, to, promotion);
    if (move) {
      this.currentMoveIndex++;
      this.playerTurn = true;
    }
    return move;
  }

  makePlayerMove(
    from: string,
    to: string,
    promotion?: string
  ): {
    move: Move | null;
    outcome: 'continue' | 'success' | 'failed' | 'invalid';
  } {
    if (this.status !== 'playing' || !this.playerTurn)
      return { move: null, outcome: 'invalid' };
    if (from === to) return { move: null, outcome: 'invalid' };

    const expectedMove = this.solutionMoves[this.currentMoveIndex];
    // Note: promotion usually lowercase in solution strings
    const playerMoveStr = `${from}${to}${promotion || ''}`;

    // We rely on super to validate legality
    const move = super.makeMove(from, to, promotion);
    if (!move) return { move: null, outcome: 'invalid' };

    if (playerMoveStr === expectedMove) {
      this.currentMoveIndex++;
      if (this.currentMoveIndex >= this.solutionMoves.length) {
        this.status = 'success';
        return { move, outcome: 'success' };
      } else {
        this.playerTurn = false; // Now opponent turn
        return { move, outcome: 'continue' };
      }
    } else {
      this.status = 'failed';
      return { move, outcome: 'failed' };
    }
  }

  retry(): void {
    if (this.currentPuzzle) {
      this.loadPuzzle(this.currentPuzzle);
    }
  }
}
