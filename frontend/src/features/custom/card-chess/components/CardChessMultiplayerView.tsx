'use client';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { CardDisplay } from './CardDisplay';
import { CardDrawChart } from './CardDrawChart';
import {
  type CardRank,
  type CardSuit,
  type PlayingCard,
  type CardResult,
  CARD_TO_PIECE,
  PIECE_NAMES
} from '../stores/useCardChessStore';
import type { ChallengeColor } from '@/features/multiplayer/types';
import { ABANDON_TIMEOUT_MS } from '@/features/multiplayer/config';
import {
  DEFAULT_FLAG_CODE,
  normalizeFlagCode
} from '@/features/settings/flags';

const VARIANT = 'card-chess';

// ---------------------------------------------------------------------------
// Deck helpers (pure, no store dependency)
// ---------------------------------------------------------------------------
function createDeck(): PlayingCard[] {
  const ranks: CardRank[] = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A'
  ];
  const suits: CardSuit[] = ['H', 'D', 'C', 'S'];
  const deck: PlayingCard[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

function getPieceName(card: PlayingCard): string {
  const mapping = CARD_TO_PIECE[card.rank];
  if (mapping.type === 'p' && mapping.file) {
    return `${mapping.file}-Pawn`;
  }
  return PIECE_NAMES[mapping.type];
}

function checkCardHasValidMoves(game: Chess, card: PlayingCard): boolean {
  const mapping = CARD_TO_PIECE[card.rank];
  const moves = game.moves({ verbose: true }) as {
    piece: string;
    from: string;
  }[];
  if (mapping.type === 'p' && mapping.file) {
    return moves.some((m) => m.piece === 'p' && m.from[0] === mapping.file);
  }
  return moves.some((m) => m.piece === mapping.type);
}

function getHighlightsForCard(
  game: Chess,
  card: PlayingCard
): Record<string, React.CSSProperties> {
  const mapping = CARD_TO_PIECE[card.rank];
  const squares: Record<string, React.CSSProperties> = {};
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r]?.[c];
      if (!p || p.color !== game.turn()) continue;
      const square = String.fromCharCode(97 + c) + (8 - r);
      if (mapping.type === 'p' && mapping.file) {
        if (p.type === 'p' && square[0] === mapping.file) {
          squares[square] = {
            boxShadow: 'inset 0 0 0 3px rgba(59, 130, 246, 0.5)',
            borderRadius: '4px'
          };
        }
      } else {
        if (p.type === mapping.type) {
          squares[square] = {
            boxShadow: 'inset 0 0 0 3px rgba(59, 130, 246, 0.5)',
            borderRadius: '4px'
          };
        }
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
// Card panel (prop-driven, not store-driven)
// ---------------------------------------------------------------------------
interface CardMultiplayerPanelProps {
  drawnCard: CardResult | null;
  isDrawing: boolean;
  needsDraw: boolean;
  onDraw: () => void;
  turnColor: 'w' | 'b';
  isMyTurn: boolean;
  gameStarted: boolean;
  gameOver: boolean;
  isInCheck: boolean;
  drawCount: number;
}

function CardMultiplayerPanel({
  drawnCard,
  isDrawing,
  needsDraw,
  onDraw,
  turnColor,
  isMyTurn,
  gameStarted,
  gameOver,
  isInCheck,
  drawCount
}: CardMultiplayerPanelProps) {
  const CARD_SIZE = 100;

  if (!gameStarted || gameOver) return null;

  if (!isMyTurn && !drawnCard && !isDrawing) {
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
        <div className='flex items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            {drawnCard || isDrawing ? (
              <>
                <div
                  className={cn(
                    'relative rounded-xl border-2 p-2 transition-all duration-300',
                    drawnCard &&
                      !isDrawing &&
                      drawnCard.hasValidMoves &&
                      'border-primary/50 shadow-[0_0_12px_rgba(var(--primary-rgb,59,130,246),0.4)]',
                    drawnCard &&
                      !isDrawing &&
                      !drawnCard.hasValidMoves &&
                      'border-destructive/30',
                    (!drawnCard || isDrawing) && 'border-transparent'
                  )}
                  style={{
                    width: CARD_SIZE + 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CardDisplay
                    card={drawnCard?.card ?? null}
                    size={CARD_SIZE}
                    isDrawing={isDrawing}
                    disabled={drawnCard ? !drawnCard.hasValidMoves : false}
                  />
                  {drawnCard && !isDrawing && !drawnCard.hasValidMoves && (
                    <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/25'>
                      <span className='text-destructive text-2xl font-bold drop-shadow'>
                        ✗
                      </span>
                    </div>
                  )}
                </div>

                {drawnCard && !isDrawing && (
                  <div className='flex flex-col items-center gap-1'>
                    <span
                      className={cn(
                        'text-sm font-medium tracking-wide',
                        drawnCard.hasValidMoves
                          ? 'text-primary'
                          : 'text-muted-foreground line-through opacity-60'
                      )}
                    >
                      {drawnCard.pieceName}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {drawnCard.card.rank}
                      {drawnCard.card.suit === 'H'
                        ? '♥'
                        : drawnCard.card.suit === 'D'
                          ? '♦'
                          : drawnCard.card.suit === 'C'
                            ? '♣'
                            : '♠'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <Skeleton
                  className='rounded-xl'
                  style={{
                    width: CARD_SIZE + 20,
                    height: CARD_SIZE * 1.4 + 20
                  }}
                />
                <Skeleton className='h-5 w-20' />
                <Skeleton className='h-4 w-12' />
              </div>
            )}
          </div>
        </div>

        {needsDraw && !isDrawing && (
          <>
            <div className='flex flex-col items-center gap-1'>
              <p className='text-muted-foreground text-sm'>
                {turnColor === 'w' ? 'White' : 'Black'}&apos;s turn — Draw a
                card!
              </p>
              {isInCheck && drawCount > 0 && (
                <p className='text-destructive text-xs font-medium'>
                  In Check — Draw {drawCount}/5
                </p>
              )}
            </div>
            {isMyTurn && (
              <button
                onClick={onDraw}
                className={cn(
                  'group flex items-center justify-center gap-3 rounded-xl px-8 py-3',
                  'bg-primary text-primary-foreground font-semibold',
                  'transition-all duration-200 hover:opacity-90 active:scale-95',
                  'shadow-lg hover:shadow-xl'
                )}
              >
                <Icons.spade className='h-5 w-5' />
                <span>Draw Card</span>
              </button>
            )}
          </>
        )}

        {isDrawing && <Skeleton className='h-5 w-24' />}

        {drawnCard && !isDrawing && !needsDraw && (
          <p className='text-muted-foreground text-center text-xs'>
            {drawnCard.hasValidMoves
              ? isMyTurn
                ? 'Move the highlighted piece on the board'
                : 'Opponent is moving…'
              : isInCheck && drawCount < 5
                ? 'No valid moves — drawing another card...'
                : !isInCheck
                  ? 'No valid moves — drawing another card...'
                  : 'Game over!'}
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
  onFindNewGame: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;
  onGoToMove: (idx: number) => void;
}

function CustomMultiplayerSidebar({
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
  const { copy, isCopied } = useClipboard();
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = movesCount < 4;

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
                      <span className='font-medium'>Copy FEN</span>
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
                      <span className='font-medium'>Copy PGN</span>
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
                      <span className='font-medium'>Copy Moves</span>
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
interface CardChessMultiplayerViewProps {
  challengeId?: string;
}

export function CardChessMultiplayerView({
  challengeId
}: CardChessMultiplayerViewProps) {
  const ws = useMultiplayerWS();
  const { data: session } = useSession();
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

  // Card state (each player has their own deck — no sync needed)
  const deckRef = useRef<PlayingCard[]>(shuffleDeck(createDeck()));
  const discardPileRef = useRef<PlayingCard[]>([]);
  const drawCountRef = useRef(0);
  const [drawnCard, setDrawnCard] = useState<CardResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [needsDraw, setNeedsDraw] = useState(true);
  const [drawCount, setDrawCount] = useState(0);
  const [isInCheck, setIsInCheck] = useState(false);
  const [cardDrawHistory, setCardDrawHistory] = useState<CardRank[]>([]);
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

  const opponentUserId = useMemo(() => {
    const me = session?.user?.id ?? null;
    if (me) {
      if (ws.whiteUserId === me) return ws.blackUserId;
      if (ws.blackUserId === me) return ws.whiteUserId;
    }
    if (!ws.myColor) return null;
    return ws.myColor === 'white' ? ws.blackUserId : ws.whiteUserId;
  }, [session?.user?.id, ws.myColor, ws.whiteUserId, ws.blackUserId]);

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
      setOpponentFlagCode(DEFAULT_FLAG_CODE);
      return;
    }
    fetch(`/api/users/${opponentUserId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { flagCode?: string | null } | null) =>
        setOpponentFlagCode(normalizeFlagCode(data?.flagCode))
      )
      .catch(() => setOpponentFlagCode(DEFAULT_FLAG_CODE));
  }, [opponentUserId]);

  // Board settings from global store
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const theme = useBoardTheme();

  const myColor = ws.myColor;
  const boardOrientation =
    myColor === 'black' ? ('black' as const) : ('white' as const);
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

  // Orientation helpers (my color at bottom)
  const boardFlipped = myColor === 'black';
  const topColor = boardFlipped ? 'white' : 'black';
  const bottomColor = boardFlipped ? 'black' : 'white';

  // Stable ref so doDrawCard (with [] deps) can call the latest sendCardSync
  const sendCardSyncRef = useRef(ws.sendCardSync);
  sendCardSyncRef.current = ws.sendCardSync;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // ---------------------------------------------------------------------------
  // Draw card logic (reads from chessRef so always current)
  // ---------------------------------------------------------------------------
  const doDrawCard = useCallback(() => {
    const chess = chessRef.current;
    const isInCheckNow = chess.isCheck();
    setIsDrawing(true);
    setTimeout(() => {
      let currentDeck = deckRef.current;
      let currentDiscardPile = discardPileRef.current;
      if (currentDeck.length === 0) {
        currentDeck = shuffleDeck([...currentDiscardPile]);
        currentDiscardPile = [];
      }
      const cardFromDeck = currentDeck[0]!;
      deckRef.current = currentDeck.slice(1);
      discardPileRef.current = currentDiscardPile;

      const hasValidMoves = checkCardHasValidMoves(chess, cardFromDeck);
      const pieceName = getPieceName(cardFromDeck);
      const cardResult: CardResult = {
        card: cardFromDeck,
        hasValidMoves,
        pieceName
      };

      const newDrawCount = drawCountRef.current + 1;
      drawCountRef.current = newDrawCount;

      setDrawnCard(cardResult);
      setIsDrawing(false);
      setNeedsDraw(false);
      setDrawCount(newDrawCount);
      setCardDrawHistory((prev) => [...prev, cardFromDeck.rank]);
      setHighlightedSquares(
        hasValidMoves ? getHighlightsForCard(chess, cardFromDeck) : {}
      );
      sendCardSyncRef.current(cardFromDeck.rank, cardFromDeck.suit);
      if (soundEnabledRef.current) playRawSound('/custom/sounds/cards.mp3');

      if (!hasValidMoves) {
        if (isInCheckNow && newDrawCount >= 5) {
          const loser = chess.turn();
          const winner = loser === 'w' ? 'Black' : 'White';
          const result = `${winner} wins — ${loser === 'w' ? 'White' : 'Black'} cannot escape check after 5 draws`;
          setGameOver(true);
          setGameResult(result);
        } else {
          setTimeout(doDrawCard, 1200);
        }
      }
    }, 600);
  }, []); // all deps are stable refs

  const drawCard = useCallback(() => {
    if (!isMyTurn || isDrawing || !needsDraw) return;
    doDrawCard();
  }, [isMyTurn, isDrawing, needsDraw, doDrawCard]);

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
      setDrawnCard(null);
      setNeedsDraw(!isOver);
      setDrawCount(0);
      drawCountRef.current = 0;
      setHighlightedSquares({});
      setIsInCheck(chess.isCheck());

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
    if (!isMyTurn || needsDraw || isDrawing || gameOver) {
      if (soundEnabled) playSound('illegal');
      return false;
    }

    const chess = chessRef.current;
    const piece = chess.get(sourceSquare);
    if (!piece) return false;

    // Card constraint
    if (drawnCard) {
      const mapping = CARD_TO_PIECE[drawnCard.card.rank];
      if (mapping.type === 'p' && mapping.file) {
        if (piece.type !== 'p' || sourceSquare[0] !== mapping.file) {
          if (soundEnabled) playSound('illegal');
          return false;
        }
      } else {
        if (piece.type !== mapping.type) {
          if (soundEnabled) playSound('illegal');
          return false;
        }
      }
      if (!drawnCard.hasValidMoves) return false;
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

    // Move played card to discard pile
    if (drawnCard) {
      discardPileRef.current = [...discardPileRef.current, drawnCard.card];
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
  // Opponent card sync (show their drawn card on our board too)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    ws.setOnSyncCard((rank, suit) => {
      const chess = chessRef.current;
      const card: PlayingCard = {
        rank: rank as CardRank,
        suit: suit as CardSuit
      };
      const hasValidMoves = checkCardHasValidMoves(chess, card);
      const pieceName = getPieceName(card);
      setDrawnCard({ card, hasValidMoves, pieceName });
      setNeedsDraw(false);
      setIsDrawing(false);
      setIsInCheck(chess.isCheck());
      setHighlightedSquares(
        hasValidMoves ? getHighlightsForCard(chess, card) : {}
      );
      if (soundEnabledRef.current) playRawSound('/custom/sounds/cards.mp3');
    });
    return () => ws.setOnSyncCard(null);
  }, [ws.setOnSyncCard]);

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
  const startGameFromFresh = useCallback((replayMoves?: string[]) => {
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
    deckRef.current = shuffleDeck(createDeck());
    discardPileRef.current = [];
    drawCountRef.current = 0;

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
    setDrawnCard(null);
    setNeedsDraw(!isOver);
    setDrawCount(0);
    setIsDrawing(false);
    setIsInCheck(chess.isCheck());
    setCardDrawHistory([]);
    setLoserColor(null);
    setHighlightedSquares({});
  }, []);

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
  }, [ws.status, ws.myColor]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [matchmakingOpen, ws.isSecondaryTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Handlers passed to MatchmakingDialog
  // ---------------------------------------------------------------------------
  const handleFindGame = useCallback(
    (timeControl: Parameters<typeof ws.joinQueue>[1]) => {
      ws.joinQueue(
        VARIANT,
        timeControl,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
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
    deckRef.current = shuffleDeck(createDeck());
    discardPileRef.current = [];
    drawCountRef.current = 0;
    setCurrentFEN(STARTING_FEN);
    setPositionHistory([STARTING_FEN]);
    setViewingIndex(0);
    setTurn('w');
    setDrawnCard(null);
    setNeedsDraw(true);
    setDrawCount(0);
    setIsDrawing(false);
    setIsInCheck(false);
    setCardDrawHistory([]);
    setLoserColor(null);
    setHighlightedSquares({});
    setMatchmakingOpen(true);
  }, [ws.disconnect]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Resign / abort
  // ---------------------------------------------------------------------------
  const handleResign = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('You resigned');
    setGameOver(true);
    ws.resign();
  }, [soundEnabled, ws.resign]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAbort = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Game Aborted');
    setGameOver(true);
    ws.abort();
  }, [soundEnabled, ws.abort]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const topTime = boardFlipped ? whiteTimeSecs : blackTimeSecs;
  const bottomTime = boardFlipped ? blackTimeSecs : whiteTimeSecs;
  const topTimerActive = activeClock === topColor && !gameOver;
  const bottomTimerActive = activeClock === bottomColor && !gameOver;

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
                name={ws.opponentName ?? 'Opponent'}
                image={ws.opponentImage ?? null}
                flagCode={opponentFlagCode}
              />
              {showIndicator &&
                (ws.opponentDisconnected ? (
                  <AbandonCountdown
                    disconnectedAt={ws.opponentDisconnectedAt ?? Date.now()}
                  />
                ) : (
                  <SignalIndicator
                    wsStatus={ws.status}
                    latencyMs={ws.opponentLatencyMs}
                  />
                ))}
            </div>
            <div className='flex items-center gap-2'>
              <CapturedPiecesDisplay
                pieces={
                  boardFlipped ? capturedPieces.black : capturedPieces.white
                }
                pieceColor={boardFlipped ? 'white' : 'black'}
                advantage={
                  boardFlipped
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
                canDrag={isMyTurn && !needsDraw && !isDrawing}
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
                canDrag={isMyTurn && !needsDraw && !isDrawing}
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
                name={session?.user?.name ?? 'You'}
                image={session?.user?.image ?? null}
                flagCode={myFlagCode}
              />
              {showIndicator && (
                <SignalIndicator
                  wsStatus={ws.status}
                  latencyMs={ws.latencyMs}
                />
              )}
            </div>
            <div className='flex items-center gap-2'>
              <CapturedPiecesDisplay
                pieces={
                  boardFlipped ? capturedPieces.white : capturedPieces.black
                }
                pieceColor={boardFlipped ? 'black' : 'white'}
                advantage={
                  boardFlipped
                    ? materialAdvantage < 0
                      ? Math.abs(materialAdvantage)
                      : undefined
                    : materialAdvantage > 0
                      ? materialAdvantage
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
              moves={moves}
              viewingIndex={viewingIndex}
              positionHistory={positionHistory}
              gameOver={gameOver}
              gameResult={gameResult}
              gameStarted={gameStarted}
              movesCount={moves.length}
              activePanel={
                <CardMultiplayerPanel
                  drawnCard={drawnCard}
                  isDrawing={isDrawing}
                  needsDraw={needsDraw}
                  onDraw={drawCard}
                  turnColor={turn}
                  isMyTurn={isMyTurn}
                  gameStarted={gameStarted}
                  gameOver={gameOver}
                  isInCheck={isInCheck}
                  drawCount={drawCount}
                />
              }
              onResign={handleResign}
              onAbort={handleAbort}
              onFindNewGame={handleFindNewGame}
              onGoToStart={goToStart}
              onGoToEnd={goToEnd}
              onGoToPrev={goToPrev}
              onGoToNext={goToNext}
              onGoToMove={goToMove}
              statsNode={<CardDrawChart cardDraws={cardDrawHistory} />}
              statsTitle='Card Draw Distribution'
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
        variantLabel='Card Chess'
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
