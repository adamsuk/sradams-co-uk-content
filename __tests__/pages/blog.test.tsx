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

interface MarkdownProps {
  children: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, React.ComponentType<any>>;
}

let capturedComponents: Record<string, React.ComponentType<any>> | undefined;
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children, components }: MarkdownProps) => {
    capturedComponents = components;
    return <div data-testid="markdown">{children}</div>;
  },
}));

const axiosMock = new AxiosMockAdapter(axios);

const mockBlogPosts = [
  {
    name: 'blog.2024.01.01.first-post.md',
    slug: 'blog.2024.01.01.first-post',
    meta: {
      title: 'First Post', desc: 'About the first post', date: '2024-01-01', public: true,
    },
    content: 'First post content',
  },
  {
    name: 'blog.2024.02.01.second-post.md',
    slug: 'blog.2024.02.01.second-post',
    meta: {
      title: 'Second Post', desc: 'About the second post', date: '2024-02-01', public: true,
    },
    content: 'Second post content',
  },
  // Filtered out — public: false
  {
    name: 'blog.2024.03.01.draft-post.md',
    slug: 'blog.2024.03.01.draft-post',
    meta: {
      title: 'Draft Post', desc: 'Not published', date: '2024-03-01', public: false,
    },
    content: '',
  },
  // Filtered out — no meta
  { name: 'no-meta.md', slug: 'no-meta', content: '' },
];

describe('Blog', () => {
  beforeEach(() => {
    axiosMock.reset();
    mockPush.mockClear();
    mockQuery = {};
    capturedComponents = undefined;
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

  it('filters out posts with public: false', async () => {
    axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
    render(<Blog />);
    await waitFor(() => expect(screen.getAllByText('First Post').length).toBeGreaterThanOrEqual(1));
    expect(screen.queryByText('Draft Post')).not.toBeInTheDocument();
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

  describe('img component', () => {
    let ImgComponent: React.FC<{ src?: string; alt?: string }>;

    beforeEach(async () => {
      axiosMock.onGet(/\/blog/).reply(200, mockBlogPosts);
      render(<Blog />);
      await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
      ImgComponent = capturedComponents!.img as React.FC<{ src?: string; alt?: string }>;
    });

    it('passes the custom img component to Markdown', () => {
      expect(capturedComponents?.img).toBeDefined();
    });

    it('decodes literal &amp; entities in image src URLs', () => {
      const urlWithAmpEntities = 'https://img.shields.io/badge/foo?&amp;style=flat&amp;logo=bar';
      const expectedUrl = 'https://img.shields.io/badge/foo?&style=flat&logo=bar';

      const { container } = render(<ImgComponent src={urlWithAmpEntities} alt="foo" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(expectedUrl);
    });

    it('strips a trailing %22 from image src URLs', () => {
      const urlWithTrailingQuote = 'https://img.shields.io/badge/foo?&style=flat%22';
      const expectedUrl = 'https://img.shields.io/badge/foo?&style=flat';

      const { container } = render(<ImgComponent src={urlWithTrailingQuote} alt="foo" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(expectedUrl);
    });

    it('does not modify clean image src URLs', () => {
      const cleanUrl = 'https://img.shields.io/badge/foo?&style=flat';

      const { container } = render(<ImgComponent src={cleanUrl} alt="foo" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(cleanUrl);
    });
  });
});
