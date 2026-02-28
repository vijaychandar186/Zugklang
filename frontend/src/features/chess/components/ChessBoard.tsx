'use client';
import { useEffect, useCallback, useMemo, useRef } from 'react';
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
import { buildCheckerPieces } from '@/features/chess/variants/checkers-chess/components/CheckerPieces';
import type { OnOpponentMoveFn } from '@/features/multiplayer/types';
import type { Square, Move } from '@/lib/chess/chess';

interface ChessBoardProps {
  serverOrientation?: 'white' | 'black';
  initialBoard3dEnabled?: boolean;
  /**
   * When provided the board operates in multiplayer mode: moves are forwarded
   * to the server and opponent moves arrive externally.
   * Omit entirely for local / vs-computer play.
   */
  onPlayerMove?: (from: string, to: string, promotion?: string) => void;
  setOnOpponentMove?: (fn: OnOpponentMoveFn | null) => void;
  movesToReplay?: string[] | null;
  onMovesReplayed?: () => void;
}

export function ChessBoard({
  serverOrientation,
  initialBoard3dEnabled,
  onPlayerMove,
  setOnOpponentMove,
  movesToReplay,
  onMovesReplayed
}: ChessBoardProps) {
  const isMultiplayer = !!onPlayerMove;

  // ── Store state ────────────────────────────────────────────────────────────
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
    engineConfig,
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
    recordMoveDepth,
    goToEnd,
    flipBoard
  } = useChessActions();

  // Always call — switchTimer is only used in single-player mode.
  const { switchTimer } = useTimerState();

  const isLocalGame = gameType === 'local';
  const isPlayMode = mode === 'play';

  // In play mode use playAs; in analysis mode use playerColor.
  const effectivePlayAs = isMultiplayer || isPlayMode ? playAs : playerColor;

  // ── Analysis ───────────────────────────────────────────────────────────────
  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();
  const theme = useBoardTheme();

  // ── Engine (disabled in multiplayer via enabled:false) ────────────────────
  const stockfishEnabled =
    !isMultiplayer && ((isPlayMode && !isLocalGame) || playingAgainstStockfish);
  const useFairy = usesFairyEngine(variant);
  const useStandardEngine = !useFairy;

  // ── Opponent-move tracking ref (multiplayer) ───────────────────────────────
  const isApplyingOpponentMoveRef = useRef(false);

  // ── onMoveExecuted: diverges between single-player and multiplayer ─────────
  const onMoveExecuted = useCallback(
    (move: Move) => {
      if (isMultiplayer) {
        if (!isApplyingOpponentMoveRef.current) {
          onPlayerMove!(move.from, move.to, move.promotion);
        }
      } else {
        if (isPlayMode) {
          const activeColor = game.turn() === 'w' ? 'white' : 'black';
          switchTimer(activeColor);
          if (isLocalGame && autoFlipBoard) flipBoard();
          if (!isLocalGame) {
            const previousTurn = game.turn() === 'w' ? 'black' : 'white';
            if (previousTurn === playAs) recordMoveDepth(null);
          }
        }
      }
    },
    [
      isMultiplayer,
      onPlayerMove,
      isPlayMode,
      game,
      switchTimer,
      isLocalGame,
      autoFlipBoard,
      flipBoard,
      playAs,
      recordMoveDepth
    ]
  );

  const onPremoveAdded = useCallback(() => {
    if (soundEnabled) playSound('premove');
  }, [soundEnabled]);

  // ── Board logic (shared) ──────────────────────────────────────────────────
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
    allowOpponentMoves: isMultiplayer ? false : !stockfishEnabled,
    enablePremoves: !isMultiplayer && stockfishEnabled && isPlayMode,
    onPremoveAdded: isMultiplayer ? undefined : onPremoveAdded
  });

  // Stable refs so effects can reference latest versions without re-running.
  const executeMoveRef = useRef(executeMove);
  executeMoveRef.current = executeMove;
  const makeDropMoveRef = useRef(makeDropMove);
  makeDropMoveRef.current = makeDropMove;

  // ── Engine hooks ──────────────────────────────────────────────────────────
  const executeDropMove = useCallback(
    (san: string) => {
      const move = makeDropMove(san);
      if (move) {
        if (isMultiplayer) {
          onPlayerMove!('@', san);
        } else {
          onMoveExecuted(move as Move);
        }
      }
      return move;
    },
    [makeDropMove, isMultiplayer, onPlayerMove, onMoveExecuted]
  );

  useStockfish({
    game,
    fen: currentFEN,
    gameId: isPlayMode ? gameId : 1,
    playAs: effectivePlayAs,
    engineConfig,
    enabled: stockfishEnabled && !gameOver && useStandardEngine,
    onMove: executeMove,
    onMoveDepthRecorded: recordMoveDepth,
    soundEnabled,
    playSound
  });

  useFairyStockfish({
    game,
    fen: currentFEN,
    gameId: isPlayMode ? gameId : 1,
    playAs: effectivePlayAs,
    engineConfig,
    enabled: stockfishEnabled && !gameOver && useFairy,
    variant,
    onMove: executeMove,
    onDropMove: executeDropMove,
    onMoveDepthRecorded: recordMoveDepth,
    soundEnabled,
    playSound
  });

  // ── Multiplayer: register opponent-move handler ────────────────────────────
  useEffect(() => {
    if (!isMultiplayer || !setOnOpponentMove) return;
    const applyOpponentMove: OnOpponentMoveFn = (from, to, promotion) => {
      isApplyingOpponentMoveRef.current = true;
      if (from === '@') {
        makeDropMoveRef.current(to);
      } else {
        executeMoveRef.current(from as Square, to as Square, promotion);
      }
      isApplyingOpponentMoveRef.current = false;
    };
    setOnOpponentMove(applyOpponentMove);
    return () => setOnOpponentMove(null);
  }, [isMultiplayer, setOnOpponentMove]);

  // ── Multiplayer: replay moves on rejoin ────────────────────────────────────
  useEffect(() => {
    if (!isMultiplayer || !movesToReplay || movesToReplay.length === 0) return;
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
  }, [movesToReplay, onMovesReplayed, isMultiplayer]);

  // ── Analysis arrows ───────────────────────────────────────────────────────
  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor: playerColorShort,
    gameTurn,
    analysisTurn
  });

  // ── Loser highlight ───────────────────────────────────────────────────────
  const loserColor = useMemo((): 'w' | 'b' | null => {
    if (!gameOver) return null;
    const outcome = game.outcome();
    if (!outcome || outcome.winner === undefined) return null;
    return outcome.winner === 'w' ? 'b' : 'w';
  }, [gameOver, game]);

  // ── Board orientation ─────────────────────────────────────────────────────
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

  // ── Variant extras ────────────────────────────────────────────────────────
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
    playerColor: effectivePlayAs,
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

  // ── Game-over detection ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlayMode || !gameStarted) return;
    if (game.isGameOver()) {
      if (soundEnabled) playSound('game-end');
      const outcome = game.outcome();
      if (!outcome || outcome.winner === undefined) {
        setGameResult('Draw!');
      } else {
        const winner = outcome.winner === 'w' ? 'White' : 'Black';
        if (isMultiplayer) {
          const isUserWin =
            (playAs === 'white' && winner === 'White') ||
            (playAs === 'black' && winner === 'Black');
          setGameResult(isUserWin ? 'You win!' : 'Opponent wins!');
        } else if (isLocalGame) {
          setGameResult(`${winner} wins!`);
        } else {
          const isUserWin =
            (playAs === 'white' && winner === 'White') ||
            (playAs === 'black' && winner === 'Black');
          setGameResult(
            isUserWin ? 'You win!' : `${getEngineName(variant)} wins!`
          );
        }
      }
      setGameOver(true);
    }
  }, [
    game,
    currentFEN,
    isPlayMode,
    gameStarted,
    isMultiplayer,
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

  // ── Render ────────────────────────────────────────────────────────────────
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
