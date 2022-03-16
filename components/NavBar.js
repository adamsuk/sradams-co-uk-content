import cn from 'classnames';
import env from '../default-env';

const NavBar = ({ className }) => {
  const menuItems = [
    { title: "github", url: `https://github.com/${env.NEXT_PUBLIC_GITHUB_PROFILE}`, img: "/Navbar/Github/GitHub-Mark-120px-plus.png" },
    { title: "linkedin", url: "https://linkedin.com/in/scott-adams-a3b070192", img: "/Navbar/LinkedIn/linkedin.png" },
    { title: "email", url: "mailto:sra405@protonmail.com", img: "/Navbar/email.png" },
  ];

  return (
    <div className="max-w-screen w-full justify-between">
      <footer className={cn(className, "mx-auto w-full max-w-7xl justify-center z-20 backdrop-filter backdrop-blur-lg bg-white/50 dark:bg-white/5 print:hidden")}>
        <div className="flex py-2 justify-evenly">
          {menuItems?.map((item) => (
            <a key={item?.title} href={item?.url}>
              <img className="visible dark:invert h-6" src={item?.img} alt={item?.title} />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default NavBar;
