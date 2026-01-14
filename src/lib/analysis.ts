import { Chess, Square } from 'chess.js';
import type { Position } from '@/types/Position';
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
  mistake: 0.15,
  inaccuracy: 0.35,
  good: 0.55,
  excellent: 0.85,
  best: 1,
  great: 1,
  brilliant: 1,
  book: 0.9, // Opening theory - slightly less than perfect
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

  // Scaling factor: allow slightly more leeway in winning/losing positions
  // At eval 0: factor = 1.0, at eval 500: factor = 1.25, at eval 1000: factor = 1.5
  const scaleFactor = 1 + absPrevEval / 2000;

  // Base thresholds (stricter, chess.com-style)
  let baseThreshold = 0;

  switch (classif) {
    case Classification.BEST:
      // Must match top move or be within 5cp
      baseThreshold = 5;
      break;
    case Classification.EXCELLENT:
      // Very good move, minor inaccuracy (5-15cp loss)
      baseThreshold = 15;
      break;
    case Classification.GOOD:
      // Decent move (15-35cp loss)
      baseThreshold = 35;
      break;
    case Classification.INACCURACY:
      // Noticeable inaccuracy (35-70cp loss)
      baseThreshold = 70;
      break;
    case Classification.MISTAKE:
      // Significant mistake (70-150cp loss)
      baseThreshold = 150;
      break;
    default:
      // BLUNDER: anything worse than 150cp loss
      return Infinity;
  }

  return baseThreshold * scaleFactor;
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
          // Finding mate for yourself
          position.classification = Classification.BEST;
        } else if (absoluteEvaluation >= -3) {
          // Allowing mate in 1-3 is a blunder
          position.classification = Classification.BLUNDER;
        } else if (absoluteEvaluation >= -8) {
          // Allowing mate in 4-8 is a mistake
          position.classification = Classification.MISTAKE;
        } else {
          // Allowing mate in 9+ is still an inaccuracy (it's far off)
          position.classification = Classification.INACCURACY;
        }
      } else if (
        previousEvaluation.type === 'mate' &&
        evaluation.type === 'cp'
      ) {
        if (previousAbsoluteEvaluation < 0 && absoluteEvaluation < 0) {
          // You were getting mated and still losing - escaping mate is good
          position.classification = Classification.BEST;
        } else if (previousAbsoluteEvaluation < 0) {
          // You escaped getting mated and are now better
          position.classification = Classification.BEST;
        } else if (absoluteEvaluation >= 600) {
          // Had mate, still completely winning - inaccuracy at worst
          position.classification = Classification.INACCURACY;
        } else if (absoluteEvaluation >= 300) {
          // Had mate, gave up significant advantage - mistake
          position.classification = Classification.MISTAKE;
        } else if (absoluteEvaluation >= 0) {
          // Had mate, now only slightly better or equal - blunder
          position.classification = Classification.BLUNDER;
        } else {
          // Had mate, now losing - major blunder
          position.classification = Classification.BLUNDER;
        }
      } else if (
        previousEvaluation.type === 'mate' &&
        evaluation.type === 'mate'
      ) {
        if (previousAbsoluteEvaluation > 0) {
          // You had mate, what happened?
          if (absoluteEvaluation < 0) {
            // Went from giving mate to getting mated - always blunder
            position.classification = Classification.BLUNDER;
          } else if (absoluteEvaluation < previousAbsoluteEvaluation) {
            // Shortened the mate - best
            position.classification = Classification.BEST;
          } else if (absoluteEvaluation === previousAbsoluteEvaluation) {
            // Same mate distance - excellent
            position.classification = Classification.EXCELLENT;
          } else if (absoluteEvaluation <= previousAbsoluteEvaluation + 2) {
            // Extended mate by 1-2 moves - good
            position.classification = Classification.GOOD;
          } else if (absoluteEvaluation <= previousAbsoluteEvaluation + 5) {
            // Extended mate by 3-5 moves - inaccuracy
            position.classification = Classification.INACCURACY;
          } else {
            // Extended mate significantly - mistake
            position.classification = Classification.MISTAKE;
          }
        } else {
          // You were getting mated
          if (absoluteEvaluation === previousAbsoluteEvaluation) {
            position.classification = Classification.BEST;
          } else if (absoluteEvaluation > previousAbsoluteEvaluation) {
            // Delayed getting mated - good
            position.classification = Classification.GOOD;
          } else {
            // Let them mate faster - mistake
            position.classification = Classification.MISTAKE;
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

    // Only downgrade blunder to mistake if position is completely won/lost
    // (>= 1000cp or <= -1000cp) to maintain accuracy
    if (
      position.classification === Classification.BLUNDER &&
      absoluteEvaluation >= 1000
    ) {
      position.classification = Classification.MISTAKE;
    }

    if (
      position.classification === Classification.BLUNDER &&
      previousAbsoluteEvaluation <= -1000
    ) {
      position.classification = Classification.MISTAKE;
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

  // Apply book moves for named opening positions only
  // Original also checked for cloud-evaluated positions, but we only use local evaluation
  for (const position of positions.slice(1)) {
    if (position.opening) {
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
