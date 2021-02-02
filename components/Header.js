import Link from 'next/link'
import style from "./Header.module.scss";

const headerStyle = {
    backgroundColor: "blue",
    color: "white",
    width: "100%",
    height: "50px"
};
  
const Header = () => (
    <div className={style.Header}>
        <header>
          <nav>
            <Link href="/">
                <a>Home</a>
            </Link>{' '}
            |
            <Link href="/blog">
                <a>Blog</a>
            </Link>{' '}
            |
            <Link href="/sandbox">
                <a>Sandbox</a>
            </Link>{' '}
          </nav>
        </header>
    </div>
);
  
export default Header;