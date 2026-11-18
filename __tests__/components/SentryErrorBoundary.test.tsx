import React from 'react';
import { render, screen } from '@testing-library/react';
import { captureException } from '@sentry/browser';

import SentryErrorBoundary from '../../components/SentryErrorBoundary';

jest.mock('@sentry/browser', () => ({
  captureException: jest.fn(),
}));

const captureExceptionMock = captureException as jest.MockedFunction<
  typeof captureException
>;

function Boom() {
  throw new Error('render crashed');
}

describe('SentryErrorBoundary', () => {
  const consoleError = console.error;

  beforeEach(() => {
    captureExceptionMock.mockClear();
    // React logs render errors; keep the test output quiet.
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = consoleError;
  });

  it('renders children when nothing throws', () => {
    render(
      <SentryErrorBoundary>
        <div>all good</div>
      </SentryErrorBoundary>,
    );
    expect(screen.getByText('all good')).toBeInTheDocument();
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('reports a render crash and shows Next\'s default client error page', () => {
    render(
      <SentryErrorBoundary>
        <Boom />
      </SentryErrorBoundary>,
    );

    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    expect(captureExceptionMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'render crashed' }),
    );
    expect(
      screen.getByText(/Application error: a client-side exception has occurred/i),
    ).toBeInTheDocument();
  });
});
