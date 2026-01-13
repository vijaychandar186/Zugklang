'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
import { ReviewMoveHistory } from './ReviewMoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';

import { EvaluationGraph } from './EvaluationGraph';
import { ReviewReport } from './ReviewReport';

import {
  useGameReviewState,
  useGameReviewActions,
  useCurrentPositionData
} from '@/features/game-review/stores/useGameReviewStore';
import { CLASSIFICATION_COLORS } from '@/features/game-review/types';
import type { ChessArrow } from '@/features/chess/types/visualization';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function GameReviewView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pgnFenInput, setPgnFenInput] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const {
    pgn,
    depth,
    status,
    progress,
    errorMsg,
    report,
    liveEvaluations,
    currentMoveIndex,
    boardFlipped,
    showArrows
  } = useGameReviewState();

  const {
    setPgn,
    setDepth,
    setStatus,
    setProgress,
    setErrorMsg,
    setReport,
    setLiveEvaluations,
    navigate,
    goToMove,
    toggleBoardFlip,
    toggleArrows,
    resetReview
  } = useGameReviewActions();

  const { position, classification, topLine, currentFen } =
    useCurrentPositionData();

  const theme = useBoardTheme();

  const totalPositions = report?.positions.length || 1;
  const canGoBack = currentMoveIndex > 0;
  const canGoForward = currentMoveIndex < totalPositions - 1;

  // Playback control
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && report) {
      interval = setInterval(() => {
        if (currentMoveIndex < report.positions.length - 1) {
          navigate(1);
        } else {
          setIsPlaying(false);
        }
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentMoveIndex, report, navigate]);

  // Square styles for move highlighting based on classification
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (position?.move?.uci && currentMoveIndex > 0) {
      const uci = position.move.uci;
      const fromSquare = uci.slice(0, 2);
      const toSquare = uci.slice(2, 4);
      const color = CLASSIFICATION_COLORS[classification || 'book'];

      styles[fromSquare] = { backgroundColor: color, opacity: 0.7 };
      styles[toSquare] = { backgroundColor: color, opacity: 0.7 };
    }
    return styles;
  }, [position, currentMoveIndex, classification]);

  // Arrows for engine suggestions
  const arrows = useMemo<ChessArrow[]>(() => {
    if (!showArrows || !position?.topLines) return [];
    return position.topLines.slice(0, 2).map((line, idx) => ({
      startSquare: line.moveUCI.slice(0, 2),
      endSquare: line.moveUCI.slice(2, 4),
      color: idx === 0 ? 'var(--arrow-best-move)' : 'var(--arrow-alternative)'
    }));
  }, [showArrows, position]);

  const handleImport = useCallback(() => {
    const trimmed = pgnFenInput.trim();
    if (!trimmed) {
      toast.error('Please enter a PGN or FEN string');
      return;
    }
    setPgn(trimmed);
    setImportDialogOpen(false);
    setPgnFenInput('');
    toast.success('Game loaded - click Review to analyse');
  }, [pgnFenInput, setPgn]);

  const handleReview = useCallback(async () => {
    if (!pgn.trim()) {
      toast.error('Import a game first');
      return;
    }

    resetReview();
    setStatus('parsing');
    setProgress(0);
    setReviewDialogOpen(false);

    try {
      // Step 1: Parse the PGN/FEN into positions
      const parseRes = await fetch('/api/game-review/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: pgn })
      });

      const parseData = await parseRes.json();
      if (!parseRes.ok) {
        setErrorMsg(parseData.message || 'Failed to parse');
        setStatus('error');
        return;
      }

      let positions = parseData.positions;
      if (!positions || positions.length === 0) {
        setErrorMsg('No positions found');
        setStatus('error');
        return;
      }

      setProgress(10);

      // Step 2: Evaluate positions with Stockfish (THE MISSING STEP!)
      setStatus('evaluating');

      const { evaluatePositions } = await import('@/lib/evaluation');
      positions = await evaluatePositions(
        positions,
        depth,
        (current, total, percent, currentPositions) => {
          // Update progress: 10% to 90% for evaluation
          const evalProgress = 10 + Math.round(percent * 0.8);
          setProgress(evalProgress);

          // Update live evaluations for progressive graph display
          const liveEvals = currentPositions.map((pos) => {
            const topLine = pos.topLines?.[0];
            if (topLine?.evaluation) {
              return {
                type: topLine.evaluation.type,
                value: topLine.evaluation.value
              };
            }
            return null;
          });
          setLiveEvaluations(liveEvals);

          // Move the yellow indicator to show current position being evaluated
          goToMove(current);
        }
      );

      // Step 3: Generate the analysis report
      setStatus('reporting');
      setProgress(95);

      const reportRes = await fetch('/api/game-review/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positions })
      });

      const reportData = await reportRes.json();
      if (!reportRes.ok) {
        setErrorMsg(reportData.message || 'Failed to generate report');
        setStatus('error');
        return;
      }

      setReport(reportData.results);
      setStatus('complete');
      setProgress(100);
      toast.success('Game review complete');
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred');
      setStatus('error');
    }
  }, [pgn, depth, resetReview, setStatus, setProgress, setErrorMsg, setReport]);

  const copyFEN = () => {
    navigator.clipboard.writeText(currentFen || STARTING_FEN);
    toast.success('FEN copied');
  };

  const copyPGN = () => {
    navigator.clipboard.writeText(pgn || '[No game loaded]');
    toast.success('PGN copied');
  };

  const handleNewReview = () => {
    resetReview();
    setPgn('');
    toast.success('Ready for new review');
  };

  const isLoading =
    status === 'parsing' || status === 'evaluating' || status === 'reporting';

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-4 lg:overflow-hidden lg:px-6'>
      {/* Board area - Center */}
      <div className='flex flex-col items-center gap-2'>
        {/* Top player */}
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardFlipped ? 'White' : 'Black'}
            isStockfish={false}
          />
        </div>

        {/* Board */}
        <BoardContainer showEvaluation={!!report}>
          <Board
            position={currentFen || STARTING_FEN}
            boardOrientation={boardFlipped ? 'black' : 'white'}
            canDrag={false}
            darkSquareStyle={theme.darkSquareStyle}
            lightSquareStyle={theme.lightSquareStyle}
            squareStyles={squareStyles}
            arrows={arrows}
          />
        </BoardContainer>

        {/* Bottom player */}
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardFlipped ? 'Black' : 'White'}
            isStockfish={false}
          />
        </div>
      </div>

      {/* Primary Sidebar - Move History, Controls & Evaluation Graph */}
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {/* Evaluation graph - show during evaluation or when complete */}
        {(report ||
          (status === 'evaluating' && liveEvaluations.length > 0)) && (
          <div className='bg-card shrink-0 rounded-lg border p-3'>
            <EvaluationGraph
              positions={
                report?.positions ||
                liveEvaluations.map((evaluation, i) => ({
                  fen: '',
                  topLines: evaluation
                    ? [
                        {
                          id: 1,
                          depth: 0,
                          evaluation: evaluation,
                          moveUCI: ''
                        }
                      ]
                    : []
                }))
              }
              currentMoveIndex={currentMoveIndex}
              onMoveClick={goToMove}
            />
          </div>
        )}

        {/* Move history and controls */}
        <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            <h3 className='font-semibold'>Game Review</h3>
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
                    <DialogTitle>Import Game</DialogTitle>
                    <DialogDescription>
                      Paste a PGN, FEN, or move list to review.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <Textarea
                      placeholder='Paste PGN, FEN, or moves here...'
                      value={pgnFenInput}
                      onChange={(e) => setPgnFenInput(e.target.value)}
                      className='min-h-[200px] font-mono text-sm'
                    />
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

          {/* Content: Move history or status */}
          {report ? (
            <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
              <div className='px-4 py-2'>
                <ReviewMoveHistory
                  positions={report.positions}
                  viewingIndex={currentMoveIndex}
                  onMoveClick={(idx) => goToMove(idx + 1)}
                />
              </div>
            </ScrollArea>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center'>
              <Icons.microscope className='text-muted-foreground h-12 w-12' />
              <div className='space-y-1'>
                <p className='font-medium'>No game loaded</p>
                <p className='text-muted-foreground text-sm'>
                  Import a PGN or paste moves to review
                </p>
              </div>
              {isLoading && (
                <div className='w-full space-y-1'>
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span className='capitalize'>{status}...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className='bg-secondary h-2 overflow-hidden rounded-full'>
                    <div
                      className='bg-primary h-full transition-all'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              {status === 'error' && (
                <p className='text-destructive text-sm'>{errorMsg}</p>
              )}
            </div>
          )}

          {report && (
            <NavigationControls
              viewingIndex={currentMoveIndex}
              totalPositions={totalPositions}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onGoToStart={() => navigate(-Infinity)}
              onGoToEnd={() => navigate(Infinity)}
              onGoToPrev={() => navigate(-1)}
              onGoToNext={() => navigate(1)}
            />
          )}

          {/* Bottom toolbar */}
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
                  <Button variant='ghost' size='icon' onClick={toggleBoardFlip}>
                    <Icons.flipBoard className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Flip Board</TooltipContent>
              </Tooltip>

              {report && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showArrows ? 'default' : 'ghost'}
                      size='icon'
                      onClick={toggleArrows}
                    >
                      <Icons.engine className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showArrows ? 'Hide Arrows' : 'Show Arrows'}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className='flex items-center gap-1'>
              {/* Review button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={report ? 'ghost' : 'default'}
                    size='icon'
                    onClick={handleReview}
                    disabled={isLoading || !pgn.trim()}
                  >
                    {isLoading ? (
                      <Icons.spinner className='h-4 w-4 animate-spin' />
                    ) : (
                      <Icons.microscope className='h-4 w-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Review Game</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={handleNewReview}>
                    <Icons.rematch className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Review</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Sidebar - Review Report Only */}
      {report && (
        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
          <div className='bg-card flex-1 overflow-hidden rounded-lg border'>
            <ScrollArea className='h-full'>
              <ReviewReport
                report={report}
                currentPosition={position}
                currentMoveIndex={currentMoveIndex}
              />
            </ScrollArea>
          </div>
        </div>
      )}

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
