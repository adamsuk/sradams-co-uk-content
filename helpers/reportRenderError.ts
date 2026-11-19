import { captureException } from '@sentry/browser';

import { getBetterStackRumToken } from './betterStackRum';

type CaptureContext = Parameters<typeof captureException>[1];

// Keep errors outside the boundary so route changes/unmounts cannot discard them.
// If the loader is blocked, retain them for the lifetime of this page.
const pending: { error: unknown; context: CaptureContext }[] = [];
let retryTimer: ReturnType<typeof setTimeout> | undefined;

function flushPending() {
  retryTimer = undefined;
  const client = window.Sentry;
  if (typeof client?.captureException === 'function') {
    while (pending.length > 0) {
      const event = pending[0];
      try {
        client.captureException(event.error, event.context);
        pending.shift();
      } catch {
        // Reporting must not break the error page or lose the queued error.
        break;
      }
    }
  }
  if (pending.length > 0) {
    retryTimer = setTimeout(flushPending, 1000);
  }
}

export default function reportRenderError(error: unknown, context: CaptureContext) {
  if (!getBetterStackRumToken()) {
    captureException(error, context);
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }
  pending.push({ error, context });
  if (retryTimer !== undefined) {
    clearTimeout(retryTimer);
  }
  flushPending();
}
