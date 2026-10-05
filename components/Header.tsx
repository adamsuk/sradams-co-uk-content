import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useTheme } from 'next-themes';
import { WiDaySunny, WiMoonAltWaxingCrescent3 } from 'react-icons/wi';

const menuItems = [
  { title: 'Blog', url: '/blog' },
  { title: 'Sandbox', url: '/sandbox' },
  { title: 'CV', url: '/cv' },
];

function isCurrent(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed z-20 w-full bg-white/50 backdrop-blur-lg backdrop-filter transition duration-500 ease-in-out dark:bg-white/5 print:hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2 transition duration-500 ease-in-out">
          <Link href="/" className="shrink-0 pr-2 text-xl font-bold tracking-tighter">
            <span className="hidden md:inline">Scott Adams</span>
            <span className="md:hidden">SA</span>
          </Link>
          <nav>
            <ul className="flex items-center justify-end">
              {menuItems.map((item) => {
                const active = isCurrent(pathname, item.url);
                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'border-b-2 px-2 py-2 uppercase leading-[22px] md:px-3 lg:px-6',
                        active ? 'border-current' : 'border-transparent',
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  aria-label="Toggle Dark Mode"
                  type="button"
                  className="pl-2 align-middle md:pl-3"
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center">
                    {mounted && resolvedTheme === 'dark' && <WiDaySunny size={24} />}
                    {mounted && resolvedTheme !== 'dark' && (
                      <WiMoonAltWaxingCrescent3 size={24} />
                    )}
                  </span>
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
