import { Chess, Square } from 'chess.js';
import type { Position, EvaluatedPosition } from '@/lib/types/Position';
import openingsData from '@/resources/openings.json';

export enum Classification {
  BRILLIANT = 'brilliant',
  GREAT = 'great',
  BEST = 'best',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  INACCURACY = 'inaccuracy',
  MISTAKE = 'mistake',
  BLUNDER = 'blunder',
  BOOK = 'book',
  FORCED = 'forced'
}

const classificationValues: Record<string, number> = {
  blunder: 0,
  mistake: 0.2,
  inaccuracy: 0.4,
  good: 0.65,
  excellent: 0.9,
  best: 1,
  great: 1,
  brilliant: 1,
  book: 1,
  forced: 1
};

const centipawnClassifications = [
  Classification.BEST,
  Classification.EXCELLENT,
  Classification.GOOD,
  Classification.INACCURACY,
  Classification.MISTAKE,
  Classification.BLUNDER
];

const pieceValues: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: Infinity,
  m: 0
};

const promotions = [undefined, 'b', 'n', 'r', 'q'] as const;

function getEvaluationLossThreshold(
  classif: Classification,
  prevEval: number
): number {
  const absPrevEval = Math.abs(prevEval);
  let threshold = 0;

  switch (classif) {
    case Classification.BEST:
      threshold =
        0.0001 * Math.pow(absPrevEval, 2) + 0.0236 * absPrevEval - 3.7143;
      break;
    case Classification.EXCELLENT:
      threshold =
        0.0002 * Math.pow(absPrevEval, 2) + 0.1231 * absPrevEval + 27.5455;
      break;
    case Classification.GOOD:
      threshold =
        0.0002 * Math.pow(absPrevEval, 2) + 0.2643 * absPrevEval + 60.5455;
      break;
    case Classification.INACCURACY:
      threshold =
        0.0002 * Math.pow(absPrevEval, 2) + 0.3624 * absPrevEval + 108.0909;
      break;
    case Classification.MISTAKE:
      threshold =
        0.0003 * Math.pow(absPrevEval, 2) + 0.4027 * absPrevEval + 225.8182;
      break;
    default:
      threshold = Infinity;
  }

  return Math.max(threshold, 0);
}

interface InfluencingPiece {
  square: Square;
  color: string;
  type: string;
}

function getAttackers(fen: string, square: Square): InfluencingPiece[] {
  const attackers: InfluencingPiece[] = [];
  const board = new Chess(fen);
  const piece = board.get(square);

  if (!piece) return attackers;

  board.load(
    fen.replace(/(?<= )(?:w|b)(?= )/g, piece.color === 'w' ? 'b' : 'w')
  );
  const legalMoves = board.moves({ verbose: true });

  for (const move of legalMoves) {
    if (move.to === square) {
      attackers.push({
        square: move.from,
        color: move.color,
        type: move.piece
      });
    }
  }

  return attackers;
}

function isPieceHanging(lastFen: string, fen: string, square: Square): boolean {
  const lastBoard = new Chess(lastFen);
  const board = new Chess(fen);

  const lastPiece = lastBoard.get(square);
  const piece = board.get(square);

  if (!piece) return false;

  const attackers = getAttackers(fen, square);

  if (
    lastPiece &&
    pieceValues[lastPiece.type] >= pieceValues[piece.type] &&
    lastPiece.color !== piece.color
  ) {
    return false;
  }

  if (
    lastPiece &&
    piece.type === 'r' &&
    pieceValues[lastPiece.type] === 3 &&
    attackers.every((atk) => pieceValues[atk.type] === 3) &&
    attackers.length === 1
  ) {
    return false;
  }

  if (
    attackers.some((atk) => pieceValues[atk.type] < pieceValues[piece.type])
  ) {
    return true;
  }

  return false;
}

interface Report {
  accuracies: {
    white: number;
    black: number;
  };
  positions: Position[];
}

async function analyse(positions: Position[]): Promise<Report> {
  let positionIndex = 0;
  for (const position of positions.slice(1)) {
    positionIndex++;

    const board = new Chess(position.fen);
    const lastPosition = positions[positionIndex - 1];

    const topMove = lastPosition.topLines?.find((line) => line.id === 1);
    const secondTopMove = lastPosition.topLines?.find((line) => line.id === 2);
    if (!topMove) continue;

    const previousEvaluation = topMove.evaluation;
    let evaluation = position.topLines?.find(
      (line) => line.id === 1
    )?.evaluation;
    if (!previousEvaluation) continue;

    const moveColour = position.fen.includes(' b ') ? 'white' : 'black';

    if (!evaluation) {
      evaluation = { type: board.isCheckmate() ? 'mate' : 'cp', value: 0 };
      if (!position.topLines) position.topLines = [];
      position.topLines.push({
        id: 1,
        depth: 0,
        evaluation: evaluation,
        moveUCI: ''
      });
    }

    const absoluteEvaluation =
      evaluation.value * (moveColour === 'white' ? 1 : -1);
    const previousAbsoluteEvaluation =
      previousEvaluation.value * (moveColour === 'white' ? 1 : -1);
    const absoluteSecondEvaluation =
      (secondTopMove?.evaluation.value ?? 0) *
      (moveColour === 'white' ? 1 : -1);

    let evalLoss = Infinity;
    let cutoffEvalLoss = Infinity;
    let lastLineEvalLoss = Infinity;

    const matchingTopLine = lastPosition.topLines?.find(
      (line) => line.moveUCI === position.move?.uci
    );
    if (matchingTopLine) {
      if (moveColour === 'white') {
        lastLineEvalLoss =
          previousEvaluation.value - matchingTopLine.evaluation.value;
      } else {
        lastLineEvalLoss =
          matchingTopLine.evaluation.value - previousEvaluation.value;
      }
    }

    if (lastPosition.cutoffEvaluation) {
      if (moveColour === 'white') {
        cutoffEvalLoss = lastPosition.cutoffEvaluation.value - evaluation.value;
      } else {
        cutoffEvalLoss = evaluation.value - lastPosition.cutoffEvaluation.value;
      }
    }

    if (moveColour === 'white') {
      evalLoss = previousEvaluation.value - evaluation.value;
    } else {
      evalLoss = evaluation.value - previousEvaluation.value;
    }

    evalLoss = Math.min(evalLoss, cutoffEvalLoss, lastLineEvalLoss);

    if (!secondTopMove) {
      position.classification = Classification.FORCED;
      continue;
    }

    const noMate = previousEvaluation.type === 'cp' && evaluation.type === 'cp';

    if (topMove.moveUCI === position.move?.uci) {
      position.classification = Classification.BEST;
    } else {
      if (noMate) {
        for (const classif of centipawnClassifications) {
          if (
            evalLoss <=
            getEvaluationLossThreshold(classif, previousEvaluation.value)
          ) {
            position.classification = classif;
            break;
          }
        }
      } else if (
        previousEvaluation.type === 'cp' &&
        evaluation.type === 'mate'
      ) {
        if (absoluteEvaluation > 0) {
          position.classification = Classification.BEST;
        } else if (absoluteEvaluation >= -2) {
          position.classification = Classification.BLUNDER;
        } else if (absoluteEvaluation >= -5) {
          position.classification = Classification.MISTAKE;
        } else {
          position.classification = Classification.INACCURACY;
        }
      } else if (
        previousEvaluation.type === 'mate' &&
        evaluation.type === 'cp'
      ) {
        if (previousAbsoluteEvaluation < 0 && absoluteEvaluation < 0) {
          position.classification = Classification.BEST;
        } else if (absoluteEvaluation >= 400) {
          position.classification = Classification.GOOD;
        } else if (absoluteEvaluation >= 150) {
          position.classification = Classification.INACCURACY;
        } else if (absoluteEvaluation >= -100) {
          position.classification = Classification.MISTAKE;
        } else {
          position.classification = Classification.BLUNDER;
        }
      } else if (
        previousEvaluation.type === 'mate' &&
        evaluation.type === 'mate'
      ) {
        if (previousAbsoluteEvaluation > 0) {
          if (absoluteEvaluation <= -4) {
            position.classification = Classification.MISTAKE;
          } else if (absoluteEvaluation < 0) {
            position.classification = Classification.BLUNDER;
          } else if (absoluteEvaluation < previousAbsoluteEvaluation) {
            position.classification = Classification.BEST;
          } else if (absoluteEvaluation <= previousAbsoluteEvaluation + 2) {
            position.classification = Classification.EXCELLENT;
          } else {
            position.classification = Classification.GOOD;
          }
        } else {
          if (absoluteEvaluation === previousAbsoluteEvaluation) {
            position.classification = Classification.BEST;
          } else {
            position.classification = Classification.GOOD;
          }
        }
      }
    }

    // Check for brilliant/great moves
    if (position.classification === Classification.BEST) {
      const winningAnyways =
        (absoluteSecondEvaluation >= 700 && topMove.evaluation.type === 'cp') ||
        (topMove.evaluation.type === 'mate' &&
          secondTopMove?.evaluation.type === 'mate');

      if (absoluteEvaluation >= 0 && !winningAnyways && position.move) {
        const lastBoard = new Chess(lastPosition.fen);
        const currentBoard = new Chess(position.fen);
        if (!lastBoard.isCheck()) {
          const lastPiece = lastBoard.get(
            position.move.uci.slice(2, 4) as Square
          ) || { type: 'm' };
          const sacrificedPieces: InfluencingPiece[] = [];

          for (const row of currentBoard.board()) {
            for (const piece of row) {
              if (!piece) continue;
              if (piece.color !== moveColour.charAt(0)) continue;
              if (piece.type === 'k' || piece.type === 'p') continue;
              if (pieceValues[lastPiece.type] >= pieceValues[piece.type])
                continue;

              if (
                isPieceHanging(lastPosition.fen, position.fen, piece.square)
              ) {
                position.classification = Classification.BRILLIANT;
                sacrificedPieces.push(piece);
              }
            }
          }

          let anyPieceViablyCapturable = false;
          const captureTestBoard = new Chess(position.fen);

          for (const piece of sacrificedPieces) {
            const attackers = getAttackers(position.fen, piece.square);

            for (const attacker of attackers) {
              for (const promotion of promotions) {
                try {
                  captureTestBoard.move({
                    from: attacker.square,
                    to: piece.square,
                    promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined
                  });

                  let attackerPinned = false;
                  for (const row of captureTestBoard.board()) {
                    for (const enemyPiece of row) {
                      if (!enemyPiece) continue;
                      if (
                        enemyPiece.color === captureTestBoard.turn() ||
                        enemyPiece.type === 'k'
                      )
                        continue;

                      if (
                        isPieceHanging(
                          position.fen,
                          captureTestBoard.fen(),
                          enemyPiece.square
                        ) &&
                        pieceValues[enemyPiece.type] >=
                          Math.max(
                            ...sacrificedPieces.map((s) => pieceValues[s.type])
                          )
                      ) {
                        attackerPinned = true;
                        break;
                      }
                    }
                    if (attackerPinned) break;
                  }

                  if (
                    !attackerPinned &&
                    !captureTestBoard.moves().some((m) => m.endsWith('#'))
                  ) {
                    anyPieceViablyCapturable = true;
                    break;
                  }

                  captureTestBoard.undo();
                } catch {
                  // Move not legal
                }
              }
              if (anyPieceViablyCapturable) break;
            }
            if (anyPieceViablyCapturable) break;
          }

          if (!anyPieceViablyCapturable) {
            position.classification = Classification.BEST;
          }
        }
      }

      if (
        noMate &&
        position.classification !== Classification.BRILLIANT &&
        lastPosition.classification === Classification.BLUNDER &&
        secondTopMove &&
        Math.abs(topMove.evaluation.value - secondTopMove.evaluation.value) >=
          150 &&
        position.move &&
        !isPieceHanging(
          lastPosition.fen,
          position.fen,
          position.move.uci.slice(2, 4) as Square
        )
      ) {
        position.classification = Classification.GREAT;
      }
    }

    if (
      position.classification === Classification.BLUNDER &&
      absoluteEvaluation >= 600
    ) {
      position.classification = Classification.GOOD;
    }

    if (
      position.classification === Classification.BLUNDER &&
      previousAbsoluteEvaluation <= -600
    ) {
      position.classification = Classification.GOOD;
    }

    position.classification = position.classification ?? Classification.BOOK;
  }

  // Generate opening names for named positions
  for (const position of positions) {
    const opening = openingsData.find((o: { name: string; fen: string }) =>
      position.fen.includes(o.fen)
    );
    position.opening = opening?.name;
  }

  // Apply book moves for named positions
  const positiveClassifs = ['excellent', 'good', 'best', 'great'];
  for (const position of positions.slice(1)) {
    if (
      position.opening ||
      positiveClassifs.includes(position.classification!)
    ) {
      position.classification = Classification.BOOK;
    } else {
      break;
    }
  }

  // Generate SAN moves from engine lines
  for (const position of positions) {
    for (const line of position.topLines || []) {
      if (line.evaluation.type === 'mate' && line.evaluation.value === 0)
        continue;

      const board = new Chess(position.fen);

      try {
        line.moveSAN = board.move({
          from: line.moveUCI.slice(0, 2),
          to: line.moveUCI.slice(2, 4),
          promotion: (line.moveUCI.slice(4) || undefined) as
            | 'q'
            | 'r'
            | 'b'
            | 'n'
            | undefined
        }).san;
      } catch {
        line.moveSAN = '';
      }
    }
  }

  // Calculate accuracies
  const accuracies = {
    white: { current: 0, maximum: 0 },
    black: { current: 0, maximum: 0 }
  };

  for (const position of positions.slice(1)) {
    const moveColour = position.fen.includes(' b ') ? 'white' : 'black';
    accuracies[moveColour].current +=
      classificationValues[position.classification!];
    accuracies[moveColour].maximum++;
  }

  return {
    accuracies: {
      white:
        accuracies.white.maximum > 0
          ? (accuracies.white.current / accuracies.white.maximum) * 100
          : 0,
      black:
        accuracies.black.maximum > 0
          ? (accuracies.black.current / accuracies.black.maximum) * 100
          : 0
    },
    positions: positions
  };
}

export default analyse;
