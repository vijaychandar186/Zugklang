'use client';

import { useCallback, useRef, useEffect, createContext, useContext } from 'react';
import { Chess, Square, Color, PieceSymbol } from 'chess.js';
import { ChessboardProvider, Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs } from 'react-chessboard';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import {
  useBoardEditorState,
  useBoardEditorActions
} from '../stores/useBoardEditorStore';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

// Context to pass through the ChessboardProvider wrapper status
const EditorProviderContext = createContext(false);
export const useIsInsideEditorProvider = () => useContext(EditorProviderContext);

interface EditorProviderProps {
  boardOrientation?: 'white' | 'black';
  children: React.ReactNode;
}

/**
 * EditorProvider wraps children with ChessboardProvider context.
 * All children (including sidebar with SparePiece) can interact with the board.
 */
export function EditorProvider({
  boardOrientation = 'white',
  children
}: EditorProviderProps) {
  const { editorPosition, isEditorMode } = useBoardEditorState();
  const { setEditorPosition } = useBoardEditorActions();
  const theme = useBoardTheme();

  // Create a chess.js instance to manage the position
  const chessGameRef = useRef(
    new Chess(editorPosition, { skipValidation: true })
  );

  // Sync chess.js with store position
  useEffect(() => {
    try {
      chessGameRef.current.load(editorPosition, { skipValidation: true });
    } catch {
      // Invalid FEN, keep current state
    }
  }, [editorPosition]);

  // Handle piece drop - works for both board pieces and spare pieces
  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs): boolean => {
      const chessGame = chessGameRef.current;
      const color = piece.pieceType[0] as 'w' | 'b';
      const type = piece.pieceType[1].toLowerCase() as PieceSymbol;

      // If the piece is dropped off the board, remove it
      if (!targetSquare) {
        if (!piece.isSparePiece && sourceSquare) {
          chessGame.remove(sourceSquare as Square);
          setEditorPosition(chessGame.fen());
        }
        return true;
      }

      // If the piece is not a spare piece, remove it from its original square
      if (!piece.isSparePiece && sourceSquare) {
        chessGame.remove(sourceSquare as Square);
      }

      // Try to place the piece on the board
      const success = chessGame.put(
        {
          color: color as Color,
          type: type
        },
        targetSquare as Square
      );

      // If placement failed (e.g., two kings of same color), show error
      if (!success) {
        // Re-add the piece to original position if it was a board piece
        if (!piece.isSparePiece && sourceSquare) {
          chessGame.put(
            { color: color as Color, type: type },
            sourceSquare as Square
          );
        }
        alert(
          `The board already contains a ${color === 'w' ? 'white' : 'black'} King piece`
        );
        return false;
      }

      // Update the game state
      setEditorPosition(chessGame.fen());
      return true;
    },
    [setEditorPosition]
  );

  // Handle right-click to remove pieces
  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      const chessGame = chessGameRef.current;
      const piece = chessGame.get(square as Square);
      if (piece) {
        chessGame.remove(square as Square);
        setEditorPosition(chessGame.fen());
      }
    },
    [setEditorPosition]
  );

  // Chessboard options
  const chessboardOptions = {
    position: editorPosition,
    boardOrientation,
    allowDragging: isEditorMode,
    allowDragOffBoard: true,
    boardStyle: BOARD_STYLES.boardStyle,
    darkSquareStyle: theme.darkSquareStyle,
    lightSquareStyle: theme.lightSquareStyle,
    dropSquareStyle: {
      boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
    },
    onPieceDrop: handlePieceDrop,
    onSquareRightClick: handleSquareRightClick,
    id: 'spare-pieces-editor'
  };

  return (
    <ChessboardProvider options={chessboardOptions}>
      <EditorProviderContext.Provider value={true}>
        {children}
      </EditorProviderContext.Provider>
    </ChessboardProvider>
  );
}

/**
 * The chessboard component - must be rendered inside EditorProvider
 */
export function EditorChessboard() {
  return (
    <div className='w-[calc(100vw-0.5rem)] sm:w-[400px] lg:w-[560px]'>
      <Chessboard />
    </div>
  );
}
