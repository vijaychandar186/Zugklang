import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side: full Sentry SDK + OTel tracing
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.SENTRY_RELEASE,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Capture 100% of errors regardless of tracing sample rate
      sampleRate: 1.0,
      integrations: [
        Sentry.prismaIntegration(),
      ],
      // Skip noisy framework internals
      ignoreErrors: [
        'NEXT_NOT_FOUND',
        'NEXT_REDIRECT',
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.SENTRY_RELEASE,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      sampleRate: 1.0,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
