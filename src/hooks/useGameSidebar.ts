import { useState, useEffect } from 'react';
import { useGameStore } from '@/hooks/stores/useGameStore';

export function useGameSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [copiedMoves, setCopiedMoves] = useState(false);
  const [copiedPGN, setCopiedPGN] = useState(false);

  // Individual selectors for better performance
  const moves = useGameStore((s) => s.moves);
  const viewingIndex = useGameStore((s) => s.viewingIndex);
  const positionHistory = useGameStore((s) => s.positionHistory);
  const goToStart = useGameStore((s) => s.goToStart);
  const goToEnd = useGameStore((s) => s.goToEnd);
  const goToPrev = useGameStore((s) => s.goToPrev);
  const goToNext = useGameStore((s) => s.goToNext);
  const goToMove = useGameStore((s) => s.goToMove);
  const onNewGame = useGameStore((s) => s.onNewGame);
  const setGameOver = useGameStore((s) => s.setGameOver);
  const setGameResult = useGameStore((s) => s.setGameResult);
  const gameOver = useGameStore((s) => s.gameOver);
  const gameResult = useGameStore((s) => s.gameResult);
  const playAs = useGameStore((s) => s.playAs);
  const flipBoard = useGameStore((s) => s.flipBoard);
  const gameStarted = useGameStore((s) => s.gameStarted);

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  // Reset copied states after timeout
  useEffect(() => {
    if (copiedMoves) {
      const timer = setTimeout(() => setCopiedMoves(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedMoves]);

  useEffect(() => {
    if (copiedPGN) {
      const timer = setTimeout(() => setCopiedPGN(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPGN]);

  // Playback logic
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (viewingIndex < positionHistory.length - 1) {
          goToNext();
        } else {
          setIsPlaying(false);
        }
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewingIndex, positionHistory.length, goToNext]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatMovesText = () => {
    const pairs: string[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = moves[i];
      const blackMove = moves[i + 1] || '';
      pairs.push(`${moveNum}. ${whiteMove}${blackMove ? ' ' + blackMove : ''}`);
    }
    return pairs.join(' ');
  };

  const formatPGN = () => {
    const date = new Date();
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    const result = gameOver
      ? gameResult?.includes('win')
        ? playAs === 'white'
          ? '1-0'
          : '0-1'
        : gameResult?.includes('resigned')
          ? playAs === 'white'
            ? '0-1'
            : '1-0'
          : '1/2-1/2'
      : '*';

    const headers = [
      '[Site "Zugklang"]',
      `[Date "${dateStr}"]`,
      `[White "${playAs === 'white' ? 'Player' : 'Stockfish'}"]`,
      `[Black "${playAs === 'black' ? 'Player' : 'Stockfish'}"]`,
      `[Result "${result}"]`
    ].join('\n');

    return `${headers}\n\n${formatMovesText()} ${result}`;
  };

  const handleCopyMoves = () => {
    navigator.clipboard.writeText(formatMovesText());
    setCopiedMoves(true);
  };

  const handleCopyPGN = () => {
    navigator.clipboard.writeText(formatPGN());
    setCopiedPGN(true);
  };

  const handleResign = () => {
    setGameResult('You resigned');
    setGameOver(true);
  };

  const handleAbort = () => {
    setGameResult('Game Aborted');
    setGameOver(true);
  };

  const handleRematch = () => {
    onNewGame();
    setGameOver(false);
  };

  return {
    // Dialog state
    settingsOpen,
    setSettingsOpen,
    newGameOpen,
    setNewGameOpen,

    // Copy state
    copiedMoves,
    copiedPGN,

    // Game state
    moves,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,

    // Navigation
    canGoBack,
    canGoForward,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,

    // Actions
    handleCopyMoves,
    handleCopyPGN,
    handleResign,
    handleAbort,
    handleRematch,
    flipBoard,

    // Playback
    isPlaying,
    onTogglePlay: togglePlay
  };
}
