import Head from "next/head";
import NavBar from './NavBar'
import Header from './Header'

import style from "./Layout.module.scss";

const Layout = pageProps => (
  <div className={style.Layout}>
    <Head>
      <title>Scott Adams</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
    <Header />
    <div className={style.Content}>
      {pageProps.children}
    </div>
    <NavBar />
  </div>
);
  
export default Layout;