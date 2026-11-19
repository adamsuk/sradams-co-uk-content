import React, { ReactElement } from 'react';
import Script from 'next/script';

import { getBetterStackRumSnippet } from '../helpers/betterStackRum';

// Next.js only inlines a beforeInteractive next/script when that element is a
// direct child of <Head> or <body> in pages/_document. Call this function and
// place the element there (`{BetterStackRum()}`). Wrapping it in another
// component drops the tag from the static HTML.
export default function BetterStackRum(): ReactElement | null {
  const snippet = getBetterStackRumSnippet();
  if (!snippet) {
    return null;
  }

  return (
    <Script id="betterstack-rum" strategy="beforeInteractive">
      {snippet}
    </Script>
  );
}
