import { Chess } from '@/lib/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';

export interface GameState {
  game: Chess;
  currentFEN: string;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
}

export function loadPGN(pgn: string): GameState | null {
  try {
    const newGame = new Chess();
    newGame.loadPgn(pgn);

    const moves: string[] = [];
    const positions: string[] = [STARTING_FEN];

    const tempGame = new Chess();
    const history = newGame.history({ verbose: true });

    for (const move of history) {
      tempGame.move(move.san);
      moves.push(move.san);
      positions.push(tempGame.fen());
    }

    return {
      game: newGame,
      currentFEN: newGame.fen(),
      moves,
      positionHistory: positions,
      viewingIndex: positions.length - 1
    };
  } catch {
    return null;
  }
}

export function loadFEN(fen: string): GameState | null {
  try {
    const newGame = new Chess(fen);
    return {
      game: newGame,
      currentFEN: fen,
      moves: [],
      positionHistory: [fen],
      viewingIndex: 0
    };
  } catch {
    return null;
  }
}

export function createInitialGameState(
  startingFEN: string = STARTING_FEN
): GameState {
  return {
    game: new Chess(startingFEN),
    currentFEN: startingFEN,
    moves: [],
    positionHistory: [startingFEN],
    viewingIndex: 0
  };
}
