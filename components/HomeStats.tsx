import React from 'react';

import GithubWeek from './GithubWeek';
import RecentActivity from './RecentActivity';

function HomeStats() {
  return (
    <>
      <details className="mx-auto mt-4 w-full max-w-sm md:hidden">
        <summary className="cursor-pointer list-none text-xs font-medium uppercase tracking-wide text-gray-500 marker:hidden dark:text-gray-400 [&::-webkit-details-marker]:hidden">
          This week
        </summary>
        <RecentActivity />
        <GithubWeek />
      </details>
      <div className="hidden md:block">
        <RecentActivity />
        <GithubWeek />
      </div>
    </>
  );
}

export default HomeStats;
