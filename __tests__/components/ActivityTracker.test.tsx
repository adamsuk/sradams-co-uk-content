import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import ActivityTracker, { activityWeeks } from '../../components/ActivityTracker';
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
    expect(weeks[0].sessions).toHaveLength(1);
    expect(weeks[1].distanceM).toBe(7000);
    expect(weeks[2].distanceM).toBe(0);
    expect(weeks[2].sessions).toHaveLength(0);
    expect(weeks[1].label).toBe('3 Aug');
  });
});

describe('ActivityTracker', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('opens the latest week and switches when another bar is chosen', async () => {
    axiosMock.onGet(FEED_URL).reply(200, {
      activities: [
        activity({
          id: 'a',
          name: 'Rushcliffe - Easy',
          start: '2026-10-05T11:00:00Z',
          distanceM: 10000,
          movingS: 3600,
        }),
        activity({
          id: 'b',
          name: 'Rushcliffe - Recovery',
          start: '2026-09-28T11:00:00Z',
          distanceM: 5000,
          movingS: 1800,
          url: 'https://intervals.icu/activities/b',
        }),
      ],
    });
    render(<ActivityTracker />);
    expect(await screen.findByRole('region', { name: 'Training' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Easy/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Recovery/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /28 Sept/ }));
    expect(screen.getByRole('link', { name: /Recovery/ })).toHaveAttribute(
      'href',
      'https://intervals.icu/activities/b',
    );
    expect(screen.queryByRole('link', { name: /Easy/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Time' }));
    expect(screen.getByRole('button', { name: 'Time' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Distance' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders nothing when the feed is empty', async () => {
    axiosMock.onGet(FEED_URL).reply(200, { activities: [] });
    const { container } = render(<ActivityTracker />);
    await waitFor(() => expect(axiosMock.history.get.length).toBeGreaterThan(0));
    expect(container).toBeEmptyDOMElement();
  });
});
