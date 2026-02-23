import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GAME_FOUR_PLAYER_KEY } from '@/lib/storage/keys';
import { hasGameStarted } from '@/lib/storage/lazyStorage';
import {
  FourPlayerGame,
  type Team,
  type PieceType,
  type MoveRecord
} from './engine';
import { playSound } from '@/features/game/utils/sounds';
import type { SoundType } from '@/features/game/utils/sounds';
import { TimeControl } from '@/features/game/types/rules';

// Tracks whether the store is currently being used by the multiplayer view.
// When true, no game state is read from or written to localStorage — the server
// is the source of truth for multiplayer games, so local persistence would only
// cause state pollution when switching back to the local game.
let fourPlayerIsMultiplayer = false;
export function setFourPlayerStorageMode(isMultiplayer: boolean): void {
  fourPlayerIsMultiplayer = isMultiplayer;
}
function createFourPlayerStorage() {
  return createJSONStorage(() => ({
    getItem: (name: string): string | null => {
      if (typeof localStorage === 'undefined') return null;
      if (fourPlayerIsMultiplayer) return null;
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (typeof localStorage === 'undefined') return;
      if (fourPlayerIsMultiplayer) return;
      try {
        const parsed = JSON.parse(value) as { state?: unknown };
        const s = parsed?.state as
          | { moves?: unknown[]; gameStarted?: boolean }
          | undefined;
        if (
          s &&
          hasGameStarted({ moves: s.moves, gameStarted: s.gameStarted })
        ) {
          localStorage.setItem(name, value);
        } else {
          localStorage.removeItem(name);
        }
      } catch {
        localStorage.removeItem(name);
      }
    },
    removeItem: (name: string): void => {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(name);
    }
  }));
}
const TEAM_ROTATIONS: Record<Team, number> = {
  r: 0,
  b: 270,
  y: 180,
  g: 90
};
const PIECE_VALUES: Record<PieceType, number> = {
  P: 1,
  N: 3,
  B: 5,
  R: 5,
  Q: 9,
  K: 0
};
interface TeamPoints {
  r: number;
  b: number;
  y: number;
  g: number;
}
interface TeamTimes {
  r: number | null;
  b: number | null;
  y: number | null;
  g: number | null;
}

export interface FourPlayerSyncSnapshot {
  moves: MoveRecord[];
  viewingMoveIndex: number;
  isGameOver: boolean;
  winner: Team | null;
  loseOrder: Team[];
  gameStarted: boolean;
  gameResult: string | null;
  points: TeamPoints;
  timeControl: TimeControl;
  teamTimes: TeamTimes;
  activeTimer: Team | null;
  lastActiveTimestamp: number | null;
  drawOfferedBy: Team | null;
  rematchOfferedBy: Team | null;
  rematchDeclined: boolean;
}
const DEFAULT_TIME_CONTROL: TimeControl = {
  mode: 'unlimited',
  minutes: 0,
  increment: 0
};
interface FourPlayerStore {
  game: FourPlayerGame;
  position: Record<
    string,
    {
      pieceType: string;
    }
  >;
  currentTeam: Team;
  orientation: number;
  gameId: number;
  selectedSquare: string | null;
  validMoves: string[];
  pendingPromotion: boolean;
  moves: MoveRecord[];
  viewingMoveIndex: number;
  isGameOver: boolean;
  winner: Team | null;
  loseOrder: Team[];
  gameStarted: boolean;
  gameResult: string | null;
  points: TeamPoints;
  hasHydrated: boolean;
  timeControl: TimeControl;
  teamTimes: TeamTimes;
  activeTimer: Team | null;
  lastActiveTimestamp: number | null;
  drawOfferedBy: Team | null;
  rematchOfferedBy: Team | null;
  rematchDeclined: boolean;
  autoRotateBoard: boolean;
  restrictedTeam: Team | null;
  selectSquare: (square: string) => void;
  movePiece: (from: string, to: string) => boolean;
  completePromotion: (piece: PieceType) => void;
  resetGame: () => void;
  startGame: () => void;
  abortGame: () => void;
  resignGame: (team: Team) => void;
  offerDraw: (team: Team) => void;
  acceptDraw: () => void;
  declineDraw: () => void;
  offerRematch: (team: Team) => void;
  acceptRematch: () => void;
  declineRematch: () => void;
  setOrientation: (degrees: number) => void;
  goToMove: (index: number) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  addPoints: (team: Team, points: number) => void;
  setTimeControl: (timeControl: TimeControl) => void;
  tickTimer: (team: Team) => void;
  switchTimer: (toTeam: Team) => void;
  stopTimer: () => void;
  onTimeout: (team: Team) => void;
  setAutoRotateBoard: (enabled: boolean) => void;
  setRestrictedTeam: (team: Team | null) => void;
  createSyncSnapshot: () => FourPlayerSyncSnapshot;
  applySyncSnapshot: (snapshot: FourPlayerSyncSnapshot) => void;
}
function syncFromGame(game: FourPlayerGame) {
  return {
    game,
    position: game.toPosition(),
    currentTeam: game.currentTeam,
    pendingPromotion: !!game.pendingPromotion,
    moves: [...game.moveHistory],
    viewingMoveIndex: game.moveHistory.length - 1,
    isGameOver: game.status === 'gameover',
    winner: game.winner,
    loseOrder: [...game.loseOrder]
  };
}
function reconstructGameAtMove(
  moves: MoveRecord[],
  moveIndex: number
): FourPlayerGame {
  const game = new FourPlayerGame();
  for (let i = 0; i <= moveIndex; i++) {
    const move = moves[i];
    if (move) {
      const success = game.playMove(move.from, move.to);
      if (success && game.pendingPromotion) {
        const promotionMatch = move.notation.match(/=([QRBN])/);
        if (promotionMatch) {
          const promotionPiece = promotionMatch[1] as PieceType;
          game.completePromotion(promotionPiece);
        }
      }
    }
  }
  return game;
}
function calculateInitialPoints(): TeamPoints {
  return { r: 0, b: 0, y: 0, g: 0 };
}
function initializeTeamTimers(timeControl: TimeControl): TeamTimes {
  if (timeControl.mode === 'unlimited') {
    return { r: null, b: null, y: null, g: null };
  }
  const timeInSeconds = timeControl.minutes * 60;
  return {
    r: timeInSeconds,
    b: timeInSeconds,
    y: timeInSeconds,
    g: timeInSeconds
  };
}
function hasTimer(timeControl: TimeControl): boolean {
  return timeControl.mode !== 'unlimited';
}
export const useFourPlayerStore = create<FourPlayerStore>()(
  persist(
    (set, get) => {
      const initialGame = new FourPlayerGame();
      return {
        ...syncFromGame(initialGame),
        orientation: 0,
        gameId: 0,
        selectedSquare: null,
        validMoves: [],
        gameStarted: false,
        gameResult: null,
        points: calculateInitialPoints(),
        hasHydrated: false,
        timeControl: DEFAULT_TIME_CONTROL,
        teamTimes: { r: null, b: null, y: null, g: null },
        activeTimer: null,
        lastActiveTimestamp: null,
        drawOfferedBy: null,
        rematchOfferedBy: null,
        rematchDeclined: false,
        autoRotateBoard: false,
        restrictedTeam: null,
        selectSquare: (square) => {
          const state = get();
          const { game } = state;
          if (
            state.restrictedTeam !== null &&
            game.currentTeam !== state.restrictedTeam
          ) {
            return;
          }
          if (state.selectedSquare && state.validMoves.includes(square)) {
            state.movePiece(state.selectedSquare, square);
            return;
          }
          const moves = game.getMovesForSquare(square);
          if (moves.length > 0) {
            set({ selectedSquare: square, validMoves: moves });
          } else {
            set({ selectedSquare: null, validMoves: [] });
          }
        },
        movePiece: (from, to) => {
          const {
            game,
            gameStarted,
            points,
            loseOrder: oldLoseOrder,
            timeControl,
            autoRotateBoard,
            restrictedTeam
          } = get();
          if (!gameStarted) return false;
          if (restrictedTeam !== null && game.currentTeam !== restrictedTeam) {
            return false;
          }
          const lastMoveIndex = game.moveHistory.length;
          const success = game.playMove(from, to);
          if (!success) return false;
          const lastMove = game.moveHistory[lastMoveIndex];
          const updatedPoints = { ...points };
          if (lastMove && lastMove.captured) {
            const capturedTeam = lastMove.captured.charAt(0) as Team;
            const wasCapturedTeamEliminated =
              oldLoseOrder.includes(capturedTeam);
            if (!wasCapturedTeamEliminated) {
              const capturedType = lastMove.captured.charAt(1) as PieceType;
              let pointValue = PIECE_VALUES[capturedType] || 0;
              if (capturedType === 'Q' && lastMove.promotedPiece) {
                pointValue = 1;
              }
              const capturingTeam = lastMove.team;
              updatedPoints[capturingTeam] =
                (updatedPoints[capturingTeam] || 0) + pointValue;
            }
          }
          if (lastMove?.checkedKings && lastMove.checkedKings.length >= 2) {
            const numKings = lastMove.checkedKings.length;
            const isQueen = lastMove.checkingPieceType === 'Q';
            let bonus = 0;
            if (isQueen) {
              bonus = numKings === 2 ? 1 : 5;
            } else {
              bonus = numKings === 2 ? 5 : 20;
            }
            updatedPoints[lastMove.team] =
              (updatedPoints[lastMove.team] || 0) + bonus;
          }
          const newLoseOrder = [...game.loseOrder];
          const newEliminations = newLoseOrder.filter(
            (t) => !oldLoseOrder.includes(t)
          );
          if (newEliminations.length > 0 && lastMove) {
            if (lastMove.isCheckmate) {
              updatedPoints[lastMove.team] =
                (updatedPoints[lastMove.team] || 0) + 20;
            } else if (lastMove.isStalemate) {
              const activeTeams = ['r', 'b', 'y', 'g'].filter(
                (t) => !newLoseOrder.includes(t as Team)
              ) as Team[];
              for (const team of activeTeams) {
                updatedPoints[team] = (updatedPoints[team] || 0) + 10;
              }
            }
          }
          const updatedState = {
            ...syncFromGame(game),
            selectedSquare: null,
            validMoves: [],
            points: updatedPoints,
            ...(autoRotateBoard
              ? { orientation: TEAM_ROTATIONS[game.currentTeam] }
              : {})
          };
          set(updatedState);
          const isCapture = !!(lastMove && lastMove.captured);
          const isCastle =
            lastMove?.notation === 'O-O' || lastMove?.notation === 'O-O-O';
          const isPromotion = lastMove?.notation.includes('=');
          let soundType: SoundType = 'move-self';
          if (isCastle) soundType = 'castle';
          else if (isPromotion) soundType = 'promote';
          else if (isCapture) soundType = 'capture';
          playSound(soundType);
          if (newEliminations.length > 0) {
            playSound('game-end');
          }
          if (hasTimer(timeControl)) {
            get().switchTimer(game.currentTeam);
          }
          return true;
        },
        completePromotion: (piece) => {
          const { game } = get();
          game.completePromotion(piece);
          set({
            ...syncFromGame(game),
            selectedSquare: null,
            validMoves: []
          });
        },
        resetGame: () => {
          const newGame = new FourPlayerGame();
          const state = get();
          const timers = initializeTeamTimers(state.timeControl);
          set({
            ...syncFromGame(newGame),
            selectedSquare: null,
            validMoves: [],
            gameId: state.gameId + 1,
            gameStarted: false,
            gameResult: null,
            points: calculateInitialPoints(),
            teamTimes: timers,
            activeTimer: null,
            lastActiveTimestamp: null,
            drawOfferedBy: null,
            rematchOfferedBy: null,
            rematchDeclined: false
          });
        },
        startGame: () => {
          const state = get();
          const shouldStartTimer = hasTimer(state.timeControl);
          set({
            gameStarted: true,
            gameResult: null,
            activeTimer: shouldStartTimer ? 'r' : null,
            lastActiveTimestamp: shouldStartTimer ? Date.now() : null,
            drawOfferedBy: null,
            rematchOfferedBy: null,
            rematchDeclined: false
          });
        },
        abortGame: () => {
          set({
            isGameOver: true,
            gameStarted: false,
            gameResult: 'Game Aborted',
            activeTimer: null,
            lastActiveTimestamp: null,
            drawOfferedBy: null,
            rematchOfferedBy: null,
            rematchDeclined: false
          });
        },
        resignGame: (team) => {
          set({
            isGameOver: true,
            gameStarted: false,
            gameResult: `${team.toUpperCase()} resigned`,
            activeTimer: null,
            lastActiveTimestamp: null,
            drawOfferedBy: null,
            rematchOfferedBy: null,
            rematchDeclined: false
          });
        },
        offerDraw: (team) => {
          set({ drawOfferedBy: team });
        },
        acceptDraw: () => {
          set({
            isGameOver: true,
            gameStarted: false,
            winner: null,
            gameResult: 'Draw by agreement',
            activeTimer: null,
            lastActiveTimestamp: null,
            drawOfferedBy: null,
            rematchOfferedBy: null,
            rematchDeclined: false
          });
        },
        declineDraw: () => {
          set({ drawOfferedBy: null });
        },
        offerRematch: (team) => {
          set({
            rematchOfferedBy: team,
            rematchDeclined: false
          });
        },
        acceptRematch: () => {
          const state = get();
          const newGame = new FourPlayerGame();
          const timers = initializeTeamTimers(state.timeControl);
          const shouldStartTimer = hasTimer(state.timeControl);
          set({
            ...syncFromGame(newGame),
            selectedSquare: null,
            validMoves: [],
            gameId: state.gameId + 1,
            gameStarted: true,
            gameResult: null,
            points: calculateInitialPoints(),
            teamTimes: timers,
            activeTimer: shouldStartTimer ? 'r' : null,
            lastActiveTimestamp: shouldStartTimer ? Date.now() : null,
            drawOfferedBy: null,
            rematchOfferedBy: null,
            rematchDeclined: false
          });
        },
        declineRematch: () => {
          set({
            rematchDeclined: true,
            rematchOfferedBy: null
          });
        },
        setOrientation: (degrees) => {
          set({ orientation: degrees });
        },
        goToMove: (index) => {
          const { moves } = get();
          if (index < -1 || index >= moves.length) return;
          if (index === -1) {
            const initialGame = new FourPlayerGame();
            set({
              viewingMoveIndex: -1,
              position: initialGame.toPosition(),
              currentTeam: initialGame.currentTeam
            });
          } else {
            const viewGame = reconstructGameAtMove(moves, index);
            set({
              viewingMoveIndex: index,
              position: viewGame.toPosition(),
              currentTeam: viewGame.currentTeam
            });
          }
        },
        goToStart: () => {
          const initialGame = new FourPlayerGame();
          set({
            viewingMoveIndex: -1,
            position: initialGame.toPosition(),
            currentTeam: initialGame.currentTeam
          });
        },
        goToEnd: () => {
          const { moves, game } = get();
          set({
            viewingMoveIndex: moves.length - 1,
            position: game.toPosition(),
            currentTeam: game.currentTeam
          });
        },
        goToPrev: () => {
          const { viewingMoveIndex, moves } = get();
          if (viewingMoveIndex > -1) {
            const newIndex = viewingMoveIndex - 1;
            if (newIndex === -1) {
              const initialGame = new FourPlayerGame();
              set({
                viewingMoveIndex: -1,
                position: initialGame.toPosition(),
                currentTeam: initialGame.currentTeam
              });
            } else {
              const viewGame = reconstructGameAtMove(moves, newIndex);
              set({
                viewingMoveIndex: newIndex,
                position: viewGame.toPosition(),
                currentTeam: viewGame.currentTeam
              });
            }
          }
        },
        goToNext: () => {
          const { viewingMoveIndex, moves, game } = get();
          if (viewingMoveIndex < moves.length - 1) {
            const newIndex = viewingMoveIndex + 1;
            if (newIndex === moves.length - 1) {
              set({
                viewingMoveIndex: newIndex,
                position: game.toPosition(),
                currentTeam: game.currentTeam
              });
            } else {
              const viewGame = reconstructGameAtMove(moves, newIndex);
              set({
                viewingMoveIndex: newIndex,
                position: viewGame.toPosition(),
                currentTeam: viewGame.currentTeam
              });
            }
          }
        },
        addPoints: (team, pointValue) => {
          set((state) => ({
            points: {
              ...state.points,
              [team]: state.points[team] + pointValue
            }
          }));
        },
        setTimeControl: (timeControl) => {
          const timers = initializeTeamTimers(timeControl);
          set({ timeControl, teamTimes: timers });
        },
        tickTimer: (team) =>
          set((state) => {
            if (state.activeTimer !== team || state.isGameOver) return {};
            const currentTime = state.teamTimes[team];
            if (currentTime === null || currentTime <= 0) return {};
            return {
              teamTimes: {
                ...state.teamTimes,
                [team]: currentTime - 1
              },
              lastActiveTimestamp: Date.now()
            };
          }),
        switchTimer: (toTeam) =>
          set((state) => {
            if (state.isGameOver || state.timeControl.mode === 'unlimited')
              return {};
            const movedTeam = state.currentTeam;
            const currentTime = state.teamTimes[movedTeam];
            const increment = state.timeControl.increment || 0;
            const newTime =
              currentTime !== null ? currentTime + increment : null;
            return {
              activeTimer: toTeam,
              teamTimes: {
                ...state.teamTimes,
                [movedTeam]: newTime
              },
              lastActiveTimestamp: Date.now()
            };
          }),
        stopTimer: () => set({ activeTimer: null, lastActiveTimestamp: null }),
        onTimeout: (team) => {
          set({
            isGameOver: true,
            gameResult: `${team.toUpperCase()} ran out of time!`,
            activeTimer: null,
            lastActiveTimestamp: null
          });
        },
        setAutoRotateBoard: (enabled) => set({ autoRotateBoard: enabled }),
        setRestrictedTeam: (team) => set({ restrictedTeam: team }),
        createSyncSnapshot: () => {
          const state = get();
          return {
            moves: [...state.moves],
            viewingMoveIndex: state.viewingMoveIndex,
            isGameOver: state.isGameOver,
            winner: state.winner,
            loseOrder: [...state.loseOrder],
            gameStarted: state.gameStarted,
            gameResult: state.gameResult,
            points: { ...state.points },
            timeControl: state.timeControl,
            teamTimes: { ...state.teamTimes },
            activeTimer: state.activeTimer,
            lastActiveTimestamp: state.lastActiveTimestamp,
            drawOfferedBy: state.drawOfferedBy,
            rematchOfferedBy: state.rematchOfferedBy,
            rematchDeclined: state.rematchDeclined
          };
        },
        applySyncSnapshot: (snapshot) => {
          const newGame = new FourPlayerGame();
          for (const move of snapshot.moves) {
            const success = newGame.playMove(move.from, move.to);
            if (success && newGame.pendingPromotion) {
              const promotionMatch = move.notation.match(/=([QRBN])/);
              if (promotionMatch) {
                const promotionPiece = promotionMatch[1] as PieceType;
                newGame.completePromotion(promotionPiece);
              }
            }
          }
          set((state) => ({
            game: newGame,
            position: newGame.toPosition(),
            currentTeam: newGame.currentTeam,
            pendingPromotion: !!newGame.pendingPromotion,
            moves: [...snapshot.moves],
            viewingMoveIndex: snapshot.viewingMoveIndex,
            isGameOver: snapshot.isGameOver,
            winner: snapshot.winner,
            loseOrder: [...snapshot.loseOrder],
            gameStarted: snapshot.gameStarted,
            gameResult: snapshot.gameResult,
            points: { ...snapshot.points },
            timeControl: snapshot.timeControl,
            teamTimes: { ...snapshot.teamTimes },
            activeTimer: snapshot.activeTimer,
            lastActiveTimestamp: snapshot.lastActiveTimestamp,
            drawOfferedBy: snapshot.drawOfferedBy ?? null,
            rematchOfferedBy: snapshot.rematchOfferedBy ?? null,
            rematchDeclined: snapshot.rematchDeclined ?? false,
            selectedSquare: null,
            validMoves: [],
            restrictedTeam: state.restrictedTeam
          }));
        }
      };
    },
    {
      name: GAME_FOUR_PLAYER_KEY,
      storage: createFourPlayerStorage(),
      partialize: (state) => ({
        moves: state.moves,
        viewingMoveIndex: state.viewingMoveIndex,
        isGameOver: state.isGameOver,
        winner: state.winner,
        loseOrder: state.loseOrder,
        orientation: state.orientation,
        gameStarted: state.gameStarted,
        gameResult: state.gameResult,
        points: state.points,
        timeControl: state.timeControl,
        teamTimes: state.teamTimes,
        activeTimer: state.activeTimer,
        lastActiveTimestamp: state.lastActiveTimestamp,
        drawOfferedBy: state.drawOfferedBy,
        rematchOfferedBy: state.rematchOfferedBy,
        rematchDeclined: state.rematchDeclined,
        autoRotateBoard: state.autoRotateBoard
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.moves && state.moves.length > 0) {
            const newGame = new FourPlayerGame();
            for (const move of state.moves) {
              const success = newGame.playMove(move.from, move.to);
              if (success && newGame.pendingPromotion) {
                const promotionMatch = move.notation.match(/=([QRBN])/);
                if (promotionMatch) {
                  const promotionPiece = promotionMatch[1] as PieceType;
                  newGame.completePromotion(promotionPiece);
                }
              }
            }
            state.game = newGame;
            state.position = newGame.toPosition();
            state.currentTeam = newGame.currentTeam;
            state.pendingPromotion = !!newGame.pendingPromotion;
            state.winner = newGame.winner;
            state.loseOrder = [...newGame.loseOrder];
          }
          if (
            state.activeTimer &&
            state.lastActiveTimestamp &&
            !state.isGameOver &&
            state.timeControl &&
            state.timeControl.mode !== 'unlimited'
          ) {
            const elapsedMs = Date.now() - state.lastActiveTimestamp;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);
            if (elapsedSeconds > 0 && state.teamTimes) {
              const currentTime = state.teamTimes[state.activeTimer];
              if (currentTime !== null) {
                state.teamTimes[state.activeTimer] = Math.max(
                  0,
                  currentTime - elapsedSeconds
                );
              }
            }
            state.lastActiveTimestamp = Date.now();
          }
          state.hasHydrated = true;
        }
      }
    }
  )
);
export { TEAM_ROTATIONS, PIECE_VALUES };
