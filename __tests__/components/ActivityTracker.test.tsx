import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import ActivityTracker, {
  activityWeeks,
  kmTick,
  shortMoving,
} from '../../components/ActivityTracker';
import { FEED_URL, type FeedActivity } from '../../components/RecentActivity';

const axiosMock = new AxiosMockAdapter(axios);

function activity(overrides: Partial<FeedActivity> = {}): FeedActivity {
  return {
    id: 'i1',
    name: 'Run',
    sport: 'Run',
    start: '2026-10-05T11:00:00Z',
    distanceM: 5000,
    movingS: 1800,
    url: 'https://intervals.icu/activities/i1',
    ...overrides,
  };
}

describe('activity weeks', () => {
  it('buckets sessions by the London week and fills gaps', () => {
    const weeks = activityWeeks([
      activity({
        id: 'sun', start: '2026-08-02T15:18:48Z', distanceM: 5000, movingS: 1800,
      }),
      activity({
        id: 'mon', start: '2026-08-03T11:20:46Z', distanceM: 7000, movingS: 2400,
      }),
      activity({
        id: 'later', start: '2026-08-17T11:00:00Z', distanceM: 1000, movingS: 600,
      }),
    ]);
    expect(weeks.map((week) => week.start)).toEqual([
      '2026-07-27',
      '2026-08-03',
      '2026-08-10',
      '2026-08-17',
    ]);
    expect(weeks[0].distanceM).toBe(5000);
    expect(weeks[1].distanceM).toBe(7000);
    expect(weeks[2].distanceM).toBe(0);
    expect(weeks[1].label).toBe('3 Aug');
  });

  it('formats the ticks', () => {
    expect(kmTick(5100)).toBe('5.1');
    expect(kmTick(21359)).toBe('21');
    expect(shortMoving(1800)).toBe('30m');
    expect(shortMoving(7002)).toBe('1h57');
  });
});

describe('ActivityTracker', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('draws one bar per week with the distance and duration', async () => {
    axiosMock.onGet(FEED_URL).reply(200, {
      activities: [
        activity({
          id: 'a', start: '2026-10-05T11:00:00Z', distanceM: 10000, movingS: 3600,
        }),
        activity({
          id: 'b', start: '2026-09-28T11:00:00Z', distanceM: 5000, movingS: 1800,
        }),
      ],
    });
    render(<ActivityTracker />);
    expect(await screen.findByRole('region', { name: 'Training' })).toBeInTheDocument();
    expect(screen.getByText(/15\.0 km/)).toBeInTheDocument();
    expect(screen.getAllByText(/28 Sept/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/5 Oct/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('1h').length).toBeGreaterThan(0);
    expect(screen.getAllByText('30m').length).toBeGreaterThan(0);
  });

  it('renders nothing when the feed is empty', async () => {
    axiosMock.onGet(FEED_URL).reply(200, { activities: [] });
    const { container } = render(<ActivityTracker />);
    await waitFor(() => expect(axiosMock.history.get.length).toBeGreaterThan(0));
    expect(container).toBeEmptyDOMElement();
  });
});
