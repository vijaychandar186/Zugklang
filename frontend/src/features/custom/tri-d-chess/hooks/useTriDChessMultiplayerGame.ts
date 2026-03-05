'use client';
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
  createElement
} from 'react';
import { useSession } from 'next-auth/react';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import {
  useMultiplayerWS,
  loadSession
} from '@/features/multiplayer/hooks/useMultiplayerWS';
import { MatchmakingDialog } from '@/features/multiplayer/components/MatchmakingDialog';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { playSound } from '@/features/game/utils/sounds';
import {
  SignalIndicator,
  AbandonCountdown
} from '@/features/multiplayer/components/PlayerStatusIndicators';
import {
  DEFAULT_FLAG_CODE,
  normalizeFlagCode
} from '@/features/settings/flags';
import type { ChallengeColor } from '@/features/multiplayer/types';
import type {
  TwoPlayerPlayerInfo,
  TwoPlayerMultiplayerSidebarProps
} from '@/features/chess/types/game-engine-contract';
import {
  type TriDSquare,
  type AttackBoardId,
  type AttackBoardSlot,
  type PieceType,
  type PieceMap,
  squareKey,
  parseSquareKey,
  BOARD_SIZES
} from '../engine/types';
import {
  type TriDGameState,
  createInitialState,
  applyPieceMove,
  applyBoardMove,
  getCurrentCheck,
  getLegalMoves,
  getLegalBoardMoves,
  requiresPromotion
} from '../engine/gameEngine';

const VARIANT = 'tri-d';

// Move encoding / decoding
// Piece: "P:{fromKey}:{toKey}" or "P:{fromKey}:{toKey}:{promotion}"
// Board: "B:{boardId}:{fromSlot}:{toSlot}" or "B:{boardId}:{fromSlot}:{toSlot}:{arrivalChoice}"
function encodeTriDMove(
  type: 'piece',
  from: TriDSquare,
  to: TriDSquare,
  promotion?: PieceType
): string;
function encodeTriDMove(
  type: 'board',
  boardId: AttackBoardId,
  fromSlot: AttackBoardSlot,
  toSlot: AttackBoardSlot,
  arrivalChoice?: 'identity' | 'rot180'
): string;
function encodeTriDMove(type: 'piece' | 'board', ...args: unknown[]): string {
  if (type === 'piece') {
    const [from, to, promotion] = args as [
      TriDSquare,
      TriDSquare,
      PieceType | undefined
    ];
    const base = `P:${squareKey(from)}:${squareKey(to)}`;
    return promotion ? `${base}:${promotion}` : base;
  }
  const [boardId, fromSlot, toSlot, arrivalChoice] = args as [
    AttackBoardId,
    AttackBoardSlot,
    AttackBoardSlot,
    ('identity' | 'rot180') | undefined
  ];
  const base = `B:${boardId}:${fromSlot}:${toSlot}`;
  return arrivalChoice ? `${base}:${arrivalChoice}` : base;
}

interface DecodedPieceMove {
  kind: 'piece';
  from: TriDSquare;
  to: TriDSquare;
  promotion?: PieceType;
}
interface DecodedBoardMove {
  kind: 'board';
  boardId: AttackBoardId;
  fromSlot: AttackBoardSlot;
  toSlot: AttackBoardSlot;
  arrivalChoice: 'identity' | 'rot180';
}
function decodeTriDMove(
  encoded: string
): DecodedPieceMove | DecodedBoardMove | null {
  if (encoded.startsWith('P:')) {
    const parts = encoded.slice(2).split(':');
    // fromKey = parts[0]:parts[1]:parts[2], toKey = parts[3]:parts[4]:parts[5], promotion? = parts[6]
    if (parts.length < 6) return null;
    const from = parseSquareKey(`${parts[0]}:${parts[1]}:${parts[2]}`);
    const to = parseSquareKey(`${parts[3]}:${parts[4]}:${parts[5]}`);
    const promotion = parts[6] as PieceType | undefined;
    return { kind: 'piece', from, to, promotion };
  }
  if (encoded.startsWith('B:')) {
    const parts = encoded.slice(2).split(':');
    // boardId:fromSlot:toSlot[:arrivalChoice]
    // fromSlot and toSlot may contain underscores so we split carefully
    // Format: B:{boardId}:{fromSlot}:{toSlot}[:{arrivalChoice}]
    // boardId = parts[0], rest are named slots
    if (parts.length < 3) return null;
    const boardId = parts[0] as AttackBoardId;
    // slots may be multi-word (underscores already preserved as single tokens)
    const fromSlot = parts[1] as AttackBoardSlot;
    const toSlot = parts[2] as AttackBoardSlot;
    const arrivalChoice =
      parts[3] === 'rot180' ? 'rot180' : ('identity' as const);
    return { kind: 'board', boardId, fromSlot, toSlot, arrivalChoice };
  }
  return null;
}

function countPiecesOnBoard(pieces: PieceMap, boardId: AttackBoardId): number {
  const size = BOARD_SIZES[boardId];
  let count = 0;
  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      if (pieces[squareKey({ boardId, row: r, col: c })]) count++;
    }
  }
  return count;
}

function toResultReason(result: string | null): string {
  if (!result) return 'unknown';
  const lower = result.toLowerCase();
  if (lower.includes('abort')) return 'abort';
  if (lower.includes('resign')) return 'resign';
  if (lower.includes('time') || lower.includes('timeout')) return 'timeout';
  if (lower.includes('draw') && lower.includes('agreement'))
    return 'draw_agreement';
  if (lower.includes('stalemate')) return 'stalemate';
  return 'checkmate';
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

export interface PendingBoardArrivalState {
  boardId: AttackBoardId;
  toSlot: AttackBoardSlot;
  identityKey: string;
  rot180Key: string;
}

export interface PendingPromotionState {
  from: TriDSquare;
  to: TriDSquare;
}

export interface TriDChessMultiplayerGame {
  gameState: TriDGameState;
  gameStarted: boolean;
  gameOver: boolean;
  viewingIndex: number;
  inCheck: boolean;
  highlightedSquares: Set<string>;
  highlightedSlots: Set<AttackBoardSlot>;
  selected: TriDSquare | null;
  selectedBoardId: AttackBoardId | null;
  pendingBoardArrival: PendingBoardArrivalState | null;
  pendingPromotion: PendingPromotionState | null;
  whiteTimeSecs: number | null;
  blackTimeSecs: number | null;
  activeClock: 'white' | 'black' | null;
  serverOrientation: 'white' | 'black';
  topPlayerInfo: TwoPlayerPlayerInfo;
  bottomPlayerInfo: TwoPlayerPlayerInfo;
  topPlayerExtras: ReactNode;
  bottomPlayerExtras: ReactNode;
  gameResult: string | null;
  overlays: ReactNode;
  multiplayerSidebarProps: TwoPlayerMultiplayerSidebarProps;
  isMyTurn: boolean;
  isActive: boolean;
  moves: string[];
  positionHistory: string[];
  turn: 'w' | 'b';
  onSquareClick: (sq: TriDSquare) => void;
  onAttackBoardClick: (id: AttackBoardId) => void;
  onSlotClick: (id: AttackBoardId, slot: AttackBoardSlot) => void;
  onChooseBoardArrival: (choice: 'identity' | 'rot180') => void;
  onCompletePromotion: (piece: PieceType) => void;
  onCancelPromotion: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (idx: number) => void;
}

export function useTriDChessMultiplayerGame(
  challengeId?: string
): TriDChessMultiplayerGame {
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

  const gameStateRef = useRef<TriDGameState>(createInitialState());
  const [gameState, setGameState] = useState<TriDGameState>(
    gameStateRef.current
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [inCheck, setInCheck] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<Set<string>>(
    new Set()
  );
  const [highlightedSlots, setHighlightedSlots] = useState<
    Set<AttackBoardSlot>
  >(new Set());
  const [selected, setSelected] = useState<TriDSquare | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<AttackBoardId | null>(
    null
  );
  const [pendingBoardArrival, setPendingBoardArrival] =
    useState<PendingBoardArrivalState | null>(null);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotionState | null>(null);

  const [whiteTimeSecs, setWhiteTimeSecs] = useState<number | null>(null);
  const [blackTimeSecs, setBlackTimeSecs] = useState<number | null>(null);
  const [activeClock, setActiveClock] = useState<'white' | 'black' | null>(
    null
  );

  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [allowAutoMatchmakingOpen, setAllowAutoMatchmakingOpen] = useState(true);
  const [sessionRestorePending, setSessionRestorePending] = useState(true);
  const restoreAttemptedRef = useRef(false);
  const [activeChallengeId, setActiveChallengeId] = useState(challengeId);
  const savedRoomIdRef = useRef<string | null>(null);
  const moveSansRef = useRef<string[]>([]);
  const [moves, setMoves] = useState<string[]>([]);
  const positionHistory = useMemo(
    () => gameState.snapshots.map(() => ''),
    [gameState.snapshots]
  );

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
    ((myColor === 'white' && gameState.turn === 'w') ||
      (myColor === 'black' && gameState.turn === 'b'));

  const viewingLive = viewingIndex === gameState.snapshots.length - 1;
  const isActive = gameStarted && !gameOver && viewingLive;

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
    if (ratingCategory) params.set('category', ratingCategory);
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

  const sendTriDMoveSyncRef = useRef(ws.sendTriDMoveSync);
  sendTriDMoveSyncRef.current = ws.sendTriDMoveSync;

  const applyMoveToState = useCallback(
    (nextState: TriDGameState, san: string, isOpponent: boolean) => {
      gameStateRef.current = nextState;
      const newInCheck = getCurrentCheck(nextState);
      const newSans = [...moveSansRef.current, san];
      moveSansRef.current = newSans;
      setGameState(nextState);
      setViewingIndex(nextState.snapshots.length - 1);
      setInCheck(newInCheck);
      setMoves(newSans);
      setHighlightedSquares(new Set());
      setHighlightedSlots(new Set());
      setSelected(null);
      setSelectedBoardId(null);
      setPendingBoardArrival(null);
      setPendingPromotion(null);
      if (nextState.isOver) {
        setGameOver(true);
        setGameResult(nextState.result);
        if (!isOpponent && nextState.result) {
          ws.notifyGameOver(nextState.result, toResultReason(nextState.result));
        }
      }
      if (soundEnabled) {
        if (nextState.isOver) playSound('game-end');
        else playSound(isOpponent ? 'move-opponent' : 'move-self');
      }
    },
    [soundEnabled, ws]
  );

  const onSquareClick = useCallback(
    (sq: TriDSquare) => {
      if (!isActive || !isMyTurn) return;
      const state = gameStateRef.current;
      const sqKey = squareKey(sq);

      // If pending arrival, clicking a highlighted square resolves arrival
      if (pendingBoardArrival) {
        if (
          sqKey === pendingBoardArrival.identityKey ||
          sqKey === pendingBoardArrival.rot180Key
        ) {
          const choice =
            sqKey === pendingBoardArrival.rot180Key ? 'rot180' : 'identity';
          const result = applyBoardMove(
            state,
            pendingBoardArrival.boardId,
            pendingBoardArrival.toSlot,
            choice
          );
          if (result) {
            const encoded = encodeTriDMove(
              'board',
              pendingBoardArrival.boardId,
              result.move.type === 'board' ? result.move.fromSlot : 'left_low',
              pendingBoardArrival.toSlot,
              choice
            );
            sendTriDMoveSyncRef.current(encoded);
            applyMoveToState(result.nextState, result.move.san, false);
          }
          setPendingBoardArrival(null);
          return;
        }
        // Click elsewhere cancels pending arrival
        setPendingBoardArrival(null);
        setHighlightedSquares(new Set());
        return;
      }

      const piece = state.pieces[sqKey];
      // If a square is already selected and we click a highlighted destination
      if (selected && highlightedSquares.has(sqKey)) {
        if (requiresPromotion(selected, sq, state)) {
          setPendingPromotion({ from: selected, to: sq });
          setSelected(null);
          setHighlightedSquares(new Set());
          return;
        }
        const result = applyPieceMove(state, selected, sq);
        if (result) {
          const encoded = encodeTriDMove('piece', selected, sq);
          sendTriDMoveSyncRef.current(encoded);
          applyMoveToState(result.nextState, result.move.san, false);
          setSelected(null);
          setHighlightedSquares(new Set());
        }
        return;
      }

      // Select own piece
      if (piece && piece.color === state.turn) {
        const legalDests = getLegalMoves(sq, state);
        setSelected(sq);
        setSelectedBoardId(null);
        setHighlightedSquares(new Set(legalDests.map(squareKey)));
        setHighlightedSlots(new Set());
        return;
      }

      // Deselect
      setSelected(null);
      setHighlightedSquares(new Set());
    },
    [
      isActive,
      isMyTurn,
      selected,
      highlightedSquares,
      pendingBoardArrival,
      applyMoveToState
    ]
  );

  const onAttackBoardClick = useCallback(
    (id: AttackBoardId) => {
      if (!isActive || !isMyTurn) return;
      if (pendingBoardArrival) {
        setPendingBoardArrival(null);
        setHighlightedSquares(new Set());
        return;
      }
      const state = gameStateRef.current;
      const legalSlots = getLegalBoardMoves(id, state);
      if (legalSlots.length === 0) return;
      setSelectedBoardId(id);
      setSelected(null);
      setHighlightedSlots(new Set(legalSlots));
      setHighlightedSquares(new Set());
    },
    [isActive, isMyTurn, pendingBoardArrival]
  );

  const onSlotClick = useCallback(
    (id: AttackBoardId, slot: AttackBoardSlot) => {
      if (!isActive || !isMyTurn) return;
      if (!highlightedSlots.has(slot)) return;
      const state = gameStateRef.current;
      const pieceCount = countPiecesOnBoard(state.pieces, id);
      if (pieceCount === 1) {
        // Need arrival choice
        const size = BOARD_SIZES[id];
        let passengerRow = -1;
        let passengerCol = -1;
        for (let r = 0; r < size.rows; r++) {
          for (let c = 0; c < size.cols; c++) {
            if (state.pieces[squareKey({ boardId: id, row: r, col: c })]) {
              passengerRow = r;
              passengerCol = c;
            }
          }
        }
        const identityKey = squareKey({
          boardId: id,
          row: passengerRow,
          col: passengerCol
        });
        const rot180Key = squareKey({
          boardId: id,
          row: size.rows - 1 - passengerRow,
          col: size.cols - 1 - passengerCol
        });
        setPendingBoardArrival({
          boardId: id,
          toSlot: slot,
          identityKey,
          rot180Key
        });
        setHighlightedSquares(new Set([identityKey, rot180Key]));
        setHighlightedSlots(new Set());
        setSelectedBoardId(null);
        return;
      }
      // Apply directly
      const result = applyBoardMove(state, id, slot);
      if (result) {
        const encoded = encodeTriDMove(
          'board',
          id,
          result.move.type === 'board' ? result.move.fromSlot : 'left_low',
          slot
        );
        sendTriDMoveSyncRef.current(encoded);
        applyMoveToState(result.nextState, result.move.san, false);
      }
      setSelectedBoardId(null);
      setHighlightedSlots(new Set());
    },
    [isActive, isMyTurn, highlightedSlots, applyMoveToState]
  );

  const onChooseBoardArrival = useCallback(
    (choice: 'identity' | 'rot180') => {
      if (!pendingBoardArrival) return;
      const state = gameStateRef.current;
      const result = applyBoardMove(
        state,
        pendingBoardArrival.boardId,
        pendingBoardArrival.toSlot,
        choice
      );
      if (result) {
        const encoded = encodeTriDMove(
          'board',
          pendingBoardArrival.boardId,
          result.move.type === 'board' ? result.move.fromSlot : 'left_low',
          pendingBoardArrival.toSlot,
          choice
        );
        sendTriDMoveSyncRef.current(encoded);
        applyMoveToState(result.nextState, result.move.san, false);
      }
      setPendingBoardArrival(null);
    },
    [pendingBoardArrival, applyMoveToState]
  );

  const onCompletePromotion = useCallback(
    (piece: PieceType) => {
      if (!pendingPromotion) return;
      const state = gameStateRef.current;
      const result = applyPieceMove(
        state,
        pendingPromotion.from,
        pendingPromotion.to,
        piece
      );
      if (result) {
        const encoded = encodeTriDMove(
          'piece',
          pendingPromotion.from,
          pendingPromotion.to,
          piece
        );
        sendTriDMoveSyncRef.current(encoded);
        applyMoveToState(result.nextState, result.move.san, false);
      }
      setPendingPromotion(null);
    },
    [pendingPromotion, applyMoveToState]
  );

  const onCancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  useEffect(() => {
    ws.setOnTriDMoveReceived((encoded) => {
      const decoded = decodeTriDMove(encoded);
      if (!decoded) return;
      const state = gameStateRef.current;
      if (decoded.kind === 'piece') {
        const result = applyPieceMove(
          state,
          decoded.from,
          decoded.to,
          decoded.promotion
        );
        if (result) applyMoveToState(result.nextState, result.move.san, true);
      } else {
        const result = applyBoardMove(
          state,
          decoded.boardId,
          decoded.toSlot,
          decoded.arrivalChoice
        );
        if (result) applyMoveToState(result.nextState, result.move.san, true);
      }
    });
    return () => ws.setOnTriDMoveReceived(null);
  }, [ws, ws.setOnTriDMoveReceived, applyMoveToState]);

  useEffect(() => {
    ws.setOnServerGameOver((result) => {
      setGameOver(true);
      setGameResult(result);
    });
    return () => ws.setOnServerGameOver(null);
  }, [ws, ws.setOnServerGameOver]);

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
      moves: moveSansRef.current,
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
      startingFen: ''
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
          console.error('Failed to save tri-d multiplayer game:', err)
        );
    save(payload);
  }, [
    ws.roomId,
    ws.myColor,
    ws.whiteUserId,
    ws.blackUserId,
    ws.timeControl,
    gameOver,
    gameResult
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
  }, [ws, ws.setOnClockSync]);

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

  const startGameFromFresh = useCallback(() => {
    const initialState = createInitialState();
    gameStateRef.current = initialState;
    moveSansRef.current = [];
    setGameState(initialState);
    setViewingIndex(0);
    setGameStarted(true);
    setGameOver(false);
    setGameResult(null);
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setInCheck(false);
    setHighlightedSquares(new Set());
    setHighlightedSlots(new Set());
    setSelected(null);
    setSelectedBoardId(null);
    setPendingBoardArrival(null);
    setPendingPromotion(null);
    setMoves([]);
    setBoardFlipped(false);
  }, [setBoardFlipped]);

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
        if (soundEnabled) playSound('game-start');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [ws, ws.status, ws.myColor, startGameFromFresh, soundEnabled]);

  useEffect(() => {
    if (ws.status === 'rejoined' && ws.myColor) {
      // Tri-D doesn't support move replay on rejoin (custom protocol)
      startGameFromFresh();
      ws.setPlaying();
      setMatchmakingOpen(false);
    }
  }, [ws, ws.status, ws.myColor, startGameFromFresh]);

  useEffect(() => {
    if (restoreAttemptedRef.current) return;
    if (typeof window === 'undefined') return;
    restoreAttemptedRef.current = true;
    const saved = loadSession();
    if (saved && saved.variant === VARIANT) {
      setMatchmakingOpen(false);
      ws.rejoin(saved.roomId, saved.rejoinToken);
      return;
    }
    setSessionRestorePending(false);
    if (!ws.isSecondaryTab) {
      setMatchmakingOpen(true);
      setAllowAutoMatchmakingOpen(true);
    }
    if (challengeId) {
      ws.joinChallenge(
        challengeId,
        session?.user?.name ?? undefined,
        session?.user?.image ?? undefined
      );
    }
  }, [challengeId, session?.user?.name, session?.user?.image, ws.isSecondaryTab, ws.joinChallenge, ws.rejoin]);

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
      allowAutoMatchmakingOpen &&
      loadSession() === null &&
      !ws.isSecondaryTab
    ) {
      setMatchmakingOpen(true);
    }
  }, [sessionRestorePending, ws.status, ws.isSecondaryTab, matchmakingOpen, allowAutoMatchmakingOpen]);

  useEffect(() => {
    if (matchmakingOpen && !ws.isSecondaryTab) ws.preConnect();
  }, [ws, matchmakingOpen, ws.isSecondaryTab]);

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
      setAllowAutoMatchmakingOpen(true);
    },
    [ws, session]
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
      setAllowAutoMatchmakingOpen(true);
    },
    [ws, session]
  );

  const handleFindNewGame = useCallback(() => {
    ws.disconnect();
    setAllowAutoMatchmakingOpen(true);
    const initialState = createInitialState();
    gameStateRef.current = initialState;
    moveSansRef.current = [];
    setGameState(initialState);
    setGameStarted(false);
    setGameOver(false);
    setGameResult(null);
    setMoves([]);
    setViewingIndex(0);
    setInCheck(false);
    setHighlightedSquares(new Set());
    setHighlightedSlots(new Set());
    setSelected(null);
    setSelectedBoardId(null);
    setPendingBoardArrival(null);
    setPendingPromotion(null);
    setMyRatingDelta(null);
    setOpponentRatingDelta(null);
    setMatchmakingOpen(true);
  }, [ws]);

  const handleResign = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('You resigned');
    setGameOver(true);
    ws.resign();
  }, [ws, soundEnabled]);

  const handleAbort = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Game Aborted');
    setGameOver(true);
    ws.abort();
  }, [ws, soundEnabled]);

  const handleOfferDraw = useCallback(() => ws.offerDraw(), [ws]);
  const handleAcceptDraw = useCallback(() => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Draw by agreement');
    setGameOver(true);
    ws.acceptDraw();
  }, [ws, soundEnabled]);
  const handleDeclineDraw = useCallback(() => ws.declineDraw(), [ws]);

  const goToStart = useCallback(() => {
    setViewingIndex(0);
    setGameState(
      gameStateRef.current.snapshots[0]
        ? {
            ...gameStateRef.current,
            pieces: gameStateRef.current.snapshots[0].pieces,
            slots: gameStateRef.current.snapshots[0].slots
          }
        : gameStateRef.current
    );
  }, []);
  const goToEnd = useCallback(() => {
    setViewingIndex(gameStateRef.current.snapshots.length - 1);
    setGameState(gameStateRef.current);
  }, []);
  const goToPrev = useCallback(() => {
    setViewingIndex((prev) => Math.max(0, prev - 1));
  }, []);
  const goToNext = useCallback(() => {
    setViewingIndex((prev) =>
      Math.min(prev + 1, gameStateRef.current.snapshots.length - 1)
    );
  }, []);
  const goToMove = useCallback((idx: number) => {
    setViewingIndex(
      Math.min(idx + 1, gameStateRef.current.snapshots.length - 1)
    );
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
          setAllowAutoMatchmakingOpen(false);
        }
      },
      status: ws.status,
      variantLabel: 'Tri-D Chess',
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
    gameState,
    gameStarted,
    gameOver,
    viewingIndex,
    inCheck,
    highlightedSquares,
    highlightedSlots,
    selected,
    selectedBoardId,
    pendingBoardArrival,
    pendingPromotion,
    whiteTimeSecs,
    blackTimeSecs,
    activeClock,
    serverOrientation,
    topPlayerInfo,
    bottomPlayerInfo,
    topPlayerExtras,
    bottomPlayerExtras,
    gameResult,
    overlays,
    multiplayerSidebarProps,
    isMyTurn,
    isActive,
    moves,
    positionHistory,
    turn: gameState.turn,
    onSquareClick,
    onAttackBoardClick,
    onSlotClick,
    onChooseBoardArrival,
    onCompletePromotion,
    onCancelPromotion,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove
  };
}
