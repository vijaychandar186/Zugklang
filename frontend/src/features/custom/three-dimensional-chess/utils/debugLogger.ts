export function debugLogger(category: string, ...args: unknown[]): void {
  console.log(`[${category}]`, ...args);
}
