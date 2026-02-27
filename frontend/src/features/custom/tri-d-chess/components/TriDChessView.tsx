'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTriDChessStore } from '../store/useTriDChessStore';
import { TriDChessBoard } from './TriDChessBoard';
import { TriDChessSidebar } from './TriDChessSidebar';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { playSound, getSoundType } from '@/features/game/utils/sounds';
import type {
  PieceType,
  AttackBoardId,
  AttackBoardSlot,
  TriDSquare
} from '../engine/types';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { PlayerClock } from '@/features/chess/components/PlayerClock';
import { BoardContainer } from '@/features/chess/components/BoardContainer';

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
                src={`/theme/pieces/${pieceTheme}/${color}${p}.png`}
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

export function TriDChessView({
  initialPieceTheme = 'classic'
}: {
  initialPieceTheme?: string;
}) {
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const [squareSize, setSquareSize] = useState(36);
  const store = useTriDChessStore();
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
    whiteTime,
    blackTime,
    activeTimer,
    timeControl,
    selectSquare,
    selectAttackBoard,
    moveAttackBoard,
    completePromotion,
    cancelPromotion,
    tickTimer
  } = store;

  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const storePieceTheme = useChessStore((s) => s.pieceThemeName);
  const soundEnabled = useChessStore((s) => s.soundEnabled);

  // Use server-read initial theme until mounted to avoid SSR/client mismatch.
  // After mount, the live store value takes over (picks up mid-game theme changes).
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const pieceTheme = isMounted ? storePieceTheme : initialPieceTheme;

  // Timer tick
  useEffect(() => {
    if (timeControl.mode !== 'timed' || gameState.isOver || !gameStarted)
      return;
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [timeControl.mode, gameState.isOver, gameStarted, tickTimer]);

  // Game-start sound
  const prevGameStarted = useRef(false);
  useEffect(() => {
    if (gameStarted && !prevGameStarted.current && soundEnabled) {
      playSound('game-start');
    }
    prevGameStarted.current = gameStarted;
  }, [gameStarted, soundEnabled]);

  // Move sounds
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

    const lastMove = moves[moves.length - 1];
    if (lastMove.type === 'board') {
      playSound('move-self');
      return;
    }
    const isCapture = !!lastMove.captured;
    const isCheck = lastMove.san.includes('+') || lastMove.san.includes('#');
    const isCastle = lastMove.san === '0-0' || lastMove.san === '0-0-0';
    const isPromotion = !!lastMove.promotion;
    playSound(getSoundType(isCapture, isCheck, isCastle, isPromotion, true));
  }, [gameState.moveHistory, soundEnabled]);

  const isActive =
    gameStarted &&
    !gameState.isOver &&
    viewingIndex === gameState.snapshots.length - 1;
  const hasTimer = timeControl.mode === 'timed';

  // Derive displayed snapshot
  const snapshot =
    gameState.snapshots[viewingIndex] ??
    gameState.snapshots[gameState.snapshots.length - 1];

  // For display: use snapshot pieces/slots when reviewing history
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
  const topTime = boardFlipped ? whiteTime : blackTime;
  const bottomTime = boardFlipped ? blackTime : whiteTime;
  const topTimerActive = activeTimer === topColor && !gameState.isOver;
  const bottomTimerActive = activeTimer === bottomColor && !gameState.isOver;
  const sharedPanelHeightClass =
    'lg:h-[min(70vw,calc(100dvh-180px),820px)] xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)]';
  const triDBoardContainerClass = `${sharedPanelHeightClass} [&>[data-board-container]]:h-full`;

  useLayoutEffect(() => {
    const el = boardViewportRef.current;
    if (!el) return;

    // Tri-D layout: ~8 squares wide, ~12 squares tall + labels/gaps.
    const computeSquareSize = () => {
      const rect = el.getBoundingClientRect();
      const uw = Math.max(0, rect.width - 28);
      const uh = Math.max(0, rect.height - 28);
      if (uw < 160 || uh < 160) return;
      const byW = Math.floor((uw - 40) / 8);
      const byH = Math.floor((uh - 84) / 12);
      const next = Math.max(30, Math.min(72, byW, byH));
      if (Number.isFinite(next))
        setSquareSize((prev) => (prev === next ? prev : next));
    };

    // Run synchronously before paint so the board renders at the correct size immediately.
    computeSquareSize();

    if (typeof ResizeObserver === 'undefined') return;
    let rafId = 0;
    const update = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeSquareSize);
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSquareClick = (sq: TriDSquare) => {
    if (!isActive) return;
    selectSquare(sq);
  };

  const handleAttackBoardClick = (boardId: AttackBoardId) => {
    if (!isActive) return;
    selectAttackBoard(boardId);
  };

  const handleSlotClick = (boardId: AttackBoardId, slot: AttackBoardSlot) => {
    if (!isActive) return;
    moveAttackBoard(boardId, slot);
  };

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      {/* Board column */}
      <div className='flex min-w-0 flex-col items-center gap-2'>
        {/* Top player */}
        <div className='flex w-full items-center justify-between py-2'>
          <div className='flex items-center gap-3'>
            <PlayerInfo name={boardFlipped ? 'White' : 'Black'} />
            {hasTimer && (
              <PlayerClock time={topTime} isActive={topTimerActive} isPlayer />
            )}
          </div>
        </div>

        {/* The 7-board layout */}
        <BoardContainer
          showEvaluation={false}
          className={triDBoardContainerClass}
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
              onSquareClick={handleSquareClick}
              onAttackBoardClick={handleAttackBoardClick}
              onSlotClick={handleSlotClick}
              isActive={isActive}
              squareSize={squareSize}
              pieceTheme={pieceTheme}
            />
          </div>
        </BoardContainer>

        {/* Bottom player */}
        <div className='flex w-full items-center justify-between py-2'>
          <div className='flex items-center gap-3'>
            <PlayerInfo name={boardFlipped ? 'Black' : 'White'} />
            {hasTimer && (
              <PlayerClock
                time={bottomTime}
                isActive={bottomTimerActive}
                isPlayer
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`flex w-full flex-col gap-2 sm:h-[400px] lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden ${sharedPanelHeightClass}`}
      >
        <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
          <TriDChessSidebar />
        </div>
      </div>

      {/* Promotion dialog */}
      {pendingPromotion && (
        <PromotionDialog
          color={gameState.turn}
          pieceTheme={pieceTheme}
          onSelect={completePromotion}
          onCancel={cancelPromotion}
        />
      )}
    </div>
  );
}
