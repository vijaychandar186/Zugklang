# Zugklang

> Where Strategy Meets Symphony

Play standard chess and 9 variants against Stockfish and Fairy-Stockfish, plus custom modes like 4-Player, Dice, and Card Chess (local + multiplayer). Solve puzzles, explore openings, review games, and train board vision with immersive audio and premium aesthetics.

---

## Features

### Chess Engines

- **Stockfish 18** — One of the strongest chess engines in the world, running fully in-browser via WebAssembly
- **Fairy-Stockfish** — Extended engine for chess variants, also WASM-powered with no server calls
- **Probabilistic AI** — Gaussian distribution difficulty curve for human-like, unpredictable opponents; adjustable from beginner to grandmaster

### Play Modes

#### vs Computer

Play any of 10 variants against the engine:

- Standard Chess
- Fischer Random (Chess960)
- Atomic Chess
- Racing Kings
- Horde Chess
- Three-Check
- Antichess
- King of the Hill
- Crazyhouse
- Chess with Checkers

#### Local Multiplayer

Same-device play across all 10 variants above.

#### Online Multiplayer

Real-time WebSocket-based online play:

- Instant matchmaking queue
- Challenge links (play with a friend)
- Account-backed sessions with secure WebSocket tokens
- Draw offer / decline
- Rematch system
- Latency monitoring
- Opponent disconnect & reconnect handling
- Rejoin after page refresh
- Supports all 10 standard variants

#### Custom Multiplayer

Real-time custom mode matchmaking/lobbies:

- **Four-Player Chess** — 4-seat lobby with leader controls (start, shuffle colors, assign teams)
- **Dice Chess** — synchronized dice constraints across players
- **Card Chess** — synchronized card-draw constraints across players
- Invite links and reconnect support

#### Custom Game Modes

- **4-Player Chess** — 14×14 board, four independent players, alliances and multi-front strategy
- **Dice Chess** — Roll 3 dice each turn to determine which piece types can move
- **Card Chess** — Draw cards to determine moveable pieces (card rank maps to piece type)

### Practice & Training

- **Tactical Puzzles** — Solve puzzles at your own pace
- **Puzzle Rush** — Timed mode: solve as many puzzles as possible before running out of time
- **Opening Explorer** — Browse and study thousands of openings and variations interactively
- **Memory Training** — Memorize and recreate chess positions to sharpen your recall
- **Vision Training** — Identify coordinates and valid moves to build pattern recognition

### Analysis Tools

- **Analysis Board** — Analyze any position with Stockfish; import PGNs, set up positions, and explore variations
- **Game Review** — Review full games move-by-move with accuracy scores and best move suggestions
- **Game History & Profile** — Track results, rating deltas, and long-term progress

### UI & Experience

- Immersive audio feedback for moves, captures, checks, and checkmates
- Multiple board themes and piece sets
- Full light / dark mode with persistent theme preference
- Fully responsive — desktop, tablet, and mobile
- Keyboard shortcuts
- Captured pieces display, player clocks, and move history

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) with Turbopack
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [chessops](https://github.com/niklasf/chessops) for chess logic
- [react-chessboard](https://github.com/Clariity/react-chessboard) for board rendering
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL for auth/user data
- [NextAuth v5](https://authjs.dev/) with GitHub OAuth

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL (or use Docker — see the [root README](../README.md))

### Installation

```bash
pnpm install
```

### Environment Variables

Create `frontend/.env.local`:

```env
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/mydatabase"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="any-random-secret"
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
```

### Database Setup

```bash
pnpm exec prisma db push
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The WebSocket server must also be running for online multiplayer — see the [root README](../README.md).

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

---

## Scripts

| Command                    | Description                             |
| -------------------------- | --------------------------------------- |
| `pnpm dev`                 | Start development server with Turbopack |
| `pnpm build`               | Build for production                    |
| `pnpm start`               | Start production server                 |
| `pnpm lint`                | Run ESLint                              |
| `pnpm lint:fix`            | Fix linting issues and format           |
| `pnpm format`              | Format with Prettier                    |
| `pnpm exec prisma studio`  | Open Prisma Studio (visual DB browser)  |
| `pnpm exec prisma db push` | Push schema changes to the database     |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js routes and pages
│   │   ├── page.tsx          # Landing page
│   │   ├── play/             # Play hub + all game modes
│   │   │   ├── computer/     # vs Stockfish (10 variants)
│   │   │   ├── local/        # Local multiplayer
│   │   │   ├── multiplayer/  # Online WebSocket play
│   │   │   ├── custom/       # 4-Player, Dice, Card chess
│   │   │   └── custom-multiplayer/ # Online custom multiplayer
│   │   ├── practice/         # Training tools
│   │   │   ├── learn/openings/
│   │   │   ├── puzzles/
│   │   │   ├── cognitive/memory/
│   │   │   └── cognitive/vision/
│   │   └── tools/            # Analysis board, game review
│   ├── features/             # Feature modules
│   │   ├── chess/            # Core board, engine, state
│   │   ├── multiplayer/      # WebSocket client
│   │   ├── analysis/         # Analysis board
│   │   ├── game-review/      # Game review
│   │   ├── puzzles/          # Puzzle engine
│   │   ├── openings/         # Opening explorer
│   │   ├── custom/           # Custom variants (4P, Dice, Card)
│   │   ├── memory/           # Memory training
│   │   ├── vision/           # Vision training
│   │   ├── games/            # Game history
│   │   ├── profile/          # Profile and insights
│   │   ├── engine/           # WASM engine hooks
│   │   └── settings/         # User preferences
│   ├── components/           # Shared UI components
│   ├── lib/                  # Utilities
│   └── constants/            # App-wide constants
├── prisma/                   # Database schema
└── docs/                     # Docker and other guides
```

---

## Further Reading

- [Docker setup guide](docs/docker.md)
- [Root README](../README.md) — running the full stack (frontend + WebSocket server + database)
- [Next.js docs](https://nextjs.org/docs)
