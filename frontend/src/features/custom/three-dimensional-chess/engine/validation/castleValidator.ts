import { Piece } from '@/features/custom/three-dimensional-chess/store/gameStore';
import { ChessWorld } from '../world/types';
import { TrackStates } from '../world/visibility';
import { isInCheck, isSquareAttacked } from './checkDetection';
import { fileToString } from '../world/coordinates';
import { getBoardController } from '../world/ownership';
import { debugLog } from '../../utils/debugFlags';

export type CastleType = 'kingside-ql' | 'kingside-kl' | 'queenside';

export interface CastleRequest {
  color: 'white' | 'black';
  castleType: CastleType;
}

export interface CastleValidation {
  valid: boolean;
  reason?: string;

  kingFrom?: { file: number; rank: number; level: string };
  kingTo?: { file: number; rank: number; level: string };
  rookFrom?: { file: number; rank: number; level: string };
  rookTo?: { file: number; rank: number; level: string };

  involvedBoards?: string[];
}

export interface CastleContext {
  color: 'white' | 'black';
  castleType: CastleType;
  pieces: Piece[];
  world: ChessWorld;
  trackStates: TrackStates;
  currentTurn: 'white' | 'black';
  attackBoardActivatedThisTurn: boolean;
  attackBoardStates?: Record<string, { activeInstanceId: string }>;
}

function getOpponentColor(color: 'white' | 'black'): 'white' | 'black' {
  return color === 'white' ? 'black' : 'white';
}

export function validateCastle(context: CastleContext): CastleValidation {
  const {
    color,
    castleType,
    pieces,
    world,
    attackBoardActivatedThisTurn,
    attackBoardStates
  } = context;

  if (attackBoardActivatedThisTurn) {
    return {
      valid: false,
      reason: 'Cannot castle after attack board activation'
    };
  }

  if (isInCheck(color, world, pieces, attackBoardStates, context.trackStates)) {
    return { valid: false, reason: 'Cannot castle while in check' };
  }

  if (castleType === 'kingside-ql' || castleType === 'kingside-kl') {
    return validateKingsideCastle(context);
  } else if (castleType === 'queenside') {
    return validateQueensideCastle(context);
  }

  return { valid: false, reason: 'Unknown castle type' };
}

function validateKingsideCastle(context: CastleContext): CastleValidation {
  const { color, castleType, pieces, world, trackStates, attackBoardStates } =
    context;

  const track: 'QL' | 'KL' = castleType === 'kingside-ql' ? 'QL' : 'KL';
  const pin = color === 'white' ? 1 : 6;
  const backRank = color === 'white' ? 0 : 9;

  debugLog(
    'castleValidation',
    `[validateKingsideCastle] Validating ${castleType} for ${color}`
  );
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] track=${track}, pin=${pin}, backRank=${backRank}`
  );

  const trackState = trackStates[track];
  const boardPin =
    color === 'white' ? trackState.whiteBoardPin : trackState.blackBoardPin;
  const rotation =
    color === 'white' ? trackState.whiteRotation : trackState.blackRotation;

  debugLog(
    'castleValidation',
    `[validateKingsideCastle] boardPin=${boardPin}, rotation=${rotation}`
  );

  if (boardPin !== pin) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: Board not at starting position`
    );
    return { valid: false, reason: `${track} board not at starting position` };
  }

  const boardId = color === 'white' ? `W${track}` : `B${track}`;
  debugLog('castleValidation', `[validateKingsideCastle] boardId=${boardId}`);

  const controller = getBoardController(boardId);
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] controller=${controller}`
  );

  if (controller !== color) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: Board not controlled by ${color}`
    );
    return {
      valid: false,
      reason: `${track} board not controlled by ${color}`
    };
  }

  const instanceId = `${track}${pin}:${rotation}`;

  // Find king and rook using board ID (pieces store 'WQL', 'WKL', etc., not instance IDs)
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] Looking for pieces with level=${boardId}, rank=${backRank}`
  );

  const king = pieces.find(
    (p) =>
      p.type === 'king' &&
      p.color === color &&
      p.level === boardId &&
      p.rank === backRank
  );

  const rook = pieces.find(
    (p) =>
      p.type === 'rook' &&
      p.color === color &&
      p.level === boardId &&
      p.rank === backRank
  );

  debugLog('castleValidation', `[validateKingsideCastle] Found king:`, king);
  debugLog('castleValidation', `[validateKingsideCastle] Found rook:`, rook);

  if (!king) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: King not found`
    );
    return { valid: false, reason: `King not found on ${instanceId}` };
  }

  if (!rook) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: Rook not found`
    );
    return { valid: false, reason: `Rook not found on ${instanceId}` };
  }

  if (king.hasMoved) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: King has moved`
    );
    return { valid: false, reason: 'King has already moved' };
  }

  if (rook.hasMoved) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: Rook has moved`
    );
    return { valid: false, reason: 'Rook has already moved' };
  }

  const kingSquareId = `${fileToString(king.file)}${king.rank}${instanceId}`;
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] King square ID: ${kingSquareId}`
  );

  const kingSquare = world.squares.get(kingSquareId);
  if (!kingSquare) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: King square not found`
    );
    return { valid: false, reason: 'King square not found' };
  }

  const kingAttacked = isSquareAttacked(
    kingSquare,
    getOpponentColor(color),
    world,
    pieces,
    attackBoardStates,
    trackStates
  );
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] King square attacked: ${kingAttacked}`
  );

  if (kingAttacked) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: King is in check`
    );
    return { valid: false, reason: 'King is in check' };
  }

  const rookSquareId = `${fileToString(rook.file)}${rook.rank}${instanceId}`;
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] Rook square ID (king destination): ${rookSquareId}`
  );

  const rookSquare = world.squares.get(rookSquareId);
  if (!rookSquare) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: Rook square not found`
    );
    return { valid: false, reason: 'Rook square not found' };
  }

  const destAttacked = isSquareAttacked(
    rookSquare,
    getOpponentColor(color),
    world,
    pieces,
    attackBoardStates,
    trackStates
  );
  debugLog(
    'castleValidation',
    `[validateKingsideCastle] King destination square attacked: ${destAttacked}`
  );

  if (destAttacked) {
    debugLog(
      'castleValidation',
      `[validateKingsideCastle] FAIL: King destination square is attacked`
    );
    return { valid: false, reason: 'King destination square is attacked' };
  }

  debugLog(
    'castleValidation',
    `[validateKingsideCastle] SUCCESS: All checks passed!`
  );

  return {
    valid: true,
    kingFrom: { file: king.file, rank: king.rank, level: king.level },
    kingTo: { file: rook.file, rank: rook.rank, level: rook.level },
    rookFrom: { file: rook.file, rank: rook.rank, level: rook.level },
    rookTo: { file: king.file, rank: king.rank, level: king.level },
    involvedBoards: [instanceId]
  };
}

function validateQueensideCastle(context: CastleContext): CastleValidation {
  const { color, pieces, world, trackStates, attackBoardStates } = context;

  const backRank = color === 'white' ? 0 : 9;
  const pin = color === 'white' ? 1 : 6;

  debugLog(
    'castleValidation',
    `[validateQueensideCastle] Validating queenside for ${color}`
  );
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] pin=${pin}, backRank=${backRank}`
  );

  const qlState = trackStates.QL;
  const klState = trackStates.KL;

  const qlPin =
    color === 'white' ? qlState.whiteBoardPin : qlState.blackBoardPin;
  const klPin =
    color === 'white' ? klState.whiteBoardPin : klState.blackBoardPin;

  debugLog(
    'castleValidation',
    `[validateQueensideCastle] qlPin=${qlPin}, klPin=${klPin}`
  );

  if (qlPin !== pin || klPin !== pin) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: Bridge boards not at starting positions`
    );
    return { valid: false, reason: 'Bridge boards not at starting positions' };
  }

  const qlBoardId = color === 'white' ? 'WQL' : 'BQL';
  const klBoardId = color === 'white' ? 'WKL' : 'BKL';

  const qlController = getBoardController(qlBoardId);
  const klController = getBoardController(klBoardId);

  debugLog(
    'castleValidation',
    `[validateQueensideCastle] qlController=${qlController}, klController=${klController}`
  );

  if (qlController !== color || klController !== color) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: Bridge boards not both controlled by player`
    );
    return {
      valid: false,
      reason: 'Bridge boards not both controlled by player'
    };
  }

  const qlRotation =
    color === 'white' ? qlState.whiteRotation : qlState.blackRotation;
  const klRotation =
    color === 'white' ? klState.whiteRotation : klState.blackRotation;
  const qlInstanceId = `QL${pin}:${qlRotation}`;
  const klInstanceId = `KL${pin}:${klRotation}`;

  debugLog(
    'castleValidation',
    `[validateQueensideCastle] qlInstanceId=${qlInstanceId}, klInstanceId=${klInstanceId}`
  );

  // Find king and rook using board IDs (pieces store 'WQL', 'WKL', 'BQL', 'BKL')
  const king = pieces.find(
    (p) =>
      p.type === 'king' &&
      p.color === color &&
      (p.level === qlBoardId || p.level === klBoardId) &&
      p.rank === backRank
  );

  const rook = pieces.find(
    (p) =>
      p.type === 'rook' &&
      p.color === color &&
      (p.level === qlBoardId || p.level === klBoardId) &&
      p.rank === backRank
  );

  debugLog('castleValidation', `[validateQueensideCastle] Found king:`, king);
  debugLog('castleValidation', `[validateQueensideCastle] Found rook:`, rook);

  if (!king) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King not found on bridge boards`
    );
    return { valid: false, reason: 'King not found on bridge boards' };
  }

  if (!rook) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: Rook not found on bridge boards`
    );
    return { valid: false, reason: 'Rook not found on bridge boards' };
  }

  if (king.level === rook.level) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King and rook on same board`
    );
    return {
      valid: false,
      reason:
        'King and rook must be on opposite bridge boards for queenside castle'
    };
  }

  if (king.hasMoved || rook.hasMoved) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King or rook has moved (king.hasMoved=${king.hasMoved}, rook.hasMoved=${rook.hasMoved})`
    );
    return { valid: false, reason: 'King or rook has already moved' };
  }

  // Check if path is clear between king and rook
  // QL attack boards have files 0-1 (z-a), KL attack boards have files 4-5 (d-e)
  // Main boards have files 1-4 (a-d), with files 2-3 (b-c) connecting QL to KL
  // For queenside castling, we need to check if files 2-3 (b-c) on the back rank are empty
  const minFile = Math.min(king.file, rook.file);
  const maxFile = Math.max(king.file, rook.file);

  debugLog(
    'castleValidation',
    `[validateQueensideCastle] Checking path from file ${minFile} to ${maxFile} on rank ${backRank}`
  );

  // Check each file between king and rook (exclusive)
  for (let file = minFile + 1; file < maxFile; file++) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] Checking file ${file}, rank ${backRank}`
    );

    // Check if any piece occupies this coordinate on any level
    const blockingPiece = pieces.find(
      (p) =>
        p.file === file &&
        p.rank === backRank &&
        p.type !== 'king' && // King and rook are allowed
        p.type !== 'rook'
    );

    if (blockingPiece) {
      debugLog(
        'castleValidation',
        `[validateQueensideCastle] FAIL: Path blocked by ${blockingPiece.color} ${blockingPiece.type} at file ${file}`
      );
      return {
        valid: false,
        reason: `Path blocked by ${blockingPiece.type} on back rank`
      };
    }
  }

  // Use instance IDs for square lookup, not board IDs
  const kingInstanceId = king.level === qlBoardId ? qlInstanceId : klInstanceId;
  const rookInstanceId = rook.level === qlBoardId ? qlInstanceId : klInstanceId;

  const kingSquareId = `${fileToString(king.file)}${king.rank}${kingInstanceId}`;
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] King square ID: ${kingSquareId}`
  );

  const kingSquare = world.squares.get(kingSquareId);

  if (!kingSquare) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King square not found`
    );
    return { valid: false, reason: 'King square not found' };
  }

  const kingAttacked = isSquareAttacked(
    kingSquare,
    getOpponentColor(color),
    world,
    pieces,
    attackBoardStates,
    trackStates
  );
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] King square attacked: ${kingAttacked}`
  );

  if (kingAttacked) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King is in check`
    );
    return { valid: false, reason: 'King is in check' };
  }

  // Queenside castling: King and rook exchange positions across boards
  // King goes to rook's file, rook goes to king's file
  const kingDestFile = rook.file;

  const kingDestSquareId = `${fileToString(kingDestFile)}${backRank}${rookInstanceId}`;
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] King destination square ID: ${kingDestSquareId}`
  );

  const kingDestSquare = world.squares.get(kingDestSquareId);

  if (!kingDestSquare) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King destination square not found`
    );
    return { valid: false, reason: 'King destination square not found' };
  }

  const destAttacked = isSquareAttacked(
    kingDestSquare,
    getOpponentColor(color),
    world,
    pieces,
    attackBoardStates,
    trackStates
  );
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] King destination square attacked: ${destAttacked}`
  );

  if (destAttacked) {
    debugLog(
      'castleValidation',
      `[validateQueensideCastle] FAIL: King destination square is attacked`
    );
    return { valid: false, reason: 'King destination square is attacked' };
  }

  debugLog(
    'castleValidation',
    `[validateQueensideCastle] SUCCESS: All checks passed!`
  );
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] King destination: file ${kingDestFile}, rank ${backRank}, level ${rook.level}`
  );
  debugLog(
    'castleValidation',
    `[validateQueensideCastle] Rook destination: file ${king.file}, rank ${backRank}, level ${king.level}`
  );

  return {
    valid: true,
    kingFrom: { file: king.file, rank: king.rank, level: king.level },
    kingTo: { file: kingDestFile, rank: backRank, level: rook.level },
    rookFrom: { file: rook.file, rank: rook.rank, level: rook.level },
    rookTo: { file: king.file, rank: king.rank, level: king.level },
    involvedBoards: [qlInstanceId, klInstanceId]
  };
}

export function getCastlingOptions(
  color: 'white' | 'black',
  pieces: Piece[],
  world: ChessWorld,
  trackStates: TrackStates,
  currentTurn: 'white' | 'black',
  attackBoardActivatedThisTurn: boolean,
  attackBoardStates?: Record<string, { activeInstanceId: string }>
): CastleType[] {
  if (color !== currentTurn) return [];
  if (attackBoardActivatedThisTurn) return [];

  const options: CastleType[] = [];

  const kingsideQL = validateCastle({
    color,
    castleType: 'kingside-ql',
    pieces,
    world,
    trackStates,
    currentTurn,
    attackBoardActivatedThisTurn,
    attackBoardStates
  });
  if (kingsideQL.valid) options.push('kingside-ql');

  const kingsideKL = validateCastle({
    color,
    castleType: 'kingside-kl',
    pieces,
    world,
    trackStates,
    currentTurn,
    attackBoardActivatedThisTurn,
    attackBoardStates
  });
  if (kingsideKL.valid) options.push('kingside-kl');

  const queenside = validateCastle({
    color,
    castleType: 'queenside',
    pieces,
    world,
    trackStates,
    currentTurn,
    attackBoardActivatedThisTurn,
    attackBoardStates
  });
  if (queenside.valid) options.push('queenside');

  return options;
}
