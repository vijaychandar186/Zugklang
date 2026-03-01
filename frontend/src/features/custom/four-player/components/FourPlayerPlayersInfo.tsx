'use client';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { useFourPlayerStore } from '../store';
import type { Team } from '../engine';
import type { FourPlayerLobbyPlayer } from '@/features/multiplayer/types';
import { cn } from '@/lib/utils';
import { formatTime } from '@/features/game/utils/formatting';
const TEAM_ORDER: Team[] = ['r', 'b', 'y', 'g'];
const TEAM_INFO: Record<
  Team,
  {
    label: string;
    cssVar: string;
  }
> = {
  r: { label: 'Red', cssVar: 'var(--four-player-red)' },
  b: { label: 'Blue', cssVar: 'var(--four-player-blue)' },
  y: { label: 'Yellow', cssVar: 'var(--four-player-yellow)' },
  g: { label: 'Green', cssVar: 'var(--four-player-green)' }
};
interface FourPlayerPlayersInfoProps {
  lobbyPlayers?: FourPlayerLobbyPlayer[];
  myTeam?: Team | null;
}
export function FourPlayerPlayersInfo({
  lobbyPlayers,
  myTeam
}: FourPlayerPlayersInfoProps) {
  const points = useFourPlayerStore((s) => s.points);
  const teamTimes = useFourPlayerStore((s) => s.teamTimes);
  const activeTimer = useFourPlayerStore((s) => s.activeTimer);
  const gameStarted = useFourPlayerStore((s) => s.gameStarted);
  const isGameOver = useFourPlayerStore((s) => s.isGameOver);
  const timeControl = useFourPlayerStore((s) => s.timeControl);
  const isMultiplayer = !!lobbyPlayers;
  const hasTimer = timeControl.mode !== 'unlimited';
  return (
    <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
      {TEAM_ORDER.map((team) => {
        const info = TEAM_INFO[team];
        const player = lobbyPlayers?.find((p) => p.team === team);
        const playerName = player?.displayName?.trim();
        const name =
          playerName || (isMultiplayer ? 'Open seat' : `${info.label} Player`);
        const subtitle = `${info.label}${myTeam === team ? ' • You' : ''}`;
        const time = teamTimes[team];
        const timerActive =
          hasTimer && gameStarted && !isGameOver && activeTimer === team;
        return (
          <div
            key={team}
            className='bg-card flex items-center justify-between rounded-lg border p-2'
          >
            <div className='flex min-w-0 items-center gap-2'>
              <span
                className='h-2.5 w-2.5 shrink-0 rounded-full'
                style={{ backgroundColor: info.cssVar }}
                aria-hidden='true'
              />
              <PlayerInfo
                name={name}
                subtitle={subtitle}
                image={player?.userImage ?? null}
              />
            </div>
            <div className='flex shrink-0 flex-col items-end gap-1'>
              <span className='text-muted-foreground text-xs'>
                {points[team]} pts
              </span>
              {hasTimer && time !== null && (
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums',
                    timerActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {formatTime(time)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
