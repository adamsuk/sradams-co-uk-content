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

const SEP = ' · ';

/** "36 commits", "8 issues": a whole number and a word. */
const STAT = /^(\d[\d,]*)\s+(\S.*)$/;
/** Starts with a number: a count, a distance, a duration or a date ("20 Oct"). */
const NUMERIC = /^\d/;

export interface MetricRow {
  /** Small muted line above the title, e.g. "Top track" or "19 Oct". */
  kicker: string;
  title: string;
  /** The rest of the value, e.g. the artist. */
  secondary: string;
  /** A short trailing number or date, right-aligned, e.g. "2 plays". */
  suffix: string;
  /** Two or more "number word" parts become a small grid of stats. */
  stats: Array<{ value: string; label: string }>;
  url: string;
}

/**
 * Turns a feed row ("Top track · Song", "Artist · 2 plays") into parts that stack in a
 * narrow card. The feed stays generic; this only splits on its " · " separator.
 */
export function metricRow(row: SourceActivity): MetricRow {
  const labelParts = row.label.split(SEP);
  const kicker = labelParts.length > 1 ? labelParts[0] : '';
  const title = labelParts.length > 1 ? labelParts.slice(1).join(SEP) : row.label;
  const parts = row.value.split(SEP).map((part) => part.trim()).filter(Boolean);
  const base = {
    kicker, title, secondary: '', suffix: '', stats: [] as MetricRow['stats'], url: row.url,
  };
  if (parts.length >= 2 && parts.every((part) => STAT.test(part))) {
    return {
      ...base,
      stats: parts.map((part) => {
        const [, value, label] = part.match(STAT) as RegExpMatchArray;
        return { value, label };
      }),
    };
  }
  if (parts.every((part) => NUMERIC.test(part))) return { ...base, suffix: parts.join(SEP) };
  const last = parts[parts.length - 1] ?? '';
  if (parts.length > 1 && NUMERIC.test(last)) {
    return { ...base, secondary: parts.slice(0, -1).join(SEP), suffix: last };
  }
  return { ...base, secondary: parts.join(SEP) };
}

interface SourceMetricsProps {
  source: ActivitySource | null;
  /** Leave the label out when the surrounding card already shows it. */
  hideLabel?: boolean;
}

const muted = 'text-gray-500 dark:text-gray-400';

export function SourceMetrics({ source, hideLabel = false }: SourceMetricsProps) {
  if (!source) return null;

  return (
    <section aria-label={source.label} className="min-w-0 break-words text-left text-sm text-gray-800 [overflow-wrap:anywhere] dark:text-gray-100">
      {hideLabel ? null : (
        <p className={`text-xs font-medium uppercase tracking-wide ${muted}`}>
          {source.label}
        </p>
      )}
      {source.summary ? <p className={`${hideLabel ? '' : 'mt-1 '}font-medium tabular-nums`}>{source.summary}</p> : null}
      {source.activity.length === 0 ? (
        <p className={`mt-3 ${muted}`}>Nothing to show.</p>
      ) : (
        <ul className={`${source.summary || !hideLabel ? 'mt-2 ' : ''}divide-y divide-gray-200 dark:divide-gray-700`}>
          {source.activity.map((activity) => {
            const row = metricRow(activity);
            return (
              <li key={`${activity.label}-${activity.url}`} className="min-w-0 py-2">
                {row.kicker && <p className={`text-xs ${muted}`}>{row.kicker}</p>}
                <div className="flex items-baseline justify-between gap-3">
                  {row.url ? (
                    <a href={row.url} className="min-w-0 font-medium hover:underline" rel="noopener noreferrer" target="_blank">
                      {row.title}
                    </a>
                  ) : <span className="min-w-0 font-medium">{row.title}</span>}
                  {row.suffix && (
                    <span className={`shrink-0 whitespace-nowrap text-xs tabular-nums ${muted}`}>{row.suffix}</span>
                  )}
                </div>
                {row.secondary && <p className={`text-xs ${muted}`}>{row.secondary}</p>}
                {row.stats.length > 0 && (
                  <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
                    {row.stats.map((stat) => (
                      <div key={stat.label} className="flex items-baseline gap-1">
                        <dt className="sr-only">{stat.label}</dt>
                        <dd className="text-base font-semibold tabular-nums">{stat.value}</dd>
                        <span aria-hidden="true" className={`text-xs ${muted}`}>{stat.label}</span>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
