import style from "./NavBar.module.scss";
  
const NavBar = () => (
    <div className={style.NavBar}>
        <a href="https://github.com/adamsuk">
            <img src="/Navbar/Github/GitHub-Mark-120px-plus.png" alt="github" />
        </a>
        <a href="https://linkedin.com/in/scott-adams-a3b070192">
            <img src="/Navbar/LinkedIn/LI-In-Bug.png" alt="linkedin" />
        </a>
        <a href="mailto:sra405@protonmail.com">
            <img src="/Navbar/email.png" alt="email" />
        </a>
    </div>
);

export default NavBar;