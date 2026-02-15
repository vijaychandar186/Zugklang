import { Piece } from './Piece';
import type { PieceType, Team } from '../types/core';
import { BOARD_CONFIG } from '../config/board';

/** Piece layout for the back rank (rook through rook) */
const BACK_RANK_LAYOUT: readonly PieceType[] = [
  'R',
  'N',
  'B',
  'Q',
  'K',
  'B',
  'N',
  'R'
] as const;

/** Back rank layout mirrored — K and Q swap positions (for Yellow/Green) */
const BACK_RANK_LAYOUT_MIRRORED: readonly PieceType[] = [
  'R',
  'N',
  'B',
  'K',
  'Q',
  'B',
  'N',
  'R'
] as const;

/** Number of pieces per team along the back rank */
const PIECES_PER_RANK = 8;

/** Starting file/rank offset for side-aligned pieces (skip 3 corner squares) */
const RANK_START_OFFSET = 3;

interface TeamSetup {
  readonly team: Team;
  readonly layout: readonly PieceType[];
  readonly createBackRank: (index: number) => { x: number; y: number };
  readonly createPawnRank: (index: number) => { x: number; y: number };
}

const TEAM_SETUPS: readonly TeamSetup[] = [
  {
    team: 'r',
    layout: BACK_RANK_LAYOUT,
    createBackRank: (i) => ({ x: i + RANK_START_OFFSET, y: 0 }),
    createPawnRank: (i) => ({ x: i + RANK_START_OFFSET, y: 1 })
  },
  {
    team: 'y',
    layout: BACK_RANK_LAYOUT_MIRRORED,
    createBackRank: (i) => ({
      x: i + RANK_START_OFFSET,
      y: BOARD_CONFIG.maxIndex
    }),
    createPawnRank: (i) => ({
      x: i + RANK_START_OFFSET,
      y: BOARD_CONFIG.maxIndex - 1
    })
  },
  {
    team: 'b',
    layout: BACK_RANK_LAYOUT,
    createBackRank: (i) => ({ x: 0, y: i + RANK_START_OFFSET }),
    createPawnRank: (i) => ({ x: 1, y: i + RANK_START_OFFSET })
  },
  {
    team: 'g',
    layout: BACK_RANK_LAYOUT_MIRRORED,
    createBackRank: (i) => ({
      x: BOARD_CONFIG.maxIndex,
      y: i + RANK_START_OFFSET
    }),
    createPawnRank: (i) => ({
      x: BOARD_CONFIG.maxIndex - 1,
      y: i + RANK_START_OFFSET
    })
  }
];

/** Create the initial 64 pieces for a new four-player game */
export function createInitialPieces(): Piece[] {
  const pieces: Piece[] = [];

  for (const setup of TEAM_SETUPS) {
    for (let i = 0; i < PIECES_PER_RANK; i++) {
      const { x, y } = setup.createBackRank(i);
      pieces.push(new Piece(x, y, setup.layout[i], setup.team));
    }
    for (let i = 0; i < PIECES_PER_RANK; i++) {
      const { x, y } = setup.createPawnRank(i);
      pieces.push(new Piece(x, y, 'P', setup.team));
    }
  }

  return pieces;
}
