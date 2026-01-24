import { NextRequest, NextResponse } from 'next/server';
import { Chess } from '@/lib/chess';
import { Position } from '@/types/Position';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function detectInputType(input: string): 'pgn' | 'fen' | 'moves' {
  const trimmed = input.trim();

  const fenPattern =
    /^[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+/;
  if (fenPattern.test(trimmed)) {
    return 'fen';
  }

  if (
    trimmed.includes('[Event ') ||
    trimmed.includes('[White ') ||
    trimmed.includes('[Black ')
  ) {
    return 'pgn';
  }

  if (/\d+\./.test(trimmed)) {
    return 'pgn';
  }

  return 'moves';
}

function parseMoveList(input: string, board: Chess): Position[] {
  const positions: Position[] = [{ fen: board.fen() }];

  const cleaned = input
    .replace(/\d+\.\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, '')
    .trim();

  const moves = cleaned.split(' ').filter((m) => m.length > 0);

  for (const moveSAN of moves) {
    try {
      const move = board.move(moveSAN);
      if (move) {
        const moveUCI = move.from + move.to + (move.promotion || '');
        positions.push({
          fen: board.fen(),
          move: {
            san: move.san,
            uci: moveUCI
          }
        });
      }
    } catch {
      continue;
    }
  }

  return positions;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input: gameInput } = body;

    if (!gameInput || typeof gameInput !== 'string' || !gameInput.trim()) {
      return NextResponse.json(
        { message: 'Enter a PGN, FEN, or moves to analyse.' },
        { status: 400 }
      );
    }

    const inputType = detectInputType(gameInput);
    const board = new Chess();
    let positions: Position[] = [];

    if (inputType === 'fen') {
      try {
        board.load(gameInput.trim().split('\n')[0].trim());
        positions = [{ fen: board.fen() }];
      } catch {
        return NextResponse.json(
          { message: 'Invalid FEN position.' },
          { status: 400 }
        );
      }
    } else if (inputType === 'pgn') {
      try {
        board.loadPgn(gameInput);

        const history = board.history({ verbose: true });
        const tempBoard = new Chess();
        positions = [{ fen: STARTING_FEN }];

        for (const move of history) {
          tempBoard.move(move.san);
          const moveUCI = move.from + move.to + (move.promotion || '');
          positions.push({
            fen: tempBoard.fen(),
            move: {
              san: move.san,
              uci: moveUCI
            }
          });
        }
      } catch {
        return NextResponse.json(
          { message: 'Failed to parse PGN. Check format and try again.' },
          { status: 400 }
        );
      }
    } else {
      positions = parseMoveList(gameInput, board);

      if (positions.length <= 1) {
        return NextResponse.json(
          {
            message:
              'No valid moves found. Enter moves in standard notation (e.g., e4 e5 Nf3).'
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
