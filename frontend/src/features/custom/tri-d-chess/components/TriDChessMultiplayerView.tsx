'use client';
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTriDChessMultiplayerGame } from '../hooks/useTriDChessMultiplayerGame';
import { TriDChessBoard } from './TriDChessBoard';
import { useChessStore, useChessActions } from '@/features/chess/stores/useChessStore';
import { getPieceAssetPath } from '@/features/chess/config/media-themes';
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

export function TriDChessMultiplayerView({
  challengeId,
  initialPieceTheme = 'classic'
}: {
  challengeId?: string;
  initialPieceTheme?: string;
}) {
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const [squareSize, setSquareSize] = useState(36);
  const game = useTriDChessMultiplayerGame(challengeId);
  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const storePieceTheme = useChessStore((s) => s.pieceThemeName);
  const { flipBoard } = useChessActions();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const pieceTheme = isMounted ? storePieceTheme : initialPieceTheme;

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

  const hasTimer = game.whiteTimeSecs !== null || game.blackTimeSecs !== null;
  const isViewingFromBlack =
    game.serverOrientation === 'black' ? !boardFlipped : boardFlipped;
  const topColor = isViewingFromBlack ? 'white' : 'black';
  const bottomColor = isViewingFromBlack ? 'black' : 'white';
  const topTime = isViewingFromBlack ? game.whiteTimeSecs : game.blackTimeSecs;
  const bottomTime = isViewingFromBlack ? game.blackTimeSecs : game.whiteTimeSecs;
  const topTimerActive = game.activeClock === topColor && !game.gameOver;
  const bottomTimerActive = game.activeClock === bottomColor && !game.gameOver;

  const { gameState, viewingIndex } = game;
  const displayPieces =
    viewingIndex === gameState.snapshots.length - 1
      ? gameState.pieces
      : (gameState.snapshots[viewingIndex]?.pieces ?? gameState.pieces);
  const displaySlots =
    viewingIndex === gameState.snapshots.length - 1
      ? gameState.slots
      : (gameState.snapshots[viewingIndex]?.slots ?? gameState.slots);

  const infoPanel = useMemo(() => {
    if (!game.gameStarted || game.gameOver) return null;
    if (game.pendingBoardArrival) {
      return (
        <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
          <p className='font-semibold'>Choose arrival square</p>
          <p>
            Click one of the two highlighted squares to place the transported
            piece.
          </p>
        </div>
      );
    }
    if (!game.isMyTurn) {
      return (
        <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
          <p className='font-semibold'>Waiting for opponent</p>
          <p>Your opponent is thinking…</p>
        </div>
      );
    }
    return (
      <div className='bg-muted/50 text-muted-foreground rounded px-3 py-2 text-xs'>
        <p className='font-semibold'>
          Your turn ({game.turn === 'w' ? 'White' : 'Black'})
        </p>
        <p>Click a piece or attack board label to move.</p>
      </div>
    );
  }, [
    game.gameStarted,
    game.gameOver,
    game.pendingBoardArrival,
    game.isMyTurn,
    game.turn
  ]);

  return (
    <GameShell
      topLeft={
        <>
          <PlayerInfo
            name={game.topPlayerInfo.name}
            image={game.topPlayerInfo.image}
            rating={game.topPlayerInfo.rating}
            ratingDelta={game.topPlayerInfo.ratingDelta}
            flagCode={game.topPlayerInfo.flagCode}
          />
          {game.topPlayerExtras}
        </>
      }
      topRight={
        hasTimer ? (
          <PlayerClock time={topTime} isActive={topTimerActive} isPlayer />
        ) : undefined
      }
      bottomLeft={
        <>
          <PlayerInfo
            name={game.bottomPlayerInfo.name}
            image={game.bottomPlayerInfo.image}
            rating={game.bottomPlayerInfo.rating}
            ratingDelta={game.bottomPlayerInfo.ratingDelta}
            flagCode={game.bottomPlayerInfo.flagCode}
          />
          {game.bottomPlayerExtras}
        </>
      }
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
              selectedSquare={game.isActive ? game.selected : null}
              selectedBoardId={game.isActive ? game.selectedBoardId : null}
              highlightedSquares={
                game.isActive ? game.highlightedSquares : new Set()
              }
              highlightedSlots={
                game.isActive ? game.highlightedSlots : new Set()
              }
              inCheck={game.inCheck && game.isActive}
              turn={game.gameState.turn}
              flipped={isViewingFromBlack}
              onSquareClick={(sq: TriDSquare) =>
                game.isActive && game.onSquareClick(sq)
              }
              onAttackBoardClick={(id: AttackBoardId) =>
                game.isActive && game.onAttackBoardClick(id)
              }
              onSlotClick={(id: AttackBoardId, slot: AttackBoardSlot) =>
                game.isActive && game.onSlotClick(id, slot)
              }
              isActive={game.isActive}
              squareSize={squareSize}
              pieceTheme={pieceTheme}
            />
          </div>
        </BoardContainer>
      }
      sidebar={
        <TwoPlayerCustomSidebar
          mode='play'
          moves={game.moves}
          viewingIndex={game.viewingIndex}
          positionHistory={game.positionHistory}
          gameOver={game.gameOver}
          gameResult={game.gameResult}
          gameStarted={game.gameStarted}
          turn={game.turn}
          soundEnabled={false}
          isAnalysisOn={false}
          isAnalysisReady={false}
          onGoToStart={game.goToStart}
          onGoToEnd={game.goToEnd}
          onGoToPrev={game.goToPrev}
          onGoToNext={game.goToNext}
          onGoToMove={game.goToMove}
          onSetGameOver={() => {}}
          onSetGameResult={() => {}}
          onFlipBoard={flipBoard}
          onStartAnalysis={() => {}}
          onEndAnalysis={() => {}}
          multiplayer={game.multiplayerSidebarProps}
          activePanel={infoPanel}
        />
      }
      overlays={
        <>
          {game.overlays}
          {game.pendingPromotion && (
            <PromotionDialog
              color={game.turn}
              pieceTheme={pieceTheme}
              onSelect={game.onCompletePromotion}
              onCancel={game.onCancelPromotion}
            />
          )}
        </>
      }
    />
  );
}
