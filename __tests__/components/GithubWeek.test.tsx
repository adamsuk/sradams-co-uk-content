import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import GithubWeek, {
  accountDetail,
  accountsFromGraphql,
  GITHUB_GRAPHQL,
  type AccountStats,
} from '../../components/GithubWeek';

const axiosMock = new AxiosMockAdapter(axios);

function stats(overrides: Partial<AccountStats> = {}): AccountStats {
  return {
    login: 'adamsuk',
    label: 'Personal',
    contributions: 0,
    commits: 0,
    pullRequests: 0,
    reviews: 0,
    ...overrides,
  };
}

describe('github week summary', () => {
  it('prefers commits and pull requests when they are public', () => {
    expect(accountDetail(stats({
      commits: 64,
      pullRequests: 17,
      reviews: 17,
      contributions: 114,
    }))).toBe('64 commits · 17 PRs · 17 reviews');
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

  it('reads both accounts from the GraphQL payload', () => {
    const accounts = accountsFromGraphql({
      data: {
        personal: {
          w: {
            totalCommitContributions: 2,
            contributionCalendar: { totalContributions: 3 },
          },
        },
        work: { w: { contributionCalendar: { totalContributions: 5 } } },
      },
    });
    expect(accounts.map((account) => account.login)).toEqual(['adamsuk', 'sra405']);
    expect(accounts[1].contributions).toBe(5);
  });
});

describe('GithubWeek', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('shows personal and work side by side', async () => {
    axiosMock.onPost(GITHUB_GRAPHQL).reply(200, {
      data: {
        personal: {
          w: {
            contributionCalendar: { totalContributions: 114 },
            totalCommitContributions: 64,
            totalPullRequestContributions: 17,
            totalPullRequestReviewContributions: 17,
          },
        },
        work: {
          w: {
            contributionCalendar: { totalContributions: 43 },
            totalCommitContributions: 0,
            totalPullRequestContributions: 0,
            totalPullRequestReviewContributions: 0,
          },
        },
      },
    });

    render(<GithubWeek now={Date.parse('2026-10-03T06:00:00Z')} />);

    expect(await screen.findByRole('region', { name: 'GitHub last 7 days' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Personal' })).toHaveAttribute('href', 'https://github.com/adamsuk');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', 'https://github.com/sra405');
    expect(screen.getByText('64 commits · 17 PRs · 17 reviews')).toBeInTheDocument();
    expect(screen.getByText('43 contributions')).toBeInTheDocument();
  });

  it('renders nothing when GitHub cannot be reached', async () => {
    axiosMock.onPost(GITHUB_GRAPHQL).reply(500);
    const { container } = render(<GithubWeek />);
    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(container).toBeEmptyDOMElement();
  });
});
