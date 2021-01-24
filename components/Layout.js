import Link from 'next/link'
import Head from "next/head";
import NavBar from './NavBar'
import Header from './Header'

import "./Layout.scss";
import "./index.scss";

const Layout = props => (
  <div className="Layout">
    <Head>
      <title>Scott Adams</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      </Head>

      <Header />
    <div className="Content">{props.children}</div>
    <NavBar />
  </div>
);
  
export default Layout;