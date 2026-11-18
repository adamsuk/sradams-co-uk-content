import * as Sentry from '@sentry/browser';

declare global {
  interface Window {
    Sentry?: typeof Sentry;
  }
}

// Client-side error tracking via the Sentry SDK, pointed at Better Stack's
// Sentry-compatible ingest. The DSN comes from NEXT_PUBLIC_SENTRY_DSN (set at
// build time). If it is unset, this is a no-op so local dev, tests, previews
// and e2e never send events.
export function getSentryDsn(
  dsn: string | undefined = process.env.NEXT_PUBLIC_SENTRY_DSN,
): string | undefined {
  const trimmed = dsn?.trim();
  return trimmed || undefined;
}

export function initSentry(dsn?: string): boolean {
  const resolved = getSentryDsn(dsn ?? process.env.NEXT_PUBLIC_SENTRY_DSN);
  if (!resolved || typeof window === 'undefined') {
    return false;
  }

  Sentry.init({
    dsn: resolved,
    // Errors only: no performance tracing and no session replay.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    environment: process.env.NODE_ENV,
  });

  // So the Better Stack ingest check can be run from the browser console:
  // Sentry.captureMessage("Hello Better Stack, this is a test message from JavaScript!")
  window.Sentry = Sentry;

  return true;
}
