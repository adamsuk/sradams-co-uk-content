import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import GithubWeek, {
  accountDetail,
  accountsFromFeed,
  type AccountStats,
} from '../../components/GithubWeek';
import { FEED_URL } from '../../components/RecentActivity';

const axiosMock = new AxiosMockAdapter(axios);

function stats(overrides: Partial<AccountStats> = {}): AccountStats {
  return {
    login: 'adamsuk',
    label: 'Personal',
    contributions: 0,
    commits: 0,
    pullRequests: 0,
    reviews: 0,
    issues: 0,
    ...overrides,
  };
}

describe('github week summary', () => {
  it('prefers commits and pull requests when they are public', () => {
    expect(accountDetail(stats({
      commits: 64,
      pullRequests: 17,
      reviews: 17,
      issues: 13,
      contributions: 114,
    }))).toBe('64 commits · 17 PRs · 17 reviews · 13 issues');
    expect(accountDetail(stats({ commits: 1, pullRequests: 1, reviews: 1 }))).toBe('1 commit · 1 PR · 1 review');
  });

  it('uses the contribution count when the detail is private', () => {
    expect(accountDetail(stats({
      login: 'sra405',
      label: 'Work',
      contributions: 43,
    }))).toBe('43 contributions');
    expect(accountDetail(stats())).toBe('Quiet week');
  });

  it('reads the accounts the feed publishes', () => {
    const accounts = accountsFromFeed({
      github: {
        accounts: [
          {
            login: 'adamsuk',
            label: 'Personal',
            commits: 2,
            contributions: 3,
          },
          { login: 'not a login', commits: 9 },
          { login: 'octocat', label: 'Lab', contributions: 5 },
        ],
      },
    });
    expect(accounts?.map((account) => account.login)).toEqual(['adamsuk', 'octocat']);
    expect(accounts?.[1].label).toBe('Lab');
    expect(accountsFromFeed({ activities: [] })).toBeNull();
  });
});

describe('GithubWeek', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('shows personal and work side by side', async () => {
    axiosMock.onGet(FEED_URL).reply(200, {
      github: {
        accounts: [
          {
            login: 'adamsuk',
            label: 'Personal',
            contributions: 114,
            commits: 64,
            pullRequests: 17,
            reviews: 17,
            issues: 0,
          },
          {
            login: 'sra405',
            label: 'Work',
            contributions: 43,
            commits: 0,
            pullRequests: 0,
            reviews: 0,
            issues: 0,
          },
        ],
      },
    });

    render(<GithubWeek />);

    expect(await screen.findByRole('region', { name: 'GitHub last 7 days' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Personal' })).toHaveAttribute('href', 'https://github.com/adamsuk');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', 'https://github.com/sra405');
    expect(screen.getByText('64 commits · 17 PRs · 17 reviews')).toBeInTheDocument();
    expect(screen.getByText('43 contributions')).toBeInTheDocument();
  });

  it('renders nothing when the feed has no github block', async () => {
    axiosMock.onGet(FEED_URL).reply(200, { activities: [] });
    const { container } = render(<GithubWeek />);
    await waitFor(() => expect(axiosMock.history.get.length).toBe(1));
    expect(container).toBeEmptyDOMElement();
  });
});
