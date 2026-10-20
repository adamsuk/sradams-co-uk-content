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
    expect(screen.getByText('6.2 km · 34m')).toBeInTheDocument();
  });

  it('renders a cover image, a secondary link and a video when given', () => {
    render(
      <FeaturedItem
        featured={featuredFromFeed({
          heading: 'Top album this week',
          title: 'Dopamine Chamber',
          image: 'https://lastfm.freetls.fastly.net/i/u/300x300/a.png',
          link: { label: 'Top track · Song', detail: 'Band', url: 'https://www.last.fm/x' },
          video: { youtubeId: 'dQw4w9WgXcQ', title: 'Band – Song' },
        })}
      />,
    );
    expect(screen.getByRole('img', { name: 'Dopamine Chamber' })).toHaveAttribute('src', 'https://lastfm.freetls.fastly.net/i/u/300x300/a.png');
    expect(screen.getByRole('link', { name: 'Top track · Song' })).toBeInTheDocument();
    expect(screen.getByTitle('Band – Song')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('renders nothing without a card', () => {
    const { container } = render(<FeaturedItem featured={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
