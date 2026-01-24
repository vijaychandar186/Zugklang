'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import Image from 'next/image';

import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { ReviewMoveHistory } from './ReviewMoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { ReviewEvaluationBar } from './ReviewEvaluationBar';
import { EvaluationGraph } from './EvaluationGraph';
import { ReviewReport } from './ReviewReport';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { UnifiedBoardWithPromotion } from '@/features/chess/components/board';
import { GameViewLayout } from '@/features/chess/components/layout';
import {
  SidebarPanel,
  SidebarHeader,
  StandardActionBar
} from '@/features/chess/components/sidebar';
import { ImportDialog, ExportMenu } from '@/features/chess/components/dialogs';

import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { useEngineInit } from '@/features/chess/hooks/useEngineInit';
import { ANIMATION_CONFIG } from '@/features/chess/config/animation';
import { ARROW_COLORS } from '@/features/chess/config/colors';
import type { ChessArrow } from '@/features/chess/types/visualization';

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

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

interface GameReviewViewProps {
  initialBoard3dEnabled?: boolean;
}

export function GameReviewView({
  initialBoard3dEnabled
}: GameReviewViewProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [shouldAutoReview, setShouldAutoReview] = useState(false);

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
  const { setPosition, startAnalysis, endAnalysis } = useAnalysisActions();
  const { uciLines } = useEngineAnalysis();
  const { showBestMoveArrow, showThreatArrow } = useAnalysisConfig();
  const { turn: analysisTurn } = useAnalysisPosition();

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

  useEngineInit();

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

  const handleImport = useCallback(
    (input: string) => {
      setPgn(input);
      setShouldAutoReview(true);
    },
    [setPgn]
  );

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

      if (!parseRes.ok) {
        const error = await parseRes.json();
        setErrorMsg(error.message || 'Failed to parse');
        setStatus('error');
        return;
      }

      const parseData = await parseRes.json();

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

      if (!reportRes.ok) {
        const error = await reportRes.json();
        setErrorMsg(error.message || 'Failed to generate report');
        setStatus('error');
        return;
      }

      const reportData = await reportRes.json();

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

  const getFEN = useCallback(() => currentFen || STARTING_FEN, [currentFen]);
  const getPGN = useCallback(() => pgn || '[No game loaded]', [pgn]);
  const getMoves = useCallback(() => {
    if (!report?.positions) return '';
    return report.positions
      .slice(1)
      .map((pos) => pos.move?.san)
      .filter(Boolean)
      .join(' ');
  }, [report]);

  const handleNewReview = useCallback(() => {
    resetReview();
    setPgn('');
    toast.success('Ready for new review');
  }, [resetReview, setPgn]);

  const isLoading =
    status === 'parsing' || status === 'evaluating' || status === 'reporting';

  const topPlayer = (
    <PlayerInfo name={boardFlipped ? 'White' : 'Black'} isStockfish={false} />
  );

  const bottomPlayer = (
    <PlayerInfo name={boardFlipped ? 'Black' : 'White'} isStockfish={false} />
  );

  const boardContent = (
    <div className='flex items-stretch justify-center gap-1 sm:gap-2'>
      <div
        className={`shrink-0 ${report || isAnalysisOn ? 'w-5 sm:w-7' : 'hidden w-0 sm:block sm:w-7'}`}
      >
        {(report || isAnalysisOn) && <ReviewEvaluationBar />}
      </div>

      <div className='relative shrink-0 [&>div]:!w-[calc(100vw-2rem)] sm:[&>div]:!w-[400px] lg:[&>div]:!w-[560px]'>
        <UnifiedBoardWithPromotion
          position={currentFen || STARTING_FEN}
          boardOrientation={boardFlipped ? 'black' : 'white'}
          initialBoard3dEnabled={initialBoard3dEnabled}
          canDrag={false}
          squareStyles={squareStyles}
          arrows={combinedArrows}
          animationDuration={ANIMATION_CONFIG.durationMs}
        />
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
  );

  const sidebar = (
    <>
      {isAnalysisOn && (
        <SidebarPanel>
          <AnalysisLines />
        </SidebarPanel>
      )}

      {(report || (status === 'evaluating' && liveEvaluations.length > 0)) && (
        <div className='shrink-0'>
          <EvaluationGraph
            positions={
              report?.positions ||
              liveEvaluations.map((evaluation) => ({
                fen: '',
                topLines: evaluation
                  ? [{ id: 1, depth: 0, evaluation: evaluation, moveUCI: '' }]
                  : []
              }))
            }
            currentMoveIndex={currentMoveIndex}
            onMoveClick={goToMove}
          />
        </div>
      )}

      <SidebarPanel flexible>
        <SidebarHeader
          title='Game Review'
          actions={
            <>
              <ExportMenu
                getFEN={getFEN}
                getPGN={getPGN}
                getMoves={getMoves}
                className='h-8 w-8'
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => setImportDialogOpen(true)}
                  >
                    <Icons.upload className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import PGN</TooltipContent>
              </Tooltip>
            </>
          }
        />

        {report ? (
          <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
            <div className='px-4 py-2'>
              <ReviewMoveHistory
                positions={report.positions}
                viewingIndex={currentMoveIndex}
                onMoveClick={goToMove}
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

        <StandardActionBar
          onFlipBoard={toggleBoardFlip}
          showEngine={true}
          isEngineOn={isAnalysisOn}
          isEngineDisabled={!isInitialized}
          onToggleEngine={handleToggleAnalysis}
          rightActions={
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={handleNewReview}>
                  <Icons.rematch className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Review</TooltipContent>
            </Tooltip>
          }
        />
      </SidebarPanel>
    </>
  );

  const secondarySidebar = report ? (
    <SidebarPanel flexible className='overflow-hidden'>
      <ScrollArea className='h-full'>
        <ReviewReport
          report={report}
          currentPosition={position}
          currentMoveIndex={currentMoveIndex}
        />
      </ScrollArea>
    </SidebarPanel>
  ) : null;

  return (
    <>
      <GameViewLayout
        topPlayerInfo={topPlayer}
        bottomPlayerInfo={bottomPlayer}
        board={boardContent}
        showEvaluation={false}
        sidebar={sidebar}
        secondarySidebar={secondarySidebar}
        className='lg:gap-4'
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
        title='Import Game'
        description='Paste a PGN or move list to review.'
        acceptFEN={false}
      />
    </>
  );
}
