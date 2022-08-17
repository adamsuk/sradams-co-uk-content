import React from 'react';
import { Menu } from '@headlessui/react';
import { useTheme } from 'next-themes';
import { WiDaySunny, WiMoonAltWaxingCrescent3 } from 'react-icons/wi';

function Header() {
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { title: 'Blog', url: '/blog' },
    { title: 'Sandbox', url: '/sandbox' },
    { title: 'CV', url: '/cv' },
  ];

  const DarkModeIcon = theme === 'dark' ? WiDaySunny : WiMoonAltWaxingCrescent3;

  return (
    <header
      className="fixed w-full overflow-x-scroll no-scrollbar backdrop-filter backdrop-blur-lg bg-white/50 dark:bg-white/5 z-20 trasition ease-in-out duration-500 print:hidden"
    >
      <div className="max-w-7xl mx-auto ">
        <div
          className="flex max-w-screen-xl py-2 mx-auto items-center justify-between px-4 trasition ease-in-out duration-500"
        >
          <a href="/" className="hidden md:block text-xl font-bold tracking-tighter">
            Scott Adams
          </a>
          <a href="/" className="visible md:hidden text-xl font-bold tracking-tighter pr-2">
            SA
          </a>
          <nav>
            <ul className="flex items-center justify-end">
              {menuItems?.map((item) => {
                if (item.options) {
                  return (
                    <Menu as="li" key={item?.title}>
                      <Menu.Button
                        key={item?.title}
                        className="inline-flex justify-center w-full px-2 lg:px-6"
                      >
                        {item?.title}
                      </Menu.Button>
                    </Menu>
                  );
                }
                return (
                  <li key={item?.title}>
                    <a href={item?.url} className="uppercase px-2 lg:px-6 py-2 border-b-2 border-transparent leading-[22px] md:px-3">
                      {item?.title}
                    </a>
                  </li>
                );
              })}
              <li key="dark-mode">
                <button
                  aria-label="Toggle Dark Mode"
                  type="button"
                  className="align-middle pl-2 md:pl-3"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <DarkModeIcon size={24} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
