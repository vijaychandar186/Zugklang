'use client';

import { useEffect } from 'react';
import { PieceCode } from '@/features/chess/types/core';
import {
  useBoardEditorState,
  useBoardEditorActions
} from '../stores/useBoardEditorStore';

// Mapping from piece codes to file names
const PIECE_FILE_NAMES: Record<PieceCode, string> = {
  wK: 'white-king',
  wQ: 'white-queen',
  wR: 'white-rook',
  wB: 'white-bishop',
  wN: 'white-knight',
  wP: 'white-pawn',
  bK: 'black-king',
  bQ: 'black-queen',
  bR: 'black-rook',
  bB: 'black-bishop',
  bN: 'black-knight',
  bP: 'black-pawn'
};

const PIECE_IMAGE_URL = (piece: PieceCode) =>
  `/pieces/${PIECE_FILE_NAMES[piece]}.svg`;

// All pieces in order for 4-column grid (white on top row, black on bottom)
const ALL_PIECES: PieceCode[] = [
  'wK',
  'wQ',
  'wR',
  'wB',
  'wN',
  'wP',
  'bK',
  'bQ',
  'bR',
  'bB',
  'bN',
  'bP'
];

interface DraggablePieceProps {
  pieceCode: PieceCode;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, piece: PieceCode) => void;
}

function DraggablePiece({
  pieceCode,
  isSelected,
  onClick,
  onDragStart
}: DraggablePieceProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // Set the drag image to the piece
    const img = new Image();
    img.src = PIECE_IMAGE_URL(pieceCode);
    e.dataTransfer.setDragImage(img, 30, 30);
    onDragStart(e, pieceCode);
  };

  return (
    <div
      className={`hover:bg-accent flex aspect-square cursor-grab items-center justify-center rounded-md transition-all active:cursor-grabbing ${
        isSelected ? 'bg-primary/20 ring-primary ring-2' : 'bg-muted/50'
      }`}
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PIECE_IMAGE_URL(pieceCode)}
        alt={pieceCode}
        className='pointer-events-none h-10 w-10'
        draggable={false}
      />
    </div>
  );
}

export function PiecePalette() {
  const { isEditorMode, selectedTool } = useBoardEditorState();
  const { setSelectedTool } = useBoardEditorActions();

  // Set custom cursor when a piece is selected
  useEffect(() => {
    if (!isEditorMode) return;

    const boardContainer = document.querySelector('[data-board-container]');
    if (!boardContainer) return;

    if (selectedTool && selectedTool !== 'cursor') {
      const cursorUrl = PIECE_IMAGE_URL(selectedTool as PieceCode);
      (boardContainer as HTMLElement).style.cursor =
        `url(${cursorUrl}) 25 25, pointer`;
    } else {
      (boardContainer as HTMLElement).style.cursor = '';
    }

    return () => {
      (boardContainer as HTMLElement).style.cursor = '';
    };
  }, [isEditorMode, selectedTool]);

  if (!isEditorMode) return null;

  const handleDragStart = (e: React.DragEvent, piece: PieceCode) => {
    e.dataTransfer.setData('text/plain', piece);
    e.dataTransfer.effectAllowed = 'copy';
    setSelectedTool(piece);
  };

  const handlePieceClick = (piece: PieceCode) => {
    // Toggle selection - if already selected, deselect (set to cursor)
    if (selectedTool === piece) {
      setSelectedTool('cursor');
    } else {
      setSelectedTool(piece);
    }
  };

  return (
    <div className='p-4'>
      <div className='bg-card grid grid-cols-4 gap-2 rounded-lg border p-3'>
        {ALL_PIECES.map((piece) => (
          <DraggablePiece
            key={piece}
            pieceCode={piece}
            isSelected={selectedTool === piece}
            onClick={() => handlePieceClick(piece)}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
      <p className='text-muted-foreground mt-2 text-center text-xs'>
        Click or drag pieces to place
      </p>
    </div>
  );
}
