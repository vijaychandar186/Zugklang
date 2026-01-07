'use client';

import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { PiecePalette } from './PiecePalette';
import { EditorBoard } from './EditorBoard';
import { AnalysisChessBoard } from './AnalysisChessBoard';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';

import {
  useAnalysisBoardState,
  useAnalysisBoardActions
} from '../stores/useAnalysisBoardStore';
import {
  useAnalysisState,
  useAnalysisActions,
  useAnalysisConfig,
  useEngineAnalysis,
  useAnalysisPosition
} from '@/features/chess/stores/useAnalysisStore';
import {
  useBoardEditorState,
  useBoardEditorActions
} from '../stores/useBoardEditorStore';

export function AnalysisView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pgnFenInput, setPgnFenInput] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [continueDialogOpen, setContinueDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(10);

  // Analysis board store state (separate from game state!)
  const {
    currentFEN,
    moves,
    viewingIndex,
    positionHistory,
    boardOrientation,
    playingAgainstStockfish
  } = useAnalysisBoardState();

  const {
    makeMove,
    loadPGN,
    loadFEN,
    resetToStarting,
    startPlayingFromPosition,
    stopPlayingFromPosition,
    toggleBoardOrientation,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove
  } = useAnalysisBoardActions();

  // Analysis store state
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup, startAnalysis, endAnalysis } =
    useAnalysisActions();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  // Board editor store state
  const { isEditorMode, editorPosition } = useBoardEditorState();
  const {
    setEditorMode,
    setEditorPosition,
    clearBoard,
    resetBoard,
    validatePosition
  } = useBoardEditorActions();

  const theme = useBoardTheme();

  // Get the current turn from the FEN being displayed
  const displayedFEN = isEditorMode ? editorPosition : currentFEN;
  const gameTurn = (displayedFEN?.split(' ')[1] || 'w') as 'w' | 'b';

  const analysisArrows = useChessArrows({
    isAnalysisOn: isAnalysisOn && !isEditorMode,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    // In analysis mode, we consider the current side to move as the "player"
    playerColor: gameTurn,
    gameTurn,
    analysisTurn
  });

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  // Initialize analysis engine
  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  // Update analysis position when FEN changes (and not in editor mode)
  useEffect(() => {
    if (!currentFEN || isEditorMode) return;
    const turn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, turn);
  }, [currentFEN, isEditorMode, setPosition]);

  // Update analysis position when editor position changes
  useEffect(() => {
    if (!isEditorMode || !editorPosition) return;
    const turn = editorPosition.split(' ')[1] as 'w' | 'b';
    setPosition(editorPosition, turn);
  }, [isEditorMode, editorPosition, setPosition]);

  // Playback control
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isEditorMode) {
      interval = setInterval(() => {
        if (viewingIndex < positionHistory.length - 1) {
          goToNext();
        } else {
          setIsPlaying(false);
        }
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewingIndex, positionHistory.length, goToNext, isEditorMode]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleToggleAnalysis = () => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  };

  const handleToggleEditorMode = () => {
    if (isEditorMode) {
      // Exiting editor mode - validate and apply position
      const validation = validatePosition();
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid position');
        return;
      }

      // Load the editor position into the analysis store
      const success = loadFEN(editorPosition);
      if (success) {
        setEditorMode(false);
        toast.success('Position loaded');
      } else {
        toast.error('Invalid position');
      }
    } else {
      // Entering editor mode - copy current position to editor
      setEditorPosition(currentFEN);
      setEditorMode(true);
    }
  };

  const handleImport = () => {
    const trimmed = pgnFenInput.trim();
    if (!trimmed) {
      toast.error('Please enter a PGN or FEN string');
      return;
    }

    const isFEN =
      trimmed.includes('/') &&
      !trimmed.includes('[') &&
      trimmed.split('\n').length === 1;

    if (isFEN) {
      if (isEditorMode) {
        // In editor mode, load directly to editor position
        try {
          new Chess(trimmed);
          setEditorPosition(trimmed);
          toast.success('FEN loaded to editor');
          setImportDialogOpen(false);
          setPgnFenInput('');
        } catch {
          toast.error('Invalid FEN string');
        }
      } else {
        const success = loadFEN(trimmed);
        if (success) {
          toast.success('FEN loaded successfully');
          setImportDialogOpen(false);
          setPgnFenInput('');
        } else {
          toast.error('Invalid FEN string');
        }
      }
    } else {
      const success = loadPGN(trimmed);
      if (success) {
        toast.success('PGN loaded successfully');
        setImportDialogOpen(false);
        setPgnFenInput('');
      } else {
        toast.error('Invalid PGN format');
      }
    }
  };

  const handleClearBoard = () => {
    clearBoard();
  };

  const handleResetBoard = () => {
    resetBoard();
  };

  const handleContinueFromPosition = (color: 'white' | 'black') => {
    if (isEditorMode) {
      const validation = validatePosition();
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid position');
        return;
      }
      const success = loadFEN(editorPosition);
      if (!success) {
        toast.error('Invalid position');
        return;
      }
      setEditorMode(false);
    }

    startPlayingFromPosition(color, selectedLevel);
    setContinueDialogOpen(false);
    toast.success(
      `Playing as ${color} against Stockfish (Level ${selectedLevel})`
    );
  };

  const handleStopPlaying = () => {
    stopPlayingFromPosition();
    toast.success('Stopped playing');
  };

  const handleFlipBoard = () => {
    toggleBoardOrientation();
  };

  const handleNewAnalysis = () => {
    if (isEditorMode) {
      resetBoard();
      setEditorMode(false);
    }
    resetToStarting();
    if (playingAgainstStockfish) {
      stopPlayingFromPosition();
    }
  };

  const copyFEN = () => {
    const fen = isEditorMode ? editorPosition : currentFEN;
    navigator.clipboard.writeText(fen);
    toast.success('FEN copied');
  };

  const copyPGN = () => {
    // Build a simple PGN from moves
    const movesPGN = moves
      .reduce((acc, move, index) => {
        if (index % 2 === 0) {
          return acc + `${Math.floor(index / 2) + 1}. ${move} `;
        }
        return acc + `${move} `;
      }, '')
      .trim();
    navigator.clipboard.writeText(movesPGN || '[No moves]');
    toast.success('PGN copied');
  };

  const copyMoves = () => {
    const movesList = moves.join(' ');
    navigator.clipboard.writeText(movesList || 'No moves');
    toast.success('Moves copied');
  };

  const handlePieceDrop = ({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (!targetSquare) return false;
    const move = makeMove(sourceSquare, targetSquare);
    return !!move;
  };

  return (
    <div className='flex min-h-screen flex-col gap-4 px-4 py-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      {/* Board area */}
      <div className='flex flex-col items-center gap-2'>
        {/* Top player */}
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardOrientation === 'white' ? 'Black' : 'White'}
            isStockfish={false}
          />
        </div>

        {/* Board */}
        <BoardContainer showEvaluation={!isEditorMode}>
          {isEditorMode ? (
            <EditorBoard boardOrientation={boardOrientation} />
          ) : playingAgainstStockfish ? (
            <AnalysisChessBoard />
          ) : (
            <Board
              position={currentFEN}
              boardOrientation={boardOrientation}
              canDrag={true}
              onPieceDrop={handlePieceDrop}
              darkSquareStyle={theme.darkSquareStyle}
              lightSquareStyle={theme.lightSquareStyle}
              arrows={analysisArrows}
            />
          )}
        </BoardContainer>

        {/* Bottom player */}
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardOrientation === 'white' ? 'White' : 'Black'}
            isStockfish={false}
          />
        </div>
      </div>

      {/* Sidebar - same whether in editor mode or not */}
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {/* Analysis lines */}
        {isAnalysisOn && !isEditorMode && (
          <div className='bg-card shrink-0 rounded-lg border'>
            <AnalysisLines />
          </div>
        )}

        {/* Move history and controls */}
        <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            <h3 className='font-semibold'>
              {isEditorMode ? 'Board Editor' : 'Analysis'}
            </h3>
            <div className='flex items-center gap-1'>
              {/* Share dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <Icons.share className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={copyFEN}>
                    <Icons.copy className='mr-2 h-4 w-4' />
                    Copy FEN
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyPGN}>
                    <Icons.fileText className='mr-2 h-4 w-4' />
                    Copy PGN
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyMoves}>
                    <Icons.arrowRight className='mr-2 h-4 w-4' />
                    Copy Moves
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Import PGN/FEN */}
              <Dialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    title='Import PGN/FEN'
                  >
                    <Icons.upload className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[600px]'>
                  <DialogHeader>
                    <DialogTitle>Import Position or Game</DialogTitle>
                    <DialogDescription>
                      Paste a PGN (game notation) or FEN (position) string.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <Textarea
                      placeholder='Paste PGN or FEN here...'
                      value={pgnFenInput}
                      onChange={(e) => setPgnFenInput(e.target.value)}
                      className='min-h-[200px] font-mono text-sm'
                    />
                    <div className='flex gap-2'>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() =>
                          setPgnFenInput(
                            'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'
                          )
                        }
                      >
                        Sample FEN
                      </Button>
                      {pgnFenInput && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setPgnFenInput('')}
                        >
                          <Icons.close className='mr-1 h-3 w-3' />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setImportDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleImport}>Import</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Content area - moves or piece palette */}
          {isEditorMode ? (
            <div className='flex-1 overflow-auto'>
              <PiecePalette />
            </div>
          ) : (
            <>
              <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
                <div className='px-4 py-2'>
                  <MoveHistory
                    moves={moves}
                    viewingIndex={viewingIndex}
                    onMoveClick={goToMove}
                  />
                </div>
              </ScrollArea>

              <NavigationControls
                viewingIndex={viewingIndex}
                totalPositions={positionHistory.length}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onGoToStart={goToStart}
                onGoToEnd={goToEnd}
                onGoToPrev={goToPrev}
                onGoToNext={goToNext}
              />
            </>
          )}

          {/* Bottom toolbar */}
          <div className='bg-muted/50 flex items-center justify-between border-t p-2'>
            {/* Left group: Settings, Flip, Engine */}
            <div className='flex items-center gap-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Icons.settings className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={handleFlipBoard}>
                    <Icons.flipBoard className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Flip Board</TooltipContent>
              </Tooltip>

              {!isEditorMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isAnalysisOn ? 'default' : 'ghost'}
                      size='icon'
                      onClick={handleToggleAnalysis}
                      disabled={!isInitialized}
                    >
                      <Icons.engine className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isAnalysisOn ? 'Disable Engine' : 'Enable Engine'}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Right group: Edit, Bot/Reset or Clear, New */}
            <div className='flex items-center gap-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isEditorMode ? 'default' : 'ghost'}
                    size='icon'
                    onClick={handleToggleEditorMode}
                  >
                    {isEditorMode ? (
                      <Icons.close className='h-4 w-4' />
                    ) : (
                      <Icons.edit className='h-4 w-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isEditorMode ? 'Exit Editor' : 'Board Editor'}
                </TooltipContent>
              </Tooltip>

              {isEditorMode ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleResetBoard}
                      >
                        <Icons.rematch className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset Board</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleClearBoard}
                      >
                        <Icons.trash className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear Board</TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  {playingAgainstStockfish ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={handleStopPlaying}
                        >
                          <Icons.abort className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Stop Playing</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => setContinueDialogOpen(true)}
                        >
                          <Icons.stockfish className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Play vs Computer</TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleNewAnalysis}
                      >
                        <Icons.rematch className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Analysis</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Continue from position dialog */}
      <Dialog open={continueDialogOpen} onOpenChange={setContinueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play from this Position</DialogTitle>
            <DialogDescription>
              Choose your color and difficulty level to continue playing against
              Stockfish.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label>Stockfish Level</Label>
                <span className='text-sm font-medium'>{selectedLevel}</span>
              </div>
              <Slider
                value={[selectedLevel]}
                onValueChange={(v) => setSelectedLevel(v[0])}
                min={1}
                max={20}
                step={1}
              />
              <div className='text-muted-foreground flex justify-between text-xs'>
                <span>Beginner</span>
                <span>Master</span>
              </div>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              className='flex-1'
              variant='outline'
              onClick={() => handleContinueFromPosition('white')}
            >
              Play as White
            </Button>
            <Button
              className='flex-1'
              onClick={() => handleContinueFromPosition('black')}
            >
              Play as Black
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
