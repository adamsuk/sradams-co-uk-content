import Link from 'next/link'
import "./Header.scss";

const headerStyle = {
    backgroundColor: "blue",
    color: "white",
    width: "100%",
    height: "50px"
};
  
const Header = () => (
    <div className="Header">
        <header>
          <nav>
            <Link href="/">
                <a>Home</a>
            </Link>{' '}
            |
            <Link href="/about">
                <a>About</a>
            </Link>{' '}
          </nav>
        </header>
    </div>
);
  
export default Header;