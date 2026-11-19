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

function FalsyBoom(): never {
  // Truthiness cannot select the fallback: undefined is still a thrown failure.
  const thrown: unknown = undefined;
  throw thrown;
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
      {
        contexts: {
          react: {
            componentStack: expect.stringContaining('Boom'),
          },
        },
      },
    );
    expect(
      screen.getByText(/Application error: a client-side exception has occurred/i),
    ).toBeInTheDocument();
  });

  it.each([
    ['two errors', new Error('first lifecycle crash'), new Error('second lifecycle crash')],
    ['an undefined error', undefined, new Error('sibling lifecycle crash')],
  ])('reports each sibling lifecycle exception separately with %s', (_label, first, second) => {
    class LifecycleBoom extends React.Component<{ error: unknown }> {
      componentDidMount() {
        const { error } = this.props;
        throw error;
      }

      render() {
        return null;
      }
    }

    render(
      <SentryErrorBoundary>
        <LifecycleBoom error={first} />
        <LifecycleBoom error={second} />
      </SentryErrorBoundary>,
    );

    expect(captureExceptionMock).toHaveBeenCalledTimes(2);
    expect(captureExceptionMock).toHaveBeenNthCalledWith(1, first, {
      contexts: {
        react: {
          componentStack: expect.stringContaining('LifecycleBoom'),
        },
      },
    });
    expect(captureExceptionMock).toHaveBeenNthCalledWith(2, second, {
      contexts: {
        react: {
          componentStack: expect.stringContaining('LifecycleBoom'),
        },
      },
    });
    expect(
      screen.getByText(/Application error: a client-side exception has occurred/i),
    ).toBeInTheDocument();
  });

  it('reports a falsy thrown value and still shows the error page', () => {
    render(
      <SentryErrorBoundary>
        <FalsyBoom />
      </SentryErrorBoundary>,
    );

    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    expect(captureExceptionMock).toHaveBeenCalledWith(undefined, {
      contexts: {
        react: {
          componentStack: expect.stringContaining('FalsyBoom'),
        },
      },
    });
    expect(
      screen.getByText(/Application error: a client-side exception has occurred/i),
    ).toBeInTheDocument();
  });
});
