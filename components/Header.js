import style from "./../styles/Header.module.scss";

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
            <a href="/">Home</a>
            |
            <a href="/posts">Blog</a>
            |
            <a href="/music">Music</a>
            |
            <a href="/sandbox">Sandbox</a>
            |
            <a href="/posts/cv">CV</a>
          </nav>
        </header>
    </div>
);
  
export default Header;
