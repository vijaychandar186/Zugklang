import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess, type ChessJSMove } from '@/lib/chess';
import { STARTING_FEN } from '@/features/chess/config/constants';
import { GAME_CARD_CHESS_KEY } from '@/lib/storage/keys';
import { createLazyStorage, hasGameStarted } from '@/lib/storage/lazyStorage';
import { TimeControl } from '@/features/game/types/rules';

// Card ranks in a standard deck
export type CardRank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';
export type CardSuit = 'H' | 'D' | 'C' | 'S'; // Hearts, Diamonds, Clubs, Spades

export interface PlayingCard {
  rank: CardRank;
  suit: CardSuit;
}

export type CardPiece = 'k' | 'q' | 'b' | 'n' | 'r' | 'p';
export type PawnFile = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export const CARD_TO_PIECE: Record<
  CardRank,
  { type: CardPiece; file?: PawnFile }
> = {
  '2': { type: 'p', file: 'a' },
  '3': { type: 'p', file: 'b' },
  '4': { type: 'p', file: 'c' },
  '5': { type: 'p', file: 'd' },
  '6': { type: 'p', file: 'e' },
  '7': { type: 'p', file: 'f' },
  '8': { type: 'p', file: 'g' },
  '9': { type: 'p', file: 'h' },
  '10': { type: 'n' },
  J: { type: 'b' },
  Q: { type: 'q' },
  K: { type: 'k' },
  A: { type: 'r' }
};

export const PIECE_NAMES: Record<CardPiece, string> = {
  k: 'King',
  q: 'Queen',
  b: 'Bishop',
  n: 'Knight',
  r: 'Rook',
  p: 'Pawn'
};

export interface CardResult {
  card: PlayingCard;
  hasValidMoves: boolean;
  pieceName: string; // e.g. "a-Pawn", "Knight", "Queen"
}

// Create a full 52-card deck
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

// Shuffle a deck using Fisher-Yates algorithm
function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
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
  const moves = game.moves({ verbose: true }) as ChessJSMove[];

  // For pawns, check specific file
  if (mapping.type === 'p' && mapping.file) {
    return moves.some((m) => m.piece === 'p' && m.from[0] === mapping.file);
  }

  // For other pieces, just check piece type
  return moves.some((m) => m.piece === mapping.type);
}

function getGameResult(game: Chess): string | null {
  if (game.isCheckmate()) {
    const winner = game.turn() === 'w' ? 'Black' : 'White';
    return `${winner} wins by checkmate`;
  }
  if (game.isStalemate()) return 'Draw by stalemate';
  if (game.isDraw()) return 'Draw';
  if (game.isInsufficientMaterial()) return 'Draw — insufficient material';
  return null;
}

interface CardChessStore {
  // Game state
  game: Chess;
  currentFEN: string;
  turn: 'w' | 'b';
  moves: string[];
  positionHistory: string[];
  viewingIndex: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameResult: string | null;
  hasHydrated: boolean;

  // Timer state
  timeControl: TimeControl;
  whiteTime: number | null;
  blackTime: number | null;
  activeTimer: 'white' | 'black' | null;
  lastActiveTimestamp: number | null;

  // Card state
  deck: PlayingCard[];
  discardPile: PlayingCard[];
  drawnCard: CardResult | null;
  isDrawing: boolean;
  needsDraw: boolean;
  drawCount: number; // Track draws in current turn (for check limit)
  highlightedSquares: Record<string, import('react').CSSProperties>;

  // Game actions
  makeMove: (
    from: string,
    to: string,
    promotion?: string
  ) => ChessJSMove | null;
  startNewGame: (timeControl?: TimeControl) => void;
  reset: () => void;
  setGameStarted: (started: boolean) => void;
  setGameOver: (over: boolean) => void;
  setGameResult: (result: string | null) => void;

  // Card actions
  drawCard: (turnColor: 'w' | 'b') => void;
  setNeedsDraw: (needs: boolean) => void;

  // Navigation
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToMove: (index: number) => void;
  calculateHighlights: () => void;
}

export const useCardChessStore = create<CardChessStore>()(
  persist(
    (set, get) => ({
      // Initial state
      game: new Chess(),
      currentFEN: STARTING_FEN,
      turn: 'w',
      moves: [],
      positionHistory: [STARTING_FEN],
      viewingIndex: 0,
      gameStarted: false,
      gameOver: false,
      gameResult: null,
      hasHydrated: false,

      // Timer state
      timeControl: { mode: 'unlimited', minutes: 0, increment: 0 },
      whiteTime: null,
      blackTime: null,
      activeTimer: null,
      lastActiveTimestamp: null,

      deck: shuffleDeck(createDeck()),
      discardPile: [],
      drawnCard: null,
      isDrawing: false,
      needsDraw: true,
      drawCount: 0,
      highlightedSquares: {},

      // ── Game actions ───────────────────────────────────────────────────

      makeMove: (from, to, promotion) => {
        const {
          game,
          drawnCard,
          needsDraw,
          isDrawing,
          gameOver,
          moves,
          positionHistory,
          viewingIndex,
          timeControl,
          whiteTime,
          blackTime,
          discardPile
        } = get();
        if (gameOver || needsDraw || isDrawing) return null;

        // Get the piece at the source square
        const piece = game.get(from);
        if (!piece) return null;

        // Validate against drawn card
        if (drawnCard) {
          const mapping = CARD_TO_PIECE[drawnCard.card.rank];
          const pieceType = piece.type as CardPiece;

          // For pawns, must match both piece type and file
          if (mapping.type === 'p' && mapping.file) {
            const fromFile = from[0] as PawnFile;
            if (pieceType !== 'p' || fromFile !== mapping.file) {
              return null;
            }
          } else {
            // For other pieces, just match piece type
            if (pieceType !== mapping.type) {
              return null;
            }
          }

          // Must have valid moves
          if (!drawnCard.hasValidMoves) return null;
        }

        // Try to make the move
        const move = game.move({ from, to, promotion });
        if (!move) return null;

        const newFEN = game.fen();
        const newHistory = [
          ...positionHistory.slice(0, viewingIndex + 1),
          newFEN
        ];

        // Check game over
        const isOver = game.isGameOver();
        const result = isOver ? getGameResult(game) : null;

        // Handle timers
        const playerWhoMoved = move.color === 'w' ? 'white' : 'black';
        const nextPlayer = playerWhoMoved === 'white' ? 'black' : 'white';
        let newWhiteTime = whiteTime;
        let newBlackTime = blackTime;
        let newActiveTimer: 'white' | 'black' | null = null;

        if (timeControl.mode === 'timed' && !isOver) {
          // Add increment to the player who just moved
          const increment = timeControl.increment;
          if (playerWhoMoved === 'white' && whiteTime !== null) {
            newWhiteTime = whiteTime + increment;
          } else if (playerWhoMoved === 'black' && blackTime !== null) {
            newBlackTime = blackTime + increment;
          }
          // Set active timer to next player
          newActiveTimer = nextPlayer;
        }

        // Add card to discard pile
        const newDiscardPile = drawnCard
          ? [...discardPile, drawnCard.card]
          : discardPile;

        set({
          currentFEN: newFEN,
          turn: game.turn(),
          moves: [...moves, move.san],
          positionHistory: newHistory,
          viewingIndex: newHistory.length - 1,
          drawnCard: null,
          needsDraw: !isOver,
          drawCount: 0,
          highlightedSquares: {},
          gameOver: isOver,
          gameResult: result,
          whiteTime: newWhiteTime,
          blackTime: newBlackTime,
          activeTimer: newActiveTimer,
          lastActiveTimestamp: newActiveTimer ? Date.now() : null,
          discardPile: newDiscardPile
        });

        return move;
      },

      calculateHighlights: () => {
        const { game, drawnCard } = get();
        if (!drawnCard || !drawnCard.hasValidMoves) {
          set({ highlightedSquares: {} });
          return;
        }

        const mapping = CARD_TO_PIECE[drawnCard.card.rank];
        const squares: Record<string, import('react').CSSProperties> = {};

        // Iterate board to find pieces matching the drawn card
        const board = game.board();
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece || piece.color !== game.turn()) continue;

            const square = String.fromCharCode(97 + c) + (8 - r);

            // For pawns, must match file
            if (mapping.type === 'p' && mapping.file) {
              if (piece.type === 'p' && square[0] === mapping.file) {
                squares[square] = {
                  boxShadow: 'inset 0 0 0 3px rgba(59, 130, 246, 0.5)',
                  borderRadius: '4px'
                };
              }
            } else {
              // For other pieces, just match type
              if (piece.type === mapping.type) {
                squares[square] = {
                  boxShadow: 'inset 0 0 0 3px rgba(59, 130, 246, 0.5)',
                  borderRadius: '4px'
                };
              }
            }
          }
        }

        set({ highlightedSquares: squares });
      },

      startNewGame: (timeControl) => {
        const newGame = new Chess();
        const tc = timeControl || {
          mode: 'unlimited',
          minutes: 0,
          increment: 0
        };
        const whiteTime = tc.mode === 'timed' ? tc.minutes * 60 : null;
        const blackTime = tc.mode === 'timed' ? tc.minutes * 60 : null;
        const activeTimer = tc.mode === 'timed' ? 'white' : null;
        const lastActiveTimestamp = tc.mode === 'timed' ? Date.now() : null;

        set({
          game: newGame,
          currentFEN: STARTING_FEN,
          turn: 'w',
          moves: [],
          positionHistory: [STARTING_FEN],
          viewingIndex: 0,
          gameStarted: true,
          gameOver: false,
          gameResult: null,
          deck: shuffleDeck(createDeck()),
          discardPile: [],
          drawnCard: null,
          isDrawing: false,
          needsDraw: true,
          drawCount: 0,
          timeControl: tc,
          whiteTime,
          blackTime,
          activeTimer,
          lastActiveTimestamp
        });
      },

      reset: () => {
        set({
          drawnCard: null,
          isDrawing: false,
          needsDraw: true,
          drawCount: 0
        });
      },

      setGameStarted: (started) => set({ gameStarted: started }),
      setGameOver: (over) => set({ gameOver: over }),
      setGameResult: (result) => set({ gameResult: result }),

      // ── Card actions ───────────────────────────────────────────────────

      drawCard: (_turnColor) => {
        const { game, deck, discardPile, drawCount } = get();
        const isInCheck = game.isCheck();

        set({ isDrawing: true });

        // Simulate card drawing animation delay
        setTimeout(() => {
          let currentDeck = deck;
          let currentDiscardPile = discardPile;

          // Reshuffle if deck is empty
          if (currentDeck.length === 0) {
            currentDeck = shuffleDeck([...discardPile]);
            currentDiscardPile = [];
          }

          // Draw a card
          const drawnCardFromDeck = currentDeck[0];
          const remainingDeck = currentDeck.slice(1);

          const hasValidMoves = checkCardHasValidMoves(game, drawnCardFromDeck);
          const pieceName = getPieceName(drawnCardFromDeck);

          const cardResult: CardResult = {
            card: drawnCardFromDeck,
            hasValidMoves,
            pieceName
          };

          const newDrawCount = drawCount + 1;

          // Calculate highlights for the drawn card
          const highlightedSquares: Record<
            string,
            import('react').CSSProperties
          > = {};
          if (hasValidMoves) {
            const mapping = CARD_TO_PIECE[drawnCardFromDeck.rank];
            const board = game.board();

            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (!piece || piece.color !== game.turn()) continue;

                const square = String.fromCharCode(97 + c) + (8 - r);

                // For pawns, must match file
                if (mapping.type === 'p' && mapping.file) {
                  if (piece.type === 'p' && square[0] === mapping.file) {
                    highlightedSquares[square] = {
                      boxShadow: 'inset 0 0 0 3px rgba(59, 130, 246, 0.5)',
                      borderRadius: '4px'
                    };
                  }
                } else {
                  // For other pieces, just match type
                  if (piece.type === mapping.type) {
                    highlightedSquares[square] = {
                      boxShadow: 'inset 0 0 0 3px rgba(59, 130, 246, 0.5)',
                      borderRadius: '4px'
                    };
                  }
                }
              }
            }
          }

          set({
            deck: remainingDeck,
            discardPile: currentDiscardPile,
            drawnCard: cardResult,
            isDrawing: false,
            needsDraw: false,
            drawCount: newDrawCount,
            highlightedSquares
          });

          // Auto re-draw logic
          if (!hasValidMoves) {
            if (isInCheck) {
              // In check: limit to 5 draws total
              if (newDrawCount >= 5) {
                // Player loses
                const loser = game.turn();
                const winner = loser === 'w' ? 'Black' : 'White';
                set({
                  gameOver: true,
                  gameResult: `${winner} wins — ${loser === 'w' ? 'White' : 'Black'} cannot escape check after 5 draws`
                });
              } else {
                // Draw another card
                setTimeout(() => {
                  get().drawCard(_turnColor);
                }, 1200);
              }
            } else {
              // Not in check: auto re-draw (doesn't count towards limit)
              setTimeout(() => {
                get().drawCard(_turnColor);
              }, 1200);
            }
          }
        }, 600);
      },

      setNeedsDraw: (needs) => set({ needsDraw: needs }),

      // ── Navigation ─────────────────────────────────────────────────────

      goToStart: () => {
        const { positionHistory } = get();
        set({ viewingIndex: 0, currentFEN: positionHistory[0] });
      },

      goToEnd: () => {
        const { positionHistory } = get();
        const last = positionHistory.length - 1;
        set({ viewingIndex: last, currentFEN: positionHistory[last] });
      },

      goToPrev: () => {
        const { viewingIndex, positionHistory } = get();
        if (viewingIndex > 0) {
          const idx = viewingIndex - 1;
          set({ viewingIndex: idx, currentFEN: positionHistory[idx] });
        }
      },

      goToNext: () => {
        const { viewingIndex, positionHistory } = get();
        if (viewingIndex < positionHistory.length - 1) {
          const idx = viewingIndex + 1;
          set({ viewingIndex: idx, currentFEN: positionHistory[idx] });
        }
      },

      goToMove: (index) => {
        const { positionHistory } = get();
        const posIdx = Math.min(index + 1, positionHistory.length - 1);
        set({ viewingIndex: posIdx, currentFEN: positionHistory[posIdx] });
      }
    }),
    {
      name: GAME_CARD_CHESS_KEY,
      storage: createLazyStorage((state: unknown) => {
        const s = state as { moves?: unknown[]; gameStarted?: boolean };
        return hasGameStarted({
          moves: s.moves,
          gameStarted: s.gameStarted
        });
      }),
      partialize: (state) => ({
        currentFEN: state.currentFEN,
        turn: state.turn,
        moves: state.moves,
        positionHistory: state.positionHistory,
        viewingIndex: state.viewingIndex,
        gameStarted: state.gameStarted,
        gameOver: state.gameOver,
        gameResult: state.gameResult,
        timeControl: state.timeControl,
        whiteTime: state.whiteTime,
        blackTime: state.blackTime,
        activeTimer: state.activeTimer,
        lastActiveTimestamp: state.lastActiveTimestamp,
        deck: state.deck,
        discardPile: state.discardPile
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            const fen = state.currentFEN || STARTING_FEN;
            state.game = new Chess(fen);
          } catch {
            state.game = new Chess();
            state.currentFEN = STARTING_FEN;
          }
          state.turn = state.game.turn();

          // Handle timer state on reload
          if (
            state.activeTimer &&
            state.lastActiveTimestamp &&
            !state.gameOver
          ) {
            const now = Date.now();
            const elapsedSeconds = Math.floor(
              (now - state.lastActiveTimestamp) / 1000
            );

            if (state.activeTimer === 'white' && state.whiteTime !== null) {
              state.whiteTime = Math.max(0, state.whiteTime - elapsedSeconds);
              if (state.whiteTime === 0) {
                state.gameOver = true;
                state.gameResult = 'Black wins on time';
                state.activeTimer = null;
              }
            } else if (
              state.activeTimer === 'black' &&
              state.blackTime !== null
            ) {
              state.blackTime = Math.max(0, state.blackTime - elapsedSeconds);
              if (state.blackTime === 0) {
                state.gameOver = true;
                state.gameResult = 'White wins on time';
                state.activeTimer = null;
              }
            }

            // Update timestamp to now for continued countdown
            if (!state.gameOver) {
              state.lastActiveTimestamp = now;
            }
          }

          state.hasHydrated = true;
        }
      }
    }
  )
);
