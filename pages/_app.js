import App from 'next/app';
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'

import Head from "next/head";
import NavBar from '../components/NavBar'
import Header from '../components/Header'

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props;
    pageProps.githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'adamsuk';
      <ThemeProvider attribute='class' className='absolute inset-0'>
        <div  key="generic" className='flex flex-col h-screen'>
          <Head>
            <html lang='en' />
            <title>Scott Adams</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
          </Head>
          <Header />
          <Component {...pageProps} className="mb-auto" />
          <NavBar {...pageProps} className="sticky bottom-0" />
        </div>
      </ThemeProvider>
    );
  }
};
  
export default MyApp;
