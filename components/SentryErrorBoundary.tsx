import React, { Component, ErrorInfo, ReactNode } from 'react';
import NextError from 'next/error';
import reportRenderError from '../helpers/reportRenderError';

interface SentryErrorBoundaryProps {
  children: ReactNode;
  /** Route id. Changing it clears a failure without remounting a healthy page. */
  resetKey?: string;
}

interface SentryErrorBoundaryState {
  hasError: boolean;
  resetKey?: string;
}

/**
 * Reports render errors to Better Stack. The fallback is Next's default
 * `/_error` page (no statusCode), which is the same client-error UI Next
 * would show after its own boundary caught the error. Placing this around
 * the page component keeps the existing Header/NavBar chrome.
 *
 * Failure is `hasError`, not the thrown value's truthiness. The value is
 * reported directly from componentDidCatch, with React's component stack
 * attached as context. Pass `resetKey` (the route) to clear a failure after
 * navigation while leaving a healthy page mounted.
 */
class SentryErrorBoundary
  extends Component<SentryErrorBoundaryProps, SentryErrorBoundaryState> {
  constructor(props: SentryErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      resetKey: props.resetKey,
    };
  }

  static getDerivedStateFromError(): Pick<SentryErrorBoundaryState, 'hasError'> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: SentryErrorBoundaryProps,
    state: SentryErrorBoundaryState,
  ): Partial<SentryErrorBoundaryState> | null {
    if (props.resetKey === state.resetKey) {
      return null;
    }
    // Remember the route. Clear the fallback only when one is already showing.
    if (!state.hasError) {
      return { resetKey: props.resetKey };
    }
    return {
      resetKey: props.resetKey,
      hasError: false,
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    reportRenderError(error, {
      contexts: {
        react: {
          componentStack: info.componentStack,
        },
      },
    });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      // ErrorProps types statusCode as required, but a missing/falsy value
      // is the client-error path and shows the default exception message.
      // @ts-expect-error -- statusCode is optional at runtime for client errors
      return <NextError />;
    }
    return children;
  }
}

export default SentryErrorBoundary;
