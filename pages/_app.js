import App from 'next/app';
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'

import Head from "next/head";
import NavBar from '../components/NavBar'
import Header from '../components/Header'

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props;
    pageProps.githubUsernames = {
      personal: "adamsuk",
      professional: "sra405",
    };
  return (
      <ThemeProvider attribute='class'>
        <div  key="generic" className='h-screen flex flex-col'>
          <Head>
            <title>Scott Adams</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
          </Head>
          <Header />
          <Component {...pageProps} />
          <NavBar {...pageProps}/>
        </div>
      </ThemeProvider>
    );
  }
};
  
export default MyApp;
