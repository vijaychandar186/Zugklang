'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { UnifiedChessBoard as Board } from './Board';
import { Board3D } from './Board3D';
import { PromotionDialog } from './PromotionDialog';
import {
  useChessState,
  useChessActions,
  useTimerState
} from '../stores/useChessStore';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig,
  useAnalysisPosition
} from '../stores/useAnalysisStore';
import { useChessArrows } from '../hooks/useChessArrows';
import { useChessBoardLogic } from '../hooks/useChessBoardLogic';
import { useBoardTheme } from '../hooks/useSquareInteraction';
import { useStockfish } from '@/features/engine/hooks/useStockfish';
import { useFairyStockfish } from '@/features/engine/hooks/useFairyStockfish';
import { playSound } from '@/features/game/utils/sounds';
import { usesFairyEngine, getEngineName } from '../config/variants';
import '../variants';
import { variantRegistry } from '../variants/shared/VariantRegistry';
import { useCrazyhousePocket } from '../variants/crazyhouse/hooks/useCrazyhousePocket';

export function ChessBoard({
  serverOrientation,
  initialBoard3dEnabled
}: {
  serverOrientation?: 'white' | 'black';
  initialBoard3dEnabled?: boolean;
}) {
  const {
    mode,
    gameType,
    hasHydrated,
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    boardOrientation,
    playAs,
    stockfishLevel,
    gameOver,
    gameStarted,
    gameId,
    playingAgainstStockfish,
    playerColor,
    soundEnabled,
    board3dEnabled,
    boardFlipped,
    autoFlipBoard,
    variant
  } = useChessState();

  const {
    setGameOver,
    setGameResult,
    setOnNewGame,
    makeMove,
    makeDropMove,
    goToEnd,
    flipBoard
  } = useChessActions();
  const { switchTimer } = useTimerState();

  const isLocalGame = gameType === 'local';
  const isPlayMode = mode === 'play';
  const effectivePlayAs = isPlayMode ? playAs : playerColor;

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  const theme = useBoardTheme();

  const stockfishEnabled =
    (isPlayMode && !isLocalGame) || playingAgainstStockfish;

  const useFairy = usesFairyEngine(variant);
  const useStandardEngine = !useFairy;

  const onMoveExecuted = useCallback(() => {
    if (isPlayMode) {
      const activeColor = game.turn() === 'w' ? 'white' : 'black';
      switchTimer(activeColor);

      if (isLocalGame && autoFlipBoard) {
        flipBoard();
      }
    }
  }, [isPlayMode, game, switchTimer, isLocalGame, autoFlipBoard, flipBoard]);

  const onPremoveAdded = useCallback(() => {
    if (soundEnabled) playSound('premove');
  }, [soundEnabled]);

  const {
    isMounted,
    position,
    isViewingHistory,
    gameTurn,
    playerColorShort,
    executeMove,
    onDrop,
    handleSquareClick,
    handleSquareRightClick,
    clearState,
    squareStyles,
    moveFrom,
    captureTargets,
    pendingPromotion,
    completePromotion,
    cancelPromotion
  } = useChessBoardLogic({
    game,
    currentFEN,
    hasHydrated,
    viewingIndex,
    positionHistory,
    playerColor: effectivePlayAs,
    soundEnabled,
    variant,
    makeMove,
    goToEnd,
    isGameOver: gameOver || (isPlayMode && !gameStarted),
    onMoveExecuted,
    allowOpponentMoves: !stockfishEnabled,
    enablePremoves: stockfishEnabled && isPlayMode,
    onPremoveAdded
  });

  // Standard Stockfish for regular chess and fischer-random
  useStockfish({
    game,
    fen: currentFEN,
    gameId: isPlayMode ? gameId : 1,
    playAs: effectivePlayAs,
    stockfishLevel,
    enabled: stockfishEnabled && !gameOver && useStandardEngine,
    onMove: executeMove,
    soundEnabled,
    playSound
  });

  const executeDropMove = useCallback(
    (san: string) => {
      const move = makeDropMove(san);
      if (move) {
        onMoveExecuted();
      }
      return move;
    },
    [makeDropMove, onMoveExecuted]
  );

  // Fairy-Stockfish for variant chess (atomic, etc.)
  useFairyStockfish({
    game,
    fen: currentFEN,
    gameId: isPlayMode ? gameId : 1,
    playAs: effectivePlayAs,
    stockfishLevel,
    enabled: stockfishEnabled && !gameOver && useFairy,
    variant,
    onMove: executeMove,
    onDropMove: executeDropMove,
    soundEnabled,
    playSound
  });

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor: playerColorShort,
    gameTurn,
    analysisTurn
  });

  const loserColor = useMemo((): 'w' | 'b' | null => {
    if (!gameOver) return null;
    const outcome = game.outcome();
    if (!outcome || outcome.winner === undefined) return null;
    return outcome.winner === 'w' ? 'b' : 'w';
  }, [gameOver, game]);

  const effectiveBoardOrientation = isPlayMode
    ? boardFlipped
      ? playAs === 'white'
        ? 'black'
        : 'white'
      : playAs
    : boardOrientation;

  const resolvedOrientation =
    isMounted && hasHydrated
      ? effectiveBoardOrientation
      : serverOrientation || 'white';

  // Get variant module from registry
  const variantModule = variantRegistry.getModule(variant);

  // Call hooks unconditionally (React hooks rules)

  const {
    selectedDropPiece,
    dropSquareStyles,
    handleDropOnSquare,
    clearDropSelection
  } = useCrazyhousePocket({
    game,
    variant,
    currentFEN,
    playerColor: effectivePlayAs,
    makeDropMove,
    onMoveExecuted,
    isGameOver: gameOver || (isPlayMode && !gameStarted)
  });

  const wrappedSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (selectedDropPiece) {
        if (handleDropOnSquare(square)) return;
        clearDropSelection();
        return;
      }
      handleSquareClick({ square });
    },
    [
      selectedDropPiece,
      handleDropOnSquare,
      clearDropSelection,
      handleSquareClick
    ]
  );

  const mergedSquareStyles = useMemo(() => {
    const base = isMounted && hasHydrated ? squareStyles : {};
    if (!selectedDropPiece) return base;
    return { ...base, ...dropSquareStyles };
  }, [
    isMounted,
    hasHydrated,
    squareStyles,
    selectedDropPiece,
    dropSquareStyles
  ]);

  useEffect(() => {
    if (!isPlayMode || !gameStarted) return;

    if (game.isGameOver()) {
      if (soundEnabled) playSound('game-end');
      const outcome = game.outcome();
      if (!outcome || outcome.winner === undefined) {
        // Draw: stalemate, insufficient material, or variant draw (e.g. both kings reach rank 8)
        setGameResult('Draw!');
      } else {
        const winner = outcome.winner === 'w' ? 'White' : 'Black';
        if (isLocalGame) {
          setGameResult(`${winner} wins!`);
        } else {
          const isUserWin =
            (playAs === 'white' && winner === 'White') ||
            (playAs === 'black' && winner === 'Black');
          const engineName = getEngineName(variant);
          setGameResult(isUserWin ? 'You win!' : `${engineName} wins!`);
        }
      }
      setGameOver(true);
    }
  }, [
    game,
    currentFEN,
    isPlayMode,
    gameStarted,
    isLocalGame,
    playAs,
    setGameResult,
    setGameOver,
    soundEnabled,
    variant
  ]);

  const onNewGame = useCallback(() => {
    if (soundEnabled) playSound('game-start');
    clearState();
  }, [clearState, soundEnabled]);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  const boardProps = {
    position,
    boardOrientation: resolvedOrientation,
    canDrag:
      isMounted &&
      hasHydrated &&
      !isViewingHistory &&
      !pendingPromotion &&
      !(isPlayMode && !gameStarted),
    squareStyles: mergedSquareStyles,
    onPieceDrop: onDrop,
    onSquareClick: wrappedSquareClick,
    onSquareRightClick: handleSquareRightClick,
    arrows: analysisArrows,
    loserColor
  };

  const shouldShow3d =
    isMounted && hasHydrated
      ? board3dEnabled
      : (initialBoard3dEnabled ?? false);

  // Get variant overlay components
  // Overlay components from variant registry
  const BoardOverlayComponent = variantModule?.components?.BoardOverlay;

  return (
    <>
      <div className='relative'>
        {shouldShow3d ? (
          <Board3D {...boardProps} />
        ) : (
          <Board
            {...boardProps}
            darkSquareStyle={theme.darkSquareStyle}
            lightSquareStyle={theme.lightSquareStyle}
          />
        )}
        {/* Render variant-specific board overlay (e.g., Racing Kings finish line) */}
        {BoardOverlayComponent && (
          <BoardOverlayComponent
            boardOrientation={resolvedOrientation}
            game={game}
            variant={variant}
            playerColor={playerColorShort}
            boardFlipped={resolvedOrientation === 'black'}
            selectedSquare={moveFrom}
            captureTargets={captureTargets}
            currentFEN={currentFEN}
          />
        )}
        <PromotionDialog
          isOpen={!!pendingPromotion}
          color={pendingPromotion?.color || 'white'}
          targetSquare={pendingPromotion?.to || 'a8'}
          boardOrientation={resolvedOrientation}
          onSelect={completePromotion}
          onCancel={cancelPromotion}
        />
      </div>
    </>
  );
}
