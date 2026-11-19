import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import Script from 'next/script';

import {
  getBetterStackInitOptions,
  getBetterStackRumSnippet,
  getBetterStackRumToken,
} from '../helpers/betterStackRum';

// beforeInteractive next/script renders null outside Next's document pass.
// Surface the inline source the document inlines into each page.
jest.mock('next/script', () => {
  function MockScript({
    id,
    children,
  }: {
    id?: string;
    children?: React.ReactNode;
  }) {
    const html = typeof children === 'string' ? children : '';
    return (
      // The real next/script inlines this string into the page.
      // eslint-disable-next-line react/no-danger
      <script id={id} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  return {
    __esModule: true,
    default: MockScript,
  };
});

// eslint-disable-next-line import/first
import BetterStackRum from '../components/BetterStackRum';

const FAKE_RUM_TOKEN = 'fake-betterstack-rum-token';
const FAKE_RELEASE = 'fake-release-sha';

interface BetterStackStub {
  (...args: unknown[]): void;
  q?: unknown[][];
  l?: number;
}

function rumWindow(): Window & { betterstack?: BetterStackStub } {
  return window;
}

function removeRumDom() {
  // Only the loader appended by the snippet. The inline tag belongs to React.
  document.querySelectorAll('script[src*="betterstack.net"]').forEach((script) => {
    script.remove();
  });
  delete rumWindow().betterstack;
}

function runSnippet(code: string) {
  // Execute the official stub in the jsdom window so betterstack('init') queues.
  // eslint-disable-next-line no-eval
  rumWindow().eval(code);
}

function loaderSrc(): string | null {
  const remote = document.querySelector('script[src*="betterstack.net/b.js"]');
  return remote?.getAttribute('src') ?? null;
}

describe('Better Stack RUM tag', () => {
  const originalToken = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
  const originalEnvironment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
  const originalRelease = process.env.NEXT_PUBLIC_SENTRY_RELEASE;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    removeRumDom();
    if (originalToken === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = originalToken;
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
    process.env.NODE_ENV = originalNodeEnv;
  });

  it.each([
    undefined,
    '',
    '   ',
    '\n\t',
  ])('renders no Better Stack script when the token is %p', (token) => {
    if (token === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = token;
    }

    expect(getBetterStackRumToken()).toBeUndefined();
    expect(getBetterStackRumSnippet()).toBeNull();
    expect(BetterStackRum()).toBeNull();

    const { container } = render(<div>{BetterStackRum()}</div>);
    expect(container.querySelector('script')).toBeNull();
    expect(document.getElementById('betterstack-rum')).toBeNull();
    expect(document.querySelector('script[src*="betterstack.net"]')).toBeNull();
    expect(rumWindow().betterstack).toBeUndefined();
  });

  it('loads the tag and inits with the Sentry environment and release', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = `  ${FAKE_RUM_TOKEN}  `;
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = '  preview  ';
    process.env.NEXT_PUBLIC_SENTRY_RELEASE = `  ${FAKE_RELEASE}  `;

    const element = BetterStackRum() as ReactElement<{
      id?: string;
      strategy?: string;
      children?: string;
    }>;
    expect(element).not.toBeNull();
    expect(element.type).toBe(Script);
    expect(element.props.id).toBe('betterstack-rum');
    expect(element.props.strategy).toBe('beforeInteractive');

    const { container } = render(element);
    const inline = container.querySelector('#betterstack-rum');
    expect(inline).not.toBeNull();
    const inlineSource = inline?.textContent || '';
    expect(inlineSource).toContain("s.src='https://betterstack.net/b.js?t='+r");
    expect(inlineSource).toContain('s.async=1');
    expect(inlineSource).toContain("s.crossOrigin='anonymous'");
    expect(inlineSource).toContain(JSON.stringify(FAKE_RUM_TOKEN));

    runSnippet(element.props.children || '');

    expect(loaderSrc()).toBe(`https://betterstack.net/b.js?t=${FAKE_RUM_TOKEN}`);
    const remote = document.querySelector(
      'script[src*="betterstack.net/b.js"]',
    ) as HTMLScriptElement;
    // The official snippet assigns async = 1. Browsers coerce that to true;
    // jsdom keeps the number.
    expect(remote.async).toBeTruthy();
    expect(remote.crossOrigin).toBe('anonymous');
    expect(rumWindow().betterstack?.q).toEqual([
      ['init', { environment: 'preview', release: FAKE_RELEASE }],
    ]);
    expect(Object.keys(rumWindow().betterstack?.q?.[0][1] as object)).toEqual([
      'environment',
      'release',
    ]);
  });

  it('omits release when NEXT_PUBLIC_SENTRY_RELEASE is unset or blank', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = FAKE_RUM_TOKEN;
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = 'production';
    delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;

    expect(getBetterStackInitOptions()).toEqual({ environment: 'production' });
    const snippet = getBetterStackRumSnippet();
    expect(snippet).not.toBeNull();
    runSnippet(snippet || '');
    expect(loaderSrc()).toBe(`https://betterstack.net/b.js?t=${FAKE_RUM_TOKEN}`);
    expect(rumWindow().betterstack?.q).toEqual([
      ['init', { environment: 'production' }],
    ]);

    removeRumDom();
    process.env.NEXT_PUBLIC_SENTRY_RELEASE = '   ';
    const blankRelease = getBetterStackRumSnippet();
    runSnippet(blankRelease || '');
    expect(rumWindow().betterstack?.q).toEqual([
      ['init', { environment: 'production' }],
    ]);
    expect(rumWindow().betterstack?.q?.[0][1]).not.toHaveProperty('release');
  });

  it('uses production on a production build when the Sentry environment is unset', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
    delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = FAKE_RUM_TOKEN;

    expect(getBetterStackInitOptions()).toEqual({ environment: 'production' });
    runSnippet(getBetterStackRumSnippet() || '');
    expect(rumWindow().betterstack?.q).toEqual([
      ['init', { environment: 'production' }],
    ]);
  });

  it('falls back to NODE_ENV when no Sentry environment is set', () => {
    delete process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
    expect(getBetterStackInitOptions().environment).toBe(process.env.NODE_ENV || 'production');
  });

  it('does not let a weird token break out of the inline script', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = 'fake-<rum>"token"';
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = 'preview';
    delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;

    const snippet = getBetterStackRumSnippet() || '';
    expect(snippet).not.toContain('<');
    expect(snippet).not.toContain('</script>');
    runSnippet(snippet);
    expect(loaderSrc()).toBe('https://betterstack.net/b.js?t=fake-<rum>"token"');
    expect(rumWindow().betterstack?.q?.[0]).toEqual([
      'init',
      { environment: 'preview' },
    ]);
  });
});
