import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import env from '../default-env';

function NavBar({ className }) {
  const menuItems = [
    {
      title: 'Github',
      url: `https://github.com/${env.NEXT_PUBLIC_GITHUB_PROFILE}`,
      img: '/Navbar/Github/GitHub-Mark-120px-plus.png',
    },
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/scott-adams-a3b070192',
      img: '/Navbar/LinkedIn/linkedin.png',
    },
    {
      title: 'Email',
      url: 'mailto:sra405@protonmail.com',
      img: '/Navbar/email.png',
    },
    {
      title: 'Phone',
      url: 'tel:+447840579704',
      img: '/Navbar/phone.webp',
    },
  ];

  return (
    <div className="max-w-screen w-full justify-between">
      <footer
        className={cn(
          className,
          'mx-auto w-full justify-center z-20 backdrop-filter backdrop-blur-lg bg-white/50 dark:bg-white/5',
        )}
      >
        <div className="flex max-w-7xl mx-auto py-2 justify-evenly print:py-1">
          {menuItems?.map((item) => (
            <>
              <a key={item?.title} href={item?.url} className="print:hidden">
                <img
                  className="visible dark:invert h-6"
                  src={item?.img}
                  alt={item?.title}
                />
              </a>
              <div className="hidden flex print:visible print:text-2xs print:block">
                <p>{item?.url}</p>
              </div>
            </>
          ))}
        </div>
      </footer>
    </div>
  );
}

NavBar.defaultProps = {
  className: '',
};

NavBar.propTypes = {
  className: PropTypes.string,
};

export default NavBar;
