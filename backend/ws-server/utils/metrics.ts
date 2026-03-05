// ---------------------------------------------------------------------------
// Minimal Prometheus text-format metrics — no external library needed.
// ---------------------------------------------------------------------------

const counters = new Map<string, number>();
const gauges = new Map<string, number>();

export function incCounter(name: string, by = 1): void {
  counters.set(name, (counters.get(name) ?? 0) + by);
}

export function setGauge(name: string, value: number): void {
  gauges.set(name, value);
}

export function renderMetrics(): string {
  const lines: string[] = [];

  for (const [name, value] of counters) {
    lines.push(`# TYPE ${name} counter`);
    lines.push(`${name} ${value}`);
  }

  for (const [name, value] of gauges) {
    lines.push(`# TYPE ${name} gauge`);
    lines.push(`${name} ${value}`);
  }

  return lines.join('\n') + '\n';
}
