import React, { useEffect, useState } from 'react';
import axios from 'axios';

import GithubWeek, { accountsFromFeed } from './GithubWeek';
import ProfilePhoto from './ProfilePhoto';
import RecentActivity, {
  activitiesInLastSevenDays,
  FEED_URL,
  formatDistance,
  isFeedActivity,
  type FeedActivity,
} from './RecentActivity';

const ACTIVITY_STROKE = 'stroke-blue-600';
const GITHUB_STROKES = ['stroke-emerald-600', 'stroke-emerald-800'];

interface Arc {
  length: number;
  offset: number;
  color: string;
}

export function ringArcs(values: number[], colors: string[], radius: number): Arc[] {
  const circ = 2 * Math.PI * radius;
  const parts = values
    .map((value, index) => ({ value: Math.max(0, value), color: colors[index % colors.length] }))
    .filter((part) => part.value > 0);
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  if (total <= 0) return [];
  const gap = parts.length > 1 ? Math.min(10, circ / parts.length / 5) : 0;
  let cursor = 0;
  return parts.map((part) => {
    const share = (part.value / total) * circ;
    const arc = {
      length: Math.max(1, share - gap),
      offset: cursor,
      color: part.color,
    };
    cursor += share;
    return arc;
  });
}

function Ring({
  values,
  colors,
  radius,
}: {
  values: number[];
  colors: string[];
  radius: number;
}) {
  const arcs = ringArcs(values, colors, radius);
  return (
    <g transform="rotate(-90 60 60)">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        strokeWidth="7"
        className="stroke-gray-200 dark:stroke-gray-700"
      />
      {arcs.map((arc) => (
        <circle
          key={`${arc.color}-${arc.offset}`}
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeDasharray={`${arc.length} ${2 * Math.PI * radius}`}
          strokeDashoffset={-arc.offset}
          className={arc.color}
        />
      ))}
    </g>
  );
}

function ProfileWeek({ login }: { login: string }) {
  const [activities, setActivities] = useState<FeedActivity[] | null>(null);
  const [github, setGithub] = useState<number[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancel = false;
    axios.get(FEED_URL)
      .then((response) => {
        if (cancel) return;
        const body = response.data as { activities?: unknown };
        const rows = Array.isArray(body?.activities)
          ? body.activities.filter(isFeedActivity)
          : [];
        setActivities(rows);
        const accounts = accountsFromFeed(response.data) ?? [];
        setGithub(accounts.map((account) => account.contributions));
      })
      .catch(() => {
        if (!cancel) {
          setActivities([]);
          setGithub([]);
        }
      });
    return () => {
      cancel = true;
    };
  }, []);

  const week = activities ? activitiesInLastSevenDays(activities) : [];
  const distanceM = week.reduce((sum, activity) => sum + activity.distanceM, 0);
  const contributions = (github ?? []).reduce((sum, value) => sum + value, 0);
  const activitySummary = `${formatDistance(distanceM)}, ${week.length} sessions`;
  const caption = activities
    ? `Last 7 days. Activity ${activitySummary}. GitHub ${contributions}.`
    : 'Last 7 days';

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
        <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label={caption}>
          <Ring values={github ?? []} colors={GITHUB_STROKES} radius={54} />
          <Ring
            values={week.map((activity) => activity.distanceM)}
            colors={[ACTIVITY_STROKE]}
            radius={44}
          />
        </svg>
        <button
          type="button"
          className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100"
          aria-expanded={open}
          aria-controls="week-metrics"
          aria-label="This week's metrics"
          onClick={() => setOpen((value) => !value)}
        >
          <ProfilePhoto login={login} />
          <span className="pointer-events-none absolute inset-x-0 bottom-[12%] text-center">
            <span className="rounded-full bg-gray-900/80 px-2 py-0.5 text-2xs font-medium text-white">
              This week
            </span>
          </span>
        </button>
      </div>
      <p className="mt-3 flex items-center justify-center gap-4 text-2xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
          Activity
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true" />
          GitHub
        </span>
      </p>
      {open && (
        <div id="week-metrics" className="mx-auto w-full max-w-sm">
          <RecentActivity />
          <GithubWeek />
        </div>
      )}
    </div>
  );
}

export default ProfileWeek;
