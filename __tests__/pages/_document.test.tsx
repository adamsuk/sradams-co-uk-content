import React, { ReactElement, ReactNode } from 'react';
import { Head } from 'next/document';
import Script from 'next/script';

import { getBetterStackRumSnippet } from '../../helpers/betterStackRum';
import Document from '../../pages/_document';

const FAKE_RUM_TOKEN = 'fake-betterstack-rum-token';

function isElement(node: ReactNode): node is ReactElement {
  return Boolean(node) && typeof node === 'object' && node !== null && 'type' in node;
}

// Next inlines a beforeInteractive next/script only when that element is a
// direct child of _document Head or body. React.Children.forEach matches
// handleDocumentScriptLoaderItems: it flattens fragments and does not walk
// into a wrapper component. <BetterStackRum /> would not be collected.
function directBeforeInteractiveScripts(documentElement: ReactElement): ReactElement[] {
  const top = React.Children.toArray(documentElement.props.children).filter(isElement);
  const head = top.find((child) => child.type === Head);
  const body = top.find((child) => child.type === 'body');
  const combined = [
    ...(Array.isArray(head?.props.children) ? head.props.children : [head?.props.children]),
    ...(Array.isArray(body?.props.children) ? body.props.children : [body?.props.children]),
  ];
  const scripts: ReactElement[] = [];
  React.Children.forEach(combined, (child) => {
    if (!isElement(child)) {
      return;
    }
    // Next marks official next/script components with this internal flag.
    // eslint-disable-next-line no-underscore-dangle
    const type = child.type as { __nextScript?: boolean };
    // eslint-disable-next-line no-underscore-dangle
    if (type?.__nextScript && child.props.strategy === 'beforeInteractive') {
      scripts.push(child);
    }
  });
  return scripts;
}

describe('pages/_document Better Stack tag', () => {
  const originalToken = process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = originalToken;
    }
  });

  it('places the beforeInteractive tag as a direct child of Head when the token is set', () => {
    process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = FAKE_RUM_TOKEN;

    const documentElement = Document() as ReactElement;
    const scripts = directBeforeInteractiveScripts(documentElement);

    expect(scripts).toHaveLength(1);
    expect(scripts[0].type).toBe(Script);
    expect(scripts[0].props.id).toBe('betterstack-rum');
    expect(scripts[0].props.strategy).toBe('beforeInteractive');
    expect(scripts[0].props.children).toBe(getBetterStackRumSnippet());
    expect(scripts[0].props.children).toContain('https://betterstack.net/b.js');
    expect(scripts[0].props.children).toContain(JSON.stringify(FAKE_RUM_TOKEN));
  });

  it.each([
    undefined,
    '',
    '   ',
    '\n\t',
  ])('omits the RUM tag from the document when the token is %p', (token) => {
    if (token === undefined) {
      delete process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN = token;
    }

    const documentElement = Document() as ReactElement;
    expect(directBeforeInteractiveScripts(documentElement)).toEqual([]);
    expect(JSON.stringify(documentElement)).not.toContain('betterstack');
    expect(JSON.stringify(documentElement)).not.toContain(FAKE_RUM_TOKEN);
  });
});
