import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FEED_URL } from './RecentActivity';

export interface AccountStats {
  login: string;
  label: string;
  contributions: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
}

const LOGIN = /^[A-Za-z0-9-]{1,39}$/;

function cleanLabel(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const label = value.replace(/\s+/g, ' ').trim().slice(0, 40);
  return label || fallback;
}

function count(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function numeric(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

export function accountDetail(stats: AccountStats): string {
  const parts: string[] = [];
  if (stats.commits > 0) parts.push(count(stats.commits, 'commit'));
  if (stats.pullRequests > 0) parts.push(count(stats.pullRequests, 'PR'));
  if (stats.reviews > 0) parts.push(count(stats.reviews, 'review'));
  if (stats.issues > 0) parts.push(count(stats.issues, 'issue'));
  if (parts.length > 0) return parts.join(' · ');
  if (stats.contributions > 0) return count(stats.contributions, 'contribution');
  return 'Quiet week';
}

export function accountsFromFeed(body: unknown): AccountStats[] | null {
  if (!body || typeof body !== 'object' || !('github' in body)) return null;
  const { github } = body as { github?: { accounts?: unknown } };
  if (!github || !Array.isArray(github.accounts)) return null;
  const rows = github.accounts.filter(
    (item): item is AccountStats => Boolean(item) && typeof item === 'object',
  );
  const accounts = rows.flatMap((row) => {
    if (typeof row.login !== 'string' || !LOGIN.test(row.login)) return [];
    return [{
      login: row.login,
      label: cleanLabel(row.label, row.login),
      contributions: numeric(row.contributions),
      commits: numeric(row.commits),
      pullRequests: numeric(row.pullRequests),
      reviews: numeric(row.reviews),
      issues: numeric(row.issues),
    }];
  });
  return accounts.length > 0 ? accounts : null;
}

function GithubWeek({ plain = false }: { plain?: boolean }) {
  const [accounts, setAccounts] = useState<AccountStats[] | null>(null);

  useEffect(() => {
    let cancel = false;
    axios.get(FEED_URL)
      .then((response) => {
        if (cancel) return;
        setAccounts(accountsFromFeed(response.data));
      })
      .catch(() => {
        if (!cancel) setAccounts(null);
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (!accounts) return null;

  return (
    <section
      className={plain
        ? 'w-full text-left text-gray-800 dark:text-gray-100'
        : 'w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left text-gray-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100'}
      aria-label="GitHub last 7 days"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        GitHub · last 7 days
      </p>
      <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
        {accounts.map((account) => (
          <li key={account.login} className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
            <a
              href={`https://github.com/${account.login}`}
              className="shrink-0 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {account.label}
            </a>
            <span className="min-w-0 text-right tabular-nums">{accountDetail(account)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default GithubWeek;
