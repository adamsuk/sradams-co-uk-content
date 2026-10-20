import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FEED_URL } from './RecentActivity';
import { Featured, featuredFromFeed } from './FeaturedItem';

export const SOURCE_ORDER = ['github', 'intervals', 'goodreads'];

export interface SourceActivity {
  label: string;
  value: string;
  url: string;
}

export interface ActivitySource {
  id: string;
  label: string;
  profileUrl: string;
  profilePicture: string;
  /** Set by the feed on the source whose picture is the safe fallback (GitHub). */
  fallbackPicture: boolean;
  summary: string;
  activity: SourceActivity[];
  /** Optional card shown beside the metrics. */
  featured: Featured | null;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function https(value: unknown): string {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export function sourcesFromFeed(body: unknown): ActivitySource[] {
  if (!body || typeof body !== 'object') return [];
  const record = body as Record<string, unknown>;
  const ids = [
    ...SOURCE_ORDER.filter((id) => id in record),
    ...Object.keys(record).filter((id) => id !== 'updatedAt' && !SOURCE_ORDER.includes(id)),
  ];
  return ids.flatMap((id) => {
    const row = record[id];
    if (!row || typeof row !== 'object' || Array.isArray(row)) return [];
    const source = row as Record<string, unknown>;
    if (!Array.isArray(source.activity)) return [];
    const activity = source.activity.flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const activityRow = item as Record<string, unknown>;
      const label = clean(activityRow.label, 80);
      const value = clean(activityRow.value, 160);
      if (!label || !value) return [];
      return [{ label, value, url: https(activityRow.url) }];
    });
    return [{
      id,
      label: clean(source.label, 40) || id,
      profileUrl: https(source.profileUrl),
      profilePicture: https(source.profilePicture),
      fallbackPicture: source.fallbackPicture === true,
      summary: clean(source.summary, 160),
      activity,
      featured: featuredFromFeed(source.featured),
    }];
  });
}

/** The flagged fallback source's picture, else the GitHub profile picture. */
export function fallbackPicture(sources: ActivitySource[] | null, login?: string): string {
  const flagged = sources?.find((source) => source.fallbackPicture && source.profilePicture);
  if (flagged) return flagged.profilePicture;
  return login ? `https://github.com/${login}.png` : '';
}

export const FEED_TIMEOUT_MS = 8000;

/** A source worth showing: it has a summary or at least one activity row. */
export function usableSources(sources: ActivitySource[]): ActivitySource[] {
  return sources.filter((source) => source.summary || source.activity.length > 0);
}

/**
 * Loads the activity feed. Resolves to [] when the feed errors, times out,
 * returns non-OK or invalid JSON, or has no usable sources, so callers can
 * fall back to the GitHub picture and hide the metrics.
 */
export function useActivitySources(): ActivitySource[] | null {
  const [sources, setSources] = useState<ActivitySource[] | null>(null);

  useEffect(() => {
    let cancel = false;
    axios.get(FEED_URL, { timeout: FEED_TIMEOUT_MS })
      .then((response) => {
        if (cancel) return;
        let { data } = response;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            data = null;
          }
        }
        setSources(usableSources(sourcesFromFeed(data)));
      })
      .catch(() => {
        if (!cancel) setSources([]);
      });
    return () => {
      cancel = true;
    };
  }, []);

  return sources;
}

export function SourceMetrics({ source }: { source: ActivitySource | null }) {
  if (!source) return null;

  return (
    <section aria-label={source.label} className="text-left text-sm text-gray-800 dark:text-gray-100">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {source.label}
      </p>
      {source.summary ? <p className="mt-1 tabular-nums">{source.summary}</p> : null}
      {source.activity.length === 0 ? (
        <p className="mt-3 text-gray-500 dark:text-gray-400">Nothing to show.</p>
      ) : (
        <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
          {source.activity.map((row) => (
            <li key={`${row.label}-${row.url}`} className="flex items-baseline justify-between gap-3 py-1.5">
              {row.url ? (
                <a href={row.url} className="hover:underline" rel="noopener noreferrer" target="_blank">
                  {row.label}
                </a>
              ) : <span>{row.label}</span>}
              <span className="min-w-0 text-right tabular-nums sm:whitespace-nowrap lg:landscape:whitespace-normal">{row.value}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
