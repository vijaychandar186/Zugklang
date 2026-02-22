'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useShallow } from 'zustand/shallow';
import { FourPlayerView } from './FourPlayerView';
import { useFourPlayerStore, TEAM_ROTATIONS } from '../store';
import { FourPlayerGame, type Team, type PieceType } from '../engine';
import { useCustomMultiplayerWS } from '@/features/custom/shared/hooks/useCustomMultiplayerWS';
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

type FourSnapshot = {
  moves: {
    from: string;
    to: string;
    team: Team;
    notation: string;
    captured?: string;
    promotedPiece?: boolean;
    checkedKings?: Team[];
    checkingPieceType?: PieceType;
    isCheckmate?: boolean;
    isStalemate?: boolean;
  }[];
  viewingMoveIndex: number;
  isGameOver: boolean;
  winner: Team | null;
  loseOrder: Team[];
  orientation: number;
  gameStarted: boolean;
  gameResult: string | null;
  points: { r: number; b: number; y: number; g: number };
  timeControl: TimeControl;
  teamTimes: {
    r: number | null;
    b: number | null;
    y: number | null;
    g: number | null;
  };
  activeTimer: Team | null;
  lastActiveTimestamp: number | null;
  autoRotateBoard: boolean;
};

const TEAM_ORDER: Team[] = ['r', 'b', 'y', 'g'];

const TEAM_INFO: Record<Team, { label: string; cssVar: string }> = {
  r: { label: 'Red', cssVar: 'var(--four-player-red)' },
  b: { label: 'Blue', cssVar: 'var(--four-player-blue)' },
  y: { label: 'Yellow', cssVar: 'var(--four-player-yellow)' },
  g: { label: 'Green', cssVar: 'var(--four-player-green)' }
};

function buildGameFromMoves(moves: FourSnapshot['moves']): FourPlayerGame {
  const game = new FourPlayerGame();
  for (const move of moves) {
    const ok = game.playMove(move.from, move.to);
    if (!ok) break;
    if (game.pendingPromotion) {
      const promotionMatch = move.notation.match(/=([QRBN])/);
      if (promotionMatch) {
        game.completePromotion(promotionMatch[1] as PieceType);
      }
    }
  }
  return game;
}

export function FourPlayerMultiplayerView() {
  const ws = useCustomMultiplayerWS();
  const params = useSearchParams();
  const { data: session } = useSession();
  const applyingRemoteRef = useRef(false);
  const initializedRef = useRef(false);
  const roomFromUrl = params.get('room');
  const snapshot = useFourPlayerStore(
    useShallow((s) => ({
      moves: s.moves,
      viewingMoveIndex: s.viewingMoveIndex,
      isGameOver: s.isGameOver,
      winner: s.winner,
      loseOrder: s.loseOrder,
      orientation: s.orientation,
      gameStarted: s.gameStarted,
      gameResult: s.gameResult,
      points: s.points,
      timeControl: s.timeControl,
      teamTimes: s.teamTimes,
      activeTimer: s.activeTimer,
      lastActiveTimestamp: s.lastActiveTimestamp,
      autoRotateBoard: s.autoRotateBoard
    }))
  );
  const currentTeam = useFourPlayerStore((s) => s.currentTeam);

  const me = ws.playerId;
  const playerIndex = useMemo(
    () => ws.players.findIndex((p) => p.playerId === me),
    [ws.players, me]
  );
  const myTeam =
    playerIndex >= 0 && playerIndex < 4 ? TEAM_ORDER[playerIndex] : null;
  const roomReady = ws.players.length >= 4;
  const canInteract = useMemo(() => {
    if (!roomReady) return ws.isHost;
    if (!snapshot.gameStarted || snapshot.isGameOver) return ws.isHost;
    return myTeam === currentTeam;
  }, [
    roomReady,
    ws.isHost,
    snapshot.gameStarted,
    snapshot.isGameOver,
    myTeam,
    currentTeam
  ]);

  // Auto-rotate board to player's team perspective
  useEffect(() => {
    if (myTeam) {
      useFourPlayerStore.setState({ orientation: TEAM_ROTATIONS[myTeam] });
    }
  }, [myTeam]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (roomFromUrl) {
      ws.joinRoom(
        roomFromUrl,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    } else {
      ws.createRoom(
        'four-player',
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    }
  }, [roomFromUrl, ws, session]);

  useEffect(() => {
    if (applyingRemoteRef.current) return;
    if (!ws.roomId) return;
    if (!canInteract) return;
    ws.sendState(snapshot as FourSnapshot);
  }, [snapshot, ws, canInteract]);

  useEffect(() => {
    ws.setOnState((incoming) => {
      const remote = incoming as FourSnapshot;
      const game = buildGameFromMoves(remote.moves);
      applyingRemoteRef.current = true;
      useFourPlayerStore.setState({
        moves: remote.moves,
        viewingMoveIndex: remote.viewingMoveIndex,
        isGameOver: remote.isGameOver,
        winner: remote.winner,
        loseOrder: remote.loseOrder,
        orientation: remote.orientation,
        gameStarted: remote.gameStarted,
        gameResult: remote.gameResult,
        points: remote.points,
        timeControl: remote.timeControl,
        teamTimes: remote.teamTimes,
        activeTimer: remote.activeTimer,
        lastActiveTimestamp: remote.lastActiveTimestamp,
        autoRotateBoard: remote.autoRotateBoard,
        game,
        position: game.toPosition(),
        currentTeam: game.currentTeam,
        pendingPromotion: !!game.pendingPromotion,
        hasHydrated: true
      });
      applyingRemoteRef.current = false;
    });
    ws.setOnSyncRequest(() => ws.sendState(snapshot as FourSnapshot));
    return () => {
      ws.setOnState(null);
      ws.setOnSyncRequest(null);
    };
  }, [ws, snapshot]);

  const shareUrl =
    typeof window !== 'undefined' && ws.roomId
      ? `${window.location.origin}/play/custom-multiplayer/four-player?room=${ws.roomId}`
      : '';

  const inRoom = ws.status === 'in_room';

  // ── Connecting / error dialog ─────────────────────────────────────────────
  const showPreGameDialog =
    ws.status === 'connecting' ||
    ws.status === 'error' ||
    (roomFromUrl != null && !inRoom);

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
    return (
      <>
        <DialogHeader>
          <DialogTitle>Connecting</DialogTitle>
          <DialogDescription>Joining 4-Player Chess room...</DialogDescription>
        </DialogHeader>
        <div className='flex justify-center py-4'>
          <div className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent' />
        </div>
      </>
    );
  };

  // ── In-room status text ───────────────────────────────────────────────────
  const roomStatusText = !roomReady
    ? `${ws.players.length}/4 players`
    : !snapshot.gameStarted
      ? 'Ready'
      : snapshot.isGameOver
        ? 'Game over'
        : canInteract
          ? 'Your turn'
          : `${TEAM_INFO[currentTeam].label}'s turn`;

  return (
    <>
      {/* Connecting/error dialog */}
      {showPreGameDialog && (
        <Dialog open onOpenChange={() => {}}>
          <DialogContent
            className='sm:max-w-sm [&>button:last-child]:hidden'
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            {preGameContent()}
          </DialogContent>
        </Dialog>
      )}

      {/* Game — always rendered */}
      <div className='relative'>
        <FourPlayerView />

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
                  {roomStatusText}
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                  <DialogTitle>4-Player Chess — Room</DialogTitle>
                  <DialogDescription>
                    {!roomReady
                      ? `${ws.players.length} of 4 players have joined`
                      : !snapshot.gameStarted
                        ? 'All players joined — host can start from the sidebar'
                        : snapshot.isGameOver
                          ? (snapshot.gameResult ?? 'Game over')
                          : canInteract
                            ? `Your turn (${myTeam ? TEAM_INFO[myTeam].label : ''})`
                            : `${TEAM_INFO[currentTeam].label}'s turn`}
                  </DialogDescription>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-2'>
                  {TEAM_ORDER.map((team, idx) => {
                    const player = ws.players[idx] ?? null;
                    const isMe = player?.playerId === me;
                    const info = TEAM_INFO[team];
                    return (
                      <div
                        key={team}
                        className='flex items-center gap-2 rounded-md border p-2'
                        style={
                          isMe
                            ? { boxShadow: `0 0 0 2px ${info.cssVar}` }
                            : undefined
                        }
                      >
                        <div
                          className='h-2.5 w-2.5 shrink-0 rounded-full'
                          style={{ backgroundColor: info.cssVar }}
                        />
                        <div className='min-w-0'>
                          <p
                            className={`truncate text-xs font-medium ${!player ? 'text-muted-foreground italic' : ''}`}
                          >
                            {player?.displayName ?? 'Open'}
                          </p>
                          <p className='text-muted-foreground text-[10px]'>
                            {info.label}
                            {isMe && ' · You'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
        {!canInteract && (
          <div className='absolute inset-0 z-30' aria-hidden='true' />
        )}
      </div>
    </>
  );
}
