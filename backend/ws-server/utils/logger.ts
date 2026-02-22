type LogLevel = 'info' | 'warn' | 'error';
function log(
  level: LogLevel,
  msg: string,
  data?: Record<string, unknown>
): void {
  console.log(
    JSON.stringify({ ts: new Date().toISOString(), level, msg, ...data })
  );
}
export const logger = {
  info: (msg: string, data?: Record<string, unknown>) => log('info', msg, data),
  warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, data),
  error: (msg: string, data?: Record<string, unknown>) =>
    log('error', msg, data)
};
