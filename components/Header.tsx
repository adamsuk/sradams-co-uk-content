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
    <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 print:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:gap-4">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tighter">
          <span className="md:hidden">SA</span>
          <span className="hidden md:inline">Scott Adams</span>
        </Link>
        <nav className="min-w-0">
          <ul className="flex items-center">
            {menuItems.map((item) => {
              const active = isCurrent(pathname, item.url);
              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-block border-b-2 px-2 py-2 uppercase leading-[22px] md:px-3 lg:px-4',
                      active ? 'border-current' : 'border-transparent',
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && resolvedTheme === 'dark' && <WiDaySunny size={24} />}
          {mounted && resolvedTheme !== 'dark' && <WiMoonAltWaxingCrescent3 size={24} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
