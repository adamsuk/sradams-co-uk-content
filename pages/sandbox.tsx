import React, { useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import sandboxes from '../components/sandbox';

interface SandboxProps {
  className?: string;
}

function Sandbox({ className = '' }: SandboxProps) {
  const router = useRouter();
  const [sandbox, setSandbox] = useState({});
  const slug = typeof router.query.component === 'string'
    ? router.query.component
    : undefined;
  const found = sandboxes.findIndex((item) => item.slug === slug);
  const itemIndex = found >= 0 ? found : 0;
  const current = sandboxes[itemIndex];
  const Active = current.component;

  const select = (next: string) => {
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
          value={current.slug}
          onChange={(event) => select(event.target.value)}
        >
          {sandboxes.map((item) => (
            <option key={item.slug} value={item.slug}>{item.name}</option>
          ))}
        </select>
      </label>
      <div className="mt-4">
        <Active key={current.slug} sandbox={sandbox} setSandbox={setSandbox} />
      </div>
    </div>
  );
}

export default Sandbox;
