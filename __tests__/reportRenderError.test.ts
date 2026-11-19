import { captureException } from '@sentry/browser';

import reportRenderError from '../helpers/reportRenderError';

jest.mock('@sentry/browser', () => ({ captureException: jest.fn() }));

const context = { contexts: { react: { componentStack: 'Page > Broken' } } };

describe('render error reporting', () => {
  const originalToken = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
  const originalSentry = window.Sentry;
  const rumCapture = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = 'test-token';
    delete window.Sentry;
  });

  afterEach(() => {
    // Drain even errors retained during a blocked loader test.
    window.Sentry = { captureMessage: jest.fn(), captureException: rumCapture };
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    window.Sentry = originalSentry;
    if (originalToken === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = originalToken;
    }
  });

  it.each([undefined, '', ' \n\t '])('uses standalone reporting for token %p', (token) => {
    if (token === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = token;
    }
    const error = new Error('standalone');
    reportRenderError(error, context);
    expect(captureException).toHaveBeenCalledWith(error, context);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('sends directly through an available RUM client', () => {
    window.Sentry = { captureMessage: jest.fn(), captureException: rumCapture };
    const error = new Error('ready');
    reportRenderError(error, context);
    expect(rumCapture).toHaveBeenCalledWith(error, context);
    expect(captureException).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  it('retains every error and its context when the loader never completes', () => {
    const error = new Error('early render');
    reportRenderError(error, context);
    reportRenderError(undefined, context);
    jest.advanceTimersByTime(60 * 60 * 1000);
    expect(captureException).not.toHaveBeenCalled();
    expect(rumCapture).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(1);

    // Even after an hour, making the client available drains the original errors once.
    window.Sentry = { captureMessage: jest.fn(), captureException: rumCapture };
    jest.advanceTimersByTime(1000);
    expect(rumCapture).toHaveBeenCalledTimes(2);
    expect(rumCapture).toHaveBeenNthCalledWith(1, error, context);
    expect(rumCapture).toHaveBeenNthCalledWith(2, undefined, context);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('retains errors if the RUM capture method throws', () => {
    rumCapture.mockImplementationOnce(() => { throw new Error('client not ready'); });
    window.Sentry = { captureMessage: jest.fn(), captureException: rumCapture };
    const error = new Error('render');
    expect(() => reportRenderError(error, context)).not.toThrow();
    jest.advanceTimersByTime(1000);
    expect(rumCapture).toHaveBeenCalledTimes(2);
    expect(rumCapture).toHaveBeenLastCalledWith(error, context);
    expect(jest.getTimerCount()).toBe(0);
  });
});
