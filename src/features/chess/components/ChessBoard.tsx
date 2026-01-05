'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { UnifiedChessBoard as Board } from './Board';
import {
  useChessState,
  useChessActions,
  useTimerState
} from '../stores/useChessStore';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig
} from '../stores/useAnalysisStore';
import { useChessArrows } from '../hooks/useChessArrows';
import {
  useBoardTheme,
  getMoveOptionStyles
} from '../hooks/useSquareInteraction';
import { useStockfish } from '@/features/engine/hooks/useStockfish';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';
import { SquareStyles, RightClickedSquares } from '@/features/chess/types/core';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function ChessBoard({
  serverOrientation
}: {
  serverOrientation?: 'white' | 'black';
}) {
  const {
    mode,
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
    boardFlipped
  } = useChessState();

  const { setGameOver, setGameResult, setOnNewGame, makeMove, goToEnd } =
    useChessActions();
  const { switchTimer } = useTimerState();

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();

  const [isMounted, setIsMounted] = useState(false);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const [premoves, setPremoves] = useState<
    Array<{ from: Square; to: Square; promotion?: string }>
  >([]);

  const gameRef = useRef(game);
  gameRef.current = game;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const theme = useBoardTheme();

  const isViewingHistory = viewingIndex < positionHistory.length - 1;
  const isPlayMode = mode === 'play';

  const effectivePlayAs = isPlayMode ? playAs : playerColor;
  const playerTurn = effectivePlayAs === 'white' ? 'w' : 'b';
  const isPlayerTurn = game.turn() === playerTurn;

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    isPlayerTurn
  });

  const effectiveBoardOrientation = useMemo(() => {
    if (isPlayMode) {
      return boardFlipped ? (playAs === 'white' ? 'black' : 'white') : playAs;
    }
    return boardOrientation;
  }, [isPlayMode, boardFlipped, playAs, boardOrientation]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playMoveSound = useCallback(
    (move: Move, gameAfterMove: Chess) => {
      if (!soundEnabledRef.current) return;
      const isCapture = move.captured !== undefined;
      const isCheck = gameAfterMove.isCheck();
      const isCastle = move.san === 'O-O' || move.san === 'O-O-O';
      const isPromotion = move.promotion !== undefined;
      const isPlayerMove =
        move.color === (effectivePlayAs === 'white' ? 'w' : 'b');
      const soundType = getSoundType(
        isCapture,
        isCheck,
        isCastle,
        isPromotion,
        isPlayerMove
      );
      playSound(soundType);
    },
    [effectivePlayAs]
  );

  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      const move = makeMove(from, to, promotion || 'q');
      if (move) {
        playMoveSound(move, gameRef.current);
        setMoveFrom(null);
        setOptionSquares({});

        if (isPlayMode) {
          const activeColor =
            gameRef.current.turn() === 'w' ? 'white' : 'black';
          switchTimer(activeColor);
        }

        return true;
      }
      return false;
    },
    [makeMove, playMoveSound, isPlayMode, switchTimer]
  );

  const stockfishEnabled = isPlayMode || playingAgainstStockfish;

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

  const handleUserMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      if (isViewingHistory) {
        goToEnd();
        return false;
      }

      if (stockfishEnabled) {
        const piece = game.get(from);
        const playerColorShort = effectivePlayAs === 'white' ? 'w' : 'b';
        if (piece?.color !== playerColorShort) {
          return false;
        }

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
      isViewingHistory,
      goToEnd,
      game,
      effectivePlayAs,
      isPlayerTurn,
      isPlayMode,
      executeMove,
      stockfishEnabled
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
        const isUserWin =
          (playAs === 'white' && winner === 'White') ||
          (playAs === 'black' && winner === 'Black');
        setGameResult(isUserWin ? 'You win!' : 'Stockfish wins!');
      } else if (game.isDraw()) {
        setGameResult('Draw!');
      } else if (game.isStalemate()) {
        setGameResult('Stalemate!');
      }
      setGameOver(true);
    }
  }, [game, isPlayMode, playAs, setGameResult, setGameOver, soundEnabled]);

  const onNewGame = useCallback(() => {
    if (soundEnabledRef.current) playSound('game-start');
    setOptionSquares({});
    setRightClickedSquares({});
    setMoveFrom(null);
    setPremoves([]);
  }, []);

  useEffect(() => {
    setOnNewGame(onNewGame);
    return () => setOnNewGame(() => {});
  }, [onNewGame, setOnNewGame]);

  const getMoveOptions = useCallback(
    (square: Square): boolean => {
      const moves = game.moves({ square, verbose: true });
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }
      const newSquares = getMoveOptionStyles(moves, square);
      setOptionSquares(newSquares);
      return true;
    },
    [game]
  );

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
      if (isViewingHistory) {
        goToEnd();
        return;
      }

      setRightClickedSquares({});
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
      isViewingHistory,
      goToEnd,
      moveFrom,
      getMoveOptions,
      game,
      isPlayerTurn,
      isPlayMode,
      handleUserMove,
      stockfishEnabled
    ]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      if (premoves.length > 0) {
        setPremoves([]);
        return;
      }
      const sq = square as Square;
      setRightClickedSquares((p) => ({
        ...p,
        [sq]: p[sq]?.backgroundColor ? undefined : BOARD_STYLES.rightClickSquare
      }));
    },
    [premoves]
  );

  const squareStyles = useMemo<SquareStyles>(() => {
    const s = { ...optionSquares, ...rightClickedSquares };
    premoves.forEach((p) => {
      s[p.from] = BOARD_STYLES.premoveSquare;
      s[p.to] = BOARD_STYLES.premoveSquare;
    });
    return s;
  }, [optionSquares, rightClickedSquares, premoves]);

  const position = isMounted
    ? isViewingHistory
      ? currentFEN
      : game.fen()
    : STARTING_FEN;

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
