import './../../styles/global-styles/main.scss'
import './../../styles/style.scss'
import style from "./../../styles/Blog.module.scss";

import Head from "next/head";
import NavBar from '../../components/NavBar'
import Header from '../../components/Header'

const MyBlogApp = ({ Component, pageProps }) => (
  <div className={style.Blog}>
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
  
export default MyBlogApp;