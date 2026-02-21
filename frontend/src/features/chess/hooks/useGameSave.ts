'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import type { GameType } from '@/features/chess/stores/useChessStore';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** Map chess-store result string to a PGN result code */
function toResultReason(result: string | null): string {
  if (!result) return 'unknown';
  const lower = result.toLowerCase();
  if (lower.includes('checkmate')) return 'checkmate';
  if (lower.includes('resign')) return 'resign';
  if (lower.includes('time') || lower.includes('timeout')) return 'timeout';
  if (lower.includes('draw') && lower.includes('agreement'))
    return 'draw_agreement';
  if (lower.includes('stalemate')) return 'stalemate';
  if (lower.includes('insufficient')) return 'insufficient_material';
  if (lower.includes('computer') || lower.includes('stockfish'))
    return 'computer';
  return 'unknown';
}

function toResultCode(
  result: string | null,
  playAs: 'white' | 'black'
): string {
  if (!result) return '*';
  const lower = result.toLowerCase();
  if (lower.includes('you win') || lower.includes('white wins')) {
    return playAs === 'white' ? '1-0' : '0-1';
  }
  if (
    lower.includes('opponent wins') ||
    lower.includes('stockfish wins') ||
    lower.includes('black wins')
  ) {
    return playAs === 'white' ? '0-1' : '1-0';
  }
  if (lower.includes('draw')) return '1/2-1/2';
  return '*';
}

/**
 * Automatically saves computer and local games to the DB when they end.
 * Multiplayer games are saved separately in MultiplayerGameView.
 *
 * Must be mounted inside a component that has access to the chess store.
 */
export function useGameSave(gameType: GameType) {
  const { data: session } = useSession();
  const savedGameIdRef = useRef<number>(-1);

  const gameId = useChessStore((s) => s.gameId);
  const gameOver = useChessStore((s) => s.gameOver);
  const gameResult = useChessStore((s) => s.gameResult);
  const moves = useChessStore((s) => s.moves);
  const variant = useChessStore((s) => s.variant);
  const timeControl = useChessStore((s) => s.timeControl);
  const playAs = useChessStore((s) => s.playAs);
  const positionHistory = useChessStore((s) => s.positionHistory);

  useEffect(() => {
    // Only save computer and local games (multiplayer is handled separately)
    if (gameType !== 'computer' && gameType !== 'local') return;
    // Must be authenticated
    if (!session?.user?.id) return;
    // Only trigger when game actually ends
    if (!gameOver) return;
    // Don't save the same game twice
    if (savedGameIdRef.current === gameId) return;
    // Don't save if no moves were made
    if (moves.length === 0) return;

    savedGameIdRef.current = gameId;

    const startingFen = positionHistory[0] ?? STARTING_FEN;
    const resultCode = toResultCode(gameResult, playAs);
    const resultReason = toResultReason(gameResult);

    fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moves,
        variant,
        gameType,
        result: resultCode,
        resultReason,
        myColor: playAs,
        opponentUserId: null,
        timeControl,
        startingFen
      })
    }).catch((err) => {
      console.error('Failed to save game:', err);
    });
  }, [gameOver, gameId]); // eslint-disable-line react-hooks/exhaustive-deps
}
