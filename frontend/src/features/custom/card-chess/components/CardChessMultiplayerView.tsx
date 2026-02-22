'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useShallow } from 'zustand/shallow';
import { Chess } from '@/lib/chess/chess';
import { CardChessView } from './CardChessView';
import { useCardChessStore } from '../stores/useCardChessStore';
import type { PlayingCard, CardResult } from '../stores/useCardChessStore';
import { useCustomMultiplayerWS } from '@/features/custom/shared/hooks/useCustomMultiplayerWS';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import type { TimeControl } from '@/features/game/types/rules';
import type { CSSProperties } from 'react';

type CardSnapshot = {
  currentFEN: string;
  turn: 'w' | 'b';
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameResult: string | null;
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;
  deck: PlayingCard[];
  discardPile: PlayingCard[];
  drawnCard: CardResult | null;
  isDrawing: boolean;
  needsDraw: boolean;
  drawCount: number;
  highlightedSquares: Record<string, CSSProperties>;
};

function PlayerRow({
  name,
  color,
  isMe,
  isEmpty
}: {
  name: string | null;
  color: 'white' | 'black';
  isMe: boolean;
  isEmpty: boolean;
}) {
  return (
    <div className='flex items-center gap-3 rounded-md border p-2.5'>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
          color === 'white'
            ? 'border-border bg-background text-foreground'
            : 'border-foreground bg-foreground text-background'
        }`}
      >
        {isEmpty ? '?' : (name?.[0]?.toUpperCase() ?? '?')}
      </div>
      <div className='min-w-0 flex-1'>
        <p
          className={`truncate text-sm font-medium ${isEmpty ? 'text-muted-foreground italic' : ''}`}
        >
          {isEmpty ? 'Waiting...' : (name ?? 'Anonymous')}
        </p>
        <p className='text-muted-foreground text-xs'>
          {color === 'white' ? 'White' : 'Black'}
          {isMe && ' · You'}
        </p>
      </div>
    </div>
  );
}

export function CardChessMultiplayerView() {
  const ws = useCustomMultiplayerWS();
  const params = useSearchParams();
  const { data: session } = useSession();
  const applyingRemoteRef = useRef(false);
  const initializedRef = useRef(false);
  const roomFromUrl = params.get('room');
  const state = useCardChessStore(
    useShallow((s) => ({
      currentFEN: s.currentFEN,
      turn: s.turn,
      moves: s.moves,
      positionHistory: s.positionHistory,
      viewingIndex: s.viewingIndex,
      gameStarted: s.gameStarted,
      gameOver: s.gameOver,
      gameResult: s.gameResult,
      timeControl: s.timeControl,
      whiteTime: s.whiteTime,
      blackTime: s.blackTime,
      activeTimer: s.activeTimer,
      lastActiveTimestamp: s.lastActiveTimestamp,
      deck: s.deck,
      discardPile: s.discardPile,
      drawnCard: s.drawnCard,
      isDrawing: s.isDrawing,
      needsDraw: s.needsDraw,
      drawCount: s.drawCount,
      highlightedSquares: s.highlightedSquares
    }))
  );

  const me = ws.playerId;
  const playerIndex = useMemo(
    () => ws.players.findIndex((p) => p.playerId === me),
    [ws.players, me]
  );
  const myColor: 'white' | 'black' | null =
    playerIndex === 0 ? 'white' : playerIndex === 1 ? 'black' : null;
  const roomReady = ws.players.length >= 2;
  const canInteract = useMemo(() => {
    if (!roomReady) return ws.isHost;
    if (!state.gameStarted || state.gameOver) return ws.isHost;
    if (myColor === 'white') return state.turn === 'w';
    if (myColor === 'black') return state.turn === 'b';
    return false;
  }, [
    roomReady,
    ws.isHost,
    state.gameStarted,
    state.gameOver,
    myColor,
    state.turn
  ]);

  // Auto-flip board for black player
  useEffect(() => {
    if (myColor === 'black') {
      useChessStore.setState({ boardFlipped: true });
    } else if (myColor === 'white') {
      useChessStore.setState({ boardFlipped: false });
    }
  }, [myColor]);

  // Auto-join on mount when URL has room param
  useEffect(() => {
    if (!roomFromUrl) return;
    if (initializedRef.current) return;
    initializedRef.current = true;
    ws.joinRoom(
      roomFromUrl,
      session?.user?.name ?? undefined,
      session?.user?.image ?? undefined
    );
  }, [roomFromUrl, ws, session]);

  const snapshot: CardSnapshot = state;
  useEffect(() => {
    if (applyingRemoteRef.current) return;
    if (!ws.roomId) return;
    if (!canInteract) return;
    ws.sendState(snapshot);
  }, [snapshot, ws, canInteract]);

  useEffect(() => {
    ws.setOnState((incoming) => {
      const remote = incoming as CardSnapshot;
      applyingRemoteRef.current = true;
      useCardChessStore.setState({
        currentFEN: remote.currentFEN,
        turn: remote.turn,
        moves: remote.moves,
        positionHistory: remote.positionHistory,
        viewingIndex: remote.viewingIndex,
        gameStarted: remote.gameStarted,
        gameOver: remote.gameOver,
        gameResult: remote.gameResult,
        timeControl: remote.timeControl,
        whiteTime: remote.whiteTime,
        blackTime: remote.blackTime,
        activeTimer: remote.activeTimer,
        lastActiveTimestamp: remote.lastActiveTimestamp,
        deck: remote.deck,
        discardPile: remote.discardPile,
        drawnCard: remote.drawnCard,
        isDrawing: remote.isDrawing,
        needsDraw: remote.needsDraw,
        drawCount: remote.drawCount,
        highlightedSquares: remote.highlightedSquares,
        game: new Chess(remote.currentFEN),
        hasHydrated: true
      });
      applyingRemoteRef.current = false;
    });
    ws.setOnSyncRequest(() => ws.sendState(snapshot));
    return () => {
      ws.setOnState(null);
      ws.setOnSyncRequest(null);
    };
  }, [ws, snapshot]);

  const shareUrl =
    typeof window !== 'undefined' && ws.roomId
      ? `${window.location.origin}/play/custom-multiplayer/card-chess?room=${ws.roomId}`
      : '';

  const displayName = session?.user?.name ?? undefined;
  const userImage = session?.user?.image ?? undefined;
  const inRoom = ws.status === 'in_room';

  // ── Pre-game dialog ───────────────────────────────────────────────────────
  const showPreGameDialog = !inRoom;

  const preGameContent = () => {
    if (ws.status === 'error') {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Connection Error</DialogTitle>
            <DialogDescription>{ws.errorMessage}</DialogDescription>
          </DialogHeader>
          <Button className='w-full' onClick={() => window.location.reload()}>
            Retry
          </Button>
        </>
      );
    }
    if (ws.status === 'in_queue') {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Finding Opponent</DialogTitle>
            <DialogDescription>
              Searching for a Card Chess opponent...
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-center py-4'>
            <div className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => ws.leaveQueue()}
          >
            Cancel
          </Button>
        </>
      );
    }
    if (ws.status === 'connecting' || (roomFromUrl && !inRoom)) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Connecting</DialogTitle>
            <DialogDescription>Joining game...</DialogDescription>
          </DialogHeader>
          <div className='flex justify-center py-4'>
            <div className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        </>
      );
    }
    // Lobby
    return (
      <>
        <DialogHeader>
          <DialogTitle>Card Chess Multiplayer</DialogTitle>
          <DialogDescription>
            Draw a card each turn to see which piece you must move.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3 pt-2'>
          <Button
            size='lg'
            className='w-full'
            onClick={() => ws.joinQueue('card-chess', displayName, userImage)}
          >
            Find Opponent
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='w-full'
            onClick={() => ws.createRoom('card-chess', displayName, userImage)}
          >
            Create Private Game
          </Button>
        </div>
        <p className='text-muted-foreground text-center text-xs'>
          Private game gives you a shareable invite link.
        </p>
      </>
    );
  };

  // ── In-room info dialog ───────────────────────────────────────────────────
  const whitePlayer = ws.players[0] ?? null;
  const blackPlayer = ws.players[1] ?? null;
  const statusText = !roomReady
    ? 'Waiting for opponent...'
    : !state.gameStarted
      ? 'Set up and start from the sidebar'
      : state.gameOver
        ? (state.gameResult ?? 'Game over')
        : canInteract
          ? 'Your turn'
          : "Opponent's turn";

  return (
    <>
      {/* Pre-game: non-dismissable dialog */}
      <Dialog open={showPreGameDialog} onOpenChange={() => {}}>
        <DialogContent
          className='sm:max-w-sm [&>button:last-child]:hidden'
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {preGameContent()}
        </DialogContent>
      </Dialog>

      {/* Game — always rendered */}
      <div className='relative'>
        <CardChessView />

        {/* Room info button — sits above the turn blocker */}
        {inRoom && (
          <div className='absolute top-2 right-2 z-40'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  variant='secondary'
                  className='h-7 px-2.5 text-xs shadow-sm'
                >
                  {!roomReady
                    ? '1/2 Players'
                    : canInteract
                      ? 'Your turn'
                      : "Opponent's turn"}
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                  <DialogTitle>Card Chess — Room</DialogTitle>
                  <DialogDescription>{statusText}</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                  <PlayerRow
                    name={whitePlayer?.displayName ?? null}
                    color='white'
                    isMe={myColor === 'white'}
                    isEmpty={!whitePlayer}
                  />
                  <PlayerRow
                    name={blackPlayer?.displayName ?? null}
                    color='black'
                    isMe={myColor === 'black'}
                    isEmpty={!blackPlayer}
                  />
                </div>
                {shareUrl && !roomReady && (
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                  >
                    Copy Invite Link
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Turn blocker */}
        {!canInteract && inRoom && (
          <div className='absolute inset-0 z-30' aria-hidden='true' />
        )}
      </div>
    </>
  );
}
