'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTriDChessStore } from '../store/useTriDChessStore';
import { TriDChessBoard } from './TriDChessBoard';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { getPieceAssetPath } from '@/features/chess/config/media-themes';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import type {
  PieceType,
  AttackBoardId,
  AttackBoardSlot,
  TriDSquare
} from '../engine/types';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { GameShell } from '@/features/chess/components/GameShell';
import { TwoPlayerCustomSidebar } from '@/features/custom/shared/components/TwoPlayerCustomSidebar';
import { TwoPlayerCustomSetupDialog } from '@/features/custom/shared/components/TwoPlayerCustomSetupDialog';
function TriDSetupDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const startNewGame = useTriDChessStore((s) => s.startNewGame);
  return (
    <TwoPlayerCustomSetupDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Tri-Dimensional Chess'
      onStartNewGame={startNewGame}
      rules={
        <p className='text-muted-foreground text-center text-sm'>
          Star Trek&rsquo;s classic 3D variant — played flat.
          <br />
          Three 4×4 fixed boards + four movable 2×2 attack boards.
          <br />
          On your turn: move a piece OR reposition an attack board.
        </p>
      }
    />
  );
}
const PROMOTE_PIECES: PieceType[] = ['q', 'r', 'b', 'n'];
function PromotionDialog({
  color,
  pieceTheme,
  onSelect,
  onCancel
}: {
  color: 'w' | 'b';
  pieceTheme: string;
  onSelect: (p: PieceType) => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className='sm:max-w-xs'>
        <DialogHeader>
          <DialogTitle>Choose promotion piece</DialogTitle>
        </DialogHeader>
        <div className='flex justify-center gap-3 py-2'>
          {PROMOTE_PIECES.map((p) => (
            <button
              key={p}
              className='border-border hover:bg-muted rounded border p-2'
              onClick={() => onSelect(p)}
            >
              <Image
                src={getPieceAssetPath(pieceTheme, `${color}${p}`)}
                alt={p}
                width={48}
                height={48}
                unoptimized
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
const BOARD_CONTAINER_CLASS =
  'lg:h-[min(70vw,calc(100dvh-180px),820px)] xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)] [&>[data-board-container]]:h-full';
export function TriDChessView({
  initialPieceTheme = 'classic'
}: {
  initialPieceTheme?: string;
}) {
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const [squareSize, setSquareSize] = useState(36);
  const {
    gameState,
    gameStarted,
    viewingIndex,
    selected,
    selectedBoardId,
    highlightedSquares,
    highlightedSlots,
    inCheck,
    pendingPromotion,
    pendingBoardArrival,
    whiteTime,
    blackTime,
    activeTimer,
    timeControl,
    selectSquare,
    selectAttackBoard,
    moveAttackBoard,
    completePromotion,
    cancelPromotion,
    tickTimer,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    setGameOver,
    setGameResult
  } = useTriDChessStore();
  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const storePieceTheme = useChessStore((s) => s.pieceThemeName);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const flipBoard = useChessStore((s) => s.flipBoard);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const pieceTheme = isMounted ? storePieceTheme : initialPieceTheme;
  useEffect(() => {
    if (timeControl.mode !== 'timed' || gameState.isOver || !gameStarted)
      return;
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [timeControl.mode, gameState.isOver, gameStarted, tickTimer]);
  const prevGameStarted = useRef(false);
  useEffect(() => {
    if (gameStarted && !prevGameStarted.current && soundEnabled)
      playSound('game-start');
    prevGameStarted.current = gameStarted;
  }, [gameStarted, soundEnabled]);
  const prevMoveCount = useRef(gameState.moveHistory.length);
  useEffect(() => {
    const moves = gameState.moveHistory;
    if (moves.length === 0) {
      prevMoveCount.current = 0;
      return;
    }
    if (moves.length <= prevMoveCount.current) {
      prevMoveCount.current = moves.length;
      return;
    }
    prevMoveCount.current = moves.length;
    if (!soundEnabled) return;
    const last = moves[moves.length - 1];
    if (last.type === 'board') {
      playSound('move-self');
      return;
    }
    const isCapture = !!last.captured;
    const isCheck = last.san.includes('+') || last.san.includes('#');
    const isCastle = last.san === '0-0' || last.san === '0-0-0';
    const isPromotion = !!last.promotion;
    playSound(getSoundType(isCapture, isCheck, isCastle, isPromotion, true));
  }, [gameState.moveHistory, soundEnabled]);
  useLayoutEffect(() => {
    const el = boardViewportRef.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const uw = Math.max(0, r.width - 28);
      const uh = Math.max(0, r.height - 28);
      if (uw < 160 || uh < 160) return;
      const next = Math.max(
        30,
        Math.min(72, Math.floor((uw - 40) / 8), Math.floor((uh - 84) / 12))
      );
      if (Number.isFinite(next)) setSquareSize((p) => (p === next ? p : next));
    };
    compute();
    if (typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const update = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const isActive =
    gameStarted &&
    !gameState.isOver &&
    viewingIndex === gameState.snapshots.length - 1;
  const hasTimer = timeControl.mode === 'timed';
  const snapshot =
    gameState.snapshots[viewingIndex] ??
    gameState.snapshots[gameState.snapshots.length - 1];
  const displayPieces =
    viewingIndex === gameState.snapshots.length - 1
      ? gameState.pieces
      : snapshot.pieces;
  const displaySlots =
    viewingIndex === gameState.snapshots.length - 1
      ? gameState.slots
      : snapshot.slots;
  const topColor = boardFlipped ? 'white' : 'black';
  const bottomColor = boardFlipped ? 'black' : 'white';
  const topTimerActive = activeTimer === topColor && !gameState.isOver;
  const bottomTimerActive = activeTimer === bottomColor && !gameState.isOver;
  const moves = useMemo(
    () => gameState.moveHistory.map((m) => m.san),
    [gameState.moveHistory]
  );
  const positionHistory = useMemo(
    () => gameState.snapshots.map(() => ''),
    [gameState.snapshots]
  );
  const infoPanel = useMemo(() => {
    if (!gameStarted || gameState.isOver) return null;
    return pendingBoardArrival ? (
      <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
        <p className='font-semibold'>Choose arrival square</p>
        <p>
          Click one of the two highlighted squares to place the transported
          piece.
        </p>
      </div>
    ) : (
      <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
        <p className='font-semibold'>
          {gameState.turn === 'w' ? 'White' : 'Black'}&apos;s turn
        </p>
        <p>
          Click a piece to see legal moves, or click an attack board label to
          reposition it.
        </p>
      </div>
    );
  }, [gameStarted, gameState.isOver, gameState.turn, pendingBoardArrival]);
  const topName = boardFlipped ? 'White' : 'Black';
  const bottomName = boardFlipped ? 'Black' : 'White';
  const topTime = boardFlipped ? whiteTime : blackTime;
  const bottomTime = boardFlipped ? blackTime : whiteTime;
  return (
    <GameShell
      topLeft={<PlayerInfo name={topName} />}
      topRight={
        hasTimer ? (
          <PlayerClock time={topTime} isActive={topTimerActive} isPlayer />
        ) : undefined
      }
      bottomLeft={<PlayerInfo name={bottomName} />}
      bottomRight={
        hasTimer ? (
          <PlayerClock
            time={bottomTime}
            isActive={bottomTimerActive}
            isPlayer
          />
        ) : undefined
      }
      boardArea={
        <BoardContainer
          showEvaluation={false}
          className={BOARD_CONTAINER_CLASS}
        >
          <div
            ref={boardViewportRef}
            className='border-border/30 bg-card flex h-full items-center justify-center rounded-lg border p-3 shadow-md'
          >
            <TriDChessBoard
              pieces={displayPieces}
              slots={displaySlots}
              selectedSquare={isActive ? selected : null}
              selectedBoardId={isActive ? selectedBoardId : null}
              highlightedSquares={isActive ? highlightedSquares : new Set()}
              highlightedSlots={isActive ? highlightedSlots : new Set()}
              inCheck={inCheck && isActive}
              turn={gameState.turn}
              flipped={boardFlipped}
              onSquareClick={(sq: TriDSquare) => isActive && selectSquare(sq)}
              onAttackBoardClick={(id: AttackBoardId) =>
                isActive && selectAttackBoard(id)
              }
              onSlotClick={(id: AttackBoardId, slot: AttackBoardSlot) =>
                isActive && moveAttackBoard(id, slot)
              }
              isActive={isActive}
              squareSize={squareSize}
              pieceTheme={pieceTheme}
            />
          </div>
        </BoardContainer>
      }
      sidebar={
        <TwoPlayerCustomSidebar
          mode='play'
          moves={moves}
          viewingIndex={viewingIndex}
          positionHistory={positionHistory}
          gameOver={gameState.isOver}
          gameResult={gameState.result}
          gameStarted={gameStarted}
          turn={gameState.turn}
          soundEnabled={soundEnabled}
          isAnalysisOn={false}
          isAnalysisReady={false}
          onGoToStart={goToStart}
          onGoToEnd={goToEnd}
          onGoToPrev={goToPrev}
          onGoToNext={goToNext}
          onGoToMove={goToMove}
          onSetGameOver={setGameOver}
          onSetGameResult={setGameResult}
          onFlipBoard={flipBoard}
          onStartAnalysis={() => {}}
          onEndAnalysis={() => {}}
          setupDialog={TriDSetupDialog}
          activePanel={infoPanel}
        />
      }
      overlays={
        pendingPromotion ? (
          <PromotionDialog
            color={gameState.turn}
            pieceTheme={pieceTheme}
            onSelect={completePromotion}
            onCancel={cancelPromotion}
          />
        ) : null
      }
    />
  );
}
