import React from 'react';

import GithubWeek from './GithubWeek';
import RecentActivity from './RecentActivity';

function HomeStats() {
  return (
    <>
      <details className="group mx-auto mt-4 w-full max-w-sm md:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-gray-800 marker:hidden dark:text-gray-100 [&::-webkit-details-marker]:hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-90 dark:text-gray-400"
          >
            <path
              d="M7 5l6 5-6 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {'This week\'s metrics'}
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
