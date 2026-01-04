import { useState, useMemo } from 'react';
import {
  useAnalysisBoardState,
  useAnalysisBoardStore,
  useAnalysisBoardActions,
  usePositionEditor,
  type EditorPieceType
} from '@/hooks/stores/useAnalysisBoardStore';

type PieceType = Exclude<EditorPieceType, 'trash'>;
import { useGameStore } from '@/hooks/stores/useGameStore';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig
} from '@/hooks/stores/useAnalysisStore';
import { playSound } from '@/utils/sounds';
import { useStockfish } from '@/hooks/computer/useStockfish';
import { useChessArrows } from '@/hooks/useChessArrows';
import { UnifiedChessBoard as Board } from '@/components/board/Board';

export function AnalysisBoard() {
  const {
    mode,
    currentFEN,
    playingAgainstStockfish,
    playerColor,
    stockfishLevel,
    viewingIndex,
    positionHistory,
    boardOrientation
  } = useAnalysisBoardState();

  const { makeMove } = useAnalysisBoardActions();
  const { editorFEN, selectedPiece, setEditorPiece } = usePositionEditor();
  const game = useAnalysisBoardStore((state) => state.game);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const theme = useMemo(
    () => ({
      dark: { backgroundColor: 'var(--board-square-dark)' },
      light: { backgroundColor: 'var(--board-square-light)' }
    }),
    []
  );

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();

  const [squareStyles, setSquareStyles] = useState({});
  const [rightClickSquares, setRightClickSquares] = useState<
    Record<string, { backgroundColor: string }>
  >({});

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow
  });

  // Stockfish integration
  useStockfish({
    game,
    gameId: 1, // Analysis session ID
    playAs: playerColor,
    stockfishLevel,
    enabled: playingAgainstStockfish,
    onMove: (from, to, promotion) => makeMove(from, to, promotion),
    soundEnabled,
    playSound
  });

  // Handle piece drop (using object destructuring as per environment pattern)
  function onDrop({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare) return false;

    // In position editor mode, handled differently (Dialog)
    if (mode === 'position-editor') return false;

    return makeMove(sourceSquare, targetSquare);
  }

  // Handle square click
  function handleSquareClick({ square }: { square: string }) {
    // In position editor mode, place or remove pieces
    if (mode === 'position-editor') {
      if (selectedPiece) {
        // Place the selected piece or remove if it's an eraser
        setEditorPiece(
          square,
          selectedPiece === 'trash' ? null : (selectedPiece as PieceType)
        );
      }
      return;
    }

    // Simple click highlighting
    setSquareStyles({
      [square]: { backgroundColor: 'var(--highlight-selected)' }
    });
  }

  // Handle right-click for custom arrows
  function handleSquareRightClick({ square }: { square: string }) {
    const color = 'var(--highlight-right-click)';

    setRightClickSquares((prev) => {
      const newSquares = { ...prev };
      if (newSquares[square]) {
        delete newSquares[square];
      } else {
        newSquares[square] = { backgroundColor: color };
      }
      return newSquares;
    });
  }

  const combinedSquareStyles = { ...squareStyles, ...rightClickSquares };
  const isViewingHistory = viewingIndex < positionHistory.length - 1;
  const isPositionEditorMode = mode === 'position-editor';

  // Show editorFEN when in position editor mode, otherwise show currentFEN
  const displayPosition = isPositionEditorMode ? editorFEN : currentFEN;

  return (
    <Board
      position={displayPosition}
      boardOrientation={boardOrientation}
      canDrag={!isViewingHistory && !isPositionEditorMode}
      squareStyles={combinedSquareStyles}
      darkSquareStyle={theme.dark}
      lightSquareStyle={theme.light}
      onPieceDrop={onDrop}
      onSquareClick={handleSquareClick}
      onSquareRightClick={handleSquareRightClick}
      arrows={isPositionEditorMode ? [] : analysisArrows}
      id='analysis-chess-board'
    />
  );
}
