// ---------------------------------------------------------------------------
// OpenTelemetry + Sentry instrumentation bootstrap.
// This file MUST be imported at the very top of server.ts before all other
// imports so the SDK patches Node.js internals before any modules load.
// ---------------------------------------------------------------------------
import * as Sentry from '@sentry/bun';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const OTEL_ENDPOINT =
  process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ?? 'http://otel-collector:4318';
const SERVICE_NAME = 'zugklang-ws-server';
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

// ---------------------------------------------------------------------------
// Sentry — initialise before OTel so Sentry can attach its OTel integration
// ---------------------------------------------------------------------------
Sentry.init({
  dsn: process.env['SENTRY_DSN'],
  environment: NODE_ENV,
  release: process.env['SENTRY_RELEASE'],
  tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,
  sampleRate: 1.0,
  // Send unhandled promise rejections and uncaught exceptions
  integrations: [
    Sentry.bunServerIntegration(),
  ],
});

// ---------------------------------------------------------------------------
// OpenTelemetry SDK
// ---------------------------------------------------------------------------
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: '1.0.0',
    'deployment.environment': NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    url: `${OTEL_ENDPOINT}/v1/traces`,
  }),
});

sdk.start();

// Graceful shutdown — flush spans before process exits
process.on('SIGTERM', () => {
  sdk.shutdown().catch(() => null);
});
process.on('SIGINT', () => {
  sdk.shutdown().catch(() => null);
});
