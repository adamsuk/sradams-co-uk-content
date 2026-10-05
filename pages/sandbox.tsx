import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import sandboxes from '../components/sandbox';

interface SandboxProps {
  className?: string;
}

function Sandbox({ className = '' }: SandboxProps) {
  const [itemIndex, setItemIndex] = useState(0);
  const [sandbox, setSandbox] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (router.query?.component) {
      const index = sandboxes.findIndex(
        (item) => item.slug === router.query.component,
      );
      if (index !== -1) {
        setItemIndex(index);
      }
    }
  }, [router.query]);

  const select = (index: number) => {
    const slug = sandboxes[index]?.slug;
    if (!slug) return;
    setItemIndex(index);
    router.push(`/sandbox/?component=${slug}`, undefined, { shallow: true });
  };

  const Active = sandboxes[itemIndex]?.component;

  return (
    <div className={cn(className, 'mx-auto w-full max-w-5xl px-4 pb-10 pt-4')}>
      <h1 className="text-3xl font-bold tracking-tight">Sandbox</h1>
      <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
        Small experiments. Pick one.
      </p>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Experiments">
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
      <div className="mt-8">
        {Active ? <Active sandbox={sandbox} setSandbox={setSandbox} /> : null}
      </div>
    </div>
  );
}

export default Sandbox;
