import { Chess, Square } from 'chess.js';
import type { Position } from '@/lib/types/Position';

interface GameReport {
  accuracies: {
    white: number;
    black: number;
  };
  positions: Position[];
}
import {
  Classification,
  centipawnClassifications,
  classificationValues,
  getEvaluationLossThreshold,
  getPositiveClassifications
} from './classification';
import {
  InfluencingPiece,
  getAttackers,
  isPieceHanging,
  pieceValues,
  promotions
} from './board';

// Import openings if available, otherwise use empty array
let openings: { fen: string; name: string }[] = [];

/**
 * Set the openings database for position detection.
 */
export function setOpenings(
  openingsData: { fen: string; name: string }[]
): void {
  openings = openingsData;
}

/**
 * Analyse a list of evaluated positions and generate classifications.
 */
export async function analysePositions(
  positions: Position[]
): Promise<GameReport> {
  // Generate classifications for each position
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

    // If there are no legal moves in this position, game is in terminal state
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

    // Calculate evaluation loss as a result of this move
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

    // If this move was the only legal one, apply forced
    if (!secondTopMove) {
      position.classification = Classification.FORCED;
      continue;
    }

    const noMate = previousEvaluation.type === 'cp' && evaluation.type === 'cp';

    // If it is the top line, disregard other detections and give best
    if (topMove.moveUCI === position.move?.uci) {
      position.classification = Classification.BEST;
    } else {
      // If no mate on the board last move and still no mate
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
      }

      // If no mate last move but you blundered a mate
      else if (previousEvaluation.type === 'cp' && evaluation.type === 'mate') {
        if (absoluteEvaluation > 0) {
          position.classification = Classification.BEST;
        } else if (absoluteEvaluation >= -2) {
          position.classification = Classification.BLUNDER;
        } else if (absoluteEvaluation >= -5) {
          position.classification = Classification.MISTAKE;
        } else {
          position.classification = Classification.INACCURACY;
        }
      }

      // If mate last move and there is no longer a mate
      else if (previousEvaluation.type === 'mate' && evaluation.type === 'cp') {
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
      }

      // If mate last move and forced mate still exists
      else if (
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

    // If current verdict is best, check for possible brilliancy
    if (position.classification === Classification.BEST) {
      // Test for brilliant move classification
      // Must be winning for the side that played the brilliancy
      const winningAnyways =
        (absoluteSecondEvaluation >= 700 && topMove.evaluation.type === 'cp') ||
        (topMove.evaluation.type === 'mate' &&
          secondTopMove?.evaluation.type === 'mate');

      if (absoluteEvaluation >= 0 && !winningAnyways) {
        const lastBoard = new Chess(lastPosition.fen);
        const currentBoard = new Chess(position.fen);
        if (lastBoard.isCheck()) continue;

        const lastPiece = lastBoard.get(
          position.move!.uci.slice(2, 4) as Square
        ) || { type: 'm' };

        const sacrificedPieces: InfluencingPiece[] = [];
        for (const row of currentBoard.board()) {
          for (const piece of row) {
            if (!piece) continue;
            if (piece.color !== moveColour.charAt(0)) continue;
            if (piece.type === 'k' || piece.type === 'p') continue;

            // If the piece just captured is of higher or equal value than the candidate
            // hanging piece, not hanging, better trade happening somewhere else
            if (pieceValues[lastPiece.type] >= pieceValues[piece.type]) {
              continue;
            }

            // If the piece is otherwise hanging, brilliant
            if (isPieceHanging(lastPosition.fen, position.fen, piece.square)) {
              position.classification = Classification.BRILLIANT;
              sacrificedPieces.push(piece);
            }
          }
        }

        // If all captures of all of your hanging pieces would result in an enemy piece
        // of greater or equal value also being hanging OR mate in 1, not brilliant
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

                // If the capture of the piece with the current attacker leads to
                // a piece of greater or equal value being hung (if attacker is pinned)
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
                          ...sacrificedPieces.map(
                            (sack) => pieceValues[sack.type]
                          )
                        )
                    ) {
                      attackerPinned = true;
                      break;
                    }
                  }
                  if (attackerPinned) break;
                }

                // If the capture of the piece leads to mate in 1
                if (
                  !attackerPinned &&
                  !captureTestBoard.moves().some((move) => move.endsWith('#'))
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

      // Test for great move classification
      if (
        noMate &&
        position.classification !== Classification.BRILLIANT &&
        lastPosition.classification === Classification.BLUNDER &&
        Math.abs(topMove.evaluation.value - secondTopMove!.evaluation.value) >=
          150 &&
        !isPieceHanging(
          lastPosition.fen,
          position.fen,
          position.move!.uci.slice(2, 4) as Square
        )
      ) {
        position.classification = Classification.GREAT;
      }
    }

    // Do not allow blunder if move still completely winning
    if (
      position.classification === Classification.BLUNDER &&
      absoluteEvaluation >= 600
    ) {
      position.classification = Classification.GOOD;
    }

    // Do not allow blunder if you were already in a completely lost position
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
    const opening = openings.find((o) => position.fen.includes(o.fen));
    position.opening = opening?.name;
  }

  // Apply book moves for cloud evaluations and named positions
  const positiveClassifs = getPositiveClassifications();
  for (const position of positions.slice(1)) {
    if (
      (position.worker === 'cloud' &&
        positiveClassifs.includes(position.classification!)) ||
      position.opening
    ) {
      position.classification = Classification.BOOK;
    } else {
      break;
    }
  }

  // Generate SAN moves from all engine lines
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

  // Calculate computer accuracy percentages
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

  // Return complete report
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

/**
 * Calculate evaluation bar percentage from centipawn value.
 * Uses a simpler linear formula clamped between 5-95%.
 */
export function calcEvalBarPercentage(
  evalValue: { type: 'cp' | 'mate'; value: number } | null
): number {
  if (!evalValue) return 50;

  if (evalValue.type === 'cp') {
    return Math.max(5, Math.min(95, 50 - evalValue.value / 10));
  } else {
    // Mate
    return evalValue.value > 0 ? 5 : evalValue.value < 0 ? 95 : 50;
  }
}

/**
 * Format evaluation value for display.
 */
export function formatEvaluation(
  evalValue: { type: 'cp' | 'mate'; value: number } | null
): string {
  if (!evalValue) return '0.0';

  if (evalValue.type === 'mate') {
    return evalValue.value === 0 ? '0' : `M${Math.abs(evalValue.value)}`;
  }
  return Math.abs(evalValue.value / 100).toFixed(1);
}
