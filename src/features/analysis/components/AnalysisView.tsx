'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chess } from '@/lib/chess';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { EditorProvider, EditorChessboard } from './SpareEditorBoard';
import { SparePiecePalette } from './SparePiecePalette';
import { AnalysisChessBoard } from './AnalysisChessBoard';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { UnifiedBoardWithPromotion } from '@/features/chess/components/board';
import { GameViewLayout } from '@/features/chess/components/layout';
import {
  SidebarPanel,
  SidebarHeader,
  MoveHistorySection,
  StandardActionBar
} from '@/features/chess/components/sidebar';
import { ImportDialog, ExportMenu } from '@/features/chess/components/dialogs';

import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { useNavigation } from '@/features/chess/hooks/useNavigation';
import { usePromotion } from '@/features/chess/hooks/usePromotion';
import { useEngineInit } from '@/features/chess/hooks/useEngineInit';

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

interface AnalysisViewProps {
  initialBoard3dEnabled?: boolean;
}

export function AnalysisView({
  initialBoard3dEnabled
}: AnalysisViewProps = {}) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [continueDialogOpen, setContinueDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(10);

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
    goToMove
  } = useAnalysisBoardActions();

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { setPosition, startAnalysis, endAnalysis } = useAnalysisActions();
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

  const navigation = useNavigation({
    viewingIndex,
    totalPositions: positionHistory.length,
    onIndexChange: goToMove,
    playbackEnabled: !isEditorMode
  });

  const promotion = usePromotion({
    fen: currentFEN,
    onMove: makeMove
  });

  useEngineInit();

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

  const handleToggleAnalysis = useCallback(() => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  }, [isAnalysisOn, startAnalysis, endAnalysis]);

  const handleToggleEditorMode = useCallback(() => {
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
  }, [
    isEditorMode,
    validatePosition,
    loadFEN,
    editorPosition,
    setEditorMode,
    setEditorPosition,
    currentFEN
  ]);

  const loadMoveList = useCallback(
    (input: string): boolean => {
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
    },
    [loadPGN]
  );

  const handleImport = useCallback(
    (input: string, type: 'pgn' | 'fen' | 'moves') => {
      if (type === 'fen') {
        if (isEditorMode) {
          try {
            new Chess(input);
            setEditorPosition(input);
            toast.success('FEN loaded to editor');
          } catch {
            toast.error('Invalid FEN string');
          }
        } else {
          const success = loadFEN(input);
          if (success) {
            toast.success('FEN loaded successfully');
          } else {
            toast.error('Invalid FEN string');
          }
        }
      } else if (type === 'pgn') {
        const success = loadPGN(input);
        if (success) {
          toast.success('PGN loaded successfully');
        } else {
          toast.error('Invalid PGN format');
        }
      } else {
        const success = loadMoveList(input);
        if (success) {
          toast.success('Moves loaded successfully');
        } else {
          toast.error('No valid moves found');
        }
      }
    },
    [isEditorMode, setEditorPosition, loadFEN, loadPGN, loadMoveList]
  );

  const handleContinueFromPosition = useCallback(
    (color: 'white' | 'black') => {
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
    },
    [
      isEditorMode,
      validatePosition,
      loadFEN,
      editorPosition,
      setEditorMode,
      startPlayingFromPosition,
      selectedLevel
    ]
  );

  const handleStopPlaying = useCallback(() => {
    stopPlayingFromPosition();
    toast.success('Stopped playing');
  }, [stopPlayingFromPosition]);

  const handleNewAnalysis = useCallback(() => {
    if (isEditorMode) {
      resetBoard();
      setEditorMode(false);
    }
    resetToStarting();
    if (playingAgainstStockfish) {
      stopPlayingFromPosition();
    }
  }, [
    isEditorMode,
    resetBoard,
    setEditorMode,
    resetToStarting,
    playingAgainstStockfish,
    stopPlayingFromPosition
  ]);

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare || sourceSquare === targetSquare) return false;
      const promotionTriggered = promotion.handleMoveWithPromotionCheck(
        sourceSquare,
        targetSquare
      );
      return promotionTriggered || !!makeMove(sourceSquare, targetSquare);
    },
    [promotion, makeMove]
  );

  const getFEN = useCallback(
    () => (isEditorMode ? editorPosition : currentFEN),
    [isEditorMode, editorPosition, currentFEN]
  );

  const getPGN = useCallback(() => {
    return moves
      .reduce((acc, move, index) => {
        if (index % 2 === 0) {
          return acc + `${Math.floor(index / 2) + 1}. ${move} `;
        }
        return acc + `${move} `;
      }, '')
      .trim();
  }, [moves]);

  const getMoves = useCallback(() => moves.join(' '), [moves]);

  const topPlayer = (
    <PlayerInfo
      name={boardOrientation === 'white' ? 'Black' : 'White'}
      isStockfish={false}
    />
  );

  const bottomPlayer = (
    <PlayerInfo
      name={boardOrientation === 'white' ? 'White' : 'Black'}
      isStockfish={false}
    />
  );

  const boardContent = isEditorMode ? (
    <EditorChessboard />
  ) : (
    <BoardContainer showEvaluation={true}>
      {playingAgainstStockfish ? (
        <AnalysisChessBoard />
      ) : (
        <UnifiedBoardWithPromotion
          position={currentFEN}
          boardOrientation={boardOrientation}
          initialBoard3dEnabled={initialBoard3dEnabled}
          canDrag={!promotion.pendingPromotion}
          onPieceDrop={handlePieceDrop}
          arrows={analysisArrows}
          pendingPromotion={promotion.pendingPromotion}
          onPromotionSelect={promotion.completePromotion}
          onPromotionCancel={promotion.cancelPromotion}
        />
      )}
    </BoardContainer>
  );

  const sidebar = (
    <>
      {isAnalysisOn && !isEditorMode && (
        <SidebarPanel>
          <AnalysisLines />
        </SidebarPanel>
      )}

      <SidebarPanel flexible>
        <SidebarHeader
          title={isEditorMode ? 'Board Editor' : 'Analysis'}
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
                <TooltipContent>Import PGN/FEN</TooltipContent>
              </Tooltip>
            </>
          }
        />

        {isEditorMode ? (
          <div className='flex-1 overflow-auto'>
            <SparePiecePalette orientation={boardOrientation} />
          </div>
        ) : (
          <MoveHistorySection
            moves={moves}
            viewingIndex={viewingIndex}
            totalPositions={positionHistory.length}
            navigation={navigation}
            emptyMessage='Make a move to start analysis'
          />
        )}

        <StandardActionBar
          onFlipBoard={toggleBoardOrientation}
          show3dToggle={!isEditorMode}
          showEngine={!isEditorMode}
          isEngineOn={isAnalysisOn}
          isEngineDisabled={!isInitialized}
          onToggleEngine={handleToggleAnalysis}
          rightActions={
            <>
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
            </>
          }
        />
      </SidebarPanel>
    </>
  );

  const dialogs = (
    <>
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

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
      />
    </>
  );

  const layout = (
    <GameViewLayout
      topPlayerInfo={topPlayer}
      bottomPlayerInfo={bottomPlayer}
      board={boardContent}
      showEvaluation={false}
      sidebar={sidebar}
    />
  );

  return (
    <>
      {isEditorMode ? (
        <EditorProvider boardOrientation={boardOrientation}>
          {layout}
        </EditorProvider>
      ) : (
        layout
      )}
      {dialogs}
    </>
  );
}
