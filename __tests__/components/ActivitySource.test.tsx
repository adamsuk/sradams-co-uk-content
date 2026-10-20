import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  SourceMetrics, fallbackPicture, metricRow, sourcesFromFeed,
} from '../../components/ActivitySource';

const feed = {
  updatedAt: '2026-10-16T10:00:00.000Z',
  intervals: {
    label: 'Training',
    profileUrl: 'https://intervals.icu/',
    profilePicture: '',
    summary: '5.5 km · 1 session · 31m',
    activity: [{ label: '16 Oct · Run', value: '5.5 km · 31m', url: 'https://intervals.icu/activities/i1' }],
  },
  github: {
    label: 'GitHub',
    profileUrl: 'https://github.com/adamsuk',
    profilePicture: 'https://github.com/adamsuk.png',
    summary: '',
    activity: [{ label: 'Personal', value: '12 commits', url: 'https://github.com/adamsuk' }],
  },
};

describe('activity sources', () => {
  it('starts with github and keeps one row shape for every source', () => {
    const sources = sourcesFromFeed(feed);
    expect(sources.map((source) => source.id)).toEqual(['github', 'intervals']);
    expect(sources[0].profilePicture).toBe('https://github.com/adamsuk.png');
    expect(sources[1].summary).toBe('5.5 km · 1 session · 31m');
    expect(sources[1].activity[0]).toEqual({
      label: '16 Oct · Run',
      value: '5.5 km · 31m',
      url: 'https://intervals.icu/activities/i1',
    });
  });

  it('renders a source without knowing which one it is', () => {
    const [github] = sourcesFromFeed(feed);
    render(<SourceMetrics source={github} />);
    expect(screen.getByRole('link', { name: 'Personal' })).toHaveAttribute('href', 'https://github.com/adamsuk');
    expect(screen.getByText('12 commits')).toBeInTheDocument();
  });

  it('cycles from the profile photo', async () => {
    const sources = sourcesFromFeed(feed);
    function Harness() {
      const [index, setIndex] = React.useState(0);
      const source = sources[index];
      return (
        <>
          <button type="button" onClick={() => setIndex((current) => (current + 1) % sources.length)}>
            {`Show the next source after ${source.label}`}
          </button>
          <SourceMetrics source={source} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByText('12 commits')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /next source/i }));
    expect(screen.getByText('5.5 km · 1 session · 31m')).toBeInTheDocument();
    expect(screen.queryByText('12 commits')).not.toBeInTheDocument();
  });
});

describe('fallbackPicture', () => {
  it('picks the flagged source picture, else the GitHub login picture', () => {
    const sources = sourcesFromFeed({
      intervals: { label: 'Training', profilePicture: 'https://storage.googleapis.com/x', activity: [] },
      github: {
        label: 'GitHub', profilePicture: 'https://github.com/adamsuk.png', fallbackPicture: true, activity: [],
      },
    });
    expect(sources.find((s) => s.id === 'github')?.fallbackPicture).toBe(true);
    expect(sources.find((s) => s.id === 'intervals')?.fallbackPicture).toBe(false);
    expect(fallbackPicture(sources, 'other')).toBe('https://github.com/adamsuk.png');
    expect(fallbackPicture([], 'adamsuk')).toBe('https://github.com/adamsuk.png');
  });
});

describe('metric rows for a narrow card', () => {
  it('splits a music row into kicker, title, artist and a short count', () => {
    expect(metricRow({ label: 'Top track · Like You Did Before', value: 'Circa Waves · 2 plays', url: '' }))
      .toMatchObject({
        kicker: 'Top track', title: 'Like You Did Before', secondary: 'Circa Waves', suffix: '2 plays', stats: [],
      });
    expect(metricRow({ label: 'Top artist · Fontaines D.C.', value: '15 plays', url: '' }))
      .toMatchObject({ kicker: 'Top artist', title: 'Fontaines D.C.', suffix: '15 plays' });
  });

  it('turns GitHub counts into a stat grid', () => {
    const row = metricRow({ label: 'Personal', value: '36 commits · 35 PRs · 24 reviews · 8 issues', url: '' });
    expect(row.title).toBe('Personal');
    expect(row.stats).toEqual([
      { value: '36', label: 'commits' },
      { value: '35', label: 'PRs' },
      { value: '24', label: 'reviews' },
      { value: '8', label: 'issues' },
    ]);
    expect(metricRow({ label: 'Work', value: '55 contributions', url: '' }).suffix).toBe('55 contributions');
  });

  it('keeps training and reading values short and right-aligned', () => {
    expect(metricRow({ label: '19 Oct · Run', value: '6.2 km · 34m', url: '' }))
      .toMatchObject({
        kicker: '19 Oct', title: 'Run', suffix: '6.2 km · 34m', secondary: '',
      });
    expect(metricRow({ label: 'Q. E. D.', value: 'Reading · 16 Oct', url: '' }))
      .toMatchObject({
        kicker: '', title: 'Q. E. D.', secondary: 'Reading', suffix: '16 Oct',
      });
  });

  it('renders the stacked layout with a stat grid', () => {
    const [github] = sourcesFromFeed({
      github: { label: 'GitHub', activity: [{ label: 'Personal', value: '36 commits · 8 issues', url: '' }] },
    });
    render(<SourceMetrics source={github} hideLabel />);
    expect(screen.getByText('36')).toBeInTheDocument();
    expect(screen.getByText('commits', { selector: 'dt' })).toBeInTheDocument();
  });
});
