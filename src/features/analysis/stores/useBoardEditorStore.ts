import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { Chess, Square } from 'chess.js';
import { PieceCode } from '@/features/chess/types/core';
import { STARTING_FEN, EMPTY_FEN } from '@/features/chess/config/constants';

export type EditorTool = 'cursor' | 'delete' | PieceCode;

type BoardEditorStore = {
  isEditorMode: boolean;
  selectedTool: EditorTool;
  editorPosition: string;
  sideToMove: 'w' | 'b';

  setEditorMode: (enabled: boolean) => void;
  setSelectedTool: (tool: EditorTool) => void;
  setEditorPosition: (position: string) => void;
  setSideToMove: (side: 'w' | 'b') => void;

  placePiece: (square: Square) => string | null;
  removePiece: (square: Square) => string | null;
  clearBoard: () => void;
  resetBoard: () => void;
  getEditorFEN: () => string;
  validatePosition: () => { valid: boolean; error?: string };
};

function pieceCodeToFENPiece(code: PieceCode): string {
  const pieceMap: Record<PieceCode, string> = {
    wK: 'K',
    wQ: 'Q',
    wR: 'R',
    wB: 'B',
    wN: 'N',
    wP: 'P',
    bK: 'k',
    bQ: 'q',
    bR: 'r',
    bB: 'b',
    bN: 'n',
    bP: 'p'
  };
  return pieceMap[code];
}

function squareToIndex(square: Square): { row: number; col: number } {
  const col = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const row = 8 - parseInt(square[1]); // 8=0, 7=1, etc. (FEN order)
  return { row, col };
}

function parseFENPosition(fen: string): string[][] {
  const position = fen.split(' ')[0];
  const rows = position.split('/');
  const board: string[][] = [];

  for (const row of rows) {
    const boardRow: string[] = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        const emptyCount = parseInt(char);
        for (let i = 0; i < emptyCount; i++) {
          boardRow.push('');
        }
      } else {
        boardRow.push(char);
      }
    }
    board.push(boardRow);
  }

  return board;
}

function boardToFEN(board: string[][]): string {
  const rows: string[] = [];

  for (const row of board) {
    let fenRow = '';
    let emptyCount = 0;

    for (const cell of row) {
      if (cell === '') {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fenRow += emptyCount;
          emptyCount = 0;
        }
        fenRow += cell;
      }
    }

    if (emptyCount > 0) {
      fenRow += emptyCount;
    }

    rows.push(fenRow);
  }

  return rows.join('/');
}

function countKings(board: string[][]): { white: number; black: number } {
  let white = 0;
  let black = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell === 'K') white++;
      if (cell === 'k') black++;
    }
  }

  return { white, black };
}

export const useBoardEditorStore = create<BoardEditorStore>()((set, get) => ({
  isEditorMode: false,
  selectedTool: 'cursor',
  editorPosition: STARTING_FEN,
  sideToMove: 'w',

  setEditorMode: (enabled) => {
    set({
      isEditorMode: enabled,
      selectedTool: enabled ? 'cursor' : 'cursor'
    });
  },

  setSelectedTool: (tool) => set({ selectedTool: tool }),

  setEditorPosition: (position) => set({ editorPosition: position }),

  setSideToMove: (side) => {
    const state = get();
    const parts = state.editorPosition.split(' ');
    parts[1] = side;
    set({
      sideToMove: side,
      editorPosition: parts.join(' ')
    });
  },

  placePiece: (square) => {
    const state = get();
    const tool = state.selectedTool;

    if (tool === 'cursor' || tool === 'delete') return null;

    const board = parseFENPosition(state.editorPosition);
    const { row, col } = squareToIndex(square);
    const pieceChar = pieceCodeToFENPiece(tool);

    // Check king placement rules
    if (pieceChar === 'K' || pieceChar === 'k') {
      const kings = countKings(board);
      const isWhiteKing = pieceChar === 'K';
      const currentKingCount = isWhiteKing ? kings.white : kings.black;

      // Check if there's already a king of this color
      // Allow placement if we're replacing an existing king of the same color
      const existingPiece = board[row][col];
      const isReplacingSameKing =
        (isWhiteKing && existingPiece === 'K') ||
        (!isWhiteKing && existingPiece === 'k');

      if (currentKingCount >= 1 && !isReplacingSameKing) {
        // Find and remove the existing king first
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (board[r][c] === pieceChar) {
              board[r][c] = '';
            }
          }
        }
      }
    }

    board[row][col] = pieceChar;

    const positionPart = boardToFEN(board);
    const parts = state.editorPosition.split(' ');
    parts[0] = positionPart;
    const newFEN = parts.join(' ');

    set({ editorPosition: newFEN });
    return newFEN;
  },

  removePiece: (square) => {
    const state = get();
    const board = parseFENPosition(state.editorPosition);
    const { row, col } = squareToIndex(square);

    board[row][col] = '';

    const positionPart = boardToFEN(board);
    const parts = state.editorPosition.split(' ');
    parts[0] = positionPart;
    const newFEN = parts.join(' ');

    set({ editorPosition: newFEN });
    return newFEN;
  },

  clearBoard: () => {
    set({ editorPosition: EMPTY_FEN });
  },

  resetBoard: () => {
    set({ editorPosition: STARTING_FEN, sideToMove: 'w' });
  },

  getEditorFEN: () => {
    return get().editorPosition;
  },

  validatePosition: () => {
    const state = get();
    const board = parseFENPosition(state.editorPosition);
    const kings = countKings(board);

    if (kings.white !== 1) {
      return {
        valid: false,
        error: `White must have exactly 1 king (currently ${kings.white})`
      };
    }

    if (kings.black !== 1) {
      return {
        valid: false,
        error: `Black must have exactly 1 king (currently ${kings.black})`
      };
    }

    // Try to create a chess.js instance to validate the position
    try {
      new Chess(state.editorPosition);
      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid position' };
    }
  }
}));

export const useBoardEditorState = () =>
  useBoardEditorStore(
    useShallow((s) => ({
      isEditorMode: s.isEditorMode,
      selectedTool: s.selectedTool,
      editorPosition: s.editorPosition,
      sideToMove: s.sideToMove
    }))
  );

export const useBoardEditorActions = () =>
  useBoardEditorStore(
    useShallow((s) => ({
      setEditorMode: s.setEditorMode,
      setSelectedTool: s.setSelectedTool,
      setEditorPosition: s.setEditorPosition,
      setSideToMove: s.setSideToMove,
      placePiece: s.placePiece,
      removePiece: s.removePiece,
      clearBoard: s.clearBoard,
      resetBoard: s.resetBoard,
      getEditorFEN: s.getEditorFEN,
      validatePosition: s.validatePosition
    }))
  );
