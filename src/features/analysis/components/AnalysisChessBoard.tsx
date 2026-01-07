'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import {
  useAnalysisBoardState,
  useAnalysisBoardActions
} from '../stores/useAnalysisBoardStore';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisConfig,
  useAnalysisPosition
} from '@/features/chess/stores/useAnalysisStore';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import {
  useBoardTheme,
  getMoveOptionStyles
} from '@/features/chess/hooks/useSquareInteraction';
import { useStockfish } from '@/features/engine/hooks/useStockfish';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';
import { SquareStyles, RightClickedSquares } from '@/features/chess/types/core';
import { useChessSettings } from '@/features/chess/stores/useChessStore';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function AnalysisChessBoard() {
  const {
    game,
    currentFEN,
    viewingIndex,
    positionHistory,
    boardOrientation,
    playingAgainstStockfish,
    playerColor,
    stockfishLevel
  } = useAnalysisBoardState();

  const { makeMove, goToEnd } = useAnalysisBoardActions();

  // Get sound settings from main chess store (shared preference)
  const { soundEnabled } = useChessSettings();

  const { isAnalysisOn } = useAnalysisState();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  const [isMounted, setIsMounted] = useState(false);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});

  const gameRef = useRef(game);
  gameRef.current = game;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const theme = useBoardTheme();

  const isViewingHistory = viewingIndex < positionHistory.length - 1;

  const playerColorShort = playerColor === 'white' ? 'w' : 'b';
  const gameTurn = game.turn();
  const isPlayerTurn = gameTurn === playerColorShort;

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor: playerColorShort,
    gameTurn,
    analysisTurn
  });

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
      const isPlayerMove = move.color === (playerColor === 'white' ? 'w' : 'b');
      const soundType = getSoundType(
        isCapture,
        isCheck,
        isCastle,
        isPromotion,
        isPlayerMove
      );
      playSound(soundType);
    },
    [playerColor]
  );

  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      const move = makeMove(from, to, promotion || 'q');
      if (move) {
        playMoveSound(move, gameRef.current);
        setMoveFrom(null);
        setOptionSquares({});
        return true;
      }
      return false;
    },
    [makeMove, playMoveSound]
  );

  useStockfish({
    game,
    fen: currentFEN,
    gameId: 1,
    playAs: playerColor,
    stockfishLevel,
    enabled: playingAgainstStockfish && !game.isGameOver(),
    onMove: executeMove,
    soundEnabled,
    playSound
  });

  const handleUserMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      if (game.isGameOver()) {
        return false;
      }

      if (isViewingHistory) {
        goToEnd();
        return false;
      }

      if (playingAgainstStockfish) {
        const piece = game.get(from);
        const playerColorShort = playerColor === 'white' ? 'w' : 'b';
        if (piece?.color !== playerColorShort) {
          return false;
        }

        if (!isPlayerTurn) {
          return false;
        }
      }

      const success = executeMove(from, to, promotion);
      if (!success && soundEnabledRef.current) {
        playSound('illegal');
      }
      return success;
    },
    [
      game,
      isViewingHistory,
      goToEnd,
      playingAgainstStockfish,
      playerColor,
      isPlayerTurn,
      executeMove
    ]
  );

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
      if (game.isGameOver()) {
        return;
      }

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
          setMoveFrom(null);
          setOptionSquares({});
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
    [game, isViewingHistory, goToEnd, moveFrom, getMoveOptions, handleUserMove]
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      const sq = square as Square;
      setRightClickedSquares((p) => ({
        ...p,
        [sq]: p[sq]?.backgroundColor ? undefined : BOARD_STYLES.rightClickSquare
      }));
    },
    []
  );

  const squareStyles = useMemo<SquareStyles>(() => {
    return { ...optionSquares, ...rightClickedSquares };
  }, [optionSquares, rightClickedSquares]);

  const position = isMounted
    ? isViewingHistory
      ? currentFEN
      : game.fen()
    : STARTING_FEN;

  return (
    <Board
      position={position}
      boardOrientation={isMounted ? boardOrientation : 'white'}
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
