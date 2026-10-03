import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface AccountStats {
  login: string;
  label: string;
  contributions: number;
  commits: number;
  pullRequests: number;
  reviews: number;
}

interface Collection {
  contributionCalendar?: { totalContributions?: number };
  totalCommitContributions?: number;
  totalPullRequestContributions?: number;
  totalPullRequestReviewContributions?: number;
}

interface GraphqlBody {
  data?: {
    personal?: { w?: Collection };
    work?: { w?: Collection };
  };
}

const ACCOUNTS = [
  { login: 'adamsuk', label: 'Personal', field: 'personal' },
  { login: 'sra405', label: 'Work', field: 'work' },
] as const;

export function weekRange(now = Date.now()): { from: string; to: string } {
  return {
    from: new Date(now - WEEK_MS).toISOString(),
    to: new Date(now).toISOString(),
  };
}

function count(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function accountDetail(stats: AccountStats): string {
  const parts: string[] = [];
  if (stats.commits > 0) parts.push(count(stats.commits, 'commit'));
  if (stats.pullRequests > 0) parts.push(count(stats.pullRequests, 'PR'));
  if (stats.reviews > 0) parts.push(count(stats.reviews, 'review'));
  if (parts.length > 0) return parts.join(' · ');
  if (stats.contributions > 0) return count(stats.contributions, 'contribution');
  return 'Quiet week';
}

function readCollection(
  collection: Collection | undefined,
  login: string,
  label: string,
): AccountStats {
  return {
    login,
    label,
    contributions: collection?.contributionCalendar?.totalContributions ?? 0,
    commits: collection?.totalCommitContributions ?? 0,
    pullRequests: collection?.totalPullRequestContributions ?? 0,
    reviews: collection?.totalPullRequestReviewContributions ?? 0,
  };
}

export function accountsFromGraphql(body: GraphqlBody): AccountStats[] {
  return ACCOUNTS.map((account) => readCollection(
    body.data?.[account.field]?.w,
    account.login,
    account.label,
  ));
}

const QUERY = `query($from: DateTime!, $to: DateTime!) {
  personal: user(login: "adamsuk") {
    w: contributionsCollection(from: $from, to: $to) {
      contributionCalendar { totalContributions }
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
  }
  work: user(login: "sra405") {
    w: contributionsCollection(from: $from, to: $to) {
      contributionCalendar { totalContributions }
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
  }
}`;

interface GithubWeekProps {
  now?: number;
}

function GithubWeek({ now = Date.now() }: GithubWeekProps) {
  const [accounts, setAccounts] = useState<AccountStats[] | null>(null);

  useEffect(() => {
    let cancel = false;
    const range = weekRange(now);
    axios.post(GITHUB_GRAPHQL, { query: QUERY, variables: range })
      .then((response) => {
        if (cancel) return;
        setAccounts(accountsFromGraphql(response.data as GraphqlBody));
      })
      .catch(() => {
        if (!cancel) setAccounts(null);
      });
    return () => {
      cancel = true;
    };
  }, [now]);

  if (!accounts) return null;

  return (
    <section
      className="mx-auto mt-5 w-full max-w-sm text-left text-gray-800 dark:text-gray-100"
      aria-label="GitHub last 7 days"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        GitHub · last 7 days
      </p>
      <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
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
            <span className="text-right tabular-nums">{accountDetail(account)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default GithubWeek;
