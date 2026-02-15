import type { Team } from '../engine';

export interface TeamInfo {
  label: string;
  short: string;
  cssVar: string;
}

export const TEAM_INFO: Record<Team, TeamInfo> = {
  r: { label: 'Red', short: 'R', cssVar: 'var(--team-red)' },
  b: { label: 'Blue', short: 'B', cssVar: 'var(--team-blue)' },
  y: { label: 'Yellow', short: 'Y', cssVar: 'var(--team-yellow)' },
  g: { label: 'Green', short: 'G', cssVar: 'var(--team-green)' }
};

export const TEAMS: Team[] = ['r', 'b', 'y', 'g'];

export function getTeamColor(team: Team): string {
  return TEAM_INFO[team].cssVar;
}

export const TEAM_CSS_VARS: Record<Team, string> = {
  r: 'var(--team-red)',
  b: 'var(--team-blue)',
  y: 'var(--team-yellow)',
  g: 'var(--team-green)'
};
