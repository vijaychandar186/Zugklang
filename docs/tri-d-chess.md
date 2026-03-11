# Tri-D Chess Rules

Tri-D Chess is a three-dimensional chess variant inspired by *Star Trek*. It is played on a stack of seven boards — three fixed 4×4 boards and four movable 2×2 **attack boards**. On each turn a player either moves a piece or repositions one of their attack boards.

---

## The Boards

```
          ┌──────┐  ┌──────┐
          │  BA1 │  │  BA2 │   ← Black attack boards (2×2)
   ┌──────┼──────┴──┴──────┼──────┐
   │ L4   │                │  R4  │
   │ L3   │      BH        │  R3  │  ← Black Home (4×4, fixed)
   │ L2   │                │  R2  │
   │ L1   │                │  R1  │
   └──────┼────────────────┼──────┘
          │                │
          │       N        │         ← Neutral (4×4, fixed)
          │                │
   ┌──────┼────────────────┼──────┐
   │      │                │      │
   │      │      WH        │      │  ← White Home (4×4, fixed)
   │      │                │      │
   └──────┼──────┬──┬──────┼──────┘
          │  WA1 │  │  WA2 │   ← White attack boards (2×2)
          └──────┘  └──────┘
```

**Fixed boards** (4×4, immovable):
- **WH** — White Home
- **N** — Neutral
- **BH** — Black Home

**Attack boards** (2×2, movable):
- **WA1, WA2** — White's two attack boards
- **BA1, BA2** — Black's two attack boards

---

## Attack Board Slots

Each attack board sits in a numbered **slot** along one side of the structure. There are 8 slots (4 left, 4 right):

| Level | Left slot | Right slot |
|-------|-----------|------------|
| 4 (top)   | L4 | R4 |
| 3         | L3 | R3 |
| 2         | L2 | R2 |
| 1 (bottom)| L1 | R1 |

**Starting positions:**

| Board | Starting slot |
|-------|--------------|
| WA1   | L1           |
| WA2   | R1           |
| BA1   | L4           |
| BA2   | R4           |

---

## Initial Piece Placement

### White

| Board | Squares | Pieces |
|-------|---------|--------|
| WA1   | back row | R, Q  |
| WA1   | front row | P, P |
| WH    | back row | N, B, B, N |
| WH    | front row | P, P, P, P |
| WA2   | back row | K, R  |
| WA2   | front row | P, P |

### Black

| Board | Squares | Pieces |
|-------|---------|--------|
| BA1   | front row | P, P |
| BA1   | back row | R, Q  |
| BH    | front row | P, P, P, P |
| BH    | back row | N, B, B, N |
| BA2   | front row | P, P |
| BA2   | back row | K, R  |

---

## How Pieces Move

Pieces move through **global space** — a piece on one board can reach squares on another board if the geometry lines up. All boards share the same 8×8 coordinate grid; a piece simply moves along that grid regardless of which physical board it is on.

| Piece | Movement |
|-------|----------|
| **King** | One square in any direction |
| **Queen** | Any number of squares in any direction (sliding) |
| **Rook** | Any number of squares horizontally or vertically |
| **Bishop** | Any number of squares diagonally |
| **Knight** | L-shape (2+1) — jumps over other pieces |
| **Pawn** | Advances one square toward the opponent's home; captures diagonally one square; may advance two squares on its first move |

Sliding pieces are **blocked** by any intervening piece on any board along their path. Knights are never blocked.

### Pawn rules

- A pawn that has **never moved** may advance two squares.
- Captures diagonally one square forward.
- **En passant**: If a pawn uses its double-step advance, the opponent may capture it on the square it passed through, on the very next move.
- **Promotion**: A pawn that reaches the far end of the global board (y=7 for white, y=0 for black) must immediately promote to Queen, Rook, Bishop, or Knight.
- A pawn carried by a moving attack board gains the `hasMoved` flag and loses its two-square option.

---

## Moving an Attack Board

Instead of moving a piece, a player may **reposition one of their attack boards**.

### Which boards can you move?

- White moves `WA1` or `WA2`; black moves `BA1` or `BA2`.
- If a single enemy piece is on one of your attack boards, that piece **controls** the board and its owner moves it instead.
- A board with **two or more pieces** cannot be moved at all.

### Where can it go?

An attack board may move to any **adjacent slot** — adjacent means directly next to the current slot (including across the same level to the other side). Each slot is adjacent to 3 or 4 others.

### Restrictions when the board carries a piece

- The board may not move **backward** (white boards cannot go to a lower-numbered slot; black boards cannot go to a higher-numbered slot).
- The square that the carried piece will land on (in global coordinates) must be **empty** on all overlapping boards (knights are exempt from blocking).
- The move must not leave your own king in check.

### Arrival choice

When a board carries **exactly one piece** to a new slot, the moving player chooses how it lands:

- **Identity** — the piece stays at its same local position on the board.
- **Rotate 180°** — the piece is placed at the opposite corner of the board.

Both possible landing squares are highlighted; click the one you want.

---

## Castling

Castling in Tri-D Chess follows the **Meder rules** and works differently from standard chess. The king moves to the rook (or vice versa) rather than jumping over it.

### Requirements (both types)

- The king must **not have moved** and must **not be in check**.
- The rook must **not have moved**.
- The king must not land on or pass through a square attacked by the opponent.

### Kingside castling (`0-0`)

- King and an unmoved rook are on the **same attack board**.
- They swap positions.

### Queenside castling (`0-0-0`)

- King is at the **back rank** of its attack board (row closest to the main boards: row 0 for white, row 1 for black).
- An unmoved rook exists on the **paired attack board** (WA1↔WA2 or BA1↔BA2) at the same back rank.
- The row of the main fixed boards (columns 2–5 globally) at the king's level must be **completely clear**.
- The king moves to the rook's square.

---

## Check, Checkmate, and Stalemate

- **Check** — the active player's king is attacked by an opponent piece. A player may not make a move that leaves or places their own king in check.
- **Checkmate** — the active player is in check and has no legal move (piece or board) that removes it. The player in check loses.
- **Stalemate** — the active player is **not** in check but has no legal moves. The game is a draw.

---

## Winning and Drawing

| Outcome | Condition |
|---------|-----------|
| Win by checkmate | Opponent's king has no legal escape |
| Win by flag | Opponent's clock reaches zero (timed games) |
| Win by king capture | If the king is taken directly (variant rule in this implementation) |
| Draw by stalemate | No legal moves, king not in check |

---

## Notation

Moves are written using extended algebraic notation:

**Piece moves**: `[piece][from board][from file][from rank][separator][to board][to file][to rank][promotion]`

- Board names: `WH`, `N`, `BH`, `WA1`, `WA2`, `BA1`, `BA2`
- Files: `a`–`d` (left to right)
- Ranks: `1`–`4` (bottom to top; `1`–`2` for attack boards)
- Separator: `-` (quiet move) or `x` (capture)
- Promotion: `=Q`, `=R`, etc.
- En passant: append `e.p.`

**Castling**: `0-0` (kingside) or `0-0-0` (queenside)

**Attack board moves**: `[BOARD]→[slot]`, e.g. `WA2→R2` or `BA1→L3`
