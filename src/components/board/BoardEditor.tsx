'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';
import { usePositionEditor } from '@/hooks/stores/useAnalysisBoardStore';
import type { PieceCode, PieceColor } from '@/types';

// Piece SVG paths for piece rendering
const PIECE_SVGS: Record<PieceCode, string> = {
  wK: '/pieces/wK.svg',
  wQ: '/pieces/wQ.svg',
  wR: '/pieces/wR.svg',
  wB: '/pieces/wB.svg',
  wN: '/pieces/wN.svg',
  wP: '/pieces/wP.svg',
  bK: '/pieces/bK.svg',
  bQ: '/pieces/bQ.svg',
  bR: '/pieces/bR.svg',
  bB: '/pieces/bB.svg',
  bN: '/pieces/bN.svg',
  bP: '/pieces/bP.svg'
};

type EditorTool = PieceCode | 'eraser';

type BoardEditorProps = {
  fen: string;
  onFenChange: (fen: string) => void;
  onApply: () => void;
  onCancel?: () => void;
  className?: string;
};

export function BoardEditor({
  fen,
  onFenChange,
  onApply,
  onCancel,
  className
}: BoardEditorProps) {
  // Use the store's selectedPiece for syncing with the board
  const { selectedPiece, setSelectedPiece } = usePositionEditor();

  const [turn, setTurn] = useState<PieceColor>(() => {
    return (fen.split(' ')[1] as PieceColor) || 'w';
  });

  // Convert store's selectedPiece to local tool type
  const selectedTool: EditorTool | null =
    selectedPiece === 'trash' ? 'eraser' : (selectedPiece as EditorTool | null);

  // Parse the current position to count pieces
  const pieceCount = useMemo(() => {
    const count: Record<PieceCode, number> = {
      wK: 0,
      wQ: 0,
      wR: 0,
      wB: 0,
      wN: 0,
      wP: 0,
      bK: 0,
      bQ: 0,
      bR: 0,
      bB: 0,
      bN: 0,
      bP: 0
    };

    const boardPart = fen.split(' ')[0];
    for (const char of boardPart) {
      if (char === 'K') count.wK++;
      else if (char === 'Q') count.wQ++;
      else if (char === 'R') count.wR++;
      else if (char === 'B') count.wB++;
      else if (char === 'N') count.wN++;
      else if (char === 'P') count.wP++;
      else if (char === 'k') count.bK++;
      else if (char === 'q') count.bQ++;
      else if (char === 'r') count.bR++;
      else if (char === 'b') count.bB++;
      else if (char === 'n') count.bN++;
      else if (char === 'p') count.bP++;
    }

    return count;
  }, [fen]);

  // Check if a piece can be added (kings limited to 1)
  const canAddPiece = useCallback(
    (piece: PieceCode): boolean => {
      if (piece === 'wK' || piece === 'bK') {
        return pieceCount[piece] < 1;
      }
      return true;
    },
    [pieceCount]
  );

  // Handle piece selection - update the store
  const handleToolSelect = (tool: EditorTool) => {
    if (tool === selectedTool) {
      setSelectedPiece(null);
    } else {
      // Check if we can add this piece
      if (tool !== 'eraser' && !canAddPiece(tool)) {
        return; // Don't allow selecting king if already on board
      }
      // Convert to store format ('trash' for eraser)
      setSelectedPiece(tool === 'eraser' ? 'trash' : tool);
    }
  };

  // Update FEN with new turn
  const handleTurnChange = (newTurn: PieceColor) => {
    setTurn(newTurn);
    const parts = fen.split(' ');
    parts[1] = newTurn;
    onFenChange(parts.join(' '));
  };

  // Clear the entire board
  const handleClearBoard = () => {
    onFenChange('8/8/8/8/8/8/8/8 w - - 0 1');
  };

  // Reset to starting position
  const handleResetBoard = () => {
    onFenChange('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  };

  // Validate position before applying
  const isValidPosition = useMemo(() => {
    // Must have exactly one king per side
    return pieceCount.wK === 1 && pieceCount.bK === 1;
  }, [pieceCount]);

  // Clear selected piece when unmounting or canceling
  useEffect(() => {
    return () => {
      setSelectedPiece(null);
    };
  }, [setSelectedPiece]);

  const whitePieces: PieceCode[] = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
  const blackPieces: PieceCode[] = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Piece Palette */}
      <div className='rounded-lg border p-3'>
        <h4 className='mb-3 text-sm font-medium'>Pieces</h4>

        {/* White pieces */}
        <div className='mb-2 flex flex-wrap gap-1'>
          {whitePieces.map((piece) => {
            const disabled = !canAddPiece(piece);
            const isSelected = selectedTool === piece;

            return (
              <button
                key={piece}
                onClick={() => handleToolSelect(piece)}
                disabled={disabled}
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-muted-foreground/30 border-transparent',
                  disabled && 'cursor-not-allowed opacity-40'
                )}
                title={disabled ? 'Only one king allowed' : piece}
              >
                <img
                  src={PIECE_SVGS[piece]}
                  alt={piece}
                  className='h-8 w-8'
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        {/* Black pieces */}
        <div className='mb-3 flex flex-wrap gap-1'>
          {blackPieces.map((piece) => {
            const disabled = !canAddPiece(piece);
            const isSelected = selectedTool === piece;

            return (
              <button
                key={piece}
                onClick={() => handleToolSelect(piece)}
                disabled={disabled}
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-muted-foreground/30 border-transparent',
                  disabled && 'cursor-not-allowed opacity-40'
                )}
                title={disabled ? 'Only one king allowed' : piece}
              >
                <img
                  src={PIECE_SVGS[piece]}
                  alt={piece}
                  className='h-8 w-8'
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        {/* Eraser tool */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleToolSelect('eraser')}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded border-2 transition-all',
              selectedTool === 'eraser'
                ? 'border-primary bg-primary/10'
                : 'hover:border-muted-foreground/30 border-transparent'
            )}
            title='Remove pieces'
          >
            <Icons.eraser className='h-5 w-5' />
          </button>
          <span className='text-muted-foreground text-xs'>
            Click squares to{' '}
            {selectedTool === 'eraser'
              ? 'remove'
              : selectedTool
                ? 'place'
                : 'select a piece'}
          </span>
        </div>
      </div>

      {/* Turn Selection */}
      <div className='rounded-lg border p-3'>
        <Label className='mb-2 block text-sm font-medium'>Turn to move</Label>
        <RadioGroup
          value={turn}
          onValueChange={(v) => handleTurnChange(v as PieceColor)}
          className='flex gap-4'
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='w' id='white-turn' />
            <Label htmlFor='white-turn' className='cursor-pointer'>
              White
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='b' id='black-turn' />
            <Label htmlFor='black-turn' className='cursor-pointer'>
              Black
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Quick Actions */}
      <div className='flex flex-wrap gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleClearBoard}
          className='gap-1'
        >
          <Icons.trash className='h-4 w-4' />
          Clear
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleResetBoard}
          className='gap-1'
        >
          <Icons.rematch className='h-4 w-4' />
          Reset
        </Button>
      </div>

      {/* Validation Warning */}
      {!isValidPosition && (
        <div className='text-destructive border-destructive/50 bg-destructive/10 rounded-lg border p-2 text-xs'>
          Position must have exactly one king per side
        </div>
      )}

      {/* Apply/Cancel Buttons */}
      <div className='flex gap-2'>
        <Button
          onClick={onApply}
          disabled={!isValidPosition}
          className='flex-1'
        >
          Apply Position
        </Button>
        {onCancel && (
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
