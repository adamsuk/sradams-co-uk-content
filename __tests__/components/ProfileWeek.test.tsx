import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import ProfileWeek, { ringArcs } from '../../components/ProfileWeek';
import { FEED_URL } from '../../components/RecentActivity';

const axiosMock = new AxiosMockAdapter(axios);

describe('ring arcs', () => {
  it('splits a circle by value and drops empty parts', () => {
    const arcs = ringArcs([10, 0, 30], ['a', 'b', 'c'], 10);
    expect(arcs).toHaveLength(2);
    expect(arcs[0].color).toBe('a');
    expect(arcs[1].color).toBe('c');
    expect(arcs[0].length).toBeLessThan(arcs[1].length);
  });
});

describe('ProfileWeek', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('draws the week on the portrait and opens the metrics from the photo', async () => {
    const start = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    axiosMock.onGet(FEED_URL).reply(200, {
      activities: [{
        id: 'run-1',
        name: 'Rushcliffe - Easy',
        sport: 'Run',
        start,
        distanceM: 5000,
        movingS: 1800,
        url: 'https://intervals.icu/activities/run-1',
      }],
      github: {
        accounts: [{
          login: 'adamsuk',
          label: 'Personal',
          contributions: 12,
          commits: 4,
          pullRequests: 1,
          reviews: 0,
          issues: 0,
        }],
      },
    });

    render(<ProfileWeek login="adamsuk" />);

    expect(screen.getByRole('img', { name: /Last 7 days/ })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /5\.0 km/ })).toBeInTheDocument();
    });
    expect(screen.getByRole('img', { name: /GitHub 12/ })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Last 7 days' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: "This week's metrics" }));

    expect(await screen.findByRole('region', { name: 'Last 7 days' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'GitHub last 7 days' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "This week's metrics" })).toHaveAttribute('aria-expanded', 'true');
  });
});
