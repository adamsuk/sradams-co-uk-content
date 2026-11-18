const initMock = jest.fn();

jest.mock('@sentry/browser', () => ({
  init: (...args: unknown[]) => initMock(...args),
}));

// Import after the mock so the helper uses it.
// eslint-disable-next-line import/first
import { getSentryDsn, initSentry } from '../helpers/initSentry';

describe('initSentry', () => {
  const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  afterEach(() => {
    initMock.mockClear();
    delete window.Sentry;
    if (originalDsn === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    } else {
      process.env.NEXT_PUBLIC_SENTRY_DSN = originalDsn;
    }
  });

  it('skips init when the DSN is unset', () => {
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    expect(initSentry()).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
  });

  it('skips init when the DSN is empty or whitespace', () => {
    expect(initSentry('')).toBe(false);
    expect(initSentry('   ')).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
  });

  it('treats a blank env var as no DSN', () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = '  ';
    expect(getSentryDsn()).toBeUndefined();
    expect(initSentry()).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
  });

  it('initialises the SDK when a DSN is provided', () => {
    const dsn = 'https://token@ingest.example.test/1';
    expect(initSentry(dsn)).toBe(true);
    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn,
        tracesSampleRate: 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
      }),
    );
    expect(window.Sentry).toBeDefined();
  });
});
