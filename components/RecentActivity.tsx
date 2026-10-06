import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const FEED_URL = 'https://activities.sradams.co.uk/feed.json';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface FeedActivity {
  id: string;
  name: string;
  sport: string;
  start: string;
  distanceM: number;
  movingS: number;
  url: string;
  account?: string;
}

interface Feed {
  activities?: unknown;
}

export function activityAccount(value: unknown): string {
  if (typeof value !== 'string') return '';
  const label = value.replace(/\s+/g, ' ').trim();
  if (!label || label.length > 40 || /[<>]/.test(label)) return '';
  return label;
}

export function isFeedActivity(value: unknown): value is FeedActivity {
  if (!value || typeof value !== 'object') return false;
  const row = value as FeedActivity;
  return typeof row.id === 'string'
    && typeof row.start === 'string'
    && typeof row.distanceM === 'number'
    && typeof row.movingS === 'number';
}

export function activitiesInLastSevenDays(
  activities: FeedActivity[],
  now = Date.now(),
): FeedActivity[] {
  return activities
    .filter((activity) => {
      const started = Date.parse(activity.start);
      return Number.isFinite(started) && started <= now && now - started <= WEEK_MS;
    })
    .sort((left, right) => Date.parse(right.start) - Date.parse(left.start));
}

export function formatDistance(metres: number): string {
  return `${(metres / 1000).toFixed(1)} km`;
}

export function formatMoving(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.round((safe % 3600) / 60);
  if (minutes === 60) {
    return `${hours + 1}h 0m`;
  }
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function formatWhen(start: string): string {
  const parsed = Date.parse(start);
  if (!Number.isFinite(parsed)) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  }).format(parsed);
}

export function activityLabel(activity: FeedActivity): string {
  if (activity.sport && activity.sport !== 'Other') return activity.sport;
  const name = (activity.name || '').trim();
  if (/football|soccer/i.test(name)) return 'Football';
  const head = name.split(' - ')[0].replace(/^Rushcliffe\s+/i, '').trim();
  if (!head) return 'Session';
  return head.length > 22 ? `${head.slice(0, 21)}…` : head;
}

function sessionWord(count: number): string {
  return count === 1 ? 'session' : 'sessions';
}

interface RecentActivityProps {
  now?: number;
}

function RecentActivity({ now = Date.now() }: RecentActivityProps) {
  const [activities, setActivities] = useState<FeedActivity[] | null>(null);

  useEffect(() => {
    let cancel = false;
    axios.get(FEED_URL)
      .then((response) => {
        if (cancel) return;
        const body = response.data as Feed;
        const rows = Array.isArray(body?.activities)
          ? body.activities.filter(isFeedActivity)
          : [];
        setActivities(rows);
      })
      .catch(() => {
        if (!cancel) setActivities(null);
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (!activities) return null;

  const week = activitiesInLastSevenDays(activities, now);
  const distanceM = week.reduce((sum, activity) => sum + activity.distanceM, 0);
  const movingS = week.reduce((sum, activity) => sum + activity.movingS, 0);

  return (
    <section
      className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left text-gray-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100 md:p-8"
      aria-label="Last 7 days"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Last 7 days
      </p>
      <p className="mt-1 text-sm tabular-nums">
        {formatDistance(distanceM)}
        {' · '}
        {week.length}
        {' '}
        {sessionWord(week.length)}
        {' · '}
        {formatMoving(movingS)}
      </p>
      {week.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Nothing in the last 7 days.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
          {week.map((activity) => (
            <li key={activity.id}>
              <a
                href={activity.url}
                className="flex items-baseline justify-between gap-3 py-1.5 text-sm hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>
                  {activityAccount(activity.account) ? `${activityAccount(activity.account)} · ` : ''}
                  {formatWhen(activity.start)}
                  {' · '}
                  {activityLabel(activity)}
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatDistance(activity.distanceM)}
                  {' · '}
                  {formatMoving(activity.movingS)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentActivity;
