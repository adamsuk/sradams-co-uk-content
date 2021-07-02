import style from "./NavBar.module.scss";
  
const NavBar = () => (
    <div className={style.NavBar}>
        <a href="https://github.com/adamsuk">
            <img src="./Navbar/Github/GitHub-Mark-64px.png" alt="github" />
        </a>
        <a href="https://linkedin.com/in/scott-adams-a3b070192">
            <img src="./Navbar/LinkedIn/LI-In-Bug.png" alt="linkedin" />
        </a>
    </div>
);

export default NavBar;