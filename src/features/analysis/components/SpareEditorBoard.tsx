'use client';

import {
  useCallback,
  useRef,
  useEffect,
  createContext,
  useContext
} from 'react';
import { Chess, Square, Color, PieceSymbol } from '@/lib/chess';
import { ChessboardProvider, Chessboard } from 'react-chessboard';
import { toast } from 'sonner';
import type { PieceDropHandlerArgs } from 'react-chessboard';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import {
  useBoardEditorState,
  useBoardEditorActions
} from '../stores/useBoardEditorStore';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

const EditorProviderContext = createContext(false);
export const useIsInsideEditorProvider = () =>
  useContext(EditorProviderContext);

interface EditorProviderProps {
  boardOrientation?: 'white' | 'black';
  children: React.ReactNode;
}

export function EditorProvider({
  boardOrientation = 'white',
  children
}: EditorProviderProps) {
  const { editorPosition, isEditorMode } = useBoardEditorState();
  const { setEditorPosition } = useBoardEditorActions();
  const theme = useBoardTheme();

  const chessGameRef = useRef(
    new Chess(editorPosition, { skipValidation: true })
  );

  useEffect(() => {
    try {
      chessGameRef.current.load(editorPosition, { skipValidation: true });
    } catch {}
  }, [editorPosition]);

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs): boolean => {
      const chessGame = chessGameRef.current;
      const color = piece.pieceType[0] as 'w' | 'b';
      const type = piece.pieceType[1].toLowerCase() as PieceSymbol;

      if (!targetSquare) {
        if (!piece.isSparePiece && sourceSquare) {
          chessGame.remove(sourceSquare as Square);
          setEditorPosition(chessGame.fen());
        }
        return true;
      }

      if (!piece.isSparePiece && sourceSquare) {
        chessGame.remove(sourceSquare as Square);
      }

      const success = chessGame.put(
        {
          color: color as Color,
          type: type
        },
        targetSquare as Square
      );

      if (!success) {
        if (!piece.isSparePiece && sourceSquare) {
          chessGame.put(
            { color: color as Color, type: type },
            sourceSquare as Square
          );
        }
        toast.error(
          `The board already contains a ${color === 'w' ? 'white' : 'black'} King`
        );
        return false;
      }

      setEditorPosition(chessGame.fen());
      return true;
    },
    [setEditorPosition]
  );

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

export function EditorChessboard() {
  return (
    <div className='w-[calc(100vw-0.5rem)] sm:w-[400px] lg:w-[560px]'>
      <Chessboard />
    </div>
  );
}
