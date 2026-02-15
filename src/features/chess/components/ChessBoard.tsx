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
import { useFairyStockfish } from '@/features/engine/hooks/useFairyStockfish';
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

  // Use Fairy-Stockfish for variant chess (atomic, racing kings, etc.), regular Stockfish for standard/fischer-random
  const useFairyEngine = variant === 'atomic' || variant === 'racingKings';
  const useStandardEngine = !useFairyEngine;

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
    hasHydrated,
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

  // Fairy-Stockfish for variant chess (atomic, etc.)
  useFairyStockfish({
    game,
    fen: currentFEN,
    gameId: isPlayMode ? gameId : 1,
    playAs: effectivePlayAs,
    stockfishLevel,
    enabled: stockfishEnabled && !gameOver && useFairyEngine,
    variant,
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
          const engineName = useFairyEngine ? 'Fairy-Stockfish' : 'Stockfish';
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
    useFairyEngine
  ]);

  const onNewGame = useCallback(() => {
    if (soundEnabled) playSound('game-start');
    clearState();
  }, [clearState, soundEnabled]);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  const resolvedOrientation =
    isMounted && hasHydrated
      ? effectiveBoardOrientation
      : serverOrientation || 'white';

  const boardProps = {
    position,
    boardOrientation: resolvedOrientation,
    canDrag:
      isMounted &&
      hasHydrated &&
      !isViewingHistory &&
      !pendingPromotion &&
      !(isPlayMode && !gameStarted),
    squareStyles: isMounted && hasHydrated ? squareStyles : {},
    onPieceDrop: onDrop,
    onSquareClick: handleSquareClick,
    onSquareRightClick: handleSquareRightClick,
    arrows: analysisArrows
  };

  const shouldShow3d =
    isMounted && hasHydrated
      ? board3dEnabled
      : (initialBoard3dEnabled ?? false);

  const isRacingKings = variant === 'racingKings';
  const finishLineAtTop = resolvedOrientation === 'white';

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
      {isRacingKings && (
        <div
          className='pointer-events-none absolute right-0 left-0'
          style={{
            [finishLineAtTop ? 'top' : 'bottom']: 0,
            height: '12.5%',
            background:
              'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 12.5% 50%',
            opacity: 0.12
          }}
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
