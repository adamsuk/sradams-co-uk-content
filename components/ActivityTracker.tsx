import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  activityLabel,
  FEED_URL,
  formatDistance,
  formatMoving,
  formatWhen,
  isFeedActivity,
  type FeedActivity,
} from './RecentActivity';

const MAX_WEEKS = 16;

type Metric = 'distance' | 'time';

export interface ActivityWeek {
  start: string;
  label: string;
  distanceM: number;
  movingS: number;
  sessions: FeedActivity[];
}

function londonParts(iso: string): { year: number; month: number; day: number } | null {
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) return null;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(parsed));
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const year = value('year');
  const month = value('month');
  const day = value('day');
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function isoDate(year: number, month: number, day: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}`;
}

function mondayOf(iso: string): string | null {
  const parts = londonParts(iso);
  if (!parts) return null;
  const utc = Date.UTC(parts.year, parts.month - 1, parts.day);
  const weekday = new Date(utc).getUTCDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  const monday = new Date(utc - offset * 24 * 60 * 60 * 1000);
  return isoDate(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate());
}

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return isoDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

function weekLabel(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function sessionTitle(activity: FeedActivity): string {
  const name = (activity.name || '').trim();
  const split = name.split(' - ');
  const detail = split.length > 1 ? split.slice(1).join(' - ').trim() : activityLabel(activity);
  if (!detail) return activityLabel(activity);
  return detail.length > 48 ? `${detail.slice(0, 47)}…` : detail;
}

function metricValue(week: ActivityWeek, metric: Metric): number {
  return metric === 'distance' ? week.distanceM : week.movingS;
}

export function activityWeeks(activities: FeedActivity[], limit = MAX_WEEKS): ActivityWeek[] {
  const buckets = new Map<string, ActivityWeek>();
  activities.forEach((activity) => {
    const start = mondayOf(activity.start);
    if (!start) return;
    const week = buckets.get(start) ?? {
      start,
      label: weekLabel(start),
      distanceM: 0,
      movingS: 0,
      sessions: [],
    };
    week.distanceM += activity.distanceM;
    week.movingS += activity.movingS;
    week.sessions.push(activity);
    buckets.set(start, week);
  });
  const keys: string[] = [];
  buckets.forEach((_week, start) => {
    keys.push(start);
  });
  keys.sort();
  if (keys.length === 0) return [];
  const filled: ActivityWeek[] = [];
  for (let cursor = keys[0]; cursor <= keys[keys.length - 1]; cursor = addDays(cursor, 7)) {
    filled.push(buckets.get(cursor) ?? {
      start: cursor,
      label: weekLabel(cursor),
      distanceM: 0,
      movingS: 0,
      sessions: [],
    });
  }
  filled.forEach((week) => {
    week.sessions.sort((left, right) => Date.parse(right.start) - Date.parse(left.start));
  });
  return filled.slice(-limit);
}

function latestWeek(weeks: ActivityWeek[]): string {
  for (let index = weeks.length - 1; index >= 0; index -= 1) {
    if (weeks[index].sessions.length > 0) return weeks[index].start;
  }
  return weeks[weeks.length - 1].start;
}

function ActivityTracker() {
  const [weeks, setWeeks] = useState<ActivityWeek[] | null>(null);
  const [metric, setMetric] = useState<Metric>('distance');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    axios.get(FEED_URL)
      .then((response) => {
        if (cancel) return;
        const body = response.data as { activities?: unknown };
        const rows = Array.isArray(body?.activities)
          ? body.activities.filter(isFeedActivity)
          : [];
        const next = activityWeeks(rows);
        setWeeks(next);
        setSelected(next.length > 0 ? latestWeek(next) : null);
      })
      .catch(() => {
        if (!cancel) setWeeks([]);
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (!weeks || weeks.length === 0) return null;

  const chosen = weeks.find((week) => week.start === selected) ?? weeks[weeks.length - 1];
  const max = weeks.reduce((peak, week) => Math.max(peak, metricValue(week, metric)), 1);
  const distanceM = weeks.reduce((sum, week) => sum + week.distanceM, 0);
  const movingS = weeks.reduce((sum, week) => sum + week.movingS, 0);

  const move = (delta: number) => {
    const index = weeks.findIndex((week) => week.start === chosen.start);
    const next = weeks[index + delta];
    if (next) setSelected(next.start);
  };

  return (
    <section
      aria-label="Training"
      className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Training
          </p>
          <p className="mt-1 text-sm tabular-nums">
            {formatDistance(distanceM)}
            {' · '}
            {formatMoving(movingS)}
          </p>
        </div>
        <div className="flex rounded-full border border-gray-200 p-0.5 text-xs dark:border-gray-700">
          {(['distance', 'time'] as Metric[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={metric === option}
              className={`rounded-full px-3 py-1 capitalize ${
                metric === option
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setMetric(option)}
            >
              {option === 'distance' ? 'Distance' : 'Time'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-end gap-1" role="group" aria-label="Weeks">
        {weeks.map((week) => {
          const value = metricValue(week, metric);
          const height = value <= 0 ? 0 : Math.max(8, Math.round((value / max) * 100));
          const active = week.start === chosen.start;
          return (
            <button
              key={week.start}
              type="button"
              aria-pressed={active}
              aria-label={`${week.label}, ${formatDistance(week.distanceM)}, ${formatMoving(week.movingS)}`}
              className="flex min-w-0 flex-1 flex-col items-center"
              onClick={() => setSelected(week.start)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  move(1);
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  move(-1);
                }
              }}
            >
              <span className="flex h-24 w-full items-end px-0.5">
                <span
                  className={`block w-full rounded-t ${
                    active
                      ? 'bg-gray-900 dark:bg-gray-100'
                      : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </span>
              <span className={`mt-1 truncate text-2xs ${active ? 'font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {week.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700" aria-live="polite">
        <p className="text-sm font-medium">
          {chosen.label}
          <span className="ml-2 font-normal tabular-nums text-gray-500 dark:text-gray-400">
            {formatDistance(chosen.distanceM)}
            {' · '}
            {formatMoving(chosen.movingS)}
          </span>
        </p>
        {chosen.sessions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Nothing this week.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
            {chosen.sessions.map((session) => (
              <li key={session.id}>
                <a
                  href={session.url}
                  className="flex items-baseline justify-between gap-3 py-1.5 text-sm hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>
                    {formatWhen(session.start)}
                    {' · '}
                    {sessionTitle(session)}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatDistance(session.distanceM)}
                    {' · '}
                    {formatMoving(session.movingS)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default ActivityTracker;
