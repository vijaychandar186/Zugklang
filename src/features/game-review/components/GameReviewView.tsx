'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

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
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { ReviewMoveHistory } from './ReviewMoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { ReviewEvaluationBar } from './ReviewEvaluationBar';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ARROW_COLORS } from '@/features/chess/config/colors';
import type { ChessArrow } from '@/features/chess/types/visualization';

import { EvaluationGraph } from './EvaluationGraph';
import { ReviewReport } from './ReviewReport';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';

import {
  useGameReviewState,
  useGameReviewActions,
  useCurrentPositionData
} from '@/features/game-review/stores/useGameReviewStore';
import {
  useAnalysisState,
  useAnalysisActions,
  useAnalysisConfig,
  useEngineAnalysis,
  useAnalysisPosition
} from '@/features/chess/stores/useAnalysisStore';
import {
  CLASSIFICATION_COLORS,
  CLASSIFICATION_ICONS
} from '@/features/game-review/types';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import Image from 'next/image';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function GameReviewView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pgnFenInput, setPgnFenInput] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shouldAutoReview, setShouldAutoReview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    pgn,
    depth,
    status,
    progress,
    errorMsg,
    report,
    liveEvaluations,
    currentMoveIndex,
    boardFlipped
  } = useGameReviewState();

  const {
    setPgn,
    setStatus,
    setProgress,
    setErrorMsg,
    setReport,
    setLivePositions,
    setLiveEvaluations,
    navigate,
    goToMove,
    toggleBoardFlip,
    resetReview
  } = useGameReviewActions();

  const { position, classification, currentFen } = useCurrentPositionData();

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup, startAnalysis, endAnalysis } =
    useAnalysisActions();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

  const theme = useBoardTheme();
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);

  const gameTurn = (currentFen?.split(' ')[1] || 'w') as 'w' | 'b';

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow,
    showThreatArrow,
    playerColor: gameTurn,
    gameTurn,
    analysisTurn
  });

  const storedPositionArrows = useMemo((): ChessArrow[] => {
    if (!report || isAnalysisOn) return [];
    if (!showBestMoveArrow && !showThreatArrow) return [];

    const currentPosition = report.positions[currentMoveIndex];
    if (!currentPosition?.topLines) return [];

    const arrows: ChessArrow[] = [];

    if (showBestMoveArrow) {
      currentPosition.topLines.slice(0, 2).forEach((line, index) => {
        if (!line.moveUCI || line.moveUCI.length < 4) return;
        const from = line.moveUCI.slice(0, 2);
        const to = line.moveUCI.slice(2, 4);
        arrows.push({
          startSquare: from,
          endSquare: to,
          color: index === 0 ? ARROW_COLORS.bestMove : ARROW_COLORS.alternative
        });
      });
    }

    if (showThreatArrow && currentMoveIndex > 0) {
      const prevPosition = report.positions[currentMoveIndex - 1];
      const threatLine = prevPosition?.topLines?.[0];
      if (threatLine?.moveUCI && threatLine.moveUCI.length >= 4) {
        const from = threatLine.moveUCI.slice(0, 2);
        const to = threatLine.moveUCI.slice(2, 4);
        if (!arrows.some((a) => a.startSquare === from && a.endSquare === to)) {
          arrows.push({
            startSquare: from,
            endSquare: to,
            color: ARROW_COLORS.threat
          });
        }
      }
    }

    return arrows;
  }, [
    report,
    currentMoveIndex,
    showBestMoveArrow,
    showThreatArrow,
    isAnalysisOn
  ]);

  const combinedArrows = useMemo(() => {
    if (isAnalysisOn && analysisArrows.length > 0) {
      return analysisArrows;
    }
    return storedPositionArrows;
  }, [isAnalysisOn, analysisArrows, storedPositionArrows]);

  const totalPositions = report?.positions.length || 1;
  const canGoBack = currentMoveIndex > 0;
  const canGoForward = currentMoveIndex < totalPositions - 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && report) {
      interval = setInterval(() => {
        if (currentMoveIndex < report.positions.length - 1) {
          navigate(1);
        } else {
          setIsPlaying(false);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentMoveIndex, report, navigate]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (position?.move?.uci && currentMoveIndex > 0) {
      const uci = position.move.uci;
      const fromSquare = uci.slice(0, 2);
      const toSquare = uci.slice(2, 4);
      const color = CLASSIFICATION_COLORS[classification || 'book'];

      styles[fromSquare] = {
        backgroundColor: `color-mix(in srgb, ${color}, transparent 30%)`
      };
      styles[toSquare] = {
        backgroundColor: `color-mix(in srgb, ${color}, transparent 30%)`
      };
    }
    return styles;
  }, [position, currentMoveIndex, classification]);

  const classificationIcon = useMemo(() => {
    const shouldShow =
      position?.move?.uci &&
      currentMoveIndex > 0 &&
      classification &&
      CLASSIFICATION_ICONS[classification];

    if (!shouldShow || !position?.move?.uci) {
      return { show: false, left: '0%', top: '0%', icon: null };
    }

    const toSquare = position.move.uci.slice(2, 4);
    const file = toSquare.charCodeAt(0) - 97;
    const rank = parseInt(toSquare[1]) - 1;

    const x = boardFlipped ? 7 - file : file;
    const y = boardFlipped ? rank : 7 - rank;

    const left = x * 12.5 + 9;
    const top = y * 12.5 - 1.5;

    return {
      show: true,
      left: `${left}%`,
      top: `${top}%`,
      icon: CLASSIFICATION_ICONS[classification]
    };
  }, [position, currentMoveIndex, classification, boardFlipped]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  useEffect(() => {
    if (!currentFen) return;
    const turn = currentFen.split(' ')[1] as 'w' | 'b';
    setPosition(currentFen, turn);
  }, [currentFen, setPosition]);

  const handleToggleAnalysis = useCallback(() => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  }, [isAnalysisOn, startAnalysis, endAnalysis]);

  const handleImport = useCallback(() => {
    const trimmed = pgnFenInput.trim();
    if (!trimmed) {
      toast.error('Please enter a PGN or FEN string');
      return;
    }
    setPgn(trimmed);
    setImportDialogOpen(false);
    setPgnFenInput('');
    setShouldAutoReview(true);
  }, [pgnFenInput, setPgn]);

  const handleReview = useCallback(async () => {
    if (!pgn.trim()) {
      toast.error('Import a game first');
      return;
    }

    resetReview();
    setStatus('parsing');
    setProgress(0);

    try {
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

      if (positions.length === 1) {
        setErrorMsg(
          'FEN positions have no moves to review. For position analysis, use the Analysis page instead.'
        );
        setStatus('error');
        return;
      }

      // Set live positions for incremental board updates during evaluation
      setLivePositions(positions);
      setProgress(10);

      setStatus('evaluating');

      const { evaluatePositions } = await import('@/lib/evaluation');
      positions = await evaluatePositions(
        positions,
        depth,
        (current, _total, percent, currentPositions) => {
          const evalProgress = 10 + Math.round(percent * 0.8);
          setProgress(evalProgress);

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

          goToMove(current);
        }
      );

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
  }, [
    pgn,
    depth,
    resetReview,
    setStatus,
    setProgress,
    setErrorMsg,
    setReport,
    setLivePositions,
    setLiveEvaluations,
    goToMove
  ]);

  useEffect(() => {
    if (shouldAutoReview && pgn.trim()) {
      setShouldAutoReview(false);
      handleReview();
    }
  }, [shouldAutoReview, pgn, handleReview]);

  const copyFEN = () => {
    navigator.clipboard.writeText(currentFen || STARTING_FEN);
    toast.success('FEN copied');
  };

  const copyPGN = () => {
    navigator.clipboard.writeText(pgn || '[No game loaded]');
    toast.success('PGN copied');
  };

  const copyMoves = () => {
    if (!report || !report.positions) {
      toast.error('No moves to copy');
      return;
    }
    const movesList = report.positions
      .slice(1)
      .map((pos) => pos.move?.san)
      .filter(Boolean)
      .join(' ');
    navigator.clipboard.writeText(movesList || 'No moves');
    toast.success('Moves copied');
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
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardFlipped ? 'White' : 'Black'}
            isStockfish={false}
          />
        </div>

        <div className='flex items-start justify-center gap-1 sm:gap-2'>
          <div
            className={`shrink-0 ${report || isAnalysisOn ? 'w-5 sm:w-7' : 'hidden w-0 sm:block sm:w-7'}`}
          >
            {(report || isAnalysisOn) && <ReviewEvaluationBar />}
          </div>

          <div
            className={`relative shrink-0 ${isAnalysisOn ? '[&>div]:!w-[calc(100vw-2rem)] sm:[&>div]:!w-[400px] lg:[&>div]:!w-[560px]' : ''}`}
          >
            {isMounted && board3dEnabled ? (
              <Board3D
                position={currentFen || STARTING_FEN}
                boardOrientation={boardFlipped ? 'black' : 'white'}
                canDrag={false}
                squareStyles={squareStyles}
                arrows={combinedArrows}
                animationDuration={ANIMATION_CONFIG.durationMs}
              />
            ) : (
              <Board
                position={currentFen || STARTING_FEN}
                boardOrientation={boardFlipped ? 'black' : 'white'}
                canDrag={false}
                darkSquareStyle={theme.darkSquareStyle}
                lightSquareStyle={theme.lightSquareStyle}
                squareStyles={squareStyles}
                arrows={combinedArrows}
                animationDuration={ANIMATION_CONFIG.durationMs}
              />
            )}
            {classificationIcon.icon && (
              <Image
                key={currentMoveIndex}
                src={classificationIcon.icon}
                alt={classification || ''}
                width={28}
                height={28}
                className='pointer-events-none absolute z-50'
                style={{
                  left: classificationIcon.left,
                  top: classificationIcon.top,
                  opacity: classificationIcon.show ? 1 : 0
                }}
              />
            )}
          </div>
        </div>

        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={boardFlipped ? 'Black' : 'White'}
            isStockfish={false}
          />
        </div>
      </div>

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        <AnalysisLines />

        {(report ||
          (status === 'evaluating' && liveEvaluations.length > 0)) && (
          <div className='bg-card shrink-0 rounded-lg border p-3'>
            <EvaluationGraph
              positions={
                report?.positions ||
                liveEvaluations.map((evaluation) => ({
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

        <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            <h3 className='font-semibold'>Game Review</h3>
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
                    <DialogTitle>Import Game</DialogTitle>
                    <DialogDescription>
                      Paste a PGN or move list to review.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <Textarea
                      placeholder='Paste PGN or moves here...'
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
                            '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Kg8 8. Bxd5+ Be6 9. Bxe6#'
                          )
                        }
                      >
                        Sample PGN
                      </Button>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() =>
                          setPgnFenInput('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Kg8 Bxd5+ Be6 Bxe6#')
                        }
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
          ) : isLoading ? (
            <div className='flex min-h-[180px] flex-1 flex-col items-center justify-center gap-4 p-4 text-center'>
              <Icons.circlestar className='text-muted-foreground h-12 w-12' />
              <div className='w-full max-w-xs space-y-2'>
                <Skeleton className='h-6 w-full rounded' />
                <Skeleton className='h-4 w-full rounded' />
              </div>
              <div className='w-full max-w-xs space-y-1'>
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
            </div>
          ) : (
            <div className='flex min-h-[180px] flex-1 flex-col items-center justify-center gap-4 p-4 text-center'>
              <Icons.circlestar className='text-muted-foreground h-12 w-12' />
              <div className='space-y-1'>
                <p className='font-medium'>No game loaded</p>
                <p className='text-muted-foreground text-sm'>
                  Import a PGN or paste moves to review
                </p>
              </div>
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
                  {isAnalysisOn ? 'Turn Off Analysis' : 'Turn On Analysis'}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className='flex items-center gap-1'>
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
