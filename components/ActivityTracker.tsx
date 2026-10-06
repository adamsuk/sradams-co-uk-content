import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  FEED_URL,
  formatDistance,
  formatMoving,
  isFeedActivity,
  type FeedActivity,
} from './RecentActivity';

const MAX_WEEKS = 16;

export interface ActivityWeek {
  start: string;
  label: string;
  distanceM: number;
  movingS: number;
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

export function shortMoving(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.round((safe % 3600) / 60);
  if (minutes === 60) return hours + 1 === 0 ? '60m' : `${hours + 1}h`;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}`;
}

export function kmTick(metres: number): string {
  const km = metres / 1000;
  return km >= 10 ? km.toFixed(0) : km.toFixed(1);
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
    };
    week.distanceM += activity.distanceM;
    week.movingS += activity.movingS;
    buckets.set(start, week);
  });
  const keys = [...buckets.keys()].sort();
  if (keys.length === 0) return [];
  const filled: ActivityWeek[] = [];
  for (let cursor = keys[0]; cursor <= keys[keys.length - 1]; cursor = addDays(cursor, 7)) {
    filled.push(buckets.get(cursor) ?? {
      start: cursor,
      label: weekLabel(cursor),
      distanceM: 0,
      movingS: 0,
    });
  }
  return filled.slice(-limit);
}

function ActivityTracker() {
  const [weeks, setWeeks] = useState<ActivityWeek[] | null>(null);

  useEffect(() => {
    let cancel = false;
    axios.get(FEED_URL)
      .then((response) => {
        if (cancel) return;
        const body = response.data as { activities?: unknown };
        const rows = Array.isArray(body?.activities)
          ? body.activities.filter(isFeedActivity)
          : [];
        setWeeks(activityWeeks(rows));
      })
      .catch(() => {
        if (!cancel) setWeeks([]);
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (!weeks || weeks.length === 0) return null;

  const maxDistance = Math.max(...weeks.map((week) => week.distanceM), 1);
  const distanceM = weeks.reduce((sum, week) => sum + week.distanceM, 0);
  const movingS = weeks.reduce((sum, week) => sum + week.movingS, 0);

  return (
    <section
      aria-label="Training"
      className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Training
        </p>
        <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {formatDistance(distanceM)}
          {' · '}
          {formatMoving(movingS)}
        </p>
      </div>
      <ul className="sr-only">
        {weeks.map((week) => (
          <li key={week.start}>
            {week.label}
            {': '}
            {formatDistance(week.distanceM)}
            {' in '}
            {formatMoving(week.movingS)}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-end gap-2 overflow-x-auto" aria-hidden="true">
        {weeks.map((week) => (
          <div key={week.start} className="flex w-11 shrink-0 flex-col items-center sm:w-auto sm:min-w-[2.75rem] sm:flex-1">
            <span className="text-2xs tabular-nums text-gray-500 dark:text-gray-400">
              {kmTick(week.distanceM)}
            </span>
            <div className="mt-1 flex h-16 w-full max-w-[2.25rem] items-end rounded-sm bg-gray-200 dark:bg-gray-800">
              <div
                className="w-full rounded-sm bg-gray-900 dark:bg-gray-100"
                style={{ height: `${Math.round((week.distanceM / maxDistance) * 100)}%` }}
                title={`${week.label}: ${formatDistance(week.distanceM)} · ${formatMoving(week.movingS)}`}
              />
            </div>
            <span className="mt-1 text-2xs text-gray-500 dark:text-gray-400">{week.label}</span>
            <span className="text-2xs tabular-nums text-gray-700 dark:text-gray-300">
              {shortMoving(week.movingS)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ActivityTracker;
