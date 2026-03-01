'use client';
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type ReactNode
} from 'react';
import { useSession } from 'next-auth/react';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import { Chess } from '@/lib/chess/chess';
import type { ChessJSMove } from '@/lib/chess/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';
import {
  useMultiplayerWS,
  loadSession
} from '@/features/multiplayer/hooks/useMultiplayerWS';
import { MatchmakingDialog } from '@/features/multiplayer/components/MatchmakingDialog';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import {
  playSound,
  getSoundType,
  playRawSound
} from '@/features/game/utils/sounds';
import { CARD_SOUND_PATH } from '@/lib/public-paths';
import {
  SignalIndicator,
  AbandonCountdown
} from '@/features/multiplayer/components/PlayerStatusIndicators';
import {
  DEFAULT_FLAG_CODE,
  normalizeFlagCode
} from '@/features/settings/flags';
import {
  type CardRank,
  type CardSuit,
  type PlayingCard,
  type CardResult,
  CARD_TO_PIECE,
  PIECE_NAMES
} from '../stores/useCardChessStore';
import type { ChallengeColor } from '@/features/multiplayer/types';
import type {
  TwoPlayerPlayerInfo,
  TwoPlayerMultiplayerSidebarProps
} from '@/features/chess/types/game-engine-contract';
import { createElement } from 'react';
const VARIANT = 'card-chess';
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
export function getHighlightsForCard(
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
            boxShadow: 'var(--highlight-piece-indicator)',
            borderRadius: '4px'
          };
        }
      } else {
        if (p.type === mapping.type) {
          squares[square] = {
            boxShadow: 'var(--highlight-piece-indicator)',
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
export interface CardChessMultiplayerGame {
  currentFEN: string;
  gameStarted: boolean;
  gameOver: boolean;
  highlightedSquares: Record<string, React.CSSProperties>;
  loserColor: 'w' | 'b' | null;
  canDrag: boolean;
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  turn: 'w' | 'b';
  drawnCard: CardResult | null;
  isDrawing: boolean;
  needsDraw: boolean;
  drawCount: number;
  isInCheck: boolean;
  cardDrawHistory: CardRank[];
  whiteTimeSecs: number | null;
  blackTimeSecs: number | null;
  activeClock: 'white' | 'black' | null;
  topPlayerInfo: TwoPlayerPlayerInfo;
  bottomPlayerInfo: TwoPlayerPlayerInfo;
  topPlayerExtras: ReactNode;
  bottomPlayerExtras: ReactNode;
  gameResult: string | null;
  ratingDelta: number | null;
  overlays: ReactNode;
  multiplayerSidebarProps: TwoPlayerMultiplayerSidebarProps;
  isMyTurn: boolean;
  onPieceDrop: (args: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
  onDrawCard: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (idx: number) => void;
}
export function useCardChessMultiplayerGame(
  challengeId?: string
): CardChessMultiplayerGame {
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
  const [whiteTimeSecs, setWhiteTimeSecs] = useState<number | null>(null);
  const [blackTimeSecs, setBlackTimeSecs] = useState<number | null>(null);
  const [activeClock, setActiveClock] = useState<'white' | 'black' | null>(
    null
  );
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [sessionRestorePending, setSessionRestorePending] = useState(true);
  const [activeChallengeId, setActiveChallengeId] = useState(challengeId);
  const savedRoomIdRef = useRef<string | null>(null);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const boardFlipped = useChessStore((s) => s.boardFlipped);
  const setBoardFlipped = useChessStore((s) => s.setBoardFlipped);
  const myColor = ws.myColor;
  const serverOrientation = myColor === 'black' ? 'black' : 'white';
  const boardOrientation = boardFlipped
    ? serverOrientation === 'white'
      ? 'black'
      : 'white'
    : serverOrientation;
  const topColor = boardOrientation === 'white' ? 'black' : 'white';
  const bottomColor = boardOrientation === 'white' ? 'white' : 'black';
  const isMyTurn =
    gameStarted &&
    !gameOver &&
    myColor !== null &&
    ((myColor === 'white' && turn === 'w') ||
      (myColor === 'black' && turn === 'b'));
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
    if (ratingCategory) params.set('category', ratingCategory);
    fetch(`/api/user/rating?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            rating: number | null;
          } | null
        ) => setMyRating(data?.rating ?? 700)
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
      .then(
        (
          data: {
            flagCode?: string | null;
          } | null
        ) => setMyFlagCode(normalizeFlagCode(data?.flagCode))
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
    if (ratingCategory) params.set('category', ratingCategory);
    fetch(`/api/users/${opponentUserId}?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            rating?: number | null;
            flagCode?: string | null;
          } | null
        ) => {
          setOpponentRating(data?.rating ?? 700);
          setOpponentFlagCode(normalizeFlagCode(data?.flagCode));
        }
      )
      .catch(() => setOpponentFlagCode(DEFAULT_FLAG_CODE));
  }, [opponentUserId, ratingCategory]);
  const sendCardSyncRef = useRef(ws.sendCardSync);
  sendCardSyncRef.current = ws.sendCardSync;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
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
      if (soundEnabledRef.current) playRawSound(CARD_SOUND_PATH);
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
  }, []);
  const drawCard = useCallback(() => {
    if (!isMyTurn || isDrawing || !needsDraw) return;
    doDrawCard();
  }, [isMyTurn, isDrawing, needsDraw, doDrawCard]);
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
  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!targetSquare) return false;
      if (!isMyTurn || needsDraw || isDrawing || gameOver) {
        if (soundEnabled) playSound('illegal');
        return false;
      }
      const chess = chessRef.current;
      const piece = chess.get(sourceSquare);
      if (!piece) return false;
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
      if (drawnCard) {
        discardPileRef.current = [...discardPileRef.current, drawnCard.card];
      }
      applyMove(moveObj, false);
      ws.sendMove(sourceSquare, targetSquare, moveObj.promotion);
      return true;
    },
    [
      isMyTurn,
      needsDraw,
      isDrawing,
      gameOver,
      drawnCard,
      soundEnabled,
      applyMove,
      ws
    ]
  );
  useEffect(() => {
    ws.setOnOpponentMove((from, to, promotion) => {
      const chess = chessRef.current;
      const moveObj = chess.move({ from, to, promotion }) as ChessJSMove | null;
      if (moveObj) applyMove(moveObj, true);
    });
    return () => ws.setOnOpponentMove(null);
  }, [ws.setOnOpponentMove, applyMove]);
  useEffect(() => {
    ws.setOnServerGameOver((result) => {
      setGameOver(true);
      setGameResult(result);
    });
    return () => ws.setOnServerGameOver(null);
  }, [ws.setOnServerGameOver]);
  useEffect(() => {
    const roomId = ws.roomId;
    const myColorNow = ws.myColor ?? 'white';
    if (!roomId || savedRoomIdRef.current === roomId) return;
    if (!gameOver || !gameResult) return;
    savedRoomIdRef.current = roomId;
    const resultCode = toResultCode(gameResult, myColorNow);
    const resultReason = toResultReason(gameResult);
    const oppUserId = myColorNow === 'white' ? ws.blackUserId : ws.whiteUserId;
    const payload = {
      roomId,
      moves,
      variant: VARIANT,
      gameType: 'multiplayer',
      result: resultCode,
      resultReason,
      myColor: myColorNow,
      opponentUserId: oppUserId,
      timeControl: ws.timeControl ?? {
        mode: 'unlimited',
        minutes: 0,
        increment: 0
      },
      startingFen: positionHistory[0] ?? STARTING_FEN
    };
    const save = (body: typeof payload) =>
      fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
              myColorNow === 'white'
                ? data.whiteRatingDelta
                : data.blackRatingDelta;
            const theirDelta =
              myColorNow === 'white'
                ? data.blackRatingDelta
                : data.whiteRatingDelta;
            if (myDelta != null) setMyRatingDelta(myDelta);
            if (theirDelta != null) setOpponentRatingDelta(theirDelta);
            if (myDelta == null) {
              setTimeout(() => save(body).catch(() => {}), 700);
            }
          }
        )
        .catch((err) =>
          console.error('Failed to save card multiplayer game:', err)
        );
    save(payload);
  }, [
    ws.roomId,
    ws.myColor,
    ws.whiteUserId,
    ws.blackUserId,
    ws.timeControl,
    gameOver,
    gameResult,
    moves,
    positionHistory
  ]);
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
      if (soundEnabledRef.current) playRawSound(CARD_SOUND_PATH);
    });
    return () => ws.setOnSyncCard(null);
  }, [ws.setOnSyncCard]);
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
      setMyRatingDelta(null);
      setOpponentRatingDelta(null);
      setDrawnCard(null);
      setNeedsDraw(!isOver);
      setDrawCount(0);
      setIsDrawing(false);
      setIsInCheck(chess.isCheck());
      setCardDrawHistory([]);
      setLoserColor(null);
      setHighlightedSquares({});
      setBoardFlipped(false);
    },
    [setBoardFlipped]
  );
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
  }, []);
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
  useEffect(() => {
    if (matchmakingOpen && !ws.isSecondaryTab) {
      ws.preConnect();
    }
  }, [matchmakingOpen, ws.isSecondaryTab]);
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
          const data = (await res.json()) as {
            rating: number;
          };
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
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setLoserColor(null);
    setHighlightedSquares({});
    setMatchmakingOpen(true);
  }, [ws.disconnect]);
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
  const isMe = (color: 'white' | 'black') => color === (ws.myColor ?? 'white');
  const getPlayerInfo = (color: 'white' | 'black'): TwoPlayerPlayerInfo => ({
    name: isMe(color)
      ? (session?.user?.name ?? 'You')
      : (ws.opponentName ?? 'Opponent'),
    image: isMe(color)
      ? (session?.user?.image ?? null)
      : (ws.opponentImage ?? null),
    rating: isMe(color) ? myRating : opponentRating,
    ratingDelta: isMe(color) ? myRatingDelta : opponentRatingDelta,
    flagCode: isMe(color) ? myFlagCode : opponentFlagCode
  });
  const topPlayerInfo = getPlayerInfo(topColor);
  const bottomPlayerInfo = getPlayerInfo(bottomColor);
  const topPlayerExtras: ReactNode = showIndicator
    ? topColor !== (ws.myColor ?? 'white') && ws.opponentDisconnected
      ? createElement(AbandonCountdown, {
          disconnectedAt: ws.opponentDisconnectedAt ?? Date.now()
        })
      : createElement(SignalIndicator, {
          wsStatus: ws.status,
          latencyMs:
            topColor !== (ws.myColor ?? 'white')
              ? ws.opponentLatencyMs
              : ws.latencyMs
        })
    : null;
  const bottomPlayerExtras: ReactNode = showIndicator
    ? createElement(SignalIndicator, {
        wsStatus: ws.status,
        latencyMs:
          bottomColor !== (ws.myColor ?? 'white')
            ? ws.opponentLatencyMs
            : ws.latencyMs
      })
    : null;
  const secondaryTabOverlay: ReactNode =
    ws.isSecondaryTab &&
    (ws.status === 'playing' ||
      ws.status === 'matched' ||
      ws.status === 'rejoined')
      ? createElement(
          'div',
          {
            className:
              'bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'
          },
          createElement(
            'div',
            {
              className:
                'bg-card mx-4 flex max-w-sm flex-col items-center gap-3 rounded-xl border p-8 text-center shadow-xl'
            },
            createElement(
              'p',
              { className: 'text-lg font-semibold' },
              'Game in progress in another tab'
            ),
            createElement(
              'p',
              { className: 'text-muted-foreground mt-1 text-sm' },
              'Switch to the other tab to continue playing.'
            )
          )
        )
      : null;
  const overlays: ReactNode = createElement(
    'div',
    null,
    secondaryTabOverlay,
    createElement(MatchmakingDialog, {
      open: matchmakingOpen && !sessionRestorePending,
      onOpenChange: (v: boolean) => {
        if (
          !v &&
          (ws.status === 'idle' ||
            ws.status === 'connecting' ||
            ws.status === 'error')
        ) {
          setMatchmakingOpen(false);
        }
      },
      status: ws.status,
      variantLabel: 'Card Chess',
      errorMessage: ws.errorMessage,
      pendingChallengeId: ws.pendingChallengeId,
      initialChallengeId: activeChallengeId,
      onFindGame: handleFindGame,
      onCancel: ws.leaveQueue,
      onCreateChallenge: handleCreateChallenge,
      onCancelChallenge: ws.cancelChallenge
    })
  );
  const multiplayerSidebarProps: TwoPlayerMultiplayerSidebarProps = {
    status: ws.status,
    drawOffered: ws.drawOffered,
    rematchOffered: ws.rematchOffered,
    rematchDeclined: ws.rematchDeclined,
    onAbort: handleAbort,
    onResign: handleResign,
    onOfferDraw: handleOfferDraw,
    onAcceptDraw: handleAcceptDraw,
    onDeclineDraw: handleDeclineDraw,
    onOfferRematch: ws.offerRematch,
    onAcceptRematch: ws.acceptRematch,
    onDeclineRematch: ws.declineRematch,
    onFindNewGame: handleFindNewGame,
    ratingDelta: myRatingDelta
  };
  return {
    currentFEN,
    gameStarted,
    gameOver,
    highlightedSquares,
    loserColor,
    canDrag: isMyTurn && !needsDraw && !isDrawing,
    moves,
    positionHistory,
    viewingIndex,
    turn,
    drawnCard,
    isDrawing,
    needsDraw,
    drawCount,
    isInCheck,
    cardDrawHistory,
    whiteTimeSecs,
    blackTimeSecs,
    activeClock,
    topPlayerInfo,
    bottomPlayerInfo,
    topPlayerExtras,
    bottomPlayerExtras,
    gameResult,
    ratingDelta: myRatingDelta,
    overlays,
    multiplayerSidebarProps,
    isMyTurn,
    onPieceDrop,
    onDrawCard: drawCard,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove
  };
}
