import { Chess, Square } from '@/lib/chess';
import type { Position } from '@/types/Position';
import type { Classification } from '@/types/classification';
import { CLASSIFICATION_VALUES } from '@/types/classification';
import type { GameReport } from '@/features/game-review/types';
import openingsData from '@/resources/openings.json';
import {
  getWinPercentageFromEval,
  computeEstimatedEloFromPositions,
  type Evaluation
} from './winPercentage';

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

function classifyByWinPercentage(
  prevEval: Evaluation,
  currEval: Evaluation,
  isWhiteMove: boolean
): Classification {
  const prevWinPct = getWinPercentageFromEval(prevEval);
  const currWinPct = getWinPercentageFromEval(currEval);
  const winPctDiff = (currWinPct - prevWinPct) * (isWhiteMove ? 1 : -1);

  if (winPctDiff < -20) return 'blunder';
  if (winPctDiff < -10) return 'mistake';
  if (winPctDiff < -7) return 'miss';
  if (winPctDiff < -5) return 'inaccuracy';
  if (winPctDiff < -2) return 'good';
  return 'excellent';
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

async function analyse(positions: Position[]): Promise<GameReport> {
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
      position.classification = 'forced';
      continue;
    }

    const noMate = previousEvaluation.type === 'cp' && evaluation.type === 'cp';

    if (topMove.moveUCI === position.move?.uci) {
      position.classification = 'best';
    } else {
      const isWhiteMove = moveColour === 'white';
      position.classification = classifyByWinPercentage(
        previousEvaluation,
        evaluation,
        isWhiteMove
      );

      if (previousEvaluation.type === 'cp' && evaluation.type === 'mate') {
        if (absoluteEvaluation > 0) {
          position.classification = 'best';
        } else if (absoluteEvaluation >= -3) {
          position.classification = 'blunder';
        } else if (absoluteEvaluation >= -8) {
          position.classification = 'mistake';
        } else {
          position.classification = 'inaccuracy';
        }
      } else if (
        previousEvaluation.type === 'mate' &&
        evaluation.type === 'cp'
      ) {
        if (previousAbsoluteEvaluation < 0 && absoluteEvaluation < 0) {
          position.classification = 'best';
        } else if (previousAbsoluteEvaluation < 0) {
          position.classification = 'best';
        } else if (absoluteEvaluation >= 600) {
          position.classification = 'inaccuracy';
        } else if (absoluteEvaluation >= 300) {
          position.classification = 'mistake';
        } else if (absoluteEvaluation >= 0) {
          position.classification = 'blunder';
        } else {
          position.classification = 'blunder';
        }
      } else if (
        previousEvaluation.type === 'mate' &&
        evaluation.type === 'mate'
      ) {
        if (previousAbsoluteEvaluation > 0) {
          if (absoluteEvaluation < 0) {
            position.classification = 'blunder';
          } else if (absoluteEvaluation < previousAbsoluteEvaluation) {
            position.classification = 'best';
          } else if (absoluteEvaluation === previousAbsoluteEvaluation) {
            position.classification = 'excellent';
          } else if (absoluteEvaluation <= previousAbsoluteEvaluation + 2) {
            position.classification = 'good';
          } else if (absoluteEvaluation <= previousAbsoluteEvaluation + 5) {
            position.classification = 'inaccuracy';
          } else {
            position.classification = 'mistake';
          }
        } else {
          if (absoluteEvaluation === previousAbsoluteEvaluation) {
            position.classification = 'best';
          } else if (absoluteEvaluation > previousAbsoluteEvaluation) {
            position.classification = 'good';
          } else {
            position.classification = 'mistake';
          }
        }
      }
    }

    if (position.classification === 'best') {
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
                position.classification = 'brilliant';
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
                  continue;
                }
              }
              if (anyPieceViablyCapturable) break;
            }
            if (anyPieceViablyCapturable) break;
          }

          if (!anyPieceViablyCapturable) {
            position.classification = 'best';
          }
        }
      }

      if (
        noMate &&
        position.classification !== 'brilliant' &&
        lastPosition.classification === 'blunder' &&
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
        position.classification = 'great';
      }
    }

    if (position.classification === 'blunder' && absoluteEvaluation >= 1000) {
      position.classification = 'mistake';
    }

    if (
      position.classification === 'blunder' &&
      previousAbsoluteEvaluation <= -1000
    ) {
      position.classification = 'mistake';
    }

    position.classification = position.classification ?? 'book';
  }

  interface OpeningData {
    name: string;
    fen: string;
  }

  for (const position of positions) {
    const opening = (openingsData as OpeningData[]).find((o) =>
      position.fen.includes(o.fen)
    );
    position.opening = opening?.name;
  }

  for (const position of positions.slice(1)) {
    if (position.opening) {
      position.classification = 'book';
    } else {
      break;
    }
  }

  for (const position of positions) {
    for (const line of position.topLines || []) {
      if (!line.moveUCI || line.moveUCI.length < 4) continue;
      if (line.evaluation.type === 'mate' && line.evaluation.value === 0)
        continue;

      const board = new Chess(position.fen);

      try {
        const move = board.move({
          from: line.moveUCI.slice(0, 2),
          to: line.moveUCI.slice(2, 4),
          promotion: (line.moveUCI.slice(4) || undefined) as
            | 'q'
            | 'r'
            | 'b'
            | 'n'
            | undefined
        });
        if (!move) throw new Error('Invalid move');
        line.moveSAN = move.san;
      } catch {
        line.moveSAN = '';
      }
    }
  }

  const accuracies = {
    white: { current: 0, maximum: 0 },
    black: { current: 0, maximum: 0 }
  };

  for (const position of positions.slice(1)) {
    const moveColour = position.fen.includes(' b ') ? 'white' : 'black';
    const classification = position.classification as Classification;
    accuracies[moveColour].current +=
      CLASSIFICATION_VALUES[classification] ?? 0;
    accuracies[moveColour].maximum++;
  }

  const estimatedElo = computeEstimatedEloFromPositions(positions);

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
    estimatedElo,
    positions: positions
  };
}

export default analyse;
