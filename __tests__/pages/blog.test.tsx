import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import Blog from '../../pages/blog';

const mockPush = jest.fn();
let mockQuery: Record<string, string> = {};

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
    pathname: '/blog',
    isReady: true,
  }),
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

jest.mock('react-spinners', () => ({
  PacmanLoader: () => <div data-testid="pacman-loader" />,
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

const axiosMock = new AxiosMockAdapter(axios);

const mockBlogPosts = [
  {
    name: 'first-post.md',
    slug: 'first-post',
    meta: { title: 'First Post', description: 'About the first post', date: '2024-01-01' },
    content: 'First post content',
  },
  {
    name: 'second-post.md',
    slug: 'second-post',
    meta: { title: 'Second Post', description: 'About the second post', date: '2024-02-01' },
    content: 'Second post content',
  },
  // Filtered out — name === 'blog.md'
  {
    name: 'blog.md', slug: 'blog', meta: { title: 'Blog Meta' }, content: '',
  },
  // Filtered out — no meta
  { name: 'no-meta.md', slug: 'no-meta', content: '' },
];

describe('Blog', () => {
  beforeEach(() => {
    axiosMock.reset();
    mockPush.mockClear();
    mockQuery = {};
  });

  it('shows a loader while data is being fetched', () => {
    axiosMock.onGet().reply(200, mockBlogPosts);
    render(<Blog />);
    expect(screen.getByTestId('pacman-loader')).toBeInTheDocument();
  });

  it('renders blog post titles in the sidebar after a successful fetch', async () => {
    axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
    render(<Blog />);
    await waitFor(() => expect(screen.getAllByText('First Post').length).toBeGreaterThanOrEqual(1));
    // Both post titles appear in the sidebar list
    expect(screen.getAllByText('Second Post').length).toBeGreaterThanOrEqual(1);
  });

  it('filters out blog.md from the post list', async () => {
    axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
    render(<Blog />);
    await waitFor(() => expect(screen.getAllByText('First Post').length).toBeGreaterThanOrEqual(1));
    expect(screen.queryByText('Blog Meta')).not.toBeInTheDocument();
  });

  it('filters out posts with no meta', async () => {
    axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
    render(<Blog />);
    await waitFor(() => expect(screen.getAllByText('First Post').length).toBeGreaterThanOrEqual(1));
    expect(screen.queryByText('no-meta')).not.toBeInTheDocument();
  });

  it('renders post descriptions in the sidebar', async () => {
    axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
    render(<Blog />);
    await waitFor(() => expect(screen.getByText('About the first post')).toBeInTheDocument());
    expect(screen.getByText('About the second post')).toBeInTheDocument();
  });

  it('displays the first post content by default', async () => {
    axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
    render(<Blog />);
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    expect(screen.getByTestId('markdown')).toHaveTextContent('First post content');
  });
});
