export const DEBUG_FLAGS: Record<string, boolean> = {};
export function debugLog(category: string, ...args: unknown[]): void {
  if (DEBUG_FLAGS[category]) {
    console.log(`[${category}]`, ...args);
  }
}
