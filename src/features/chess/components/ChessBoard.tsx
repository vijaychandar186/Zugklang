'use client';

import { useEffect, useCallback } from 'react';
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
import { playSound } from '@/features/game/utils/sounds';

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
    autoFlipBoard
  } = useChessState();

  const {
    setGameOver,
    setGameResult,
    setOnNewGame,
    makeMove,
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
    pendingPromotion,
    completePromotion,
    cancelPromotion
  } = useChessBoardLogic({
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    playerColor: effectivePlayAs,
    soundEnabled,
    makeMove,
    goToEnd,
    isGameOver: gameOver || (isPlayMode && !gameStarted),
    onMoveExecuted,
    allowOpponentMoves: !stockfishEnabled,
    enablePremoves: stockfishEnabled && isPlayMode,
    onPremoveAdded
  });

  useStockfish({
    game,
    fen: currentFEN,
    gameId: isPlayMode ? gameId : 1,
    playAs: effectivePlayAs,
    stockfishLevel,
    enabled: stockfishEnabled && !gameOver,
    onMove: executeMove,
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

  const effectiveBoardOrientation = isPlayMode
    ? boardFlipped
      ? playAs === 'white'
        ? 'black'
        : 'white'
      : playAs
    : boardOrientation;

  // Handle game over detection
  useEffect(() => {
    if (!isPlayMode) return;

    if (game.isGameOver()) {
      if (soundEnabled) playSound('game-end');
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        if (isLocalGame) {
          setGameResult(`${winner} wins!`);
        } else {
          const isUserWin =
            (playAs === 'white' && winner === 'White') ||
            (playAs === 'black' && winner === 'Black');
          setGameResult(isUserWin ? 'You win!' : 'Stockfish wins!');
        }
      } else if (game.isDraw()) {
        setGameResult('Draw!');
      } else if (game.isStalemate()) {
        setGameResult('Stalemate!');
      }
      setGameOver(true);
    }
  }, [
    game,
    currentFEN,
    isPlayMode,
    isLocalGame,
    playAs,
    setGameResult,
    setGameOver,
    soundEnabled
  ]);

  // Setup new game handler
  const onNewGame = useCallback(() => {
    if (soundEnabled) playSound('game-start');
    clearState();
  }, [clearState, soundEnabled]);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  const resolvedOrientation = isMounted
    ? effectiveBoardOrientation
    : serverOrientation || 'white';

  // Common board props
  const boardProps = {
    position,
    boardOrientation: resolvedOrientation,
    canDrag:
      isMounted &&
      !isViewingHistory &&
      !pendingPromotion &&
      !(isPlayMode && !gameStarted),
    squareStyles: isMounted ? squareStyles : {},
    onPieceDrop: onDrop,
    onSquareClick: handleSquareClick,
    onSquareRightClick: handleSquareRightClick,
    arrows: analysisArrows
  };

  // Use initialBoard3dEnabled for SSR consistency, then fall back to store state
  const shouldShow3d = isMounted
    ? board3dEnabled
    : (initialBoard3dEnabled ?? false);

  return (
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
      <PromotionDialog
        isOpen={!!pendingPromotion}
        color={pendingPromotion?.color || 'white'}
        targetSquare={pendingPromotion?.to || 'a8'}
        boardOrientation={resolvedOrientation}
        onSelect={completePromotion}
        onCancel={cancelPromotion}
      />
    </div>
  );
}
