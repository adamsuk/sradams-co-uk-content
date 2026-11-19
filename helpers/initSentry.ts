import { init, captureMessage } from '@sentry/browser';

declare global {
  interface Window {
    Sentry?: { captureMessage: typeof captureMessage };
  }
}

// Client-side error tracking via the Sentry SDK, pointed at Better Stack's
// Sentry-compatible ingest. The DSN comes from NEXT_PUBLIC_SENTRY_DSN (set at
// build time). If it is unset, this is a no-op so local dev, tests and e2e
// never send events. Preview and production deploys receive the DSN from the
// Actions secret and do send events.
export function getSentryDsn(
  dsn: string | undefined = process.env.NEXT_PUBLIC_SENTRY_DSN,
): string | undefined {
  const trimmed = dsn?.trim();
  return trimmed || undefined;
}

function getSentryEnvironment(
  value: string | undefined = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
): string {
  const trimmed = value?.trim();
  return trimmed || process.env.NODE_ENV || 'production';
}

export function initSentry(dsn?: string): boolean {
  const resolved = getSentryDsn(dsn ?? process.env.NEXT_PUBLIC_SENTRY_DSN);
  if (!resolved || typeof window === 'undefined') {
    return false;
  }

  init({
    dsn: resolved,
    // Errors only: no performance tracing and no session replay.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // autoSessionTracking was removed in SDK v8+. The v11 default
    // browserSessionIntegration would still send a session envelope on
    // every page load, so drop it from the default set.
    integrations: (defaults) => (
      defaults.filter((integration) => integration.name !== 'BrowserSession')
    ),
    environment: getSentryEnvironment(),
    // Still send errors. Do not collect user info, cookies, headers, bodies,
    // URL query params, or stack-frame local variables.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
  });

  // So the Better Stack ingest check can be run from the browser console:
  // Sentry.captureMessage("Hello Better Stack, this is a test message from JavaScript!")
  // Only captureMessage is exposed, so unused SDK exports can be tree-shaken.
  window.Sentry = { captureMessage };

  return true;
}
