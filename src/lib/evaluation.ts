import { StockfishEngine } from '@/lib/engine';
import type { Position, EngineLine } from '@/types/Position';

interface InfoLine {
  depth: number;
  multipv: number;
  score?: {
    type: 'cp' | 'mate';
    value: number;
  };
  pv?: string[];
}

function parseInfoLine(line: string, isBlackToMove: boolean): InfoLine | null {
  const depthMatch = line.match(/depth (\d+)/);
  const multipvMatch = line.match(/multipv (\d+)/);
  const cpMatch = line.match(/score cp (-?\d+)/);
  const mateMatch = line.match(/score mate (-?\d+)/);
  const pvMatch = line.match(/ pv (.+)/);

  if (!depthMatch || !multipvMatch) return null;

  const info: InfoLine = {
    depth: parseInt(depthMatch[1]),
    multipv: parseInt(multipvMatch[1])
  };

  if (cpMatch) {
    let value = parseInt(cpMatch[1]);
    if (isBlackToMove) {
      value *= -1;
    }
    info.score = {
      type: 'cp',
      value
    };
  } else if (mateMatch) {
    let value = parseInt(mateMatch[1]);
    if (isBlackToMove) {
      value *= -1;
    }
    info.score = {
      type: 'mate',
      value
    };
  }

  if (pvMatch) {
    info.pv = pvMatch[1].trim().split(' ');
  }

  return info;
}

export async function evaluatePosition(
  fen: string,
  depth: number = 16,
  multiPV: number = 2
): Promise<EngineLine[]> {
  const engine = StockfishEngine.getInstance();
  await engine.waitUntilReady();

  const isBlackToMove = fen.includes(' b ');

  return new Promise((resolve) => {
    const lines = new Map<number, InfoLine>();

    const handleMessage = (e: MessageEvent) => {
      const message = String(e.data || '');

      if (message.startsWith('info')) {
        const info = parseInfoLine(message, isBlackToMove);
        if (info && info.score && info.pv && info.pv.length > 0) {
          const existing = lines.get(info.multipv);
          if (!existing || info.depth >= existing.depth) {
            lines.set(info.multipv, info);
          }
        }
      }

      if (message.startsWith('bestmove')) {
        clearTimeout(timeout);
        cleanup();

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

        result.sort((a, b) => a.id - b.id);
        resolve(result);
      }
    };

    const cleanup = () => {
      engine.removeEventListener('message', handleMessage);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve([]);
    }, 30000);

    engine.addEventListener('message', handleMessage);

    engine.sendCommand('ucinewgame');
    engine.sendCommand(`setoption name MultiPV value ${multiPV}`);
    engine.sendCommand(`position fen ${fen}`);
    engine.sendCommand(`go depth ${depth}`);
  });
}

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
      onProgress?.(i + 1, result.length, percent, [...result]);
    } catch (error) {
      console.error(`Failed to evaluate position ${i}:`, error);
      result[i].topLines = [];
    }
  }

  return result;
}
