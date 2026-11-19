import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

import Head from "next/head";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import ScrollArea from "../components/ScrollArea";
import SentryErrorBoundary from "../components/SentryErrorBoundary";
import { getBetterStackRumToken } from "../helpers/betterStackRum";
import { initSentry } from "../helpers/initSentry";

// The b.js tag embeds Sentry. Skip the standalone client while that token is
// set so both do not share window.Sentry. An unset or blank token still calls
// initSentry(), which no-ops without a DSN and initialises when one is set.
if (!getBetterStackRumToken()) {
  initSentry();
}

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router]);

  return (
    <>
      <Head>
        <title>Scott Adams</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {/* Full-height shell: header on top, contact bar at the bottom, the page scrolls between. */}
        <div
          key="generic"
          className="app-shell flex flex-col overflow-hidden print:h-auto print:overflow-visible"
        >
          <Header />
          <ScrollArea>
            <SentryErrorBoundary resetKey={router.asPath}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} setLoading={setLoading} loading={loading} />
            </SentryErrorBoundary>
          </ScrollArea>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <NavBar {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
