import React from "react";
import cn from "classnames";
import env from "../default-env";

interface NavBarProps {
  className?: string;
}

const NavBar = ({ className = "" }: NavBarProps) => {
  const menuItems = [
    {
      title: "Github",
      url: `https://github.com/${env.NEXT_PUBLIC_GITHUB_PROFILE}`,
      img: "/Navbar/Github/GitHub-Mark-120px-plus.png",
      invert: true,
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/scott-adams-a3b070192",
      img: "/Navbar/LinkedIn/linkedin.png",
    },
    {
      title: "Email",
      url: "mailto:sra405@protonmail.com",
      img: "/Navbar/email.png",
    },
    {
      title: "Phone",
      url: "tel:+447840579704",
      img: "/Navbar/phone.webp",
    },
  ];

  return (
    <footer
      className={cn(
        className,
        "z-20 w-full bg-white/50 backdrop-blur-lg backdrop-filter dark:bg-white/5",
      )}
    >
      <div className="mx-auto flex max-w-7xl justify-evenly py-2 print:py-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            <a href={item.url} className="print:hidden">
              <img
                className={cn("h-6", item.invert && "dark:invert")}
                src={item.img}
                alt={item.title}
              />
            </a>
            <p className="hidden print:block print:text-2xs">{item.url}</p>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default NavBar;
