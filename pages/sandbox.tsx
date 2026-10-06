import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import sandboxes from '../components/sandbox';

interface SandboxProps {
  className?: string;
}

function slugFromLocation() {
  if (typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get('component') || undefined;
}

function Sandbox({ className = '' }: SandboxProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [chosenSlug, setChosenSlug] = useState<string | undefined>(slugFromLocation);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [sandbox, setSandbox] = useState({});
  const router = useRouter();
  const querySlug = typeof router.query.component === 'string'
    ? router.query.component
    : undefined;
  const slug = chosenSlug ?? querySlug ?? slugFromLocation();
  const found = slug ? sandboxes.findIndex((item) => item.slug === slug) : 0;
  const itemIndex = Math.max(0, found);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || window.sessionStorage.getItem('sandbox-menu-opened')) return;
    menu.open = true;
    window.sessionStorage.setItem('sandbox-menu-opened', '1');
    setHighlighted(slugFromLocation() || sandboxes[0].slug);
  }, []);

  const select = (index: number) => {
    const next = sandboxes[index]?.slug;
    if (!next) return;
    const href = `/sandbox/?component=${next}`;
    setHighlighted(null);
    setChosenSlug(next);
    window.history.replaceState(window.history.state, '', href);
    if (menuRef.current) menuRef.current.open = false;
    router.push(href, undefined, { shallow: true });
  };

  const onToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    const open = event.currentTarget.open;
    const current = slugFromLocation() || sandboxes[0].slug;
    setHighlighted(open ? current : null);
  };

  const Active = sandboxes[itemIndex]?.component;
  const idle = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  const idleDark = 'dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700';

  return (
    <div className={cn(className, 'mx-auto w-full max-w-5xl px-4 pb-6 pt-4')}>
      <h1 className="text-3xl font-bold tracking-tight">Sandbox</h1>
      <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
        Small experiments. Pick one.
      </p>
      <details
        ref={menuRef}
        onToggle={onToggle}
        className="mt-3 rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium">
          Choose an experiment
        </summary>
        <div className="flex flex-wrap gap-2 px-4 pb-3" role="tablist" aria-label="Experiments">
          {sandboxes.map((item, index) => {
            const selected = highlighted === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => select(index)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : `${idle} ${idleDark}`,
                )}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </details>
      <div className="mt-3">
        {Active ? (
          <Active
            key={sandboxes[itemIndex].slug}
            sandbox={sandbox}
            setSandbox={setSandbox}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Sandbox;
