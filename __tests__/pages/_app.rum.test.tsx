/**
 * pages/_app.tsx decides whether to call initSentry at module scope.
 * Each case loads that module after the RUM token is set.
 */

const FAKE_RUM_TOKEN = 'fake-betterstack-rum-token';
const FAKE_DSN = 'https://token@ingest.example.test/1';

jest.mock('../../helpers/initSentry', () => ({
  initSentry: jest.fn(),
}));

function loadApp(): jest.Mock {
  let sentryInit: jest.Mock | undefined;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const sentry = require('../../helpers/initSentry') as { initSentry: jest.Mock };
    sentryInit = sentry.initSentry;
    sentryInit.mockClear();
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    require('../../pages/_app');
  });
  if (!sentryInit) {
    throw new Error('initSentry mock was not loaded');
  }
  return sentryInit;
}

describe('MyApp Sentry init and the Better Stack tag', () => {
  const originalToken = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
  const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = originalToken;
    }
    if (originalDsn === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    } else {
      process.env.NEXT_PUBLIC_SENTRY_DSN = originalDsn;
    }
  });

  it('does not call initSentry when the RUM token is set, even with a DSN', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = FAKE_RUM_TOKEN;
    process.env.NEXT_PUBLIC_SENTRY_DSN = FAKE_DSN;
    expect(loadApp()).not.toHaveBeenCalled();
  });

  it('does not call initSentry when the RUM token is padded', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = `  ${FAKE_RUM_TOKEN}  `;
    process.env.NEXT_PUBLIC_SENTRY_DSN = FAKE_DSN;
    expect(loadApp()).not.toHaveBeenCalled();
  });

  it.each([
    undefined,
    '',
    '   ',
    '\n\t',
  ])('calls initSentry when the RUM token is %p', (token) => {
    if (token === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = token;
    }
    process.env.NEXT_PUBLIC_SENTRY_DSN = FAKE_DSN;
    const initSentry = loadApp();
    expect(initSentry).toHaveBeenCalledTimes(1);
    expect(initSentry).toHaveBeenCalledWith();
  });
});
