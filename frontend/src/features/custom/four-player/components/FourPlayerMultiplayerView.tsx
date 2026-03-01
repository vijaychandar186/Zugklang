'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Icons } from '@/components/Icons';
import {
  useMultiplayerWS,
  loadFourPlayerSession,
  clearFourPlayerSession
} from '@/features/multiplayer/hooks/useMultiplayerWS';
import type {
  FourPlayerLobbyPlayer,
  FourPlayerLobbyState
} from '@/features/multiplayer/types';
import type { TimeControl, TimeControlMode } from '@/features/game/types/rules';
import { FourPlayerBoard } from './FourPlayerBoard';
import { FourPlayerSidebar } from './FourPlayerSidebar';
import type { Team } from '../engine';
import {
  useFourPlayerStore,
  setFourPlayerStorageMode,
  TEAM_ROTATIONS,
  type FourPlayerSyncSnapshot
} from '../store';
const TEAM_LABEL: Record<Team, string> = {
  r: 'Red',
  b: 'Blue',
  y: 'Yellow',
  g: 'Green'
};
interface FourPlayerMultiplayerViewProps {
  lobbyId?: string;
}
function getDisplayName(
  player: {
    displayName: string | null;
    playerId: string;
  } | null
): string {
  if (!player) return 'Open seat';
  if (player.displayName && player.displayName.trim().length > 0) {
    return player.displayName;
  }
  return `Player ${player.playerId.slice(0, 6)}`;
}
function formatTimeLabel(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMins} min`;
}
function formatIncrementLabel(secs: number): string {
  if (secs === 0) return 'No increment';
  if (secs < 60) return `+${secs} sec`;
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  if (remainingSecs === 0) return `+${mins} min`;
  return `+${mins} min ${remainingSecs} sec`;
}
function formatTimeControl(tc: TimeControl): string {
  if (tc.mode === 'unlimited') return 'Unlimited';
  const time = formatTimeLabel(tc.minutes);
  if (tc.increment > 0)
    return `${time} · ${formatIncrementLabel(tc.increment)}`;
  return time;
}
function toResultReason(result: string | null): string {
  if (!result) return 'elimination';
  const lower = result.toLowerCase();
  if (lower.includes('abort')) return 'abort';
  if (lower.includes('resign')) return 'resign';
  if (lower.includes('draw') && lower.includes('agreement'))
    return 'draw_agreement';
  if (lower.includes('time') || lower.includes('timeout')) return 'timeout';
  return 'elimination';
}
function toResultCode(
  winner: Team | null,
  myTeam: Team,
  result: string | null
): '1-0' | '0-1' | '1/2-1/2' | '*' {
  if (winner) return winner === myTeam ? '1-0' : '0-1';
  if (result?.toLowerCase().includes('draw')) return '1/2-1/2';
  return '*';
}
export function FourPlayerMultiplayerView({
  lobbyId: initialLobbyId
}: FourPlayerMultiplayerViewProps) {
  const { data: session } = useSession();
  const {
    playerId,
    errorMessage,
    preConnect,
    createFourPlayerLobby,
    joinFourPlayerLobby,
    leaveFourPlayerLobby,
    startFourPlayerLobby,
    shuffleFourPlayerLobby,
    assignFourPlayerTeam,
    sendFourPlayerStateSync,
    rejoinFourPlayerLobby,
    setOnFourPlayerLobbyState,
    setOnFourPlayerLobbyStarted,
    setOnFourPlayerLobbyRejoined,
    setOnFourPlayerPlayerReconnected,
    setOnFourPlayerStateSync
  } = useMultiplayerWS();
  const [lobby, setLobby] = useState<FourPlayerLobbyState | null>(null);
  const [stablePlayersByTeam, setStablePlayersByTeam] = useState<
    Partial<Record<Team, FourPlayerLobbyPlayer>>
  >({});
  const [lobbyDialogOpen, setLobbyDialogOpen] = useState(true);
  const [joinAttempted, setJoinAttempted] = useState(false);
  const [rejoinAttempted, setRejoinAttempted] = useState(false);
  const rejoinPendingRef = useRef(false);
  const applyingRemoteStateRef = useRef(false);
  const lastSnapshotRef = useRef<string>('');
  const [timerMode, setTimerMode] = useState<TimeControlMode>('unlimited');
  const [minutes, setMinutes] = useState(10);
  const [increment, setIncrement] = useState(0);
  const [inviteCopied, setInviteCopied] = useState(false);
  const gameStarted = useFourPlayerStore((s) => s.gameStarted);
  const isGameOver = useFourPlayerStore((s) => s.isGameOver);
  const currentTeam = useFourPlayerStore((s) => s.currentTeam);
  const pendingPromotion = useFourPlayerStore((s) => s.pendingPromotion);
  const moves = useFourPlayerStore((s) => s.moves);
  const points = useFourPlayerStore((s) => s.points);
  const teamTimes = useFourPlayerStore((s) => s.teamTimes);
  const activeTimer = useFourPlayerStore((s) => s.activeTimer);
  const gameResult = useFourPlayerStore((s) => s.gameResult);
  const winner = useFourPlayerStore((s) => s.winner);
  const gameId = useFourPlayerStore((s) => s.gameId);
  const lobbyStarted = lobby?.started ?? false;
  const lobbyId = lobby?.lobbyId ?? null;
  const currentLobbyId = lobbyId;
  const me = useMemo(
    () => lobby?.players.find((p) => p.playerId === playerId) ?? null,
    [lobby?.players, playerId]
  );
  const myTeam = me?.team ?? null;
  const isLeader = !!(me && lobby && lobby.leaderId === me.playerId);
  useEffect(() => {
    if (!lobby?.players?.length) return;
    setStablePlayersByTeam((prev) => {
      const next = { ...prev };
      for (const player of lobby.players) {
        next[player.team] = player;
      }
      return next;
    });
  }, [lobby?.players]);
  useEffect(() => {
    if (lobby) return;
    setStablePlayersByTeam({});
  }, [lobby]);
  useEffect(() => {
    setFourPlayerStorageMode(true);
    useFourPlayerStore.persist.rehydrate();
    const fpSession = loadFourPlayerSession();
    const storeState = useFourPlayerStore.getState();
    const hadActiveGame = storeState.gameStarted && !storeState.isGameOver;
    useFourPlayerStore
      .getState()
      .setTimeControl({ mode: 'unlimited', minutes: 0, increment: 0 });
    useFourPlayerStore.getState().resetGame();
    useFourPlayerStore.getState().setRestrictedTeam(null);
    if (fpSession && hadActiveGame) {
      setLobbyDialogOpen(false);
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('lobby')) {
        url.searchParams.delete('lobby');
        window.history.replaceState({}, '', url.toString());
      }
    }
    return () => {
      setFourPlayerStorageMode(false);
      useFourPlayerStore.getState().setRestrictedTeam(null);
    };
  }, []);
  useEffect(() => {
    useFourPlayerStore.getState().setRestrictedTeam(myTeam);
    if (myTeam) {
      useFourPlayerStore.getState().setOrientation(TEAM_ROTATIONS[myTeam]);
    }
  }, [myTeam]);
  useEffect(() => {
    preConnect();
  }, [preConnect]);
  useEffect(() => {
    setOnFourPlayerLobbyState((nextLobby) => {
      setLobby(nextLobby);
      if (nextLobby.started) setLobbyDialogOpen(false);
    });
    setOnFourPlayerLobbyStarted((_lobbyId, _startedAt, _timeControl) => {
      setLobbyDialogOpen(false);
    });
    setOnFourPlayerLobbyRejoined((lobbyState) => {
      rejoinPendingRef.current = false;
      applyingRemoteStateRef.current = true;
      setLobby(lobbyState);
      setLobbyDialogOpen(false);
    });
    setOnFourPlayerPlayerReconnected((_reconnectedPlayerId) => {
      if (lobbyId && gameStarted) {
        const snap = useFourPlayerStore.getState().createSyncSnapshot();
        sendFourPlayerStateSync(lobbyId, JSON.stringify(snap));
      }
    });
    setOnFourPlayerStateSync((_lobbyId, _fromPlayerId, rawState) => {
      try {
        const snapshot = JSON.parse(rawState) as FourPlayerSyncSnapshot;
        applyingRemoteStateRef.current = true;
        useFourPlayerStore.getState().applySyncSnapshot(snapshot);
        lastSnapshotRef.current = rawState;
      } catch {}
    });
    return () => {
      setOnFourPlayerLobbyState(null);
      setOnFourPlayerLobbyStarted(null);
      setOnFourPlayerLobbyRejoined(null);
      setOnFourPlayerPlayerReconnected(null);
      setOnFourPlayerStateSync(null);
    };
  }, [
    setOnFourPlayerLobbyStarted,
    setOnFourPlayerLobbyState,
    setOnFourPlayerLobbyRejoined,
    setOnFourPlayerPlayerReconnected,
    setOnFourPlayerStateSync,
    lobbyId,
    gameStarted,
    sendFourPlayerStateSync
  ]);
  useEffect(() => {
    if (!playerId || joinAttempted || !initialLobbyId) return;
    joinFourPlayerLobby(
      initialLobbyId,
      session?.user?.name ?? undefined,
      session?.user?.image ?? undefined
    );
    setJoinAttempted(true);
  }, [
    initialLobbyId,
    joinAttempted,
    joinFourPlayerLobby,
    playerId,
    session?.user?.image,
    session?.user?.name
  ]);
  useEffect(() => {
    if (!playerId || rejoinAttempted) return;
    const fpSession = loadFourPlayerSession();
    if (!fpSession) return;
    setRejoinAttempted(true);
    rejoinPendingRef.current = true;
    rejoinFourPlayerLobby(fpSession.lobbyId, fpSession.rejoinToken);
  }, [playerId, rejoinAttempted, rejoinFourPlayerLobby]);
  useEffect(() => {
    if (!rejoinPendingRef.current || !errorMessage) return;
    rejoinPendingRef.current = false;
    clearFourPlayerSession();
    useFourPlayerStore
      .getState()
      .setTimeControl({ mode: 'unlimited', minutes: 0, increment: 0 });
    useFourPlayerStore.getState().resetGame();
    useFourPlayerStore.getState().setRestrictedTeam(null);
    setLobbyDialogOpen(true);
  }, [errorMessage]);
  useEffect(() => {
    if (isGameOver) {
      clearFourPlayerSession();
    }
  }, [isGameOver]);
  const savedFourPlayerGameRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isGameOver || !currentLobbyId || !session?.user?.id || !myTeam) return;
    const saveKey = `${currentLobbyId}:${gameId}`;
    if (savedFourPlayerGameRef.current === saveKey) return;
    savedFourPlayerGameRef.current = saveKey;
    const result = toResultCode(winner, myTeam, gameResult);
    const resultReason = toResultReason(gameResult);
    const tc = lobby?.timeControl ?? {
      mode: 'unlimited',
      minutes: 0,
      increment: 0
    };
    fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: `${currentLobbyId}-${playerId}`,
        moves: [],
        variant: 'four-player',
        gameType: 'multiplayer',
        result,
        resultReason,
        myColor: 'white',
        opponentUserId: null,
        timeControl: tc,
        startingFen: 'four-player-start'
      })
    }).catch((err) => {
      console.error('Failed to save 4-player game:', err);
    });
  }, [
    isGameOver,
    currentLobbyId,
    session?.user?.id,
    myTeam,
    playerId,
    winner,
    gameResult,
    lobby,
    gameId
  ]);
  useEffect(() => {
    if (!lobbyStarted || !isLeader || !lobbyId || !lobby) return;
    const state = useFourPlayerStore.getState();
    if (!state.gameStarted && state.moves.length === 0) {
      state.setTimeControl(lobby.timeControl);
      state.resetGame();
      state.startGame();
      const payload = JSON.stringify(state.createSyncSnapshot());
      lastSnapshotRef.current = payload;
      sendFourPlayerStateSync(lobbyId, payload);
    }
  }, [isLeader, lobby, lobbyId, lobbyStarted, sendFourPlayerStateSync]);
  useEffect(() => {
    if (!lobbyStarted || !lobbyId) return;
    if (!myTeam) return;
    if (!gameStarted && !isGameOver) return;
    const snapshot = useFourPlayerStore.getState().createSyncSnapshot();
    const serialized = JSON.stringify(snapshot);
    if (applyingRemoteStateRef.current) {
      applyingRemoteStateRef.current = false;
      lastSnapshotRef.current = serialized;
      return;
    }
    if (serialized === lastSnapshotRef.current) return;
    lastSnapshotRef.current = serialized;
    sendFourPlayerStateSync(lobbyId, serialized);
  }, [
    sendFourPlayerStateSync,
    lobbyId,
    lobbyStarted,
    myTeam,
    gameStarted,
    isGameOver,
    currentTeam,
    pendingPromotion,
    moves,
    points,
    teamTimes,
    activeTimer,
    gameResult
  ]);
  const inviteLink = useMemo(() => {
    if (!currentLobbyId || typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?lobby=${currentLobbyId}`;
  }, [currentLobbyId]);
  const handleCreateLobby = useCallback(() => {
    const timeControl: TimeControl = {
      mode: timerMode,
      minutes: timerMode === 'timed' ? minutes : 0,
      increment: timerMode === 'timed' ? increment : 0
    };
    createFourPlayerLobby(
      session?.user?.name ?? undefined,
      session?.user?.image ?? undefined,
      timeControl
    );
  }, [
    createFourPlayerLobby,
    increment,
    minutes,
    session?.user?.image,
    session?.user?.name,
    timerMode
  ]);
  const handleLeaveLobby = useCallback(() => {
    if (!currentLobbyId) return;
    leaveFourPlayerLobby(currentLobbyId);
    setLobby(null);
    setLobbyDialogOpen(true);
    useFourPlayerStore
      .getState()
      .setTimeControl({ mode: 'unlimited', minutes: 0, increment: 0 });
    useFourPlayerStore.getState().resetGame();
    useFourPlayerStore.getState().setRestrictedTeam(null);
  }, [currentLobbyId, leaveFourPlayerLobby]);
  const handleStartLobby = useCallback(() => {
    if (!currentLobbyId) return;
    startFourPlayerLobby(currentLobbyId);
  }, [currentLobbyId, startFourPlayerLobby]);
  const handleRandomizeColors = useCallback(() => {
    if (!currentLobbyId || !isLeader || lobby?.started) return;
    shuffleFourPlayerLobby(currentLobbyId);
  }, [currentLobbyId, isLeader, lobby?.started, shuffleFourPlayerLobby]);
  const handleAssignTeam = useCallback(
    (team: Team, nextPlayerId: string) => {
      if (!currentLobbyId || !isLeader || lobby?.started) return;
      if (!nextPlayerId) return;
      assignFourPlayerTeam(currentLobbyId, nextPlayerId, team);
    },
    [assignFourPlayerTeam, currentLobbyId, isLeader, lobby?.started]
  );
  const copyInviteLink = useCallback(() => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setInviteCopied(true);
      toast.success('Invite link copied');
    });
  }, [inviteLink]);
  useEffect(() => {
    if (!inviteCopied) return;
    const timer = setTimeout(() => setInviteCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [inviteCopied]);
  const lobbyPlayers = lobby?.players ?? [];
  const sidebarPlayers = useMemo(() => {
    if (!lobby) return undefined;
    const byTeam = new Map<Team, FourPlayerLobbyPlayer>();
    for (const player of lobby.players) {
      byTeam.set(player.team, player);
    }
    for (const team of Object.keys(stablePlayersByTeam) as Team[]) {
      if (byTeam.has(team)) continue;
      const cached = stablePlayersByTeam[team];
      if (cached) byTeam.set(team, cached);
    }
    return Array.from(byTeam.values());
  }, [lobby, stablePlayersByTeam]);
  const filledSeats = lobbyPlayers.length;
  const startDisabled = !isLeader || filledSeats !== 4 || !!lobby?.started;
  const randomizeDisabled = !isLeader || !!lobby?.started || filledSeats < 2;
  const canAssignColors = isLeader && !lobby?.started && filledSeats >= 2;
  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex min-w-0 flex-col items-center gap-2'>
        <div className='mx-auto w-full sm:w-[400px] lg:w-[min(calc(100dvh-120px),calc(100vw-clamp(20rem,24vw,30rem)-6rem))]'>
          <FourPlayerBoard />
        </div>
      </div>

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(calc(100dvh-120px),calc(100vw-clamp(20rem,24vw,30rem)-6rem))] lg:min-h-0 lg:w-[clamp(20rem,24vw,30rem)] lg:shrink-0 lg:overflow-hidden'>
        <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
          <FourPlayerSidebar
            lobbyPlayers={sidebarPlayers}
            myTeam={myTeam}
            onNewGame={() => setLobbyDialogOpen(true)}
          />
        </div>
      </div>

      <Dialog
        open={lobbyDialogOpen}
        onOpenChange={(open) => {
          setLobbyDialogOpen(open);
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-center text-xl'>
              4-Player Lobby
            </DialogTitle>
          </DialogHeader>

          {errorMessage && (
            <p className='text-destructive text-sm'>{errorMessage}</p>
          )}

          {!lobby ? (
            <div className='space-y-4 pt-2'>
              {initialLobbyId && (
                <p className='text-muted-foreground text-sm'>
                  Joining lobby{' '}
                  <span className='font-mono'>{initialLobbyId}</span>…
                </p>
              )}

              <div className='space-y-3'>
                <Label className='block text-center'>Time Control</Label>
                <Select
                  value={timerMode}
                  onValueChange={(v) => setTimerMode(v as TimeControlMode)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select time control' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='unlimited'>Unlimited</SelectItem>
                    <SelectItem value='timed'>Time Controlled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {timerMode === 'timed' && (
                <>
                  <div className='space-y-3'>
                    <Label className='block text-center'>
                      Time per player: {formatTimeLabel(minutes)}
                    </Label>
                    <Slider
                      value={[minutes]}
                      onValueChange={(v) => setMinutes(v[0]!)}
                      min={1}
                      max={180}
                      step={1}
                      className='w-full'
                    />
                    <div className='text-muted-foreground flex justify-between text-xs'>
                      <span>1 min</span>
                      <span>3 hours</span>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <Label className='block text-center'>
                      Increment: {formatIncrementLabel(increment)}
                    </Label>
                    <Slider
                      value={[increment]}
                      onValueChange={(v) => setIncrement(v[0]!)}
                      min={0}
                      max={180}
                      step={1}
                      className='w-full'
                    />
                    <div className='text-muted-foreground flex justify-between text-xs'>
                      <span>No increment</span>
                      <span>3 min</span>
                    </div>
                  </div>
                </>
              )}

              <Button className='w-full' onClick={handleCreateLobby}>
                Create Lobby
              </Button>
            </div>
          ) : (
            <div className='space-y-4 pt-2'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={copyInviteLink}
              >
                {inviteCopied ? (
                  <Icons.check className='mr-2 h-4 w-4 [color:var(--success)]' />
                ) : (
                  <Icons.copy className='mr-2 h-4 w-4' />
                )}
                {inviteCopied ? 'Invite Link Copied' : 'Copy Invite Link'}
              </Button>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                disabled={randomizeDisabled}
                onClick={handleRandomizeColors}
              >
                <Icons.dices className='mr-2 h-4 w-4' />
                Randomize Colors
              </Button>

              <div className='bg-muted/40 flex items-center justify-between rounded-md border px-3 py-2'>
                <span className='text-muted-foreground text-sm'>Time</span>
                <span className='text-sm font-medium'>
                  {formatTimeControl(lobby.timeControl)}
                </span>
              </div>

              <div className='space-y-2'>
                {(['r', 'b', 'y', 'g'] as Team[]).map((team) => {
                  const player =
                    lobbyPlayers.find((p) => p.team === team) ?? null;
                  return (
                    <div
                      key={team}
                      className='bg-muted/40 flex items-center justify-between rounded-md border px-3 py-2'
                    >
                      <span className='font-medium'>{TEAM_LABEL[team]}</span>
                      {canAssignColors ? (
                        <Select
                          value={player?.playerId ?? ''}
                          onValueChange={(value) =>
                            handleAssignTeam(team, value)
                          }
                        >
                          <SelectTrigger className='h-8 w-[180px]'>
                            <SelectValue placeholder='Open seat' />
                          </SelectTrigger>
                          <SelectContent>
                            {lobbyPlayers.map(
                              (candidate: FourPlayerLobbyPlayer) => (
                                <SelectItem
                                  key={candidate.playerId}
                                  value={candidate.playerId}
                                >
                                  {getDisplayName(candidate)}
                                  {candidate.isLeader ? ' (Leader)' : ''}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className='text-muted-foreground text-sm'>
                          {getDisplayName(player)}
                          {player?.isLeader ? ' (Leader)' : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className='flex gap-2'>
                <Button
                  className='flex-1'
                  disabled={startDisabled}
                  onClick={handleStartLobby}
                >
                  Start Game
                </Button>
                <Button variant='outline' onClick={handleLeaveLobby}>
                  Leave
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
