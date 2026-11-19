// Better Stack real-user monitoring (web vitals, analytics, session replay
// and front-end errors). The public client token is
// NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN, inlined at build time. Unset or blank
// renders nothing, so local dev, tests, e2e and forks stay a no-op.
// Environment and release match the Sentry SDK (see helpers/initSentry.ts):
// NEXT_PUBLIC_SENTRY_ENVIRONMENT and NEXT_PUBLIC_SENTRY_RELEASE.
// Masking, replay and sampling are configured in the Better Stack Frontend
// tab, not here.

const BETTER_STACK_RUM_SRC = 'https://betterstack.net/b.js';

export interface BetterStackInitOptions {
  environment: string;
  release?: string;
}

function readTrimmed(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

// Keep a token that contains "<" from closing the inline script tag.
function jsonForInlineScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function getBetterStackRumToken(
  value: string | undefined = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN,
): string | undefined {
  return readTrimmed(value);
}

// Same fallback as getSentryEnvironment: the deploy workflow sets
// NEXT_PUBLIC_SENTRY_ENVIRONMENT to "preview" on pull requests and
// "production" otherwise. A production build leaves NODE_ENV as "production".
function getBetterStackEnvironment(
  value: string | undefined = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
): string {
  return readTrimmed(value) || process.env.NODE_ENV || 'production';
}

// Same rule as getSentryRelease: omit a blank release so events are not
// stamped with an empty string.
function getBetterStackRelease(
  value: string | undefined = process.env.NEXT_PUBLIC_SENTRY_RELEASE,
): string | undefined {
  return readTrimmed(value);
}

export function getBetterStackInitOptions(): BetterStackInitOptions {
  const environment = getBetterStackEnvironment();
  const release = getBetterStackRelease();
  if (!release) {
    return { environment };
  }
  return { environment, release };
}

export function getBetterStackRumSnippet(): string | null {
  const token = getBetterStackRumToken();
  if (!token) {
    return null;
  }

  const options = getBetterStackInitOptions();
  // Official loader: https://betterstack.com/docs/rum/js-tag/installation/
  // The token is JSON-encoded so it cannot break out of the script string.
  return `!function(b,e,t,r){
    b[t]=b[t]||function(...args){(b[t].q=b[t].q||[]).push(args)};
    b[t].l=+new Date;
    var s=e.createElement('script'); s.async=1; s.crossOrigin='anonymous';
    s.src='${BETTER_STACK_RUM_SRC}?t='+r;
    (e.head||e.getElementsByTagName('head')[0]).appendChild(s);
  }(window,document,'betterstack',${jsonForInlineScript(token)});
  betterstack('init', ${jsonForInlineScript(options)});`;
}
