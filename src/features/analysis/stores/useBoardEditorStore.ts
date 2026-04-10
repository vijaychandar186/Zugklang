import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { Chess } from '@/lib/chess';
import { STARTING_FEN, EMPTY_FEN } from '@/features/chess/config/constants';

type BoardEditorStore = {
  isEditorMode: boolean;
  editorPosition: string;
  sideToMove: 'w' | 'b';

  setEditorMode: (enabled: boolean) => void;
  setEditorPosition: (position: string) => void;
  setSideToMove: (side: 'w' | 'b') => void;

  clearBoard: () => void;
  resetBoard: () => void;
  getEditorFEN: () => string;
  validatePosition: () => { valid: boolean; error?: string };
};

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
  editorPosition: STARTING_FEN,
  sideToMove: 'w',

  setEditorMode: (enabled) => {
    set({ isEditorMode: enabled });
  },

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
      editorPosition: s.editorPosition,
      sideToMove: s.sideToMove
    }))
  );

export const useBoardEditorActions = () =>
  useBoardEditorStore(
    useShallow((s) => ({
      setEditorMode: s.setEditorMode,
      setEditorPosition: s.setEditorPosition,
      setSideToMove: s.setSideToMove,
      clearBoard: s.clearBoard,
      resetBoard: s.resetBoard,
      getEditorFEN: s.getEditorFEN,
      validatePosition: s.validatePosition
    }))
  );
