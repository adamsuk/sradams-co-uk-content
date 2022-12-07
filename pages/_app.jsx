import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { ThemeProvider } from 'next-themes';

import '../styles/globals.css';

import Head from 'next/head';
import NavBar from '../components/NavBar';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);
  return (
    <>
      <Head>
        <title>Scott Adams</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider attribute="class" className="absolute inset-0">
        <div key="generic" className="flex flex-col h-screen justify-between">
          <Header />
          {loading ? (
            <div className="relative top-1/2 translate-y-[-50%]">
              <div className="justify-center items-center w-full p-3 md:p-7">
                <div className="flex flex-col m-auto text-center content-center md:max-w-[35%]">
                  <h1>Loading ...</h1>
                </div>
              </div>
            </div>
          ) : (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Component {...pageProps} className="container max-w-full overflow-y-auto h-full print:overflow-visible" />
          )}
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <NavBar {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

MyApp.defaultProps = {
  pageProps: {},
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
};

export default MyApp;
