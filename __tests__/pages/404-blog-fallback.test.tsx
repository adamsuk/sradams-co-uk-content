import React from 'react';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';

import Custom404 from '../../pages/404';
import { blogSlugFromPath, findPublicPost } from '../../helpers/blogPosts';

jest.mock('axios');

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

const posts = [
  {
    slug: 'blog.new-post',
    content: '---\ntitle: x\n---\nFresh **content** here',
    meta: { title: 'A brand new post', date: '2026-10-20', public: true },
  },
  {
    slug: 'secret-post',
    content: 'hidden',
    meta: { title: 'Secret', date: '2026-10-20', public: false },
  },
];

const setPath = (path: string) => {
  window.history.pushState({}, '', path);
};

describe('blogSlugFromPath', () => {
  it.each([
    ['/blog/new-post', 'new-post'],
    ['/blog/new-post/', 'new-post'],
    ['/blog/new-post.html', 'new-post'],
    ['/blog/new-post?x=1#top', 'new-post'],
    ['/blog', null],
    ['/blog/a/b', null],
    ['/cv', null],
    [undefined, null],
  ])('%s -> %s', (path, expected) => {
    expect(blogSlugFromPath(path)).toBe(expected);
  });
});

describe('findPublicPost', () => {
  it('matches normalised slugs and skips private posts', () => {
    expect(findPublicPost(posts as never, 'new-post')?.meta.title).toBe('A brand new post');
    expect(findPublicPost(posts as never, 'secret-post')).toBeUndefined();
    expect(findPublicPost(undefined, 'new-post')).toBeUndefined();
  });
});

describe('Custom404 blog fallback', () => {
  afterEach(() => {
    setPath('/');
    jest.resetAllMocks();
  });

  it('renders a post published after the last build', async () => {
    setPath('/blog/new-post');
    mockedAxios.get.mockResolvedValue({ data: posts });
    render(<Custom404 />);
    expect(await screen.findByText('A brand new post')).toBeInTheDocument();
    expect(screen.getByText(/Fresh/)).toBeInTheDocument();
    expect(screen.queryByText(/Uh oh/)).not.toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringMatching(/\/blog$/));
  });

  it('shows the 404 message for unknown or private posts', async () => {
    setPath('/blog/secret-post');
    mockedAxios.get.mockResolvedValue({ data: posts });
    render(<Custom404 />);
    expect(await screen.findByText(/Uh oh/)).toBeInTheDocument();
  });

  it('shows the 404 message when the CMS is unreachable', async () => {
    setPath('/blog/new-post');
    mockedAxios.get.mockRejectedValue(new Error('offline'));
    render(<Custom404 />);
    expect(await screen.findByText(/Uh oh/)).toBeInTheDocument();
  });

  it('does not call the CMS for non-blog paths', async () => {
    setPath('/nope');
    render(<Custom404 />);
    await waitFor(() => expect(screen.getByText(/Uh oh/)).toBeInTheDocument());
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});
