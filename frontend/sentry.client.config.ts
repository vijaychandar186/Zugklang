import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Capture 10% of sessions for performance in prod; 100% in dev
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // Capture all sessions with errors
  replaysOnErrorSampleRate: 1.0,
  // Capture 1% of sessions without errors for session replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0,

  integrations: [
    Sentry.replayIntegration({
      // Mask PII in replays
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Only trace requests to our own domain
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/[^/]*zugklang/,
  ],
});
