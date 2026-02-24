import { makeInstanceId } from './attackBoardAdjacency';
import {
  translatePassenger,
  rotatePassenger180,
  type ArrivalChoice
} from './coordinatesTransform';

import type { ChessWorld } from './types';
import type { Piece } from '@/features/custom/three-dimensional-chess/store/gameStore';
import { PIN_POSITIONS } from './pinPositions';
import { getPinLevel } from './attackBoardAdjacency';
import {
  ATTACK_BOARD_ADJACENCY,
  classifyDirection
} from './attackBoardAdjacency';
import { isInCheck } from '../validation/checkDetection';
import { debugLog } from '@/features/custom/three-dimensional-chess/utils/debugFlags';

export interface BoardMoveContext {
  boardId: string;
  fromPinId: string;
  toPinId: string;
  rotate: boolean;
  pieces: Piece[];
  world: ChessWorld;
  attackBoardPositions: Record<string, string>;
  attackBoardStates?: Record<string, { activeInstanceId: string }>;
  arrivalChoice?: ArrivalChoice;
  currentTurn?: 'white' | 'black';
}

export interface BoardMoveValidation {
  isValid: boolean;
  reason?: string;
}
export interface ActivationContext {
  boardId: string;
  fromPinId: string;
  toPinId: string;
  rotate: boolean;
  pieces: Piece[];
  world: ChessWorld;
  attackBoardPositions: Record<string, string>;
  attackBoardStates?: Record<string, { activeInstanceId: string }>;
  arrivalChoice?: ArrivalChoice;
  currentTurn?: 'white' | 'black';
}

export interface ActivationResult {
  updatedPieces: Piece[];
  updatedPositions: Record<string, string>;
  activeInstanceId: string;
}

export function validateActivation(
  context: ActivationContext
): BoardMoveValidation {
  return validateBoardMove({
    boardId: context.boardId,
    fromPinId: context.fromPinId,
    toPinId: context.toPinId,
    rotate: context.rotate,
    pieces: context.pieces,
    world: context.world,
    attackBoardPositions: context.attackBoardPositions,
    attackBoardStates: context.attackBoardStates,
    currentTurn: context.currentTurn,
    arrivalChoice: context.arrivalChoice
  });
}

export function executeActivation(
  context: ActivationContext
): ActivationResult {
  debugLog('worldMutation', '[executeActivation] START', {
    boardId: context.boardId,
    fromPinId: context.fromPinId,
    toPinId: context.toPinId,
    rotate: context.rotate,
    arrivalChoice: context.arrivalChoice
  });

  // Note: Multiple passengers are blocked by validatePassengerCount in validateActivation
  const base = executeBoardMove({
    boardId: context.boardId,
    fromPinId: context.fromPinId,
    toPinId: context.toPinId,
    rotate: context.rotate,
    pieces: context.pieces,
    world: context.world,
    attackBoardPositions: context.attackBoardPositions,
    arrivalChoice: context.arrivalChoice
  });

  debugLog('worldMutation', '[executeActivation] executeBoardMove returned:', {
    updatedPiecesCount: base.updatedPieces.length,
    updatedPositions: base.updatedPositions
  });

  // Log each remapped piece
  const remappedPassengers = base.updatedPieces.filter(
    (p) => p.level === context.boardId
  );
  debugLog(
    'worldMutation',
    '[executeActivation] Remapped passengers:',
    remappedPassengers.map((p) => ({
      type: p.type,
      color: p.color,
      level: p.level,
      file: p.file,
      rank: p.rank,
      squareId: `${['z', 'a', 'b', 'c', 'd', 'e'][p.file]}${p.rank}${p.level}`
    }))
  );

  const rotation: 0 | 180 =
    context.rotate ||
    context.world.boards.get(context.boardId)?.rotation === 180
      ? 180
      : 0;
  // Use destination pin's track for cross-track moves
  const track = context.toPinId.startsWith('QL') ? 'QL' : 'KL';
  const pinNum = Number(context.toPinId.slice(2));
  const activeInstanceId = makeInstanceId(
    track as 'QL' | 'KL',
    pinNum,
    rotation
  );

  debugLog('worldMutation', '[executeActivation] Computed activeInstanceId:', {
    track,
    pinNum,
    rotation,
    activeInstanceId
  });
  debugLog('worldMutation', '[executeActivation] END');

  return {
    updatedPieces: base.updatedPieces,
    updatedPositions: base.updatedPositions,
    activeInstanceId
  };
}

export function validateBoardMove(
  context: BoardMoveContext
): BoardMoveValidation {
  // Check if the player controlling the board matches the current turn
  const turnCheck = validateTurn(context);
  if (!turnCheck.isValid) return turnCheck;

  const passengerCountCheck = validatePassengerCount(context);
  if (!passengerCountCheck.isValid) return passengerCountCheck;

  const rotationCheck = validateRotation(context);
  if (!rotationCheck.isValid) return rotationCheck;

  if (context.fromPinId !== context.toPinId) {
    const adjacencyCheck = validateAdjacency(context);
    if (!adjacencyCheck.isValid) return adjacencyCheck;

    const occupancyCheck = validateOccupancy(context);
    if (!occupancyCheck.isValid) return occupancyCheck;

    const shadowCheck = validateVerticalShadow(context);
    if (!shadowCheck.isValid) return shadowCheck;
  }

  const kingSafetyCheck = validateKingSafety(context);
  if (!kingSafetyCheck.isValid) return kingSafetyCheck;

  return { isValid: true };
}

function validatePassengerCount(
  context: BoardMoveContext
): BoardMoveValidation {
  // Attack board movement is only allowed with 0 or 1 passengers
  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );
  if (passengerPieces.length > 1) {
    return {
      isValid: false,
      reason: 'Cannot move attack board with more than 1 piece on board'
    };
  }

  return { isValid: true };
}

function validateRotation(context: BoardMoveContext): BoardMoveValidation {
  if (!context.rotate) {
    return { isValid: true };
  }

  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );
  if (passengerPieces.length > 1) {
    return {
      isValid: false,
      reason: 'Cannot rotate with more than 1 piece on board'
    };
  }

  return { isValid: true };
}

function getBoardOwner(boardId: string): 'white' | 'black' {
  return boardId.startsWith('W') ? 'white' : 'black';
}

function getBoardController(
  boardId: string,
  fromPinId: string,
  pieces: Piece[]
): 'white' | 'black' {
  const passengerPieces = getPassengerPieces(boardId, fromPinId, pieces);

  if (passengerPieces.length > 0) {
    return passengerPieces[0].color;
  }

  return getBoardOwner(boardId);
}

function validateTurn(context: BoardMoveContext): BoardMoveValidation {
  // If currentTurn is not provided, skip validation (for backwards compatibility with tests)
  if (!context.currentTurn) {
    return { isValid: true };
  }

  const controller = getBoardController(
    context.boardId,
    context.fromPinId,
    context.pieces
  );

  if (controller !== context.currentTurn) {
    return {
      isValid: false,
      reason: `Cannot move this attack board - it is controlled by ${controller} but it is ${context.currentTurn}'s turn`
    };
  }

  return { isValid: true };
}

function validateAdjacency(context: BoardMoveContext): BoardMoveValidation {
  const adjacencyList = ATTACK_BOARD_ADJACENCY[context.fromPinId];

  if (!adjacencyList) {
    return { isValid: false, reason: 'Invalid source pin' };
  }

  const isExplicitlyAdjacent = adjacencyList.includes(context.toPinId);

  // Check if this is a valid "forward to next main board level" move
  const fromPin = PIN_POSITIONS[context.fromPinId];
  const toPin = PIN_POSITIONS[context.toPinId];
  const controller = getBoardController(
    context.boardId,
    context.fromPinId,
    context.pieces
  );

  let isForwardToNextLevel = false;
  if (!isExplicitlyAdjacent && fromPin && toPin) {
    // Same track (QL→QL or KL→KL)
    const sameTrack =
      context.fromPinId.startsWith('QL') === context.toPinId.startsWith('QL');

    if (sameTrack) {
      // Check if moving to next main board level
      const fromZ = fromPin.zHeight;
      const toZ = toPin.zHeight;
      const direction = classifyDirection(
        context.fromPinId,
        context.toPinId,
        controller
      );

      // Must be forward and to a different main board level
      if (direction === 'forward' && fromZ !== toZ) {
        // Check that we're moving to an adjacent main board level (not skipping)
        const zLevels = [0, 8, 16]; // White, Neutral, Black
        const fromZIndex = zLevels.indexOf(fromZ - 4); // Subtract ATTACK_OFFSET
        const toZIndex = zLevels.indexOf(toZ - 4);

        if (fromZIndex !== -1 && toZIndex !== -1) {
          const levelDiff =
            controller === 'white'
              ? toZIndex - fromZIndex // White moves up in Z
              : fromZIndex - toZIndex; // Black moves down in Z

          if (levelDiff === 1) {
            // Check rank proximity: pin centers must be within 4 ranks
            const fromCenterRank = fromPin.rankOffset + 0.5;
            const toCenterRank = toPin.rankOffset + 0.5;
            const rankDistance = Math.abs(toCenterRank - fromCenterRank);

            if (rankDistance <= 4) {
              isForwardToNextLevel = true;
            }
          }
        }
      }
    }
  }

  if (!isExplicitlyAdjacent && !isForwardToNextLevel) {
    return { isValid: false, reason: 'Destination pin is not adjacent' };
  }

  const direction = classifyDirection(
    context.fromPinId,
    context.toPinId,
    controller
  );

  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );
  const isOccupied = passengerPieces.length > 0;

  if (isOccupied) {
    if (direction === 'backward') {
      return { isValid: false, reason: 'Cannot move backward while occupied' };
    }
    if (direction === 'side') {
      const awayLevel = controller === 'white' ? 6 : 1;
      const fromLevel = getPinLevel(context.fromPinId);
      const toLevel = getPinLevel(context.toPinId);
      const distFromAway = Math.abs(fromLevel - awayLevel);
      const distToAway = Math.abs(toLevel - awayLevel);
      const sideIsBackward = distToAway > distFromAway;
      if (sideIsBackward) {
        return {
          isValid: false,
          reason: 'Cannot move backward while occupied'
        };
      }
    }
  }

  return { isValid: true };
}

function validateOccupancy(context: BoardMoveContext): BoardMoveValidation {
  const destinationOccupied = Object.entries(context.attackBoardPositions).some(
    ([boardId, pinId]) =>
      boardId !== context.boardId && pinId === context.toPinId
  );

  if (destinationOccupied) {
    return {
      isValid: false,
      reason: 'Destination pin is occupied by another attack board'
    };
  }

  return { isValid: true };
}

function validateVerticalShadow(
  context: BoardMoveContext
): BoardMoveValidation {
  // Skip vertical shadow validation if the board is empty
  // Empty boards have no pieces that could be blocked by vertical shadows
  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );
  if (passengerPieces.length === 0) {
    return { isValid: true };
  }

  const fromPin = PIN_POSITIONS[context.fromPinId];
  const toPin = PIN_POSITIONS[context.toPinId];

  if (!fromPin || !toPin) {
    return { isValid: false, reason: 'Invalid pin' };
  }

  const fileOffsetCells = toPin.fileOffset - fromPin.fileOffset;
  const rankOffsetCells = toPin.rankOffset - fromPin.rankOffset;

  debugLog(
    'worldMutation',
    `[validateVerticalShadow] Moving ${context.boardId} from ${context.fromPinId} to ${context.toPinId}`
  );
  debugLog(
    'worldMutation',
    `[validateVerticalShadow] Passengers:`,
    passengerPieces.map((p) => `${p.type}@(${p.file},${p.rank})`)
  );

  // Check only the specific squares where passenger pieces would land
  for (const passenger of passengerPieces) {
    let destinationSquare: { file: number; rank: number };

    // Apply rotation if specified
    const applyRotation = context.rotate || context.arrivalChoice === 'rot180';
    if (applyRotation) {
      // Calculate relative position within the source board
      const relativeFile = passenger.file - fromPin.fileOffset;
      const relativeRank = passenger.rank - fromPin.rankOffset;

      // Apply 180° rotation
      const rotated = rotatePassenger180(relativeFile, relativeRank);

      // Translate to destination board
      destinationSquare = {
        file: toPin.fileOffset + rotated.newRelativeFile,
        rank: toPin.rankOffset + rotated.newRelativeRank
      };
    } else {
      // Identity transformation (no rotation)
      destinationSquare = {
        file: passenger.file + fileOffsetCells,
        rank: passenger.rank + rankOffsetCells
      };
    }

    debugLog(
      'worldMutation',
      `[validateVerticalShadow] Passenger ${passenger.type} would move to (${destinationSquare.file}, ${destinationSquare.rank}) [rotation: ${applyRotation}]`
    );

    const blockingPiece = context.pieces.find((p) => {
      if (
        p.file !== destinationSquare.file ||
        p.rank !== destinationSquare.rank
      ) {
        return false;
      }

      debugLog(
        'worldMutation',
        `[validateVerticalShadow] Found piece at same (file,rank): ${p.type} at (${p.file}, ${p.rank}, ${p.level})`
      );

      if (p.type === 'knight') {
        return false;
      }

      if (p.level === context.boardId) {
        return false;
      }

      const pieceLevel = p.level;

      // Vertical shadow rule: any piece at the same (file, rank) blocks movement,
      // regardless of Z-height (per Meder Article 3.1c)
      // This applies to both main boards (W, N, B) and attack boards
      if (pieceLevel === 'W' || pieceLevel === 'N' || pieceLevel === 'B') {
        return true;
      }

      // For attack boards, also apply vertical shadow regardless of Z-height
      // Example: a piece at z4QL2 blocks movement to z4QL5
      const piecePinId = context.attackBoardPositions[pieceLevel];
      if (!piecePinId) {
        return true; // Conservative: block if we can't determine the pin
      }
      const piecePin = PIN_POSITIONS[piecePinId];
      if (!piecePin) {
        return true; // Conservative: block if we can't find the pin
      }

      // Vertical shadow applies regardless of Z-height
      return true;
    });

    if (blockingPiece) {
      const fileNames = ['z', 'a', 'b', 'c', 'd', 'e'];
      const fileName = fileNames[blockingPiece.file] || '?';
      const destFileName = fileNames[destinationSquare.file] || '?';
      return {
        isValid: false,
        reason: `Vertical shadow: ${passenger.type} cannot move to ${destFileName}${destinationSquare.rank}${context.boardId} - blocked by ${blockingPiece.type} at ${fileName}${blockingPiece.rank}${blockingPiece.level}`
      };
    }
  }

  return { isValid: true };
}

function validateKingSafety(context: BoardMoveContext): BoardMoveValidation {
  // Get pieces on the moving board
  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );

  // Find the king on the board (if any)
  const kingOnBoard = passengerPieces.find((p) => p.type === 'king');

  if (!kingOnBoard) {
    return { isValid: true }; // No king on board, no check to worry about
  }

  // Simulate the board move to get new piece positions
  const simulatedPieces = simulateBoardMove(context);

  // Create simulated attackBoardPositions with the new board position
  const simulatedAttackBoardPositions = {
    ...context.attackBoardPositions,
    [context.boardId]: context.toPinId
  };

  // Convert to attackBoardStates format with instance IDs for check detection
  const simulatedAttackBoardStates: Record<
    string,
    { activeInstanceId: string }
  > = {};

  // Start with existing attack board states if provided
  if (context.attackBoardStates) {
    Object.assign(simulatedAttackBoardStates, context.attackBoardStates);
  }

  // Update the moving board's state
  for (const [boardId, pinId] of Object.entries(
    simulatedAttackBoardPositions
  )) {
    if (boardId === context.boardId) {
      // For the moving board, determine rotation based on arrivalChoice
      const rotation = context.arrivalChoice === 'rot180' ? 180 : 0;

      // Parse track from pin ID (QL1 -> QL, KL6 -> KL)
      const track = pinId.startsWith('QL') ? 'QL' : 'KL';
      const pinNum = parseInt(pinId.substring(2));

      // Create instance ID using the helper function: "QL6:0" or "KL1:180"
      const instanceId = makeInstanceId(
        track as 'QL' | 'KL',
        pinNum,
        rotation as 0 | 180
      );

      simulatedAttackBoardStates[boardId] = {
        activeInstanceId: instanceId
      };
    } else if (!context.attackBoardStates) {
      // If attackBoardStates not provided, construct them with rotation 0
      const track = pinId.startsWith('QL') ? 'QL' : 'KL';
      const pinNum = parseInt(pinId.substring(2));
      const instanceId = makeInstanceId(track as 'QL' | 'KL', pinNum, 0);

      simulatedAttackBoardStates[boardId] = {
        activeInstanceId: instanceId
      };
    }
  }

  // Check if the king is in check in the new position
  const kingInCheck = isInCheck(
    kingOnBoard.color,
    context.world,
    simulatedPieces,
    simulatedAttackBoardStates // Now passing proper AttackBoardStates format
  );

  if (kingInCheck) {
    return {
      isValid: false,
      reason: 'Cannot move board: would put king in check'
    };
  }

  return { isValid: true };
}

function simulateBoardMove(context: BoardMoveContext): Piece[] {
  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );

  const fromPin = PIN_POSITIONS[context.fromPinId];
  const toPin = PIN_POSITIONS[context.toPinId];

  const fileOffsetCells = toPin.fileOffset - fromPin.fileOffset;
  const rankOffsetCells = toPin.rankOffset - fromPin.rankOffset;

  return context.pieces.map((piece) => {
    const isPassenger = passengerPieces.includes(piece);

    if (!isPassenger) {
      return piece;
    }

    let newFile = piece.file + fileOffsetCells;
    let newRank = piece.rank + rankOffsetCells;

    // Apply rotation if specified
    const applyRotation = context.rotate || context.arrivalChoice === 'rot180';
    if (applyRotation) {
      const relativeFile = piece.file - fromPin.fileOffset;
      const relativeRankCells = piece.rank - fromPin.rankOffset;

      const rotated = rotatePassenger180(relativeFile, relativeRankCells);
      const arrival = translatePassenger(
        toPin.fileOffset + rotated.newRelativeFile,
        toPin.rankOffset + rotated.newRelativeRank
      );

      newFile = arrival.file;
      newRank = arrival.rank;
    }

    return {
      ...piece,
      file: newFile,
      rank: newRank
    };
  });
}

function getPassengerPieces(
  boardId: string,
  pinId: string,
  pieces: Piece[]
): Piece[] {
  const pin = PIN_POSITIONS[pinId];
  if (!pin) return [];

  const boardSquares = getBoardSquaresForBoardAtPin(boardId, pinId);

  return pieces.filter((piece) => {
    const pieceSquareId = `${piece.file}-${piece.rank}`;
    const isOnBoardSquare = boardSquares.some(
      (sq) => `${sq.file}-${sq.rank}` === pieceSquareId
    );
    const isOnThisBoard = piece.level === boardId;
    return isOnBoardSquare && isOnThisBoard;
  });
}

function getBoardSquaresForBoardAtPin(
  boardId: string,
  pinId: string
): Array<{ file: number; rank: number }> {
  const pin = PIN_POSITIONS[pinId];
  if (!pin) return [];

  const isQueenLine = pinId.startsWith('QL');
  const baseFile = isQueenLine ? 0 : 4;
  const baseRank = pin.rankOffset;

  return [
    { file: baseFile, rank: baseRank },
    { file: baseFile + 1, rank: baseRank },
    { file: baseFile, rank: baseRank + 1 },
    { file: baseFile + 1, rank: baseRank + 1 }
  ];
}

export interface BoardMoveResult {
  updatedPieces: Piece[];
  updatedPositions: Record<string, string>;
}

export function executeBoardMove(context: BoardMoveContext): BoardMoveResult {
  const updatedPositions = {
    ...context.attackBoardPositions,
    [context.boardId]: context.toPinId
  };

  const passengerPieces = getPassengerPieces(
    context.boardId,
    context.fromPinId,
    context.pieces
  );

  debugLog(
    'worldMutation',
    '[executeBoardMove] Passenger count:',
    passengerPieces.length
  );
  debugLog(
    'worldMutation',
    '[executeBoardMove] Passenger IDs:',
    passengerPieces.map((p) => `${p.type}@${p.file},${p.rank},${p.level}`)
  );

  const fromPin = PIN_POSITIONS[context.fromPinId];
  const toPin = PIN_POSITIONS[context.toPinId];

  const fileOffsetCells = toPin.fileOffset - fromPin.fileOffset;
  const rankOffsetCells = toPin.rankOffset - fromPin.rankOffset;

  const updatedPieces = context.pieces.map((piece) => {
    const isPassenger = passengerPieces.includes(piece);

    if (!isPassenger) {
      return piece;
    }

    let newFile = piece.file + fileOffsetCells;
    let newRank = piece.rank + rankOffsetCells;

    const applyArrivalRotation =
      context.rotate || context.arrivalChoice === 'rot180';
    if (applyArrivalRotation) {
      const relativeFile = piece.file - fromPin.fileOffset;
      const relativeRankCells = piece.rank - fromPin.rankOffset;

      const rotated = rotatePassenger180(relativeFile, relativeRankCells);
      const arrival = translatePassenger(
        toPin.fileOffset + rotated.newRelativeFile,
        toPin.rankOffset + rotated.newRelativeRank
      );

      newFile = arrival.file;
      newRank = arrival.rank;
    }

    debugLog('worldMutation', '[executeBoardMove] Remapping passenger:', {
      type: piece.type,
      from: `${piece.file},${piece.rank},${piece.level}`,
      to: `${newFile},${newRank},${piece.level}`
    });

    const updatedPiece = {
      ...piece,
      file: newFile,
      rank: newRank,
      hasMoved: true
    };

    if (piece.type === 'pawn') {
      updatedPiece.movedByAB = true;
    }

    return updatedPiece;
  });

  return {
    updatedPieces,
    updatedPositions
  };
}
