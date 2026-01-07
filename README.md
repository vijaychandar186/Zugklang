# Zugklang

Where Strategy Meets Symphony - A modern chess application with immersive audio feedback and premium aesthetics.

## Features

- **Stockfish 16 Integration** - Play against one of the strongest chess engines in the world with adjustable difficulty
- **Deep Analysis** - Review games with engine evaluations, best move suggestions, and detailed move analysis
- **Immersive Audio** - Dynamic soundscapes with carefully crafted audio feedback for every move
- **Local Multiplayer** - Play against friends on the same device
- **Beautiful Themes** - Multiple board themes and piece sets with light/dark mode support
- **Game History** - Full move navigation, PGN import, and position replay

## Tech Stack

- [Next.js 15](https://nextjs.org/) with Turbopack
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [chess.js](https://github.com/jhlywa/chess.js) for game logic
- [react-chessboard](https://github.com/Clariity/react-chessboard) for board rendering

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix linting issues and format code |
| `pnpm format` | Format code with Prettier |

## License

MIT
