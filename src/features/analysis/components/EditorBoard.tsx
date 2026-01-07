'use client';

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Square } from 'chess.js';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import {
  useBoardEditorState,
  useBoardEditorActions
} from '../stores/useBoardEditorStore';
import { SquareStyles, PieceCode } from '@/features/chess/types/core';

interface EditorBoardProps {
  boardOrientation?: 'white' | 'black';
}

export function EditorBoard({ boardOrientation = 'white' }: EditorBoardProps) {
  const { selectedTool, editorPosition, isEditorMode } = useBoardEditorState();
  const { placePiece, removePiece, setEditorPosition, setSelectedTool } =
    useBoardEditorActions();
  const theme = useBoardTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate which square is under the mouse based on coordinates
  const getSquareFromCoordinates = useCallback(
    (clientX: number, clientY: number): Square | null => {
      if (!boardRef.current) return null;

      const rect = boardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

      const squareSize = rect.width / 8;
      let col = Math.floor(x / squareSize);
      let row = Math.floor(y / squareSize);

      // Adjust for board orientation
      if (boardOrientation === 'white') {
        row = 7 - row;
      } else {
        col = 7 - col;
      }

      const file = String.fromCharCode(97 + col); // a-h
      const rank = String(row + 1); // 1-8

      return `${file}${rank}` as Square;
    },
    [boardOrientation]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';

      const square = getSquareFromCoordinates(e.clientX, e.clientY);
      if (square !== dragOverSquare) {
        setDragOverSquare(square);
      }
    },
    [getSquareFromCoordinates, dragOverSquare]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverSquare(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverSquare(null);

      const piece = e.dataTransfer.getData('text/plain') as PieceCode;
      if (!piece) return;

      const square = getSquareFromCoordinates(e.clientX, e.clientY);
      if (!square) return;

      // Set the tool and place the piece
      setSelectedTool(piece);
      placePiece(square);
    },
    [getSquareFromCoordinates, setSelectedTool, placePiece]
  );

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (!isEditorMode) return;

      const sq = square as Square;

      if (selectedTool === 'cursor') {
        return;
      }

      if (selectedTool === 'delete') {
        removePiece(sq);
        return;
      }

      // Place the selected piece (if a piece is selected from palette)
      placePiece(sq);
    },
    [isEditorMode, selectedTool, placePiece, removePiece]
  );

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!isEditorMode) return false;

      const source = sourceSquare as Square;

      // If dropped outside the board (targetSquare is null), remove the piece
      if (!targetSquare) {
        removePiece(source);
        return true;
      }

      const target = targetSquare as Square;

      if (source === target) return false;

      // Move piece on the board
      const fenParts = editorPosition.split(' ');
      const positionPart = fenParts[0];
      const rows = positionPart.split('/');

      const sourceCol = source.charCodeAt(0) - 97;
      const sourceRow = 8 - parseInt(source[1]);
      const targetCol = target.charCodeAt(0) - 97;
      const targetRow = 8 - parseInt(target[1]);

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

      const piece = board[sourceRow][sourceCol];
      if (!piece) return false;

      board[sourceRow][sourceCol] = '';
      board[targetRow][targetCol] = piece;

      const newRows: string[] = [];
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
        newRows.push(fenRow);
      }

      fenParts[0] = newRows.join('/');
      setEditorPosition(fenParts.join(' '));

      return true;
    },
    [isEditorMode, editorPosition, setEditorPosition, removePiece]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      const sq = square as Square;
      // Right click to delete piece
      removePiece(sq);
    },
    [removePiece]
  );

  const squareStyles = useMemo<SquareStyles>(() => {
    const styles: SquareStyles = {};

    // Highlight the square being dragged over
    if (dragOverSquare) {
      styles[dragOverSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)'
      };
    }

    return styles;
  }, [dragOverSquare]);

  const position = isMounted ? editorPosition : editorPosition;

  return (
    <div
      ref={boardRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className='w-full'
    >
      <Board
        position={position}
        boardOrientation={boardOrientation}
        canDrag={isEditorMode}
        squareStyles={squareStyles}
        darkSquareStyle={theme.darkSquareStyle}
        lightSquareStyle={theme.lightSquareStyle}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        onSquareRightClick={handleSquareRightClick}
        arrows={[]}
      />
    </div>
  );
}
