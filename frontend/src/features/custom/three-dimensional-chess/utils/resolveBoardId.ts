import {
  useGameStore,
  type GameState
} from '@/features/custom/three-dimensional-chess/store/gameStore';

type AttackBoardStates = GameState['attackBoardStates'];

export function resolveBoardId(
  level: string,
  attackBoardStates?: AttackBoardStates
): string {
  if (level === 'W' || level === 'N' || level === 'B') return level;
  const states = attackBoardStates ?? useGameStore.getState().attackBoardStates;
  const active = states?.[level]?.activeInstanceId;
  return active ?? level;
}
