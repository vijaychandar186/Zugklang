import { describe, it, expect } from 'vitest';
import {
  indexToSquare,
  squareToIndex,
  isLightSquare,
  getOppositeColor,
  formatTime,
  getSquaresBetween,
  fenToPosition,
  createArrow,
  createArrowsFromUCI,
  PIECE_UNICODE,
  getFileFromIndex,
  getRankFromIndex
} from '@/features/chess/utils/chessboard';
import { STARTING_FEN } from '@/features/chess/config/constants';

describe('indexToSquare', () => {
  it('0 → a8 (top-left)', () => {
    expect(indexToSquare(0)).toBe('a8');
  });

  it('7 → h8', () => {
    expect(indexToSquare(7)).toBe('h8');
  });

  it('56 → a1 (bottom-left)', () => {
    expect(indexToSquare(56)).toBe('a1');
  });

  it('63 → h1', () => {
    expect(indexToSquare(63)).toBe('h1');
  });
});

describe('squareToIndex', () => {
  it('a8 → 0', () => {
    expect(squareToIndex('a8')).toBe(0);
  });

  it('h1 → 63', () => {
    expect(squareToIndex('h1')).toBe(63);
  });

  it('roundtrip: index → square → index', () => {
    for (let i = 0; i < 64; i++) {
      expect(squareToIndex(indexToSquare(i))).toBe(i);
    }
  });
});

describe('isLightSquare', () => {
  it('a1 is dark', () => {
    expect(isLightSquare('a1')).toBe(false);
  });

  it('b1 is light', () => {
    expect(isLightSquare('b1')).toBe(true);
  });

  it('a2 is light', () => {
    expect(isLightSquare('a2')).toBe(true);
  });

  it('h8 is dark', () => {
    // h=7, rank-1=7, (7+7)%2=0 → dark
    expect(isLightSquare('h8')).toBe(false);
  });

  it('a8 is light', () => {
    // a=0, rank-1=7, (0+7)%2=1 → light
    expect(isLightSquare('a8')).toBe(true);
  });
});

describe('getOppositeColor', () => {
  it('white → black', () => {
    expect(getOppositeColor('white')).toBe('black');
  });

  it('black → white', () => {
    expect(getOppositeColor('black')).toBe('white');
  });
});

describe('formatTime', () => {
  it('0 seconds → 0:00', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('60 seconds → 1:00', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('90 seconds → 1:30', () => {
    expect(formatTime(90)).toBe('1:30');
  });

  it('3600 seconds → 1:00:00', () => {
    expect(formatTime(3600)).toBe('1:00:00');
  });

  it('3661 seconds → 1:01:01', () => {
    expect(formatTime(3661)).toBe('1:01:01');
  });

  it('59 seconds → 0:59', () => {
    expect(formatTime(59)).toBe('0:59');
  });
});

describe('getSquaresBetween', () => {
  it('returns empty array for non-line squares', () => {
    expect(getSquaresBetween('a1', 'b3')).toEqual([]);
  });

  it('returns intermediate squares along a file', () => {
    expect(getSquaresBetween('a1', 'a4')).toEqual(['a2', 'a3']);
  });

  it('returns intermediate squares along a rank', () => {
    expect(getSquaresBetween('a1', 'd1')).toEqual(['b1', 'c1']);
  });

  it('returns intermediate squares along a diagonal', () => {
    expect(getSquaresBetween('a1', 'd4')).toEqual(['b2', 'c3']);
  });

  it('returns empty array for adjacent squares', () => {
    expect(getSquaresBetween('a1', 'b1')).toEqual([]);
    expect(getSquaresBetween('a1', 'a2')).toEqual([]);
  });

  it('works in reverse direction', () => {
    expect(getSquaresBetween('a4', 'a1')).toEqual(['a3', 'a2']);
  });
});

describe('fenToPosition', () => {
  it('places white king on e1 in starting position', () => {
    const pos = fenToPosition(STARTING_FEN);
    expect(pos['e1']).toEqual({ pieceType: 'wK' });
  });

  it('places black king on e8 in starting position', () => {
    const pos = fenToPosition(STARTING_FEN);
    expect(pos['e8']).toEqual({ pieceType: 'bK' });
  });

  it('has 32 pieces in the starting position', () => {
    const pos = fenToPosition(STARTING_FEN);
    expect(Object.keys(pos).length).toBe(32);
  });

  it('empty squares are not included', () => {
    const pos = fenToPosition(STARTING_FEN);
    expect(pos['e4']).toBeUndefined();
  });
});

describe('createArrow', () => {
  it('creates an arrow with from/to/color', () => {
    const arrow = createArrow('e2', 'e4', '#ff0000');
    expect(arrow).toEqual({
      startSquare: 'e2',
      endSquare: 'e4',
      color: '#ff0000'
    });
  });

  it('uses default gold color when not specified', () => {
    const arrow = createArrow('e2', 'e4');
    expect(arrow.color).toBe('#FFD700');
  });
});

describe('createArrowsFromUCI', () => {
  it('converts UCI moves to arrows', () => {
    const arrows = createArrowsFromUCI(['e2e4', 'd2d4']);
    expect(arrows).toHaveLength(2);
    expect(arrows[0]).toEqual({
      startSquare: 'e2',
      endSquare: 'e4',
      color: '#FFD700'
    });
    expect(arrows[1]).toEqual({
      startSquare: 'd2',
      endSquare: 'd4',
      color: '#FFD700'
    });
  });

  it('returns empty array for empty input', () => {
    expect(createArrowsFromUCI([])).toEqual([]);
  });
});

describe('PIECE_UNICODE', () => {
  it('has all 12 piece unicode symbols', () => {
    expect(Object.keys(PIECE_UNICODE)).toHaveLength(12);
    expect(PIECE_UNICODE.wK).toBe('♔');
    expect(PIECE_UNICODE.bK).toBe('♚');
    expect(PIECE_UNICODE.wP).toBe('♙');
    expect(PIECE_UNICODE.bP).toBe('♟');
  });
});

describe('getFileFromIndex', () => {
  it('0 → a', () => expect(getFileFromIndex(0)).toBe('a'));
  it('7 → h', () => expect(getFileFromIndex(7)).toBe('h'));
});

describe('getRankFromIndex', () => {
  it('0 → 8 (top rank)', () => expect(getRankFromIndex(0)).toBe(8));
  it('7 → 1 (bottom rank)', () => expect(getRankFromIndex(7)).toBe(1));
});
