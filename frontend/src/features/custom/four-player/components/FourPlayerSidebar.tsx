'use client';
import { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/Icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { SidebarPanel } from '@/features/chess/components/sidebar/SidebarPanel';
import { SidebarHeader } from '@/features/chess/components/sidebar/SidebarHeader';
import { SettingsButton } from '@/features/chess/components/actions/SettingsButton';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { useClipboard } from '@/features/chess/hooks/useClipboard';
import { useFourPlayerStore, TEAM_ROTATIONS } from '../store';
import { useFourPlayerTimer } from '../hooks/useFourPlayerTimer';
import { formatTime } from '@/features/game/utils/formatting';
import { playSound } from '@/features/game/utils/sounds';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { cn } from '@/lib/utils';
import type { Team, MoveRecord } from '../engine';
import type { FourPlayerLobbyPlayer } from '@/features/multiplayer/types';
const TEAM_INFO: Record<
  Team,
  {
    label: string;
    cssVar: string;
    short: string;
  }
> = {
  r: { label: 'Red', cssVar: 'var(--four-player-red)', short: 'R' },
  b: { label: 'Blue', cssVar: 'var(--four-player-blue)', short: 'B' },
  y: { label: 'Yellow', cssVar: 'var(--four-player-yellow)', short: 'Y' },
  g: { label: 'Green', cssVar: 'var(--four-player-green)', short: 'G' }
};
const TEAMS: Team[] = ['r', 'b', 'y', 'g'];
function getLobbyPlayerName(
  player: FourPlayerLobbyPlayer | undefined
): string | null {
  if (!player) return null;
  const trimmed = player.displayName?.trim();
  if (trimmed) return trimmed;
  return `Player ${player.playerId.slice(0, 6)}`;
}
function formatMovesText(moves: MoveRecord[]): string {
  const rounds: string[] = [];
  for (let i = 0; i < moves.length; i += 4) {
    const roundNum = Math.floor(i / 4) + 1;
    const roundMoves: string[] = [];
    for (let j = 0; j < 4; j++) {
      const move = moves[i + j];
      if (move) {
        const info = TEAM_INFO[move.team];
        roundMoves.push(`${info.label}: ${move.notation}`);
      }
    }
    rounds.push(`${roundNum}. ${roundMoves.join(', ')}`);
  }
  return rounds.join('\n');
}
type MoveItemProps = {
  move: MoveRecord;
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
};
const MoveItem = memo(function MoveItem({
  move,
  index,
  isActive,
  onClick
}: MoveItemProps) {
  const handleClick = useCallback(() => onClick(index), [onClick, index]);
  const info = TEAM_INFO[move.team];
  return (
    <button
      onClick={handleClick}
      className={`hover:bg-muted flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs ${isActive ? 'bg-muted ring-border ring-1 ring-inset' : ''}`}
    >
      <span
        className='inline-block h-2 w-2 shrink-0 rounded-full'
        style={{ backgroundColor: info.cssVar }}
      />
      <span>{move.notation}</span>
    </button>
  );
});
function FourPlayerMoveHistory({
  moves,
  viewingMoveIndex,
  onMoveClick
}: {
  moves: MoveRecord[];
  viewingMoveIndex: number;
  onMoveClick: (index: number) => void;
}) {
  if (moves.length === 0) {
    return (
      <p className='text-muted-foreground py-4 text-center text-sm'>
        No moves yet
      </p>
    );
  }
  const rounds: {
    roundNum: number;
    startIndex: number;
  }[] = [];
  for (let i = 0; i < moves.length; i += 4) {
    rounds.push({ roundNum: Math.floor(i / 4) + 1, startIndex: i });
  }
  return (
    <ol className='space-y-1'>
      {rounds.map(({ roundNum, startIndex }) => (
        <li
          key={roundNum}
          className='flex flex-wrap items-center gap-0.5 text-sm'
        >
          <span className='text-muted-foreground w-6 shrink-0 text-xs'>
            {roundNum}.
          </span>
          {[0, 1, 2, 3].map((offset) => {
            const idx = startIndex + offset;
            if (idx >= moves.length) return null;
            return (
              <MoveItem
                key={idx}
                move={moves[idx]}
                index={idx}
                isActive={viewingMoveIndex === idx}
                onClick={onMoveClick}
              />
            );
          })}
        </li>
      ))}
    </ol>
  );
}
export function FourPlayerSidebar({
  lobbyPlayers,
  myTeam,
  onNewGame
}: {
  lobbyPlayers?: FourPlayerLobbyPlayer[];
  myTeam?: Team | null;
  onNewGame?: () => void;
} = {}) {
  const router = useRouter();
  const {
    moves,
    viewingMoveIndex,
    currentTeam,
    orientation,
    isGameOver,
    winner,
    loseOrder,
    game,
    gameStarted,
    gameResult,
    points,
    drawOfferedBy,
    rematchOfferedBy,
    rematchDeclined,
    goToMove,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    resetGame,
    abortGame,
    resignGame,
    offerDraw,
    acceptDraw,
    declineDraw,
    offerRematch,
    acceptRematch,
    declineRematch,
    setOrientation
  } = useFourPlayerStore();
  const { hasTimer, teamTimes, activeTimer } = useFourPlayerTimer();
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const isMultiplayer = lobbyPlayers !== undefined;
  const canGoBack = viewingMoveIndex > -1;
  const canGoForward = viewingMoveIndex < moves.length - 1;
  const canAbort = moves.length < 4;
  const isPlaying = gameStarted && !isGameOver;
  const { isPlaying: isPlaybackActive, togglePlay } = usePlayback({
    currentIndex: viewingMoveIndex + 1,
    totalItems: moves.length + 1,
    onNext: goToNext
  });
  const [rematchSent, setRematchSent] = useState(false);
  const { copy, isCopied } = useClipboard();
  const currentInfo = TEAM_INFO[currentTeam];
  const isChecked = !isGameOver && game.isChecked;
  useEffect(() => {
    if (rematchDeclined) setRematchSent(false);
  }, [rematchDeclined]);
  useEffect(() => {
    if (!isGameOver) setRematchSent(false);
  }, [isGameOver]);
  const handleAbort = () => {
    if (soundEnabled) playSound('game-end');
    abortGame();
  };
  const handleResign = () => {
    if (soundEnabled) playSound('game-end');
    resignGame(myTeam ?? currentTeam);
  };
  const handleOfferDraw = () => {
    if (soundEnabled) playSound('draw-offer');
    offerDraw(myTeam ?? currentTeam);
  };
  const handleAcceptDraw = () => {
    if (soundEnabled) playSound('game-end');
    acceptDraw();
  };
  const handleDeclineDraw = () => {
    declineDraw();
  };
  const handleOfferRematch = () => {
    offerRematch(myTeam ?? currentTeam);
  };
  const handleAcceptRematch = () => {
    acceptRematch();
  };
  const handleDeclineRematch = () => {
    declineRematch();
  };
  const handleCopyMoves = () => copy(formatMovesText(moves), 'moves');
  const handleCopyGameState = () => {
    const gameState = JSON.stringify(
      {
        moves: moves,
        currentTeam: currentTeam,
        winner: winner,
        loseOrder: loseOrder,
        points: points
      },
      null,
      2
    );
    copy(gameState, 'state');
  };
  return (
    <SidebarPanel fullHeight>
      <SidebarHeader
        title='Moves'
        actions={
          <>
            <span className='text-muted-foreground mr-2 text-xs'>
              {moves.length} move{moves.length !== 1 ? 's' : ''}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => router.push('/')}
                >
                  <Icons.home className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Icons.share className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Game</DialogTitle>
                  <DialogDescription>
                    Copy moves or game state to clipboard.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-3 pt-2'>
                  <Button
                    onClick={handleCopyMoves}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>
                        {isCopied('moves') ? 'Copied Moves' : 'Copy Moves'}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        Simple move list
                      </span>
                    </div>
                    {isCopied('moves') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                  <Button
                    onClick={handleCopyGameState}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>
                        {isCopied('state')
                          ? 'Copied Game State'
                          : 'Copy Game State'}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        Full game state as JSON
                      </span>
                    </div>
                    {isCopied('state') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <SettingsButton show3dToggle={false} />
          </>
        }
      />

      <div className='border-b px-2 py-1.5'>
        <Table className='text-xs'>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='h-7 px-2 text-[10px]'>Team</TableHead>
              <TableHead className='h-7 px-2 text-center text-[10px]'>
                Pts
              </TableHead>
              <TableHead className='h-7 px-2 text-center text-[10px]'>
                Time
              </TableHead>
              <TableHead className='h-7 px-2 text-right text-[10px]'>
                View
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEAMS.map((team) => {
              const info = TEAM_INFO[team];
              const time = teamTimes[team];
              const isTimerActive = activeTimer === team;
              const isLow = time !== null && time <= 30;
              const isCritical = time !== null && time <= 10;
              const isEliminated = loseOrder.includes(team);
              const isOrientationActive = orientation === TEAM_ROTATIONS[team];
              const lobbyPlayer = lobbyPlayers?.find((p) => p.team === team);
              const playerName = getLobbyPlayerName(lobbyPlayer);
              return (
                <TableRow
                  key={team}
                  className={cn(isOrientationActive && 'bg-muted/60')}
                >
                  <TableCell className='max-w-[118px] px-2 py-1.5'>
                    <div className='flex items-center gap-1.5'>
                      <span
                        className='h-2.5 w-2.5 shrink-0 rounded-full'
                        style={{ backgroundColor: info.cssVar }}
                      />
                      <span className='truncate font-medium'>{info.label}</span>
                      {myTeam === team && (
                        <span className='text-muted-foreground text-[10px]'>
                          (you)
                        </span>
                      )}
                    </div>
                    {playerName && (
                      <p
                        className={cn(
                          'text-muted-foreground truncate text-[10px]',
                          isEliminated && 'line-through opacity-70'
                        )}
                      >
                        {playerName}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className='px-2 py-1.5 text-center font-medium'>
                    {points[team]}
                  </TableCell>
                  <TableCell className='px-2 py-1.5 text-center'>
                    {hasTimer && time !== null ? (
                      <span
                        className={cn(
                          'inline-flex rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums',
                          isTimerActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                          isLow &&
                            isTimerActive &&
                            'text-background bg-[color:var(--classification-inaccuracy)]',
                          isCritical &&
                            isTimerActive &&
                            'bg-destructive text-destructive-foreground animate-pulse'
                        )}
                      >
                        {formatTime(time)}
                      </span>
                    ) : (
                      <span className='text-muted-foreground text-[10px]'>
                        -
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='px-2 py-1.5 text-right'>
                    <Button
                      type='button'
                      variant={isOrientationActive ? 'default' : 'ghost'}
                      size='sm'
                      className='h-6 px-2 text-[10px]'
                      onClick={() => setOrientation(TEAM_ROTATIONS[team])}
                    >
                      {isOrientationActive ? 'Active' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {drawOfferedBy &&
        (!myTeam || drawOfferedBy !== myTeam) &&
        !isGameOver && (
          <div className='shrink-0 space-y-2 border-b bg-blue-500/10 px-4 py-3'>
            <p className='text-center text-sm font-medium text-blue-600 dark:text-blue-400'>
              {TEAM_INFO[drawOfferedBy].label} offers a draw
            </p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={handleAcceptDraw}
              >
                Accept
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={handleDeclineDraw}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

      <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
        <div className='px-4 py-2'>
          <FourPlayerMoveHistory
            moves={moves}
            viewingMoveIndex={viewingMoveIndex}
            onMoveClick={goToMove}
          />
        </div>
      </ScrollArea>

      <NavigationControls
        viewingIndex={viewingMoveIndex + 1}
        totalPositions={moves.length + 1}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isPlaying={isPlaybackActive}
        onTogglePlay={togglePlay}
        onGoToStart={goToStart}
        onGoToEnd={goToEnd}
        onGoToPrev={goToPrev}
        onGoToNext={goToNext}
      />

      <div className='bg-muted/50 space-y-2 border-t p-2'>
        {(isGameOver || !gameStarted) && (
          <div className='flex flex-col gap-2 border-b pb-2'>
            {gameResult ? (
              <p className='text-center text-sm font-medium'>{gameResult}</p>
            ) : isGameOver && winner ? (
              <>
                <div className='flex items-center justify-center gap-2'>
                  <div
                    className='h-3.5 w-3.5 rounded-full'
                    style={{ backgroundColor: TEAM_INFO[winner].cssVar }}
                  />
                  <span className='text-sm font-bold'>
                    {TEAM_INFO[winner].label} wins!
                  </span>
                </div>
                {loseOrder.length > 0 && (
                  <p className='text-muted-foreground text-center text-xs'>
                    Eliminated:{' '}
                    {loseOrder.map((t, i) => (
                      <span key={t}>
                        {i > 0 && ', '}
                        <span style={{ color: TEAM_INFO[t].cssVar }}>
                          {TEAM_INFO[t].label}
                        </span>
                      </span>
                    ))}
                  </p>
                )}
              </>
            ) : (
              <p className='text-center text-sm font-medium'>
                {isMultiplayer
                  ? 'Waiting for game to start…'
                  : 'No active game'}
              </p>
            )}
            {!isMultiplayer && (
              <Button
                variant='default'
                size='sm'
                className='w-full'
                onClick={onNewGame ?? resetGame}
              >
                <Icons.newGame className='mr-2 h-4 w-4' />
                New Game
              </Button>
            )}
          </div>
        )}

        {isMultiplayer &&
          isGameOver &&
          rematchOfferedBy &&
          (!myTeam || rematchOfferedBy !== myTeam) && (
            <div className='space-y-2 rounded-md border bg-purple-500/10 px-3 py-2'>
              <p className='text-center text-sm font-medium text-purple-600 dark:text-purple-400'>
                {TEAM_INFO[rematchOfferedBy].label} wants a rematch
              </p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  className='flex-1 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
                  onClick={handleAcceptRematch}
                >
                  Accept
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={handleDeclineRematch}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}

        {isMultiplayer &&
          isGameOver &&
          !rematchOfferedBy &&
          !rematchDeclined && (
            <Button
              size='sm'
              variant={rematchSent ? 'default' : 'outline'}
              className='w-full'
              disabled={rematchSent}
              onClick={() => {
                setRematchSent(true);
                handleOfferRematch();
              }}
            >
              {rematchSent ? 'Rematch Sent ✓' : 'Rematch'}
            </Button>
          )}

        {isMultiplayer && isGameOver && rematchDeclined && (
          <p className='text-muted-foreground text-center text-xs'>
            A player declined the rematch
          </p>
        )}

        {!isGameOver && gameStarted && (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-center gap-2'>
              <div
                className='h-3 w-3 rounded-full'
                style={{ backgroundColor: currentInfo.cssVar }}
              />
              <span className='text-sm font-medium'>
                {currentInfo.label}&apos;s turn
              </span>
              {isChecked && (
                <span className='bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-xs font-bold'>
                  Check!
                </span>
              )}
            </div>

            {loseOrder.length > 0 && (
              <p className='text-muted-foreground text-center text-xs'>
                {loseOrder.length} eliminated:{' '}
                {loseOrder.map((t, i) => (
                  <span key={t}>
                    {i > 0 && ', '}
                    <span style={{ color: TEAM_INFO[t].cssVar }}>
                      {TEAM_INFO[t].label}
                    </span>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        {gameStarted && !isGameOver && (
          <div className='flex justify-center gap-1'>
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                      disabled={isGameOver || !gameStarted || !isPlaying}
                    >
                      <Icons.handshake className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Declare Draw</TooltipContent>
              </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                  <AlertDialogDescription>
                    Send a draw offer to the other players?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleOfferDraw}
                    className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  >
                    Offer Draw
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                      disabled={isGameOver || !gameStarted}
                    >
                      {canAbort ? (
                        <Icons.abort className='h-4 w-4' />
                      ) : (
                        <Icons.flag className='h-4 w-4' />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  {canAbort ? 'Abort Game' : 'Resign Game'}
                </TooltipContent>
              </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {canAbort ? 'Abort Game?' : 'Resign Game?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {canAbort
                      ? 'Are you sure you want to abort?'
                      : 'Are you sure you want to resign? Other players win.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={canAbort ? handleAbort : handleResign}
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  >
                    {canAbort ? 'Abort' : 'Resign'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </SidebarPanel>
  );
}
