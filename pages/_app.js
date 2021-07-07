import App from 'next/app';

import './../styles/global-styles/main.scss'
import './../styles/style.scss'

import Head from "next/head";
import NavBar from '../components/NavBar'
import Header from '../components/Header'

import style from "./../styles/Layout.module.scss";

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props;
    const Layout = Component.Layout || style.Layout;
  return (
      <div className={Layout}>
        <Head>
          <title>Scott Adams</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <Header />
        <Component {...pageProps} />
        <NavBar />
      </div>
    );
  }
};
  
export default MyApp;