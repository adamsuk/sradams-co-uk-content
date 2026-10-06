import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import sandboxes from '../components/sandbox';

interface SandboxProps {
  className?: string;
}

function Sandbox({ className = '' }: SandboxProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const openedOnLoad = useRef(false);
  const [chosenSlug, setChosenSlug] = useState<string | null>(null);
  const [sandbox, setSandbox] = useState({});
  const router = useRouter();
  const querySlug = typeof router.query.component === 'string' ? router.query.component : undefined;
  const slug = chosenSlug ?? querySlug;
  const itemIndex = !router.isReady && !chosenSlug
    ? null
    : Math.max(0, slug ? sandboxes.findIndex((item) => item.slug === slug) : 0);

  useEffect(() => {
    if (openedOnLoad.current || !menuRef.current) return;
    menuRef.current.open = true;
    openedOnLoad.current = true;
  }, []);

  const select = (index: number) => {
    const next = sandboxes[index]?.slug;
    if (!next) return;
    setChosenSlug(next);
    if (menuRef.current) menuRef.current.open = false;
    router.push(`/sandbox/?component=${next}`, undefined, { shallow: true });
  };

  const Active = itemIndex == null ? null : sandboxes[itemIndex]?.component;

  return (
    <div className={cn(className, 'mx-auto w-full max-w-5xl px-4 pb-6 pt-4')}>
      <h1 className="text-3xl font-bold tracking-tight">Sandbox</h1>
      <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
        Small experiments. Pick one.
      </p>
      <details
        ref={menuRef}
        className="mt-3 rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium">
          Choose an experiment
        </summary>
        <div className="flex flex-wrap gap-2 px-4 pb-3" role="tablist" aria-label="Experiments">
          {sandboxes.map((item, index) => {
            const selected = index === itemIndex;
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
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
                )}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </details>
      <div className="mt-3">
        {Active ? <Active sandbox={sandbox} setSandbox={setSandbox} /> : null}
      </div>
    </div>
  );
}

export default Sandbox;
