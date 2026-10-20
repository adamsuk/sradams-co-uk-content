import React from 'react';
import { render, screen } from '@testing-library/react';

import FeaturedItem, { featuredFromFeed } from '../../components/FeaturedItem';
import { sourcesFromFeed } from '../../components/ActivitySource';

describe('featured item', () => {
  it('keeps a valid card and drops unsafe fields', () => {
    const featured = featuredFromFeed({
      heading: 'Top album this week',
      title: 'Dopamine Chamber',
      subtitle: 'Fontaines D.C.',
      url: 'http://insecure.example/x',
      image: 'https://lastfm.freetls.fastly.net/i/u/300x300/a.png',
      details: ['9 plays', 4, ''],
      link: { label: 'Top track · Like You Did Before', detail: 'Circa Waves · 2 plays', url: 'https://www.last.fm/x' },
      video: { youtubeId: 'not a video id' },
    });
    expect(featured).toMatchObject({
      title: 'Dopamine Chamber',
      url: '',
      details: ['9 plays'],
      link: { label: 'Top track · Like You Did Before' },
    });
    expect(featured?.video).toBeUndefined();
    expect(featuredFromFeed({ heading: 'x' })).toBeNull();
    expect(featuredFromFeed('nope')).toBeNull();
  });

  it('is optional on every source', () => {
    const [github, intervals] = sourcesFromFeed({
      github: { label: 'GitHub', activity: [{ label: 'Personal', value: '1 commit', url: '' }] },
      intervals: {
        label: 'Training',
        activity: [],
        summary: '1 session',
        featured: { title: 'Evening run', route: { width: 100, height: 50, points: [[1, 2], [50, 40]] } },
      },
    });
    expect(github.featured).toBeNull();
    expect(intervals.featured?.route?.points).toHaveLength(2);
  });

  it('renders a route map for an activity', () => {
    render(
      <FeaturedItem
        source="Training"
        sourceId="intervals"
        featured={featuredFromFeed({
          heading: 'Latest activity',
          title: 'Evening run',
          subtitle: 'Run · 19 Oct',
          url: 'https://intervals.icu/activities/i1',
          details: ['6.2 km', '34m'],
          route: { width: 100, height: 50, points: [[1, 2], [50, 40], [90, 10]] },
        })}
      />,
    );
    expect(screen.getByText('Latest activity · Training')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Evening run' })).toHaveAttribute('href', 'https://intervals.icu/activities/i1');
    expect(screen.getByRole('img', { name: 'Route of Evening run' })).toBeInTheDocument();
    // Only the map and the activity name; the rest lives in "This week's metrics".
    expect(screen.queryByText('6.2 km · 34m')).not.toBeInTheDocument();
    expect(screen.queryByText('Run · 19 Oct')).not.toBeInTheDocument();
  });

  it('renders a cover with its title and artist, but no plays or top track', () => {
    render(
      <FeaturedItem
        featured={featuredFromFeed({
          heading: 'Top album this week',
          title: 'Dopamine Chamber',
          subtitle: 'Fontaines D.C.',
          details: ['9 plays'],
          image: 'https://lastfm.freetls.fastly.net/i/u/300x300/a.png',
          link: { label: 'Top track · Song', detail: 'Band', url: 'https://www.last.fm/x' },
          video: { youtubeId: 'dQw4w9WgXcQ', title: 'Band – Song' },
        })}
      />,
    );
    expect(screen.getByRole('img', { name: 'Dopamine Chamber' })).toHaveAttribute('src', 'https://lastfm.freetls.fastly.net/i/u/300x300/a.png');
    expect(screen.queryByText(/Top track/)).not.toBeInTheDocument();
    expect(screen.queryByText('9 plays')).not.toBeInTheDocument();
    expect(screen.getByText('Fontaines D.C.')).toBeInTheDocument();
    expect(screen.getByTitle('Band – Song')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('keeps a GitHub card to the PR title and repo', () => {
    render(
      <FeaturedItem
        sourceId="github"
        featured={featuredFromFeed({
          heading: 'Latest PR',
          title: 'Add featured items',
          subtitle: 'adamsuk/activity-feed #10',
          description: 'A long description of the change',
          details: ['Merged', 'Merged 20 Oct'],
        })}
      />,
    );
    expect(screen.getByText('Add featured items')).toBeInTheDocument();
    expect(screen.getByText('adamsuk/activity-feed #10')).toBeInTheDocument();
    expect(screen.queryByText(/long description/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Merged/)).not.toBeInTheDocument();
  });

  it('renders nothing without a card', () => {
    const { container } = render(<FeaturedItem featured={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
