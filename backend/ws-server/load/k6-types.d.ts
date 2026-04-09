declare module 'k6' {
  export function check<T>(
    value: T,
    checks: Record<string, (value: T) => boolean>
  ): boolean;
  export function sleep(seconds: number): void;
}

declare module 'k6/http' {
  export interface Response {
    status: number;
    body: string;
  }

  export function get(url: string, params?: Record<string, unknown>): Response;
}

declare module 'k6/ws' {
  export interface Socket {
    on(event: 'open' | 'close' | 'error', handler: () => void): void;
    on(event: 'message', handler: (data: unknown) => void): void;
    send(message: string): void;
    close(): void;
  }

  export interface Response {
    status: number;
  }

  export type Params = Record<string, unknown>;

  export function connect(
    url: string,
    params: Params,
    callback: (socket: Socket) => void
  ): Response;

  const ws: {
    connect: typeof connect;
  };
  export default ws;
}
