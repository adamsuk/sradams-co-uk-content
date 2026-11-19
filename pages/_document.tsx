import React from 'react';
import {
  Html, Head, Main, NextScript,
} from 'next/document';

import BetterStackRum from '../components/BetterStackRum';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {BetterStackRum()}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
