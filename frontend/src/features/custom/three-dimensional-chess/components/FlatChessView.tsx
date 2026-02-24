'use client';
import Image from 'next/image';
import { useGameStore } from '../store/gameStore';
import type { Piece } from '../store/gameStore';
import { resolveBoardId } from '../utils/resolveBoardId';
import type { WorldSquare } from '../engine/world/types';

const LIGHT = '#DDE6F5';
const DARK = '#1E3D8F';
const SQ = 42; // px per square

type Level = 'white' | 'neutral' | 'black';
type Corner = 'top' | 'bottom';

function getPinMeta(instanceId: string): { level: Level; corner: Corner } {
  const match = instanceId.match(/^[QK]L(\d+):/);
  const pin = match ? parseInt(match[1]) : 1;
  const level: Level = pin <= 2 ? 'white' : pin <= 4 ? 'neutral' : 'black';
  // pins 1, 3, 5 → bottom corner; pins 2, 4, 6 → top corner
  const corner: Corner = pin % 2 === 1 ? 'bottom' : 'top';
  return { level, corner };
}

// ── Single square ────────────────────────────────────────────────────────────

function Sq({
  square,
  piece,
  isSelected,
  isHighlighted,
  isCastle
}: {
  square: WorldSquare;
  piece: Piece | undefined;
  isSelected: boolean;
  isHighlighted: boolean;
  isCastle: boolean;
}) {
  const selectSquare = useGameStore((s) => s.selectSquare);
  const isLight = square.color === 'light';

  let bg = isLight ? LIGHT : DARK;
  if (isSelected) bg = 'rgba(255,230,0,0.85)';
  else if (isCastle) bg = 'rgba(255,200,0,0.8)';
  else if (isHighlighted)
    bg = isLight ? 'rgba(60,200,80,0.55)' : 'rgba(60,200,80,0.45)';

  return (
    <div
      onClick={() => selectSquare(square.id)}
      style={{
        width: SQ,
        height: SQ,
        background: bg,
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {isHighlighted && !piece && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: SQ * 0.32,
              height: SQ * 0.32,
              borderRadius: '50%',
              background: 'rgba(60,200,80,0.7)'
            }}
          />
        </div>
      )}
      {piece && (
        <div style={{ position: 'absolute', inset: 3 }}>
          <Image
            src={`/pieces/${piece.color}-${piece.type}.svg`}
            alt={`${piece.color} ${piece.type}`}
            fill
            className='object-contain'
          />
        </div>
      )}
    </div>
  );
}

// ── Board grid ───────────────────────────────────────────────────────────────

function Board({
  boardId,
  cols,
  isAttack = false,
  attackBoardId
}: {
  boardId: string;
  cols: number;
  isAttack?: boolean;
  attackBoardId?: string;
}) {
  const world = useGameStore((s) => s.world);
  const pieces = useGameStore((s) => s.pieces);
  const selectedSquareId = useGameStore((s) => s.selectedSquareId);
  const highlightedSquareIds = useGameStore((s) => s.highlightedSquareIds);
  const castleDestinations = useGameStore((s) => s.castleDestinations);
  const selectedBoardId = useGameStore((s) => s.selectedBoardId);
  const selectBoard = useGameStore((s) => s.selectBoard);
  const attackBoardStates = useGameStore((s) => s.attackBoardStates);

  const board = world.boards.get(boardId);
  if (!board) return null;

  // Build (file,rank) → WorldSquare — avoids the short-vs-full boardId mismatch
  // (main boards store squares with short IDs 'W','N','B', not 'WL','NL','BL')
  const sqByPos = new Map<string, WorldSquare>();
  world.squares.forEach((sq) => {
    if (sq.boardId === boardId) sqByPos.set(`${sq.file},${sq.rank}`, sq);
  });

  // Piece lookup by the square's actual ID
  const pieceAt = new Map<string, Piece>();
  pieces.forEach((p) => {
    const level = resolveBoardId(p.level, attackBoardStates);
    // createSquareId equivalent inline to avoid import cycle risk
    const FILE_LETTERS = ['z', 'a', 'b', 'c', 'd', 'e'];
    const sqId = `${FILE_LETTERS[p.file] ?? p.file}${p.rank}${level}`;
    pieceAt.set(sqId, p);
  });

  const sortedFiles = [...board.files].sort((a, b) => a - b);
  const sortedRanks = [...board.ranks].sort((a, b) => b - a);

  const isSelectedBoard = isAttack && attackBoardId === selectedBoardId;

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cols}, ${SQ}px)`,
        border: isSelectedBoard
          ? '2px solid #f97316'
          : '1px solid rgba(120,120,160,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: isAttack ? 'pointer' : 'default'
      }}
      onClick={
        isAttack
          ? (e) => {
              e.stopPropagation();
              selectBoard(
                selectedBoardId === attackBoardId ? null : attackBoardId!
              );
            }
          : undefined
      }
    >
      {sortedRanks.flatMap((rank) =>
        sortedFiles.map((file) => {
          const sq = sqByPos.get(`${file},${rank}`);
          if (!sq) return null;
          return (
            <Sq
              key={sq.id}
              square={sq}
              piece={pieceAt.get(sq.id)}
              isSelected={sq.id === selectedSquareId}
              isHighlighted={highlightedSquareIds.includes(sq.id)}
              isCastle={castleDestinations.some((cd) => cd.squareId === sq.id)}
            />
          );
        })
      )}
    </div>
  );
}

// ── Attack board slot (label + 2×2 grid) ─────────────────────────────────────

function AttackSlot({ boardId }: { boardId: 'WQL' | 'WKL' | 'BQL' | 'BKL' }) {
  const attackBoardStates = useGameStore((s) => s.attackBoardStates);
  const selectedBoardId = useGameStore((s) => s.selectedBoardId);
  const selectBoard = useGameStore((s) => s.selectBoard);

  const instanceId = attackBoardStates?.[boardId]?.activeInstanceId;
  const label = { WQL: 'W-QL', WKL: 'W-KL', BQL: 'B-QL', BKL: 'B-KL' }[boardId];
  const isSelected = selectedBoardId === boardId;
  const isKL = boardId.endsWith('KL');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isKL ? 'flex-end' : 'flex-start',
        gap: 3
      }}
    >
      <button
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          padding: '1px 6px',
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          background: isSelected ? '#f97316' : 'rgba(120,120,160,0.15)',
          color: isSelected ? '#fff' : 'inherit'
        }}
        onClick={() => selectBoard(isSelected ? null : boardId)}
      >
        {label}
      </button>
      {instanceId ? (
        <Board boardId={instanceId} cols={2} isAttack attackBoardId={boardId} />
      ) : (
        <div style={{ width: SQ * 2, height: SQ * 2 }} />
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

const LEVELS: Array<{ label: string; mainBoardId: string; level: Level }> = [
  { label: 'Black', mainBoardId: 'BL', level: 'black' },
  { label: 'Neutral', mainBoardId: 'NL', level: 'neutral' },
  { label: 'White', mainBoardId: 'WL', level: 'white' }
];

const QL_BOARDS = ['WQL', 'BQL'] as const;
const KL_BOARDS = ['WKL', 'BKL'] as const;

export function FlatChessView() {
  const attackBoardStates = useGameStore((s) => s.attackBoardStates);

  const getBoardMeta = (boardKey: string) => {
    const instanceId = attackBoardStates?.[boardKey]?.activeInstanceId ?? '';
    return getPinMeta(instanceId);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }}
    >
      {LEVELS.map(({ label, mainBoardId, level }) => {
        const qlAtLevel = QL_BOARDS.filter(
          (b) => getBoardMeta(b).level === level
        );
        const klAtLevel = KL_BOARDS.filter(
          (b) => getBoardMeta(b).level === level
        );

        // Each side column is wide enough for one 2×2 board
        const sideW = SQ * 2 + 12;

        return (
          <div
            key={level}
            style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.5
              }}
            >
              {label} Level
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* QL side */}
              <div
                style={{
                  width: sideW,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  alignItems: 'flex-start'
                }}
              >
                {qlAtLevel.map((b) => (
                  <AttackSlot key={b} boardId={b} />
                ))}
              </div>

              {/* Main 4×4 board */}
              <Board boardId={mainBoardId} cols={4} />

              {/* KL side */}
              <div
                style={{
                  width: sideW,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  alignItems: 'flex-end'
                }}
              >
                {klAtLevel.map((b) => (
                  <AttackSlot key={b} boardId={b} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
