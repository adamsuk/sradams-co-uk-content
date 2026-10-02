import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import RecentActivity, {
  activitiesInLastSevenDays,
  activityLabel,
  FEED_URL,
  formatDistance,
  formatMoving,
  type FeedActivity,
} from '../../components/RecentActivity';

const axiosMock = new AxiosMockAdapter(axios);

function activity(overrides: Partial<FeedActivity> = {}): FeedActivity {
  return {
    id: 'i1',
    name: 'Rushcliffe Running',
    sport: 'Run',
    start: '2026-10-01T11:00:00Z',
    distanceM: 5000,
    movingS: 1800,
    url: 'https://intervals.icu/activities/i1',
    ...overrides,
  };
}

describe('recent activity helpers', () => {
  const now = Date.parse('2026-10-02T12:00:00Z');

  it('keeps only the last seven days, newest first', () => {
    const rows = [
      activity({ id: 'old', start: '2026-09-20T09:00:00Z' }),
      activity({ id: 'mid', start: '2026-09-28T12:00:00Z' }),
      activity({ id: 'new', start: '2026-10-01T19:00:00Z' }),
    ];
    expect(activitiesInLastSevenDays(rows, now).map((row) => row.id)).toEqual(['new', 'mid']);
  });

  it('formats distance and moving time', () => {
    expect(formatDistance(5054)).toBe('5.1 km');
    expect(formatMoving(1800)).toBe('30m');
    expect(formatMoving(7002)).toBe('1h 57m');
  });

  it('labels football instead of Other', () => {
    expect(activityLabel(activity({
      sport: 'Other',
      name: 'Rushcliffe Soccer/Football',
    }))).toBe('Football');
    expect(activityLabel(activity())).toBe('Run');
  });
});

describe('RecentActivity', () => {
  const now = Date.parse('2026-10-02T12:00:00Z');

  beforeEach(() => {
    axiosMock.reset();
  });

  it('shows the week summary and the sessions inside it', async () => {
    axiosMock.onGet(FEED_URL).reply(200, {
      source: 'intervals',
      activities: [
        activity({
          id: 'ball',
          sport: 'Other',
          name: 'Rushcliffe Soccer/Football',
          start: '2026-10-01T19:06:29Z',
          distanceM: 5054,
          movingS: 2926,
          url: 'https://intervals.icu/activities/ball',
        }),
        activity({
          id: 'run',
          start: '2026-09-30T11:48:29Z',
          distanceM: 5498,
          movingS: 1859,
          url: 'https://intervals.icu/activities/run',
        }),
        activity({ id: 'old', start: '2026-08-01T11:00:00Z' }),
      ],
    });

    render(<RecentActivity now={now} />);

    expect(await screen.findByRole('region', { name: 'Last 7 days' })).toBeInTheDocument();
    expect(screen.getByText(/2 sessions/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Football/ })).toHaveAttribute(
      'href',
      'https://intervals.icu/activities/ball',
    );
    expect(screen.getByRole('link', { name: /Run/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /1 Aug|Aug/ })).not.toBeInTheDocument();
  });

  it('says when the last week was empty', async () => {
    axiosMock.onGet(FEED_URL).reply(200, {
      source: 'intervals',
      activities: [activity({ start: '2026-01-01T00:00:00Z' })],
    });
    render(<RecentActivity now={now} />);
    expect(await screen.findByText('Nothing in the last 7 days.')).toBeInTheDocument();
    expect(screen.getByText(/0 sessions/)).toBeInTheDocument();
  });

  it('renders nothing when the feed cannot be loaded', async () => {
    axiosMock.onGet(FEED_URL).reply(500);
    const { container } = render(<RecentActivity />);
    await waitFor(() => expect(axiosMock.history.get.length).toBe(1));
    expect(container).toBeEmptyDOMElement();
  });
});
