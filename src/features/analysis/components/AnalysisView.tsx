'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chess, type PieceSymbol } from '@/lib/chess';
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
import { Board3D } from '@/features/chess/components/Board3D';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { EditorProvider, EditorChessboard } from './SpareEditorBoard';
import { SparePiecePalette } from './SparePiecePalette';
import { AnalysisChessBoard } from './AnalysisChessBoard';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { PromotionDialog } from '@/features/chess/components/PromotionDialog';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { usePlayback } from '@/features/chess/hooks/usePlayback';

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
import { useChessStore } from '@/features/chess/stores/useChessStore';

interface AnalysisViewProps {
  initialBoard3dEnabled?: boolean;
}

type PendingPromotion = {
  from: string;
  to: string;
  color: 'white' | 'black';
};

export function AnalysisView({
  initialBoard3dEnabled
}: AnalysisViewProps = {}) {
  const [pgnFenInput, setPgnFenInput] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [continueDialogOpen, setContinueDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

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

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup, startAnalysis, endAnalysis } =
    useAnalysisActions();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  const { isEditorMode, editorPosition } = useBoardEditorState();
  const {
    setEditorMode,
    setEditorPosition,
    clearBoard,
    resetBoard,
    validatePosition
  } = useBoardEditorActions();

  const theme = useBoardTheme();
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);

  const displayedFEN = isEditorMode ? editorPosition : currentFEN;
  const gameTurn = (displayedFEN?.split(' ')[1] || 'w') as 'w' | 'b';

  const analysisArrows = useChessArrows({
    isAnalysisOn: isAnalysisOn && !isEditorMode,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor: gameTurn,
    gameTurn,
    analysisTurn
  });

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: goToNext,
    enabled: !isEditorMode
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  useEffect(() => {
    if (!currentFEN || isEditorMode) return;
    const turn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, turn);
  }, [currentFEN, isEditorMode, setPosition]);

  useEffect(() => {
    if (!isEditorMode || !editorPosition) return;
    const turn = editorPosition.split(' ')[1] as 'w' | 'b';
    setPosition(editorPosition, turn);
  }, [isEditorMode, editorPosition, setPosition]);

  const handleToggleAnalysis = () => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  };

  const handleToggleEditorMode = () => {
    if (isEditorMode) {
      const validation = validatePosition();
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid position');
        return;
      }

      const success = loadFEN(editorPosition);
      if (success) {
        setEditorMode(false);
        toast.success('Position loaded');
      } else {
        toast.error('Invalid position');
      }
    } else {
      setEditorPosition(currentFEN);
      setEditorMode(true);
    }
  };

  const detectInputType = (input: string): 'pgn' | 'fen' | 'moves' => {
    const fenPattern =
      /^[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+/;
    if (fenPattern.test(input)) {
      return 'fen';
    }
    if (
      input.includes('[Event ') ||
      input.includes('[White ') ||
      input.includes('[Black ')
    ) {
      return 'pgn';
    }
    if (/\d+\./.test(input)) {
      return 'pgn';
    }
    return 'moves';
  };

  const loadMoveList = (input: string): boolean => {
    try {
      const board = new Chess();
      const cleaned = input
        .replace(/\d+\.\s*/g, '')
        .replace(/\s+/g, ' ')
        .replace(/1-0|0-1|1\/2-1\/2|\*/g, '')
        .trim();

      const movesList = cleaned.split(' ').filter((m) => m.length > 0);
      let moveCount = 0;

      for (const moveSAN of movesList) {
        try {
          const move = board.move(moveSAN);
          if (move) moveCount++;
        } catch {}
      }

      if (moveCount === 0) return false;
      return loadPGN(board.pgn());
    } catch {
      return false;
    }
  };

  const handleImport = () => {
    const trimmed = pgnFenInput.trim();
    if (!trimmed) {
      toast.error('Please enter a PGN, FEN, or moves');
      return;
    }

    const inputType = detectInputType(trimmed);

    if (inputType === 'fen') {
      if (isEditorMode) {
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
    } else if (inputType === 'pgn') {
      const success = loadPGN(trimmed);
      if (success) {
        toast.success('PGN loaded successfully');
        setImportDialogOpen(false);
        setPgnFenInput('');
      } else {
        toast.error('Invalid PGN format');
      }
    } else {
      const success = loadMoveList(trimmed);
      if (success) {
        toast.success('Moves loaded successfully');
        setImportDialogOpen(false);
        setPgnFenInput('');
      } else {
        toast.error('No valid moves found');
      }
    }
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

  const isPromotionMove = useCallback(
    (from: string, to: string, fen: string): boolean => {
      try {
        const game = new Chess(fen);
        const piece = game.get(from as 'a1');
        if (!piece || piece.type !== 'p') return false;
        const targetRank = to[1];
        return targetRank === '8' || targetRank === '1';
      } catch {
        return false;
      }
    },
    []
  );

  const completePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return;
      makeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, makeMove]
  );

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const handlePieceDrop = ({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (!targetSquare) return false;
    if (sourceSquare === targetSquare) return false;

    if (isPromotionMove(sourceSquare, targetSquare, currentFEN)) {
      try {
        const game = new Chess(currentFEN);
        const moves = game.moves({
          square: sourceSquare as 'a1',
          verbose: true
        });
        const isLegal = moves.some((m) => m.to === targetSquare);
        if (isLegal) {
          const piece = game.get(sourceSquare as 'a1');
          setPendingPromotion({
            from: sourceSquare,
            to: targetSquare,
            color: piece?.color === 'w' ? 'white' : 'black'
          });
          return true;
        }
      } catch {
        return false;
      }
    }

    const move = makeMove(sourceSquare, targetSquare);
    return !!move;
  };

  const layoutContent = (
    <>
      {}
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardOrientation === 'white' ? 'Black' : 'White'}
            isStockfish={false}
          />
        </div>

        {isEditorMode ? (
          <EditorChessboard />
        ) : (
          <BoardContainer showEvaluation={true}>
            {playingAgainstStockfish ? (
              <AnalysisChessBoard />
            ) : (
              <div className='relative'>
                {(
                  isMounted ? board3dEnabled : (initialBoard3dEnabled ?? false)
                ) ? (
                  <Board3D
                    position={currentFEN}
                    boardOrientation={boardOrientation}
                    canDrag={!pendingPromotion}
                    onPieceDrop={handlePieceDrop}
                    arrows={analysisArrows}
                  />
                ) : (
                  <Board
                    position={currentFEN}
                    boardOrientation={boardOrientation}
                    canDrag={!pendingPromotion}
                    onPieceDrop={handlePieceDrop}
                    darkSquareStyle={theme.darkSquareStyle}
                    lightSquareStyle={theme.lightSquareStyle}
                    arrows={analysisArrows}
                  />
                )}
                <PromotionDialog
                  isOpen={!!pendingPromotion}
                  color={pendingPromotion?.color || 'white'}
                  targetSquare={pendingPromotion?.to || 'a8'}
                  boardOrientation={boardOrientation}
                  onSelect={completePromotion}
                  onCancel={cancelPromotion}
                />
              </div>
            )}
          </BoardContainer>
        )}

        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardOrientation === 'white' ? 'White' : 'Black'}
            isStockfish={false}
          />
        </div>
      </div>

      {}
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {isAnalysisOn && !isEditorMode && (
          <div className='bg-card shrink-0 rounded-lg border'>
            <AnalysisLines />
          </div>
        )}

        <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            <h3 className='font-semibold'>
              {isEditorMode ? 'Board Editor' : 'Analysis'}
            </h3>
            <div className='flex items-center gap-1'>
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
                      Paste a PGN, FEN, or move list to analyze.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <Textarea
                      placeholder='Paste PGN, FEN, or moves here...'
                      value={pgnFenInput}
                      onChange={(e) => setPgnFenInput(e.target.value)}
                      className='min-h-[200px] font-mono text-sm'
                    />
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() =>
                          setPgnFenInput(
                            '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7'
                          )
                        }
                      >
                        Sample PGN
                      </Button>
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
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() => setPgnFenInput('e4 e5 Nf3 Nc6 Bb5 a6')}
                      >
                        Sample Moves
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

          {}
          {isEditorMode ? (
            <div className='flex-1 overflow-auto'>
              <SparePiecePalette orientation={boardOrientation} />
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

          <div className='bg-muted/50 flex items-center justify-between border-t p-2'>
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
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={toggleBoardOrientation}
                  >
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
                      <Button variant='ghost' size='icon' onClick={resetBoard}>
                        <Icons.rematch className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset Board</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='ghost' size='icon' onClick={clearBoard}>
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

      {}
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

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        show3dToggle={!isEditorMode}
      />
    </>
  );

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      {isEditorMode ? (
        <EditorProvider boardOrientation={boardOrientation}>
          {layoutContent}
        </EditorProvider>
      ) : (
        layoutContent
      )}
    </div>
  );
}
