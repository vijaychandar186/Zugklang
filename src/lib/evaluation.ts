import { StockfishEngine } from '@/lib/engine';
import type { Position, EngineLine, Evaluation } from '@/lib/types/Position';

interface InfoLine {
  depth: number;
  multipv: number;
  score?: {
    type: 'cp' | 'mate';
    value: number;
  };
  pv?: string[];
}

// Parse Stockfish UCI "info" output lines
function parseInfoLine(line: string): InfoLine | null {
  const depthMatch = line.match(/depth (\d+)/);
  const multipvMatch = line.match(/multipv (\d+)/);
  const cpMatch = line.match(/score cp (-?\d+)/);
  const mateMatch = line.match(/score mate (-?\d+)/);
  const pvMatch = line.match(/pv (.+)/);

  if (!depthMatch || !multipvMatch) return null;

  const info: InfoLine = {
    depth: parseInt(depthMatch[1]),
    multipv: parseInt(multipvMatch[1])
  };

  if (cpMatch) {
    info.score = {
      type: 'cp',
      value: parseInt(cpMatch[1])
    };
  } else if (mateMatch) {
    info.score = {
      type: 'mate',
      value: parseInt(mateMatch[1])
    };
  }

  if (pvMatch) {
    info.pv = pvMatch[1].trim().split(' ');
  }

  return info;
}

// Evaluate a single position and return top engine lines
export async function evaluatePosition(
  fen: string,
  depth: number = 16,
  multiPV: number = 2
): Promise<EngineLine[]> {
  const engine = StockfishEngine.getInstance();
  await engine.waitUntilReady();

  return new Promise((resolve) => {
    const lines = new Map<number, InfoLine>();
    let timeout: NodeJS.Timeout;

    const handleMessage = (e: MessageEvent) => {
      const message = String(e.data || '');

      // Parse info lines
      if (message.startsWith('info')) {
        const info = parseInfoLine(message);
        if (info && info.score && info.pv && info.pv.length > 0) {
          // Store the best info for each multipv line
          const existing = lines.get(info.multipv);
          if (!existing || info.depth >= existing.depth) {
            lines.set(info.multipv, info);
          }
        }
      }

      // When engine sends bestmove, evaluation is complete
      if (message.startsWith('bestmove')) {
        clearTimeout(timeout);
        cleanup();

        // Convert to EngineLine format
        const result: EngineLine[] = [];
        for (const [id, info] of lines.entries()) {
          if (info.score && info.pv && info.pv.length > 0) {
            result.push({
              id,
              depth: info.depth,
              evaluation: info.score,
              moveUCI: info.pv[0]
            });
          }
        }

        // Sort by multipv id
        result.sort((a, b) => a.id - b.id);
        resolve(result);
      }
    };

    const cleanup = () => {
      engine.removeEventListener('message', handleMessage);
    };

    // Set timeout in case engine hangs
    timeout = setTimeout(() => {
      cleanup();
      resolve([]);
    }, 30000); // 30 second timeout

    // Listen for engine messages
    engine.addEventListener('message', handleMessage);

    // Send UCI commands
    engine.sendCommand('ucinewgame');
    engine.sendCommand(`setoption name MultiPV value ${multiPV}`);
    engine.sendCommand(`position fen ${fen}`);
    engine.sendCommand(`go depth ${depth}`);
  });
}

// Evaluate all positions in sequence with progress updates
export async function evaluatePositions(
  positions: Position[],
  depth: number = 16,
  onProgress?: (
    current: number,
    total: number,
    percent: number,
    currentPositions: Position[]
  ) => void
): Promise<Position[]> {
  const result = [...positions];

  for (let i = 0; i < result.length; i++) {
    try {
      const topLines = await evaluatePosition(result[i].fen, depth, 2);
      result[i].topLines = topLines;

      const percent = Math.round(((i + 1) / result.length) * 100);
      // Pass a fresh copy of positions so React sees the change
      onProgress?.(i + 1, result.length, percent, [...result]);
    } catch (error) {
      console.error(`Failed to evaluate position ${i}:`, error);
      result[i].topLines = [];
    }
  }

  return result;
}
