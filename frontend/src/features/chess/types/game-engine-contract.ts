import type { MultiplayerStatus } from '@/features/multiplayer/types';
export interface MoveResult {
  color: 'w' | 'b';
  san: string;
  captured?: unknown;
  promotion?: unknown;
}
export interface TwoPlayerPlayerInfo {
  name: string;
  image?: string | null;
  rating?: number | null;
  ratingDelta?: number | null;
  flagCode?: string | null;
}
export interface TwoPlayerMultiplayerSidebarProps {
  status: MultiplayerStatus;
  drawOffered: boolean;
  rematchOffered: boolean;
  rematchDeclined: boolean;
  onAbort: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onAcceptDraw: () => void;
  onDeclineDraw: () => void;
  onOfferRematch: () => void;
  onAcceptRematch: () => void;
  onDeclineRematch: () => void;
  onFindNewGame: () => void;
  ratingDelta?: number | null;
}
export interface GameEngineContract {
  makeMove(from: string, to: string, promotion?: string): MoveResult | null;
  isCheck(): boolean;
  getTurn(): 'w' | 'b';
  isGameOver(): boolean;
  getCurrentFEN(): string;
}
