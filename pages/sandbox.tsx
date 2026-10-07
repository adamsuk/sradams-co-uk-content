import React, { useEffect, useState } from 'react';
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
  const router = useRouter();
  const [sandbox, setSandbox] = useState({});
  const [checked, setChecked] = useState(false);
  const [locationSlug, setLocationSlug] = useState<string | undefined>();
  const querySlug = typeof router.query.component === 'string'
    ? router.query.component
    : undefined;

  useEffect(() => {
    setLocationSlug(slugFromLocation());
    setChecked(true);
  }, []);

  const slug = querySlug || (checked ? (locationSlug || sandboxes[0].slug) : undefined);
  const current = sandboxes.find((item) => item.slug === slug);
  const Active = current?.component;

  const select = (next: string) => {
    setLocationSlug(next);
    router.push(`/sandbox/?component=${next}`, undefined, { shallow: true });
  };

  return (
    <div className={cn(className, 'mx-auto w-full max-w-5xl px-4 pb-6 pt-4')}>
      <h1 className="text-3xl font-bold tracking-tight">Sandbox</h1>
      <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
        Small experiments. Pick one.
      </p>
      <label className="mt-4 block text-sm font-medium" htmlFor="experiment">
        Experiment
        <select
          id="experiment"
          className={[
            'mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2',
            'dark:border-gray-700 dark:bg-gray-900',
          ].join(' ')}
          value={slug || ''}
          onChange={(event) => select(event.target.value)}
        >
          <option value="" disabled>Choose an experiment</option>
          {sandboxes.map((item) => (
            <option key={item.slug} value={item.slug}>{item.title}</option>
          ))}
        </select>
      </label>
      {current && Active ? (
        <div className="mt-4">
          <Active key={current.slug} sandbox={sandbox} setSandbox={setSandbox} />
        </div>
      ) : null}
    </div>
  );
}

export default Sandbox;
