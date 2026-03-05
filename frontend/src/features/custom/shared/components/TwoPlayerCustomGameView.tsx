'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { GameShell } from '@/features/chess/components/GameShell';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useAnalysisSync } from '@/features/chess/hooks/useAnalysisSync';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage
} from '@/features/chess/utils/fen-logic';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import type { CapturedPieces } from '@/features/chess/types/core';
import type { TimeControl } from '@/features/game/types/rules';
import type { TwoPlayerPlayerInfo } from '@/features/chess/types/game-engine-contract';
type MoveResult = {
  color: 'w' | 'b';
  san: string;
  captured?: unknown;
  promotion?: unknown;
} | null;
interface TwoPlayerCustomGameViewProps {
  currentFEN: string;
  gameStarted: boolean;
  gameOver: boolean;
  highlightedSquares: Record<string, CSSProperties>;
  makeMove: (from: string, to: string, promotion?: string) => MoveResult;
  isCheck: () => boolean;
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  sidebar: ReactNode;
  canMove?: boolean;
  loserColor?: 'w' | 'b' | null;
  topPlayer?: TwoPlayerPlayerInfo;
  bottomPlayer?: TwoPlayerPlayerInfo;
  topPlayerExtras?: ReactNode;
  bottomPlayerExtras?: ReactNode;
  overlays?: ReactNode;
  serverOrientation?: 'white' | 'black';
  onPieceDrop?: (args: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
}
export function TwoPlayerCustomGameView({
  currentFEN,
  gameStarted,
  gameOver,
  highlightedSquares,
  makeMove,
  isCheck,
  timeControl,
  whiteTime,
  blackTime,
  activeTimer,
  sidebar,
  canMove = true,
  loserColor = null,
  topPlayer,
  bottomPlayer,
  topPlayerExtras,
  bottomPlayerExtras,
  overlays,
  serverOrientation = 'white',
  onPieceDrop: externalPieceDrop
}: TwoPlayerCustomGameViewProps) {
  const boardFlipped = useChessStore((s) => s.boardFlipped);
  // isViewingFromBlack: true when the board is currently showing from black's POV.
  // For a black player (serverOrientation='black'), not flipped → viewing from black.
  // For a white player (serverOrientation='white'), flipped → viewing from black.
  const isViewingFromBlack =
    serverOrientation === 'black' ? !boardFlipped : boardFlipped;
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const theme = useBoardTheme();
  const [captured, setCaptured] = useState<CapturedPieces>({
    white: [],
    black: []
  });
  const [materialAdvantage, setMaterialAdvantage] = useState(0);
  useAnalysisSync(currentFEN);
  useEffect(() => {
    if (!currentFEN) return;
    const caps = getCapturedPiecesFromFEN(currentFEN);
    setCaptured(caps);
    setMaterialAdvantage(getMaterialAdvantage(caps));
  }, [currentFEN]);
  useEffect(() => {
    if (gameOver && gameStarted && soundEnabled) {
      playSound('game-end');
    }
  }, [gameOver, gameStarted, soundEnabled]);
  function handlePieceDrop({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) {
    if (externalPieceDrop)
      return externalPieceDrop({ sourceSquare, targetSquare });
    if (!targetSquare) return false;
    let move = makeMove(sourceSquare, targetSquare);
    if (!move) move = makeMove(sourceSquare, targetSquare, 'q');
    if (move) {
      if (soundEnabled) {
        const isCapture = move.captured !== undefined;
        const moveIsCheck = isCheck();
        const isCastle = move.san === 'O-O' || move.san === 'O-O-O';
        const isPromotion = move.promotion !== undefined;
        playSound(
          getSoundType(isCapture, moveIsCheck, isCastle, isPromotion, true)
        );
      }
      return true;
    }
    if (soundEnabled) playSound('illegal');
    return false;
  }
  const isActive = gameStarted && !gameOver && canMove;
  const orientation = isViewingFromBlack ? ('black' as const) : ('white' as const);
  const hasTimer = timeControl.mode === 'timed';
  const topTime = isViewingFromBlack ? whiteTime : blackTime;
  const bottomTime = isViewingFromBlack ? blackTime : whiteTime;
  const topColor = isViewingFromBlack ? 'white' : 'black';
  const bottomColor = isViewingFromBlack ? 'black' : 'white';
  const topTimerActive = activeTimer === topColor && !gameOver;
  const bottomTimerActive = activeTimer === bottomColor && !gameOver;
  const topCaptured = isViewingFromBlack ? captured.black : captured.white;
  const bottomCaptured = isViewingFromBlack ? captured.white : captured.black;
  const topAdvantage = isViewingFromBlack
    ? materialAdvantage > 0
      ? materialAdvantage
      : undefined
    : materialAdvantage < 0
      ? Math.abs(materialAdvantage)
      : undefined;
  const bottomAdvantage = isViewingFromBlack
    ? materialAdvantage < 0
      ? Math.abs(materialAdvantage)
      : undefined
    : materialAdvantage > 0
      ? materialAdvantage
      : undefined;
  const topInfo: TwoPlayerPlayerInfo = topPlayer ?? {
    name: isViewingFromBlack ? 'White' : 'Black'
  };
  const bottomInfo: TwoPlayerPlayerInfo = bottomPlayer ?? {
    name: isViewingFromBlack ? 'Black' : 'White'
  };
  const topPieceColor = isViewingFromBlack ? ('white' as const) : ('black' as const);
  const bottomPieceColor = isViewingFromBlack
    ? ('black' as const)
    : ('white' as const);
  return (
    <GameShell
      topLeft={
        <>
          <PlayerInfo
            name={topInfo.name}
            image={topInfo.image}
            rating={topInfo.rating}
            ratingDelta={topInfo.ratingDelta}
            flagCode={topInfo.flagCode}
          />
          {topPlayerExtras}
        </>
      }
      topRight={
        <>
          <CapturedPiecesDisplay
            pieces={topCaptured}
            pieceColor={topPieceColor}
            advantage={topAdvantage}
          />
          {hasTimer && (
            <PlayerClock time={topTime} isActive={topTimerActive} isPlayer />
          )}
        </>
      }
      bottomLeft={
        <>
          <PlayerInfo
            name={bottomInfo.name}
            image={bottomInfo.image}
            rating={bottomInfo.rating}
            ratingDelta={bottomInfo.ratingDelta}
            flagCode={bottomInfo.flagCode}
          />
          {bottomPlayerExtras}
        </>
      }
      bottomRight={
        <>
          <CapturedPiecesDisplay
            pieces={bottomCaptured}
            pieceColor={bottomPieceColor}
            advantage={bottomAdvantage}
          />
          {hasTimer && (
            <PlayerClock
              time={bottomTime}
              isActive={bottomTimerActive}
              isPlayer
            />
          )}
        </>
      }
      boardArea={
        <BoardContainer>
          {board3dEnabled ? (
            <Board3D
              position={currentFEN}
              onPieceDrop={handlePieceDrop}
              boardOrientation={orientation}
              canDrag={isActive}
              squareStyles={highlightedSquares}
              loserColor={loserColor}
            />
          ) : (
            <Board
              position={currentFEN}
              onPieceDrop={handlePieceDrop}
              boardOrientation={orientation}
              darkSquareStyle={theme.darkSquareStyle}
              lightSquareStyle={theme.lightSquareStyle}
              canDrag={isActive}
              animationDuration={200}
              squareStyles={highlightedSquares}
              loserColor={loserColor}
            />
          )}
        </BoardContainer>
      }
      sidebar={sidebar}
      overlays={overlays}
    />
  );
}
