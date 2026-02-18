'use client';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { PromotionDialog } from '@/features/chess/components/PromotionDialog';
import {
  useChessState,
  useChessActions,
  useTimerState
} from '@/features/chess/stores/useChessStore';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { useChessBoardLogic } from '@/features/chess/hooks/useChessBoardLogic';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { playSound } from '@/features/game/utils/sounds';
import '@/features/chess/variants';
import { variantRegistry } from '@/features/chess/variants/shared/VariantRegistry';
import { useCrazyhousePocket } from '@/features/chess/variants/crazyhouse/hooks/useCrazyhousePocket';
import { buildCheckerPieces } from '@/features/chess/variants/checkers-chess/components/CheckerPieces';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig,
  useAnalysisPosition
} from '@/features/chess/stores/useAnalysisStore';
import type { OnOpponentMoveFn } from '../types';
import type { Square, Move } from '@/lib/chess';

interface MultiplayerChessBoardProps {
  serverOrientation?: 'white' | 'black';
  initialBoard3dEnabled?: boolean;
  /** Called with the move the local player just made */
  onPlayerMove: (from: string, to: string, promotion?: string) => void;
  /** Register the callback to apply an incoming opponent move */
  setOnOpponentMove: (fn: OnOpponentMoveFn | null) => void;
  /** Moves to silently replay after reconnection (UCI strings e.g. "e2e4", "@N@e4") */
  movesToReplay?: string[] | null;
  /** Called after all movesToReplay have been applied */
  onMovesReplayed?: () => void;
}

export function MultiplayerChessBoard({
  serverOrientation,
  initialBoard3dEnabled,
  onPlayerMove,
  setOnOpponentMove,
  movesToReplay,
  onMovesReplayed
}: MultiplayerChessBoardProps) {
  const {
    mode,
    hasHydrated,
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    boardOrientation,
    playAs,
    gameOver,
    gameStarted,
    gameId,
    soundEnabled,
    board3dEnabled,
    boardFlipped,
    variant
  } = useChessState();

  const {
    setGameOver,
    setGameResult,
    setOnNewGame,
    makeMove,
    makeDropMove,
    goToEnd
  } = useChessActions();
  const { switchTimer } = useTimerState();

  const isPlayMode = mode === 'play';

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  const theme = useBoardTheme();

  // Track whether a move being executed came from the opponent (via WS)
  const isApplyingOpponentMoveRef = useRef(false);

  const onMoveExecuted = useCallback(
    (move: Move) => {
      if (isPlayMode) {
        const activeColor = game.turn() === 'w' ? 'white' : 'black';
        switchTimer(activeColor);
      }
      // Only forward to WS if this is a local player move
      if (!isApplyingOpponentMoveRef.current) {
        onPlayerMove(move.from, move.to, move.promotion);
      }
    },
    [isPlayMode, game, switchTimer, onPlayerMove]
  );

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
    playerColor: playAs,
    soundEnabled,
    variant,
    makeMove,
    goToEnd,
    isGameOver: gameOver || (isPlayMode && !gameStarted),
    onMoveExecuted,
    allowOpponentMoves: false // multiplayer: only allow own pieces
  });

  // Expose executeMove so the WS hook can apply opponent moves
  const executeMoveRef = useRef(executeMove);
  executeMoveRef.current = executeMove;

  useEffect(() => {
    const applyOpponentMove: OnOpponentMoveFn = (from, to, promotion) => {
      isApplyingOpponentMoveRef.current = true;
      if (from === '@') {
        // Crazyhouse drop move — `to` is the full SAN e.g. "N@e4"
        makeDropMove(to);
        // Switch timer manually (makeDropMove doesn't trigger onMoveExecuted)
        if (isPlayMode) {
          const activeColor = game.turn() === 'w' ? 'white' : 'black';
          switchTimer(activeColor);
        }
      } else {
        executeMoveRef.current(from as Square, to as Square, promotion);
      }
      isApplyingOpponentMoveRef.current = false;
    };
    setOnOpponentMove(applyOpponentMove);
    return () => setOnOpponentMove(null);
  }, [setOnOpponentMove, makeDropMove, isPlayMode, game, switchTimer]);

  // Replay moves silently after reconnection
  const makeDropMoveRef = useRef(makeDropMove);
  makeDropMoveRef.current = makeDropMove;
  useEffect(() => {
    if (!movesToReplay || movesToReplay.length === 0) return;
    for (const moveStr of movesToReplay) {
      const from = moveStr.slice(0, 2);
      const to = moveStr.slice(2, 4);
      const promotion = moveStr.slice(4) || undefined;
      isApplyingOpponentMoveRef.current = true;
      if (from === '@') {
        makeDropMoveRef.current(to);
      } else {
        executeMoveRef.current(from as Square, to as Square, promotion);
      }
      isApplyingOpponentMoveRef.current = false;
    }
    onMovesReplayed?.();
  }, [movesToReplay, onMovesReplayed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Crazyhouse drop moves: player's own drops
  const executeDropMove = useCallback(
    (san: string) => {
      const move = makeDropMove(san);
      if (move) {
        if (isPlayMode) {
          const activeColor = game.turn() === 'w' ? 'white' : 'black';
          switchTimer(activeColor);
        }
        // '@' as from-square signals a drop move to the WS peer
        onPlayerMove('@', san);
      }
      return move;
    },
    [makeDropMove, isPlayMode, game, switchTimer, onPlayerMove]
  );

  // Game-over detection (checkmate / stalemate / variant win)
  useEffect(() => {
    if (!isPlayMode || !gameStarted) return;
    if (game.isGameOver()) {
      if (soundEnabled) playSound('game-end');
      const outcome = game.outcome();
      if (!outcome || outcome.winner === undefined) {
        setGameResult('Draw!');
      } else {
        const winner = outcome.winner === 'w' ? 'White' : 'Black';
        const isUserWin =
          (playAs === 'white' && winner === 'White') ||
          (playAs === 'black' && winner === 'Black');
        setGameResult(isUserWin ? 'You win!' : 'Opponent wins!');
      }
      setGameOver(true);
    }
  }, [
    game,
    currentFEN,
    isPlayMode,
    gameStarted,
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

  const variantModule = variantRegistry.getModule(variant);

  const {
    selectedDropPiece,
    dropSquareStyles,
    handleDropOnSquare,
    clearDropSelection
  } = useCrazyhousePocket({
    game,
    variant,
    currentFEN,
    playerColor: playAs,
    makeDropMove: executeDropMove,
    onMoveExecuted: () => {},
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

  const checkerPieces = useMemo(
    () => (variant === 'checkersChess' ? buildCheckerPieces() : undefined),
    [variant]
  );

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
    loserColor,
    ...(checkerPieces ? { pieces: checkerPieces } : {})
  };

  const shouldShow3d =
    isMounted && hasHydrated
      ? board3dEnabled
      : (initialBoard3dEnabled ?? false);

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
