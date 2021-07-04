import './../styles/global-styles/main.scss'
import './../styles/style.scss'
import style from "./../styles/Layout.module.scss";

import Head from "next/head";
import NavBar from '../components/NavBar'
import Header from '../components/Header'

import { useState, useEffect } from "react";
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }) => {

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateLoadingStatus = () => setIsLoading(!isLoading);

    Router.events.on("routeChangeStart", updateLoadingStatus);
    Router.events.on("routeChangeComplete", updateLoadingStatus);

    return () => {
      Router.events.off("routeChangeStart", updateLoadingStatus);
      Router.events.off("routeChangeComplete", updateLoadingStatus);
    };
  }, [isLoading]);

  return (
    <div className={style.Layout}>
      <Head>
        <title>Scott Adams</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <Header />
      { isLoading ? <p>Loading...</p> : <Component {...pageProps} /> }
      <NavBar />
    </div>
  )
};
  
export default MyApp;