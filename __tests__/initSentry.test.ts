const initMock = jest.fn();
const captureMessageMock = jest.fn();

jest.mock('@sentry/browser', () => ({
  init: (...args: unknown[]) => initMock(...args),
  captureMessage: (...args: unknown[]) => captureMessageMock(...args),
}));

// Import after the mock so the helper uses it.
// eslint-disable-next-line import/first
import { getSentryDsn, initSentry } from '../helpers/initSentry';

const FAKE_DSN = 'https://token@ingest.example.test/1';
const FAKE_RUM_TOKEN = 'fake-betterstack-rum-token';

describe('initSentry', () => {
  const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const originalEnvironment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
  const originalRelease = process.env.NEXT_PUBLIC_SENTRY_RELEASE;
  const originalRumToken = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;

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
    if (originalRelease === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;
    } else {
      process.env.NEXT_PUBLIC_SENTRY_RELEASE = originalRelease;
    }
    if (originalRumToken === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = originalRumToken;
    }
  });

  beforeEach(() => {
    // DSN-only cases describe today's client. A token inherited from the
    // environment would take the tag path instead.
    delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
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

  it('does not start the standalone SDK while the Better Stack tag is on', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = `  ${FAKE_RUM_TOKEN}  `;
    process.env.NEXT_PUBLIC_SENTRY_DSN = FAKE_DSN;
    expect(initSentry()).toBe(false);
    expect(initSentry(FAKE_DSN)).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
    expect(window.Sentry).toBeUndefined();
  });

  it('still initialises when the RUM token is unset or blank and a DSN is set', () => {
    delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    expect(initSentry(FAKE_DSN)).toBe(true);
    expect(initMock).toHaveBeenCalledTimes(1);

    initMock.mockClear();
    delete window.Sentry;
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = '   ';
    expect(initSentry(FAKE_DSN)).toBe(true);
    expect(initMock).toHaveBeenCalledTimes(1);
    expect(window.Sentry).toBeDefined();
  });

  it('initialises the SDK when a DSN is provided', () => {
    const dsn = FAKE_DSN;
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = 'preview';
    delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;
    expect(initSentry(dsn)).toBe(true);
    expect(initMock).toHaveBeenCalledTimes(1);
    const options = initMock.mock.calls[0][0];
    expect(options).toEqual(expect.objectContaining({
      dsn,
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      environment: 'preview',
      release: undefined,
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

  it('sends the trimmed release so uploaded source maps match the client', () => {
    process.env.NEXT_PUBLIC_SENTRY_RELEASE = '  abc123def  ';
    expect(initSentry('https://token@ingest.example.test/1')).toBe(true);
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        release: 'abc123def',
      }),
    );
  });

  it('omits release when NEXT_PUBLIC_SENTRY_RELEASE is unset or blank', () => {
    delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;
    expect(initSentry('https://token@ingest.example.test/1')).toBe(true);
    expect(initMock.mock.calls[0][0].release).toBeUndefined();

    initMock.mockClear();
    process.env.NEXT_PUBLIC_SENTRY_RELEASE = '   ';
    expect(initSentry('https://token@ingest.example.test/1')).toBe(true);
    expect(initMock.mock.calls[0][0].release).toBeUndefined();
  });
});
