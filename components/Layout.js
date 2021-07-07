import style from "../styles/Layout.module.scss";

const Layout = pageProps => (
  <div className={style.Content}>
    {pageProps.children}
  </div>
);
  
export default Layout;