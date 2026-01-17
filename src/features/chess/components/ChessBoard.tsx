'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Square } from 'chess.js';
import { UnifiedChessBoard as Board } from './Board';
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
import { BOARD_STYLES } from '@/features/chess/config/board-themes';
import { SquareStyles } from '@/features/chess/types/core';

export function ChessBoard({
  serverOrientation
}: {
  serverOrientation?: 'white' | 'black';
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
    gameId,
    playingAgainstStockfish,
    playerColor,
    soundEnabled,
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

  const [premoves, setPremoves] = useState<
    Array<{ from: Square; to: Square; promotion?: string }>
  >([]);

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const theme = useBoardTheme();

  const onMoveExecuted = useCallback(() => {
    if (isPlayMode) {
      const activeColor = game.turn() === 'w' ? 'white' : 'black';
      switchTimer(activeColor);

      if (isLocalGame && autoFlipBoard) {
        flipBoard();
      }
    }
  }, [isPlayMode, game, switchTimer, isLocalGame, autoFlipBoard, flipBoard]);

  const {
    isMounted,
    position,
    isViewingHistory,
    isPlayerTurn,
    gameTurn,
    playerColorShort,
    executeMove,
    handleSquareRightClick: baseHandleSquareRightClick,
    clearState,
    squareStyles: baseSquareStyles,
    moveFrom,
    setMoveFrom,
    setOptionSquares,
    getMoveOptions
  } = useChessBoardLogic({
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    playerColor: effectivePlayAs,
    soundEnabled,
    makeMove,
    goToEnd,
    isGameOver: gameOver,
    onMoveExecuted,
    allowOpponentMoves: !(
      (isPlayMode && !isLocalGame) ||
      playingAgainstStockfish
    )
  });

  const stockfishEnabled =
    (isPlayMode && !isLocalGame) || playingAgainstStockfish;

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

  const handleUserMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      if (gameOver) return false;

      if (isViewingHistory) {
        goToEnd();
        return false;
      }

      if (stockfishEnabled) {
        const piece = game.get(from);
        const colorShort = effectivePlayAs === 'white' ? 'w' : 'b';
        if (piece?.color !== colorShort) return false;

        if (!isPlayerTurn && isPlayMode) {
          setPremoves((prev) => [
            ...prev,
            { from, to, promotion: promotion || 'q' }
          ]);
          if (soundEnabledRef.current) playSound('premove');
          setMoveFrom(null);
          setOptionSquares({});
          return true;
        }
      }

      const success = executeMove(from, to, promotion);
      if (!success && soundEnabledRef.current) {
        playSound('illegal');
      }
      return success;
    },
    [
      gameOver,
      isViewingHistory,
      goToEnd,
      stockfishEnabled,
      game,
      effectivePlayAs,
      isPlayerTurn,
      isPlayMode,
      executeMove,
      setMoveFrom,
      setOptionSquares
    ]
  );

  useEffect(() => {
    if (premoves.length > 0 && isPlayerTurn && !game.isGameOver()) {
      const [first, ...rest] = premoves;
      const success = executeMove(first.from, first.to, first.promotion);
      if (success) {
        setPremoves(rest);
      } else {
        setPremoves([]);
      }
    }
  }, [premoves, isPlayerTurn, game, executeMove]);

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

  const onNewGame = useCallback(() => {
    if (soundEnabledRef.current) playSound('game-start');
    clearState();
    setPremoves([]);
  }, [clearState]);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  const onDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!targetSquare) return false;
      return handleUserMove(sourceSquare as Square, targetSquare as Square);
    },
    [handleUserMove]
  );

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (gameOver) return;

      if (isViewingHistory) {
        goToEnd();
        return;
      }

      const sq = square as Square;

      if (!moveFrom) {
        if (getMoveOptions(sq)) setMoveFrom(sq);
        return;
      }

      const moves = game.moves({ square: moveFrom, verbose: true });
      const found = moves.find((m) => m.from === moveFrom && m.to === sq);

      if (!found) {
        if (getMoveOptions(sq)) {
          setMoveFrom(sq);
        } else {
          if (!isPlayerTurn && isPlayMode && stockfishEnabled) {
            handleUserMove(moveFrom, sq);
            setMoveFrom(null);
            setOptionSquares({});
          } else {
            setMoveFrom(null);
            setOptionSquares({});
          }
        }
        return;
      }

      const piece = game.get(moveFrom);
      const promotion =
        piece?.type === 'p' && (sq[1] === '8' || sq[1] === '1')
          ? 'q'
          : undefined;
      handleUserMove(moveFrom, sq, promotion);
      setMoveFrom(null);
      setOptionSquares({});
    },
    [
      gameOver,
      isViewingHistory,
      goToEnd,
      moveFrom,
      getMoveOptions,
      game,
      isPlayerTurn,
      isPlayMode,
      stockfishEnabled,
      handleUserMove,
      setMoveFrom,
      setOptionSquares
    ]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      if (premoves.length > 0) {
        setPremoves([]);
        return;
      }
      baseHandleSquareRightClick({ square });
    },
    [premoves, baseHandleSquareRightClick]
  );

  const squareStyles: SquareStyles = {
    ...baseSquareStyles,
    ...premoves.reduce(
      (acc, p) => ({
        ...acc,
        [p.from]: BOARD_STYLES.premoveSquare,
        [p.to]: BOARD_STYLES.premoveSquare
      }),
      {}
    )
  };

  return (
    <Board
      position={position}
      boardOrientation={
        isMounted ? effectiveBoardOrientation : serverOrientation || 'white'
      }
      canDrag={isMounted && !isViewingHistory}
      squareStyles={isMounted ? squareStyles : {}}
      darkSquareStyle={theme.darkSquareStyle}
      lightSquareStyle={theme.lightSquareStyle}
      onPieceDrop={onDrop}
      onSquareClick={handleSquareClick}
      onSquareRightClick={handleSquareRightClick}
      arrows={analysisArrows}
    />
  );
}
