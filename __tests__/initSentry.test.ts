const initMock = jest.fn();
const captureMessageMock = jest.fn();

jest.mock('@sentry/browser', () => ({
  init: (...args: unknown[]) => initMock(...args),
  captureMessage: (...args: unknown[]) => captureMessageMock(...args),
}));

// Import after the mock so the helper uses it.
// eslint-disable-next-line import/first
import { getSentryDsn, initSentry } from '../helpers/initSentry';

describe('initSentry', () => {
  const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const originalEnvironment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

  afterEach(() => {
    initMock.mockClear();
    captureMessageMock.mockClear();
    delete window.Sentry;
    if (originalDsn === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    } else {
      process.env.NEXT_PUBLIC_SENTRY_DSN = originalDsn;
    }
    if (originalEnvironment === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
    } else {
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = originalEnvironment;
    }
  });

  it('skips init when the DSN is unset', () => {
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    expect(initSentry()).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
    expect(window.Sentry).toBeUndefined();
  });

  it('skips init when the DSN is empty or whitespace', () => {
    expect(initSentry('')).toBe(false);
    expect(initSentry('   ')).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
    expect(window.Sentry).toBeUndefined();
  });

  it('treats a blank env var as no DSN', () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = '  ';
    expect(getSentryDsn()).toBeUndefined();
    expect(initSentry()).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
    expect(window.Sentry).toBeUndefined();
  });

  it('initialises the SDK when a DSN is provided', () => {
    const dsn = 'https://token@ingest.example.test/1';
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = 'preview';
    expect(initSentry(dsn)).toBe(true);
    expect(initMock).toHaveBeenCalledTimes(1);
    const options = initMock.mock.calls[0][0];
    expect(options).toEqual(expect.objectContaining({
      dsn,
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      environment: 'preview',
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        stackFrameVariables: false,
      },
    }));
    expect(options.integrations([
      { name: 'BrowserSession' },
      { name: 'GlobalHandlers' },
    ])).toEqual([{ name: 'GlobalHandlers' }]);
    expect(window.Sentry).toBeDefined();
    expect(typeof window.Sentry.captureMessage).toBe('function');
    window.Sentry.captureMessage('hello from the console');
    expect(captureMessageMock).toHaveBeenCalledWith('hello from the console');
  });

  it('falls back to NODE_ENV when no Sentry environment is set', () => {
    delete process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
    expect(initSentry('https://token@ingest.example.test/1')).toBe(true);
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: process.env.NODE_ENV,
      }),
    );
  });
});
