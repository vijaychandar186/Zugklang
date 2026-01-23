'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export type UseClipboardOptions = {
  resetDelay?: number;
};

export function useClipboard({ resetDelay = 2000 }: UseClipboardOptions = {}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (copiedKey) {
      const timer = setTimeout(() => setCopiedKey(null), resetDelay);
      return () => clearTimeout(timer);
    }
  }, [copiedKey, resetDelay]);

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      return true;
    } catch {
      return false;
    }
  }, []);

  const isCopied = useCallback((key: string) => copiedKey === key, [copiedKey]);

  return {
    copy,
    isCopied,
    copiedKey
  };
}

export interface UseChessClipboardOptions {
  getFEN: () => string;
  getPGN: () => string;
  getMoves?: () => string;
}

export interface UseChessClipboardReturn {
  copyFEN: () => void;
  copyPGN: () => void;
  copyMoves: () => void;
}

export function useChessClipboard({
  getFEN,
  getPGN,
  getMoves
}: UseChessClipboardOptions): UseChessClipboardReturn {
  const copyFEN = useCallback(() => {
    const fen = getFEN();
    navigator.clipboard.writeText(fen);
    toast.success('FEN copied');
  }, [getFEN]);

  const copyPGN = useCallback(() => {
    const pgn = getPGN();
    navigator.clipboard.writeText(pgn || '[No moves]');
    toast.success('PGN copied');
  }, [getPGN]);

  const copyMoves = useCallback(() => {
    if (!getMoves) {
      toast.error('No moves to copy');
      return;
    }
    const moves = getMoves();
    navigator.clipboard.writeText(moves || 'No moves');
    toast.success('Moves copied');
  }, [getMoves]);

  return {
    copyFEN,
    copyPGN,
    copyMoves
  };
}

export function formatMovesText(moves: string[]): string {
  const pairs: string[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1] || '';
    pairs.push(`${moveNum}. ${whiteMove}${blackMove ? ' ' + blackMove : ''}`);
  }
  return pairs.join(' ');
}

export function formatPGN(
  moves: string[],
  options: {
    gameOver?: boolean;
    gameResult?: string | null;
    playAs?: 'white' | 'black';
    isLocalGame?: boolean;
  } = {}
): string {
  const {
    gameOver,
    gameResult,
    playAs = 'white',
    isLocalGame = false
  } = options;
  const date = new Date();
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  let result = '*';
  if (gameOver && gameResult) {
    if (gameResult.includes('White wins')) {
      result = '1-0';
    } else if (gameResult.includes('Black wins')) {
      result = '0-1';
    } else if (gameResult.includes('You win')) {
      result = playAs === 'white' ? '1-0' : '0-1';
    } else if (
      gameResult.includes('Stockfish wins') ||
      gameResult.includes('resigned')
    ) {
      result = playAs === 'white' ? '0-1' : '1-0';
    } else {
      result = '1/2-1/2';
    }
  }

  const whiteName = isLocalGame
    ? 'White'
    : playAs === 'white'
      ? 'Player'
      : 'Stockfish';
  const blackName = isLocalGame
    ? 'Black'
    : playAs === 'black'
      ? 'Player'
      : 'Stockfish';

  const headers = [
    '[Site "Zugklang"]',
    `[Date "${dateStr}"]`,
    `[White "${whiteName}"]`,
    `[Black "${blackName}"]`,
    `[Result "${result}"]`
  ].join('\n');

  return `${headers}\n\n${formatMovesText(moves)} ${result}`;
}
