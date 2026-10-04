import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import LatestPost, { newestPost } from '../../components/LatestPost';
import env from '../../default-env';
import { BlogPost } from '../../models/blogPosts';

const axiosMock = new AxiosMockAdapter(axios);

function post(overrides: Partial<BlogPost> & { title?: string; date?: string; public?: boolean }): BlogPost {
  return {
    name: overrides.name || 'blog.2024.01.01.first.md',
    slug: overrides.slug || 'blog.2024.01.01.first',
    content: overrides.content || 'word '.repeat(40),
    meta: {
      title: overrides.title || 'First',
      desc: 'A short description',
      date: overrides.date || '2024-01-01',
      public: overrides.public,
      ...overrides.meta,
    },
  };
}

describe('newestPost', () => {
  it('picks the newest public post and skips the blog index and drafts', () => {
    const chosen = newestPost([
      post({ name: 'blog.md', title: 'Blog', date: '2026-01-01' }),
      post({ name: 'old.md', slug: 'blog.old', title: 'Older', date: '2024-01-01' }),
      post({
        name: 'new.md', slug: 'blog.new', title: 'Newer', date: '2026-05-02',
      }),
      post({
        name: 'draft.md', slug: 'blog.draft', title: 'Secret', date: '2026-08-01', public: false,
      }),
    ]);
    expect(chosen?.meta.title).toBe('Newer');
  });
});

describe('LatestPost', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('links the newest post beside the stats', async () => {
    axiosMock.onGet(`${env.NEXT_PUBLIC_CMS_URL}/blog`).reply(200, [
      post({ title: 'Older', date: '2024-01-01', slug: 'blog.older' }),
      post({
        title: 'Ship the feed',
        date: '2026-09-01',
        slug: 'blog.ship-the-feed',
        content: 'one two three',
      }),
    ]);
    render(<LatestPost />);
    const link = await screen.findByRole('link', { name: /Ship the feed/ });
    expect(link).toHaveAttribute('href', '/blog/ship-the-feed');
    expect(screen.getByText('Latest post')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/min read/)).toBeInTheDocument());
  });

  it('renders nothing when the blog cannot be loaded', async () => {
    axiosMock.onGet(`${env.NEXT_PUBLIC_CMS_URL}/blog`).reply(500);
    const { container } = render(<LatestPost />);
    await waitFor(() => expect(axiosMock.history.get.length).toBe(1));
    expect(container).toBeEmptyDOMElement();
  });
});
