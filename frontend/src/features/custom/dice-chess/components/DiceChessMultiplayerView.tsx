'use client';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import { Chess } from '@/lib/chess/chess';
import type { ChessJSMove } from '@/lib/chess/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';
import {
  useMultiplayerWS,
  loadSession
} from '@/features/multiplayer/hooks/useMultiplayerWS';
import { MatchmakingDialog } from '@/features/multiplayer/components/MatchmakingDialog';
import { useSession } from 'next-auth/react';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { CapturedPiecesDisplay } from '@/features/chess/components/CapturedPieces';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import {
  getCapturedPiecesFromFEN,
  getMaterialAdvantage
} from '@/features/chess/utils/fen-logic';
import {
  playSound,
  getSoundType,
  playRawSound
} from '@/features/game/utils/sounds';
import {
  useClipboard,
  formatMovesText,
  formatPGN
} from '@/features/chess/hooks/useClipboard';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { GameOverPanel } from '@/features/chess/components/sidebar/GameOverPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { DiceChess, WHITE_FACES, BLACK_FACES } from './DiceChess';
import type { DiceValue } from './DiceChess';
import {
  type DicePiece,
  type DiceResult,
  PIECE_NAMES
} from '../stores/useDiceChessStore';
import { DiceRollChart } from './DiceRollChart';
import type {
  ChallengeColor,
  MultiplayerStatus
} from '@/features/multiplayer/types';
import { ABANDON_TIMEOUT_MS } from '@/features/multiplayer/config';
import {
  DEFAULT_FLAG_CODE,
  normalizeFlagCode
} from '@/features/settings/flags';

const VARIANT = 'dice-chess';
const ALL_PIECES: DicePiece[] = ['k', 'q', 'b', 'n', 'r', 'p'];
const PIECE_TO_DICE_VALUE: Record<DicePiece, DiceValue> = {
  k: 1,
  q: 2,
  b: 3,
  n: 4,
  r: 5,
  p: 6
};

function rollRandomPiece(): DicePiece {
  return ALL_PIECES[Math.floor(Math.random() * ALL_PIECES.length)]!;
}

function checkPieceHasValidMoves(game: Chess, piece: DicePiece): boolean {
  const allMoves = game.moves({ verbose: true }) as { piece: string }[];
  return allMoves.some((m) => m.piece === piece);
}

function getHighlightsForDice(
  game: Chess,
  dice: DiceResult[]
): Record<string, React.CSSProperties> {
  const validPieces = new Set(
    dice.filter((d) => d.hasValidMoves).map((d) => d.piece)
  );
  const squares: Record<string, React.CSSProperties> = {};
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r]?.[c];
      if (
        p &&
        p.color === game.turn() &&
        validPieces.has(p.type as DicePiece)
      ) {
        squares[String.fromCharCode(97 + c) + (8 - r)] = {
          boxShadow: 'inset 0 0 0 3px rgba(59,130,246,0.5)',
          borderRadius: '4px'
        };
      }
    }
  }
  return squares;
}

function getGameResult(game: Chess): string | null {
  if (game.isCheckmate())
    return `${game.turn() === 'w' ? 'Black' : 'White'} wins by checkmate`;
  if (game.isStalemate()) return 'Draw by stalemate';
  if (game.isDraw()) return 'Draw';
  if (game.isInsufficientMaterial()) return 'Draw — insufficient material';
  return null;
}

function toResultReason(result: string | null): string {
  if (!result) return 'unknown';
  const lower = result.toLowerCase();
  if (lower.includes('abort')) return 'abort';
  if (lower.includes('checkmate')) return 'checkmate';
  if (lower.includes('resign')) return 'resign';
  if (lower.includes('time') || lower.includes('timeout')) return 'timeout';
  if (lower.includes('draw') && lower.includes('agreement'))
    return 'draw_agreement';
  if (lower.includes('stalemate')) return 'stalemate';
  if (lower.includes('insufficient')) return 'insufficient_material';
  return 'unknown';
}

function toResultCode(
  result: string | null,
  playAs: 'white' | 'black'
): '1-0' | '0-1' | '1/2-1/2' | '*' {
  if (!result) return '*';
  const lower = result.toLowerCase();
  if (lower.includes('white wins') || lower.startsWith('1-0')) return '1-0';
  if (lower.includes('black wins') || lower.startsWith('0-1')) return '0-1';
  if (lower.includes('you win')) return playAs === 'white' ? '1-0' : '0-1';
  if (lower.includes('you resigned')) return playAs === 'white' ? '0-1' : '1-0';
  if (
    lower.includes('opponent wins') ||
    lower.includes('opponent resigned') ||
    lower.includes('opponent abandoned')
  ) {
    return playAs === 'white' ? '1-0' : '0-1';
  }
  if (lower.includes('draw')) return '1/2-1/2';
  return '*';
}

function AbandonCountdown({ disconnectedAt }: { disconnectedAt: number }) {
  const [secsLeft, setSecsLeft] = useState(() =>
    Math.max(
      0,
      Math.ceil((ABANDON_TIMEOUT_MS - (Date.now() - disconnectedAt)) / 1000)
    )
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSecsLeft(
        Math.max(
          0,
          Math.ceil((ABANDON_TIMEOUT_MS - (Date.now() - disconnectedAt)) / 1000)
        )
      );
    }, 500);
    return () => clearInterval(id);
  }, [disconnectedAt]);
  return (
    <span className='animate-pulse text-xs text-yellow-500'>
      Reconnecting… Auto-abandon in {secsLeft}s
    </span>
  );
}

function SignalIndicator({
  wsStatus,
  latencyMs
}: {
  wsStatus: string;
  latencyMs: number | null;
}) {
  if (wsStatus === 'error' || wsStatus === 'idle' || latencyMs === null)
    return null;
  if (latencyMs <= 80)
    return <Icons.signal className='h-4 w-4 text-green-500' />;
  if (latencyMs <= 150)
    return <Icons.signalHigh className='h-4 w-4 text-green-400' />;
  if (latencyMs <= 300)
    return <Icons.signalMedium className='h-4 w-4 text-yellow-500' />;
  return <Icons.signalLow className='h-4 w-4 text-red-500' />;
}

// ---------------------------------------------------------------------------
// Dice panel (prop-driven, not store-driven)
// ---------------------------------------------------------------------------
interface DiceMultiplayerPanelProps {
  dice: DiceResult[] | null;
  isRolling: boolean;
  needsRoll: boolean;
  onRoll: () => void;
  turnColor: 'w' | 'b';
  isMyTurn: boolean;
  gameStarted: boolean;
  gameOver: boolean;
}

function DiceMultiplayerPanel({
  dice,
  isRolling,
  needsRoll,
  onRoll,
  turnColor,
  isMyTurn,
  gameStarted,
  gameOver
}: DiceMultiplayerPanelProps) {
  const faces = turnColor === 'w' ? WHITE_FACES : BLACK_FACES;
  const rolledValues: [DiceValue, DiceValue, DiceValue] = dice
    ? [
        PIECE_TO_DICE_VALUE[dice[0]!.piece],
        PIECE_TO_DICE_VALUE[dice[1]!.piece],
        PIECE_TO_DICE_VALUE[dice[2]!.piece]
      ]
    : [6, 6, 6];
  const DICE_SIZE = 70;

  if (!gameStarted || gameOver) return null;

  if (!isMyTurn && !dice && !isRolling) {
    return (
      <div className='border-b px-4 py-3'>
        <p className='text-muted-foreground text-center text-sm'>
          Waiting for opponent…
        </p>
      </div>
    );
  }

  return (
    <div className='border-b px-4 py-3'>
      <div className='flex flex-col items-center gap-3'>
        {(dice || isRolling) && (
          <div className='flex items-center justify-center gap-4'>
            {([0, 1, 2] as const).map((i) => {
              const hasDice = dice !== null;
              const hasValidMoves = hasDice && dice[i]!.hasValidMoves;
              return (
                <div key={i} className='flex flex-col items-center gap-1'>
                  <div
                    className={cn(
                      'relative rounded-xl border-2 p-1 transition-all duration-300',
                      hasDice &&
                        !isRolling &&
                        hasValidMoves &&
                        'border-primary/50 shadow-[0_0_8px_rgba(var(--primary-rgb,59,130,246),0.3)]',
                      hasDice &&
                        !isRolling &&
                        !hasValidMoves &&
                        'border-destructive/30',
                      (!hasDice || isRolling) && 'border-transparent'
                    )}
                    style={{
                      width: DICE_SIZE + 12,
                      height: DICE_SIZE + 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DiceChess
                      size={DICE_SIZE}
                      faces={faces}
                      defaultValue={rolledValues[i]}
                      targetValue={hasDice ? rolledValues[i] : undefined}
                      rolling={isRolling}
                      disabled={hasDice && !isRolling && !hasValidMoves}
                    />
                    {hasDice && !isRolling && !hasValidMoves && (
                      <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/25'>
                        <span className='text-destructive text-xl font-bold drop-shadow'>
                          ✗
                        </span>
                      </div>
                    )}
                  </div>
                  {hasDice && !isRolling && (
                    <span
                      className={cn(
                        'text-[10px] font-medium tracking-wider uppercase',
                        hasValidMoves
                          ? 'text-primary'
                          : 'text-muted-foreground line-through opacity-60'
                      )}
                    >
                      {PIECE_NAMES[dice[i]!.piece]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {needsRoll && !isRolling && (
          <>
            <p className='text-muted-foreground text-sm'>
              {turnColor === 'w' ? 'White' : 'Black'}&apos;s turn — Roll the
              dice!
            </p>
            {isMyTurn && (
              <button
                onClick={onRoll}
                className={cn(
                  'group flex items-center justify-center gap-3 rounded-xl px-8 py-3',
                  'bg-primary text-primary-foreground font-semibold',
                  'transition-all duration-200 hover:opacity-90 active:scale-95',
                  'shadow-lg hover:shadow-xl'
                )}
              >
                <Icons.dices className='h-5 w-5 transition-transform group-hover:rotate-12' />
                <span>Roll Dice</span>
              </button>
            )}
          </>
        )}

        {isRolling && <Skeleton className='h-5 w-24' />}

        {dice && !isRolling && !needsRoll && (
          <p className='text-muted-foreground text-center text-xs'>
            {dice.some((d) => d.hasValidMoves)
              ? isMyTurn
                ? 'Move any highlighted piece on the board'
                : 'Opponent is moving…'
              : 'No valid moves — re-rolling…'}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal sidebar
// ---------------------------------------------------------------------------
interface CustomMultiplayerSidebarProps {
  status: MultiplayerStatus;
  drawOffered: boolean;
  rematchOffered: boolean;
  rematchDeclined: boolean;
  moves: string[];
  viewingIndex: number;
  positionHistory: string[];
  gameOver: boolean;
  gameResult: string | null;
  gameStarted: boolean;
  movesCount: number;
  activePanel?: React.ReactNode;
  statsNode?: React.ReactNode;
  statsTitle?: string;
  onResign: () => void;
  onAbort: () => void;
  onOfferDraw: () => void;
  onAcceptDraw: () => void;
  onDeclineDraw: () => void;
  onOfferRematch: () => void;
  onAcceptRematch: () => void;
  onDeclineRematch: () => void;
  onFindNewGame: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;
  onGoToMove: (idx: number) => void;
}

function CustomMultiplayerSidebar({
  status,
  drawOffered,
  rematchOffered,
  rematchDeclined,
  moves,
  viewingIndex,
  positionHistory,
  gameOver,
  gameResult,
  gameStarted,
  movesCount,
  activePanel,
  statsNode,
  statsTitle,
  onResign,
  onAbort,
  onOfferDraw,
  onAcceptDraw,
  onDeclineDraw,
  onOfferRematch,
  onAcceptRematch,
  onDeclineRematch,
  onFindNewGame,
  onGoToStart,
  onGoToEnd,
  onGoToPrev,
  onGoToNext,
  onGoToMove
}: CustomMultiplayerSidebarProps) {
  const router = useRouter();
  const flipBoard = useChessStore((s) => s.flipBoard);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rematchSent, setRematchSent] = useState(false);
  const { copy, isCopied } = useClipboard();
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = movesCount < 4;
  const isPlaying = status === 'playing' || (gameStarted && !gameOver);
  useEffect(() => {
    if (rematchDeclined) setRematchSent(false);
  }, [rematchDeclined]);
  useEffect(() => {
    if (!gameOver) setRematchSent(false);
  }, [gameOver]);

  const handleCopyMoves = () => copy(formatMovesText(moves), 'moves');
  const handleCopyPGN = () =>
    copy(
      formatPGN(moves, {
        gameOver,
        gameResult,
        playAs: 'white',
        isLocalGame: false
      }),
      'pgn'
    );
  const handleCopyFEN = () => {
    const fen = positionHistory[viewingIndex] || positionHistory[0];
    copy(fen!, 'fen');
  };

  return (
    <>
      <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
          <div className='flex items-center gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => router.push('/')}
                >
                  <Icons.home className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Icons.share className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Game</DialogTitle>
                  <DialogDescription>
                    Copy moves or PGN to clipboard.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-3 pt-2'>
                  <Button
                    onClick={handleCopyFEN}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>
                        {isCopied('fen') ? 'Copied FEN' : 'Copy FEN'}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        Current position
                      </span>
                    </div>
                    {isCopied('fen') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                  <Button
                    onClick={handleCopyPGN}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>
                        {isCopied('pgn') ? 'Copied PGN' : 'Copy PGN'}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        Standard PGN format
                      </span>
                    </div>
                    {isCopied('pgn') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                  <Button
                    onClick={handleCopyMoves}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>
                        {isCopied('moves') ? 'Copied Moves' : 'Copy Moves'}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        Simple move list
                      </span>
                    </div>
                    {isCopied('moves') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {activePanel}

        {drawOffered && !gameOver && (
          <div className='shrink-0 space-y-2 border-b bg-blue-500/10 px-4 py-3'>
            <p className='text-center text-sm font-medium text-blue-600 dark:text-blue-400'>
              Opponent offers a draw
            </p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={onAcceptDraw}
              >
                Accept
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={onDeclineDraw}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <MoveHistory
              moves={moves}
              viewingIndex={viewingIndex}
              onMoveClick={onGoToMove}
              showDepthTooltips={false}
            />
          </div>
        </ScrollArea>

        <NavigationControls
          viewingIndex={viewingIndex}
          totalPositions={positionHistory.length}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          isPlaying={false}
          onTogglePlay={() => {}}
          onGoToStart={onGoToStart}
          onGoToEnd={onGoToEnd}
          onGoToPrev={onGoToPrev}
          onGoToNext={onGoToNext}
        />

        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {(gameOver || !gameStarted) && (
            <GameOverPanel
              gameResult={gameResult || 'No active game'}
              onNewGame={onFindNewGame}
              statsNode={gameOver ? statsNode : undefined}
              statsTitle={statsTitle}
            />
          )}

          {gameOver && rematchOffered && (
            <div className='space-y-2 rounded-md border bg-purple-500/10 px-3 py-2'>
              <p className='text-center text-sm font-medium text-purple-600 dark:text-purple-400'>
                Opponent wants a rematch
              </p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  className='flex-1 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
                  onClick={onAcceptRematch}
                >
                  Accept
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={onDeclineRematch}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}

          {gameOver &&
            !rematchOffered &&
            !rematchDeclined &&
            status !== 'matched' &&
            status !== 'rejoined' && (
              <Button
                size='sm'
                variant={rematchSent ? 'default' : 'outline'}
                className='w-full'
                disabled={rematchSent}
                onClick={() => {
                  setRematchSent(true);
                  onOfferRematch();
                }}
              >
                {rematchSent ? 'Rematch Sent ✓' : 'Rematch'}
              </Button>
            )}

          {gameOver && rematchDeclined && (
            <p className='text-muted-foreground text-center text-xs'>
              Opponent declined the rematch
            </p>
          )}

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
                <Button variant='ghost' size='icon' onClick={flipBoard}>
                  <Icons.flipBoard className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flip Board</TooltipContent>
            </Tooltip>

            <div className='ml-auto flex items-center gap-1'>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                        disabled={gameOver || !gameStarted || !isPlaying}
                      >
                        <Icons.handshake className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Offer Draw</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                    <AlertDialogDescription>
                      Send a draw offer to your opponent?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onOfferDraw}
                      className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                    >
                      Offer Draw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                        disabled={gameOver || !gameStarted}
                      >
                        {canAbort ? (
                          <Icons.abort className='h-4 w-4' />
                        ) : (
                          <Icons.flag className='h-4 w-4' />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    {canAbort ? 'Abort Game' : 'Resign Game'}
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {canAbort ? 'Abort Game?' : 'Resign Game?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {canAbort
                        ? 'Are you sure you want to abort?'
                        : 'Are you sure you want to resign? Your opponent wins.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={canAbort ? onAbort : onResign}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      {canAbort ? 'Abort' : 'Resign'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------
interface DiceChessMultiplayerViewProps {
  challengeId?: string;
}

export function DiceChessMultiplayerView({
  challengeId
}: DiceChessMultiplayerViewProps) {
  const ws = useMultiplayerWS();
  const { data: session } = useSession();
  const [myRating, setMyRating] = useState<number | null>(null);
  const [opponentRating, setOpponentRating] = useState<number | null>(null);
  const [myRatingDelta, setMyRatingDelta] = useState<number | null>(null);
  const [opponentRatingDelta, setOpponentRatingDelta] = useState<number | null>(
    null
  );
  const [myFlagCode, setMyFlagCode] = useState(DEFAULT_FLAG_CODE);
  const [opponentFlagCode, setOpponentFlagCode] = useState(DEFAULT_FLAG_CODE);

  // Chess state (self-managed, not via useChessStore)
  const chessRef = useRef(new Chess());
  const positionHistoryRef = useRef<string[]>([STARTING_FEN]);
  const [currentFEN, setCurrentFEN] = useState(STARTING_FEN);
  const [moves, setMoves] = useState<string[]>([]);
  const [positionHistory, setPositionHistory] = useState<string[]>([
    STARTING_FEN
  ]);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [loserColor, setLoserColor] = useState<'w' | 'b' | null>(null);

  // Dice state
  const [dice, setDice] = useState<DiceResult[] | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [needsRoll, setNeedsRoll] = useState(true);
  const [diceRollHistory, setDiceRollHistory] = useState<DicePiece[]>([]);
  const [highlightedSquares, setHighlightedSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  // Clock state (driven by server clock_sync)
  const [whiteTimeSecs, setWhiteTimeSecs] = useState<number | null>(null);
  const [blackTimeSecs, setBlackTimeSecs] = useState<number | null>(null);
  const [activeClock, setActiveClock] = useState<'white' | 'black' | null>(
    null
  );

  // Matchmaking state
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [sessionRestorePending, setSessionRestorePending] = useState(true);
  const [activeChallengeId, setActiveChallengeId] = useState(challengeId);
  const savedRoomIdRef = useRef<string | null>(null);

  const opponentUserId = useMemo(() => {
    const me = session?.user?.id ?? null;
    if (me) {
      if (ws.whiteUserId === me) return ws.blackUserId;
      if (ws.blackUserId === me) return ws.whiteUserId;
    }
    if (!ws.myColor) return null;
    return ws.myColor === 'white' ? ws.blackUserId : ws.whiteUserId;
  }, [session?.user?.id, ws.myColor, ws.whiteUserId, ws.blackUserId]);

  const ratingCategory = useMemo(() => {
    const tc = ws.timeControl;
    if (!tc) return null;
    if (tc.mode === 'unlimited') return 'classical' as const;
    if (tc.mode !== 'timed') return null;
    return getTimeCategory(tc.minutes, tc.increment);
  }, [ws.timeControl]);

  useEffect(() => {
    if (!session?.user?.id) {
      setMyRating(null);
      return;
    }
    const params = new URLSearchParams({ variant: VARIANT });
    if (ratingCategory) {
      params.set('category', ratingCategory);
    }
    fetch(`/api/user/rating?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { rating: number | null } | null) =>
        setMyRating(data?.rating ?? 700)
      )
      .catch(() => setMyRating(700));
  }, [session?.user?.id, ratingCategory]);

  useEffect(() => {
    if (!session?.user?.id) {
      setMyFlagCode(DEFAULT_FLAG_CODE);
      return;
    }
    fetch('/api/user/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { flagCode?: string | null } | null) =>
        setMyFlagCode(normalizeFlagCode(data?.flagCode))
      )
      .catch(() => setMyFlagCode(DEFAULT_FLAG_CODE));
  }, [session?.user?.id]);

  useEffect(() => {
    if (!opponentUserId) {
      setOpponentRating(null);
      setOpponentFlagCode(DEFAULT_FLAG_CODE);
      return;
    }
    setOpponentRating(null);
    const params = new URLSearchParams({ variant: VARIANT });
    if (ratingCategory) {
      params.set('category', ratingCategory);
    }
    fetch(`/api/users/${opponentUserId}?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: { rating?: number | null; flagCode?: string | null } | null) => {
          setOpponentRating(data?.rating ?? 700);
          setOpponentFlagCode(normalizeFlagCode(data?.flagCode));
        }
      )
      .catch(() => setOpponentFlagCode(DEFAULT_FLAG_CODE));
  }, [opponentUserId, ratingCategory]);

  // Board settings from global store
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const setBoardFlipped = useChessStore((s) => s.setBoardFlipped);
  const theme = useBoardTheme();

  const myColor = ws.myColor;
  const serverOrientation = myColor === 'black' ? 'black' : 'white';
  const boardOrientation = boardFlipped
    ? serverOrientation === 'white'
      ? 'black'
      : 'white'
    : serverOrientation;
  const isMyTurn =
    gameStarted &&
    !gameOver &&
    myColor !== null &&
    ((myColor === 'white' && turn === 'w') ||
      (myColor === 'black' && turn === 'b'));

  const capturedPieces = useMemo(
    () => getCapturedPiecesFromFEN(currentFEN),
    [currentFEN]
  );
  const materialAdvantage = useMemo(
    () => getMaterialAdvantage(capturedPieces),
    [capturedPieces]
  );

  // Orientation helpers
  const topColor = boardOrientation === 'white' ? 'black' : 'white';
  const bottomColor = boardOrientation === 'white' ? 'white' : 'black';

  // Stable ref so doRoll (with [] deps) can call the latest sendDiceSync
  const sendDiceSyncRef = useRef(ws.sendDiceSync);
  sendDiceSyncRef.current = ws.sendDiceSync;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // ---------------------------------------------------------------------------
  // Dice roll logic (reads from chessRef so always current)
  // ---------------------------------------------------------------------------
  const doRoll = useCallback(() => {
    const chess = chessRef.current;
    setIsRolling(true);
    setTimeout(() => {
      const rolled: DiceResult[] = [];
      for (let i = 0; i < 3; i++) {
        const piece = rollRandomPiece();
        const hasValidMoves = checkPieceHasValidMoves(chess, piece);
        rolled.push({ piece, hasValidMoves });
      }
      setDice(rolled);
      setIsRolling(false);
      setNeedsRoll(false);
      setDiceRollHistory((prev) => [...prev, ...rolled.map((d) => d.piece)]);
      setHighlightedSquares(getHighlightsForDice(chess, rolled));
      sendDiceSyncRef.current([
        rolled[0]!.piece,
        rolled[1]!.piece,
        rolled[2]!.piece
      ]);
      if (soundEnabledRef.current) playRawSound('/custom/sounds/dice.mp3');
      if (!rolled.some((d) => d.hasValidMoves)) {
        setTimeout(doRoll, 1200);
      }
    }, 800);
  }, []); // chessRef and sendDiceSyncRef are stable

  const rollDice = useCallback(() => {
    if (!isMyTurn || isRolling || !needsRoll) return;
    doRoll();
  }, [isMyTurn, isRolling, needsRoll, doRoll]);

  // ---------------------------------------------------------------------------
  // Apply a move to local state (shared by my move + opponent move)
  // ---------------------------------------------------------------------------
  const applyMove = useCallback(
    (moveObj: ChessJSMove, isOpponent: boolean) => {
      const chess = chessRef.current;
      const newFEN = chess.fen();
      const newTurn = chess.turn();
      const isOver = chess.isGameOver();
      const result = isOver ? getGameResult(chess) : null;

      const newHistory = [...positionHistoryRef.current, newFEN];
      positionHistoryRef.current = newHistory;

      setCurrentFEN(newFEN);
      setTurn(newTurn);
      setMoves((prev) => [...prev, moveObj.san]);
      setPositionHistory(newHistory);
      setViewingIndex(newHistory.length - 1);
      setDice(null);
      setNeedsRoll(!isOver);
      setHighlightedSquares({});

      if (soundEnabled) {
        const isCapture = moveObj.captured !== undefined;
        const isCheck = chess.isCheck();
        const isCastle = moveObj.san === 'O-O' || moveObj.san === 'O-O-O';
        const isPromotion = moveObj.promotion !== undefined;
        playSound(
          getSoundType(isCapture, isCheck, isCastle, isPromotion, !isOpponent)
        );
      }

      if (isOver) {
        setGameOver(true);
        setGameResult(result);
        setLoserColor(chess.isCheckmate() ? chess.turn() : null);
        if (!isOpponent) {
          const reason = chess.isCheckmate() ? 'checkmate' : 'draw';
          ws.notifyGameOver(result ?? 'Game over', reason);
        }
      }
    },
    [soundEnabled, ws]
  );

  // ---------------------------------------------------------------------------
  // Handle board piece drop (my move)
  // ---------------------------------------------------------------------------
  function handlePieceDrop({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare) return false;
    if (!isMyTurn || needsRoll || isRolling || gameOver) {
      if (soundEnabled) playSound('illegal');
      return false;
    }

    const chess = chessRef.current;
    const piece = chess.get(sourceSquare);
    if (!piece) return false;

    // Dice constraint
    if (dice) {
      const allowed = dice.some(
        (d) => d.piece === piece.type && d.hasValidMoves
      );
      if (!allowed) {
        if (soundEnabled) playSound('illegal');
        return false;
      }
    }

    let moveObj = chess.move({
      from: sourceSquare,
      to: targetSquare
    }) as ChessJSMove | null;
    if (!moveObj) {
      moveObj = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      }) as ChessJSMove | null;
    }
    if (!moveObj) {
      if (soundEnabled) playSound('illegal');
      return false;
    }

    applyMove(moveObj, false);
    ws.sendMove(sourceSquare, targetSquare, moveObj.promotion);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Opponent move (from server)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    ws.setOnOpponentMove((from, to, promotion) => {
      const chess = chessRef.current;
      const moveObj = chess.move({
        from,
        to,
        promotion
      }) as ChessJSMove | null;
      if (moveObj) applyMove(moveObj, true);
    });
    return () => ws.setOnOpponentMove(null);
  }, [ws.setOnOpponentMove, applyMove]);

  // ---------------------------------------------------------------------------
  // Server game over (resign, abort, timeout, opponent abandoned)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    ws.setOnServerGameOver((result) => {
      setGameOver(true);
      setGameResult(result);
    });
    return () => ws.setOnServerGameOver(null);
  }, [ws.setOnServerGameOver]);

  useEffect(() => {
    const roomId = ws.roomId;
    const myColor = ws.myColor ?? 'white';
    if (!roomId || savedRoomIdRef.current === roomId) return;
    if (!session?.user?.id || !gameOver || !gameResult) return;

    savedRoomIdRef.current = roomId;
    const resultCode = toResultCode(gameResult, myColor);
    const resultReason = toResultReason(gameResult);
    const opponentUserId =
      myColor === 'white' ? ws.blackUserId : ws.whiteUserId;

    const payload = {
      roomId,
      moves,
      variant: VARIANT,
      gameType: 'multiplayer',
      result: resultCode,
      resultReason,
      myColor,
      opponentUserId,
      timeControl: ws.timeControl ?? {
        mode: 'unlimited',
        minutes: 0,
        increment: 0
      },
      startingFen: positionHistory[0] ?? STARTING_FEN
    };

    fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            whiteRatingDelta?: number | null;
            blackRatingDelta?: number | null;
          } | null
        ) => {
          if (!data) return;
          const myDelta =
            myColor === 'white' ? data.whiteRatingDelta : data.blackRatingDelta;
          const theirDelta =
            myColor === 'white' ? data.blackRatingDelta : data.whiteRatingDelta;
          if (myDelta != null) setMyRatingDelta(myDelta);
          if (theirDelta != null) setOpponentRatingDelta(theirDelta);

          if (myDelta == null) {
            setTimeout(() => {
              fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              })
                .then((r) => (r.ok ? r.json() : null))
                .then(
                  (
                    retryData: {
                      whiteRatingDelta?: number | null;
                      blackRatingDelta?: number | null;
                    } | null
                  ) => {
                    if (!retryData) return;
                    const retryMyDelta =
                      myColor === 'white'
                        ? retryData.whiteRatingDelta
                        : retryData.blackRatingDelta;
                    const retryTheirDelta =
                      myColor === 'white'
                        ? retryData.blackRatingDelta
                        : retryData.whiteRatingDelta;
                    if (retryMyDelta != null) setMyRatingDelta(retryMyDelta);
                    if (retryTheirDelta != null)
                      setOpponentRatingDelta(retryTheirDelta);
                  }
                )
                .catch(() => {});
            }, 700);
          }
        }
      )
      .catch((err) => {
        console.error('Failed to save dice multiplayer game:', err);
      });
  }, [
    ws.roomId,
    ws.myColor,
    ws.whiteUserId,
    ws.blackUserId,
    ws.timeControl,
    session?.user?.id,
    gameOver,
    gameResult,
    moves,
    positionHistory
  ]);

  // ---------------------------------------------------------------------------
  // Clock sync
  // ---------------------------------------------------------------------------
  useEffect(() => {
    ws.setOnClockSync((wMs, bMs, active) => {
      const toSecs = (ms: number | null) =>
        ms === null ? null : Math.max(0, Math.ceil(ms / 1000));
      setWhiteTimeSecs(toSecs(wMs));
      setBlackTimeSecs(toSecs(bMs));
      setActiveClock(active);
    });
    return () => ws.setOnClockSync(null);
  }, [ws.setOnClockSync]);

  // ---------------------------------------------------------------------------
  // Opponent dice sync (show their roll result on our board too)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    ws.setOnSyncDice((pieces) => {
      const chess = chessRef.current;
      const synced: DiceResult[] = pieces.map((p) => ({
        piece: p as DicePiece,
        hasValidMoves: checkPieceHasValidMoves(chess, p as DicePiece)
      }));
      setDice(synced);
      setNeedsRoll(false);
      setIsRolling(false);
      setHighlightedSquares(getHighlightsForDice(chess, synced));
      if (soundEnabledRef.current) playRawSound('/custom/sounds/dice.mp3');
    });
    return () => ws.setOnSyncDice(null);
  }, [ws.setOnSyncDice]);

  // Local clock countdown between server syncs
  useEffect(() => {
    if (!activeClock || gameOver) return;
    const id = setInterval(() => {
      if (activeClock === 'white') {
        setWhiteTimeSecs((prev) =>
          prev !== null ? Math.max(0, prev - 1) : null
        );
      } else {
        setBlackTimeSecs((prev) =>
          prev !== null ? Math.max(0, prev - 1) : null
        );
      }
    }, 1000);
    return () => clearInterval(id);
  }, [activeClock, gameOver]);

  // ---------------------------------------------------------------------------
  // Start game helper
  // ---------------------------------------------------------------------------
  const startGameFromFresh = useCallback(
    (replayMoves?: string[]) => {
      const chess = new Chess();
      const history: string[] = [STARTING_FEN];
      const sanMoves: string[] = [];

      if (replayMoves) {
        for (const uci of replayMoves) {
          const from = uci.slice(0, 2);
          const to = uci.slice(2, 4);
          const promotion = uci[4] || undefined;
          const mo = chess.move({ from, to, promotion }) as ChessJSMove | null;
          if (mo) {
            sanMoves.push(mo.san);
            history.push(chess.fen());
          }
        }
      }

      chessRef.current = chess;
      positionHistoryRef.current = history;
      const fen = chess.fen();
      const isOver = chess.isGameOver();

      setCurrentFEN(fen);
      setTurn(chess.turn());
      setMoves(sanMoves);
      setPositionHistory(history);
      setViewingIndex(history.length - 1);
      setGameStarted(true);
      setGameOver(isOver);
      setGameResult(isOver ? getGameResult(chess) : null);
      setDice(null);
      setNeedsRoll(!isOver);
      setDiceRollHistory([]);
      setLoserColor(null);
      setHighlightedSquares({});
      setBoardFlipped(false);
    },
    [setBoardFlipped]
  );

  // ---------------------------------------------------------------------------
  // React to WebSocket status changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (ws.status === 'matched' && ws.myColor) {
      const t = setTimeout(() => {
        startGameFromFresh();
        ws.setPlaying();
        setMatchmakingOpen(false);
        setActiveChallengeId(undefined);
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('challenge');
          window.history.replaceState({}, '', url.toString());
        }
      }, 800);
      return () => clearTimeout(t);
    }
  }, [ws.status, ws.myColor, startGameFromFresh]);

  useEffect(() => {
    if (ws.status === 'rejoined' && ws.myColor) {
      const movesToReplay = ws.movesToReplay ?? [];
      startGameFromFresh(movesToReplay);
      if (movesToReplay.length > 0) ws.clearMovesToReplay();
      ws.setPlaying();
      setMatchmakingOpen(false);
    }
  }, [ws.status, ws.myColor]);

  // ---------------------------------------------------------------------------
  // Session restore on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = loadSession();
    if (saved && saved.variant === VARIANT) {
      setMatchmakingOpen(false);
      ws.rejoin(saved.roomId, saved.rejoinToken);
      return;
    }
    setSessionRestorePending(false);
    if (!ws.isSecondaryTab) setMatchmakingOpen(true);
    if (challengeId) {
      ws.joinChallenge(
        challengeId,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionRestorePending) return;
    if (
      ws.status === 'rejoined' ||
      ws.status === 'matched' ||
      ws.status === 'playing' ||
      ws.status === 'error' ||
      (ws.status === 'idle' && loadSession() === null)
    ) {
      setSessionRestorePending(false);
    }
  }, [sessionRestorePending, ws.status]);

  useEffect(() => {
    if (sessionRestorePending) return;
    if (
      ws.status === 'idle' &&
      !matchmakingOpen &&
      loadSession() === null &&
      !ws.isSecondaryTab
    ) {
      setMatchmakingOpen(true);
    }
  }, [sessionRestorePending, ws.status, ws.isSecondaryTab, matchmakingOpen]);

  // Pre-connect when dialog opens
  useEffect(() => {
    if (matchmakingOpen && !ws.isSecondaryTab) {
      ws.preConnect();
    }
  }, [matchmakingOpen, ws.isSecondaryTab]);

  // ---------------------------------------------------------------------------
  // Handlers passed to MatchmakingDialog
  // ---------------------------------------------------------------------------
  const handleFindGame = useCallback(
    async (timeControl: Parameters<typeof ws.joinQueue>[1]) => {
      let rating = 700;
      try {
        const category =
          timeControl.mode === 'unlimited'
            ? 'classical'
            : timeControl.mode === 'timed'
              ? getTimeCategory(timeControl.minutes, timeControl.increment)
              : 'classical';
        const res = await fetch(
          `/api/user/rating?variant=${encodeURIComponent(VARIANT)}&category=${encodeURIComponent(category)}`
        );
        if (res.ok) {
          const data = (await res.json()) as { rating: number };
          rating = data.rating;
        }
      } catch {}
      ws.joinQueue(
        VARIANT,
        timeControl,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined,
        rating
      );
    },
    [ws.joinQueue, session]
  );

  const handleCreateChallenge = useCallback(
    (
      timeControl: Parameters<typeof ws.createChallenge>[1],
      color: ChallengeColor
    ) => {
      ws.createChallenge(
        VARIANT,
        timeControl,
        color,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    },
    [ws.createChallenge, session]
  );

  const handleFindNewGame = useCallback(() => {
    ws.disconnect();
    setGameStarted(false);
    setGameOver(false);
    setGameResult(null);
    setMoves([]);
    const chess = new Chess();
    chessRef.current = chess;
    positionHistoryRef.current = [STARTING_FEN];
    setCurrentFEN(STARTING_FEN);
    setPositionHistory([STARTING_FEN]);
    setViewingIndex(0);
    setTurn('w');
    setDice(null);
    setNeedsRoll(true);
    setDiceRollHistory([]);
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setLoserColor(null);
    setHighlightedSquares({});
    setMatchmakingOpen(true);
  }, [ws.disconnect]);

  // ---------------------------------------------------------------------------
  // Resign / abort
  // ---------------------------------------------------------------------------
  const handleResign = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('You resigned');
    setGameOver(true);
    ws.resign();
  }, [soundEnabled, ws.resign]);

  const handleAbort = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Game Aborted');
    setGameOver(true);
    ws.abort();
  }, [soundEnabled, ws.abort]);
  const handleOfferDraw = useCallback(() => {
    ws.offerDraw();
  }, [ws.offerDraw]);
  const handleAcceptDraw = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Draw by agreement');
    setGameOver(true);
    ws.acceptDraw();
  }, [soundEnabled, ws.acceptDraw]);
  const handleDeclineDraw = useCallback(() => {
    ws.declineDraw();
  }, [ws.declineDraw]);

  // ---------------------------------------------------------------------------
  // Navigation (position history)
  // ---------------------------------------------------------------------------
  const goToStart = useCallback(() => {
    setViewingIndex(0);
    setCurrentFEN(positionHistoryRef.current[0]!);
  }, []);
  const goToEnd = useCallback(() => {
    const last = positionHistoryRef.current.length - 1;
    setViewingIndex(last);
    setCurrentFEN(positionHistoryRef.current[last]!);
  }, []);
  const goToPrev = useCallback(() => {
    setViewingIndex((prev) => {
      if (prev <= 0) return prev;
      const next = prev - 1;
      setCurrentFEN(positionHistoryRef.current[next]!);
      return next;
    });
  }, []);
  const goToNext = useCallback(() => {
    setViewingIndex((prev) => {
      const last = positionHistoryRef.current.length - 1;
      if (prev >= last) return prev;
      const next = prev + 1;
      setCurrentFEN(positionHistoryRef.current[next]!);
      return next;
    });
  }, []);
  const goToMove = useCallback((idx: number) => {
    const posIdx = Math.min(idx + 1, positionHistoryRef.current.length - 1);
    setViewingIndex(posIdx);
    setCurrentFEN(positionHistoryRef.current[posIdx]!);
  }, []);

  const showIndicator = gameStarted && !gameOver;
  const hasTimer = whiteTimeSecs !== null || blackTimeSecs !== null;
  const topTime = topColor === 'white' ? whiteTimeSecs : blackTimeSecs;
  const bottomTime = bottomColor === 'white' ? whiteTimeSecs : blackTimeSecs;
  const topTimerActive = activeClock === topColor && !gameOver;
  const bottomTimerActive = activeClock === bottomColor && !gameOver;
  const isMe = (color: 'white' | 'black') => color === (ws.myColor ?? 'white');
  const getPlayerName = (color: 'white' | 'black') => {
    if (isMe(color)) return session?.user?.name ?? 'You';
    return ws.opponentName ?? 'Opponent';
  };
  const getPlayerImage = (color: 'white' | 'black') => {
    if (isMe(color)) return session?.user?.image ?? null;
    return ws.opponentImage ?? null;
  };
  const getPlayerRating = (color: 'white' | 'black') => {
    if (isMe(color)) return myRating;
    return opponentRating;
  };
  const getPlayerRatingDelta = (color: 'white' | 'black') => {
    if (isMe(color)) return myRatingDelta;
    return opponentRatingDelta;
  };
  const getPlayerFlagCode = (color: 'white' | 'black') => {
    if (isMe(color)) return myFlagCode;
    return opponentFlagCode;
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        {/* Board column */}
        <div className='flex flex-col items-center gap-2'>
          {/* Top player (opponent) */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
              <PlayerInfo
                name={getPlayerName(topColor)}
                image={getPlayerImage(topColor)}
                rating={getPlayerRating(topColor)}
                ratingDelta={getPlayerRatingDelta(topColor)}
                flagCode={getPlayerFlagCode(topColor)}
              />
              {showIndicator &&
                (topColor !== (ws.myColor ?? 'white') &&
                ws.opponentDisconnected ? (
                  <AbandonCountdown
                    disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
                  />
                ) : (
                  <SignalIndicator
                    wsStatus={ws.status}
                    latencyMs={
                      topColor !== (ws.myColor ?? 'white')
                        ? ws.opponentLatencyMs
                        : ws.latencyMs
                    }
                  />
                ))}
            </div>
            <div className='flex items-center gap-2'>
              <CapturedPiecesDisplay
                pieces={
                  topColor === 'white'
                    ? capturedPieces.black
                    : capturedPieces.white
                }
                pieceColor={topColor}
                advantage={
                  topColor === 'white'
                    ? materialAdvantage > 0
                      ? materialAdvantage
                      : undefined
                    : materialAdvantage < 0
                      ? Math.abs(materialAdvantage)
                      : undefined
                }
              />
              {hasTimer && topTime !== null && (
                <span
                  className={cn(
                    'font-mono text-sm tabular-nums',
                    topTimerActive && topTime <= 10
                      ? 'text-destructive font-bold'
                      : 'text-muted-foreground'
                  )}
                >
                  {String(Math.floor(topTime / 60)).padStart(2, '0')}:
                  {String(topTime % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          </div>

          <BoardContainer>
            {board3dEnabled ? (
              <Board3D
                position={currentFEN}
                onPieceDrop={handlePieceDrop}
                boardOrientation={boardOrientation}
                canDrag={isMyTurn && !needsRoll && !isRolling}
                squareStyles={highlightedSquares}
                loserColor={loserColor}
              />
            ) : (
              <Board
                position={currentFEN}
                onPieceDrop={handlePieceDrop}
                boardOrientation={boardOrientation}
                darkSquareStyle={theme.darkSquareStyle}
                lightSquareStyle={theme.lightSquareStyle}
                canDrag={isMyTurn && !needsRoll && !isRolling}
                animationDuration={200}
                squareStyles={highlightedSquares}
                loserColor={loserColor}
              />
            )}
          </BoardContainer>

          {/* Bottom player (me) */}
          <div className='flex w-full items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
              <PlayerInfo
                name={getPlayerName(bottomColor)}
                image={getPlayerImage(bottomColor)}
                rating={getPlayerRating(bottomColor)}
                ratingDelta={getPlayerRatingDelta(bottomColor)}
                flagCode={getPlayerFlagCode(bottomColor)}
              />
              {showIndicator && (
                <SignalIndicator
                  wsStatus={ws.status}
                  latencyMs={
                    bottomColor !== (ws.myColor ?? 'white')
                      ? ws.opponentLatencyMs
                      : ws.latencyMs
                  }
                />
              )}
            </div>
            <div className='flex items-center gap-2'>
              <CapturedPiecesDisplay
                pieces={
                  bottomColor === 'white'
                    ? capturedPieces.black
                    : capturedPieces.white
                }
                pieceColor={bottomColor}
                advantage={
                  bottomColor === 'white'
                    ? materialAdvantage > 0
                      ? materialAdvantage
                      : undefined
                    : materialAdvantage < 0
                      ? Math.abs(materialAdvantage)
                      : undefined
                }
              />
              {hasTimer && bottomTime !== null && (
                <span
                  className={cn(
                    'font-mono text-sm tabular-nums',
                    bottomTimerActive && bottomTime <= 10
                      ? 'text-destructive font-bold'
                      : 'text-muted-foreground'
                  )}
                >
                  {String(Math.floor(bottomTime / 60)).padStart(2, '0')}:
                  {String(bottomTime % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[min(70vw,calc(100dvh-180px),820px)] lg:w-[clamp(20rem,22vw,30rem)] lg:overflow-hidden xl:h-[min(68vw,calc(100dvh-180px),920px)] 2xl:h-[min(66vw,calc(100dvh-180px),1020px)]'>
          <div className='lg:min-h-0 lg:flex-1 lg:overflow-hidden'>
            <CustomMultiplayerSidebar
              status={ws.status}
              drawOffered={ws.drawOffered}
              rematchOffered={ws.rematchOffered}
              rematchDeclined={ws.rematchDeclined}
              moves={moves}
              viewingIndex={viewingIndex}
              positionHistory={positionHistory}
              gameOver={gameOver}
              gameResult={gameResult}
              gameStarted={gameStarted}
              movesCount={moves.length}
              activePanel={
                <DiceMultiplayerPanel
                  dice={dice}
                  isRolling={isRolling}
                  needsRoll={needsRoll}
                  onRoll={rollDice}
                  turnColor={turn}
                  isMyTurn={isMyTurn}
                  gameStarted={gameStarted}
                  gameOver={gameOver}
                />
              }
              onResign={handleResign}
              onAbort={handleAbort}
              onOfferDraw={handleOfferDraw}
              onAcceptDraw={handleAcceptDraw}
              onDeclineDraw={handleDeclineDraw}
              onOfferRematch={ws.offerRematch}
              onAcceptRematch={ws.acceptRematch}
              onDeclineRematch={ws.declineRematch}
              onFindNewGame={handleFindNewGame}
              onGoToStart={goToStart}
              onGoToEnd={goToEnd}
              onGoToPrev={goToPrev}
              onGoToNext={goToNext}
              onGoToMove={goToMove}
              statsNode={<DiceRollChart diceRolls={diceRollHistory} />}
              statsTitle='Dice Roll Distribution'
            />
          </div>
        </div>
      </div>

      {/* Secondary-tab overlay */}
      {ws.isSecondaryTab &&
        (ws.status === 'playing' ||
          ws.status === 'matched' ||
          ws.status === 'rejoined') && (
          <div className='bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
            <div className='bg-card mx-4 flex max-w-sm flex-col items-center gap-3 rounded-xl border p-8 text-center shadow-xl'>
              <Icons.system className='text-muted-foreground h-10 w-10' />
              <div>
                <p className='text-lg font-semibold'>
                  Game in progress in another tab
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Switch to the other tab to continue playing.
                </p>
              </div>
            </div>
          </div>
        )}

      <MatchmakingDialog
        open={matchmakingOpen && !sessionRestorePending}
        onOpenChange={(v) => {
          if (
            !v &&
            (ws.status === 'idle' ||
              ws.status === 'connecting' ||
              ws.status === 'error')
          ) {
            setMatchmakingOpen(false);
          }
        }}
        status={ws.status}
        variantLabel='Dice Chess'
        errorMessage={ws.errorMessage}
        pendingChallengeId={ws.pendingChallengeId}
        initialChallengeId={activeChallengeId}
        onFindGame={handleFindGame}
        onCancel={ws.leaveQueue}
        onCreateChallenge={handleCreateChallenge}
        onCancelChallenge={ws.cancelChallenge}
      />
    </>
  );
}
