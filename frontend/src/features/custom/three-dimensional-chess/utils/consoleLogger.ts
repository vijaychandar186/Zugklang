export function consoleLogger(category: string, ...args: unknown[]): void {
  console.log(`[${category}]`, ...args);
}
