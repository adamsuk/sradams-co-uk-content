/**
 * @jest-environment node
 */

const initMock = jest.fn();

jest.mock('@sentry/browser', () => ({
  init: (...args: unknown[]) => initMock(...args),
  captureMessage: jest.fn(),
}));

// Import after the mock so the helper uses it.
// eslint-disable-next-line import/first
import { initSentry } from '../helpers/initSentry';

describe('initSentry in a non-browser environment', () => {
  const originalRumToken = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;

  afterEach(() => {
    if (originalRumToken === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = originalRumToken;
    }
  });

  it('skips init when window is undefined even if a DSN is set', () => {
    // Keep the RUM token unset so this still asserts the window guard.
    delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    expect(typeof window).toBe('undefined');
    expect(initSentry('https://token@ingest.example.test/1')).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
  });
});
