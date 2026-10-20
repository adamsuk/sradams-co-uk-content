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
        // Always in view under the scrolling page, and clear of the iOS home indicator.
        "z-20 w-full shrink-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-800 dark:bg-gray-950 print:border-0",
      )}
    >
      <nav aria-label="Contact" className="mx-auto flex max-w-7xl justify-evenly py-[0.25rem] print:py-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            <a href={item.url} className="inline-flex p-[0.25rem] print:hidden">
              <img
                className={cn("h-[1.5rem] w-auto sm:h-[1.75rem]", item.invert && "dark:invert")}
                src={item.img}
                alt={item.title}
              />
            </a>
            <p className="hidden print:block print:text-2xs">{item.url}</p>
          </div>
        ))}
      </nav>
    </footer>
  );
};

export default NavBar;
