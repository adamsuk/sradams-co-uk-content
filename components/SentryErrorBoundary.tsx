import React, { Component, ReactNode } from 'react';
import NextError from 'next/error';
import { captureException } from '@sentry/browser';

interface SentryErrorBoundaryProps {
  children: ReactNode;
}

interface SentryErrorBoundaryState {
  error: Error | null;
}

/**
 * Reports render errors to Better Stack. The fallback is Next's default
 * `/_error` page (no statusCode), which is the same client-error UI Next
 * would show after its own boundary caught the error. Placing this around
 * the page component keeps the existing Header/NavBar chrome.
 */
class SentryErrorBoundary extends Component<SentryErrorBoundaryProps, SentryErrorBoundaryState> {
  constructor(props: SentryErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): SentryErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    captureException(error);
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      // ErrorProps types statusCode as required, but a missing/falsy value
      // is the client-error path and shows the default exception message.
      // @ts-expect-error -- statusCode is optional at runtime for client errors
      return <NextError />;
    }
    return children;
  }
}

export default SentryErrorBoundary;
