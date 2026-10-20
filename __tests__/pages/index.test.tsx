import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import Homepage, { profileIntro } from '../../pages/index';
import env from '../../default-env';

const mockPush = jest.fn();
let mockQuery: Record<string, string> = {};
let mockIsReady = true;

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
    pathname: '/',
    isReady: mockIsReady,
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
const README_CONTENT = '# Hello World\n\nThis is a test README.';

describe('Homepage', () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.onGet('https://activities.sradams.co.uk/feed.json').reply(200, {
      source: 'intervals',
      activities: [],
    });
    axiosMock.onGet(`${env.NEXT_PUBLIC_CMS_URL}/blog`).reply(200, []);
    mockPush.mockClear();
    mockQuery = {};
    mockIsReady = true;
    capturedComponents = undefined;
  });

  const FEED = 'https://activities.sradams.co.uk/feed.json';
  const GITHUB_PIC = `https://github.com/${env.NEXT_PUBLIC_GITHUB_PROFILE}.png`;
  const feedWithSource = {
    intervals: {
      label: 'Intervals',
      profilePicture: 'https://example.com/intervals.jpg',
      summary: '10 km',
      activity: [{ label: 'Run', value: '5 km', url: '' }],
    },
  };

  async function expectGithubFallback() {
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('img', { name: 'ME!' })).toHaveAttribute('src', GITHUB_PIC));
    expect(screen.queryByTestId('source-card')).not.toBeInTheDocument();
  }

  it('uses the GitHub picture and hides metrics when the feed fails', async () => {
    axiosMock.onGet(FEED).reply(500);
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await expectGithubFallback();
  });

  it('uses the GitHub picture and hides metrics when the feed times out', async () => {
    axiosMock.onGet(FEED).timeout();
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await expectGithubFallback();
  });

  it('uses the GitHub picture and hides metrics when the feed is invalid JSON', async () => {
    axiosMock.onGet(FEED).reply(200, '<html>oops');
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await expectGithubFallback();
  });

  it('uses the GitHub picture and hides metrics when the feed has no usable sources', async () => {
    axiosMock.onGet(FEED).reply(200, { github: { label: 'GitHub', activity: [] } });
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await expectGithubFallback();
  });

  // Scott's live feed from 16 Oct: Intervals picture is "" and nothing is flagged as the fallback.
  const liveFeed = {
    updatedAt: '2026-10-16T11:00:58.741Z',
    github: {
      label: 'GitHub',
      profileUrl: 'https://github.com/adamsuk',
      profilePicture: 'https://github.com/adamsuk.png',
      summary: '',
      activity: [{ label: 'Personal', value: '40 commits · 33 PRs · 34 reviews · 2 issues', url: 'https://github.com/adamsuk' }],
      updatedAt: '2026-10-16T11:00:58.206Z',
    },
    intervals: {
      label: 'Training',
      profileUrl: 'https://intervals.icu/',
      profilePicture: '',
      summary: '17.2 km · 3 sessions · 2h 3m',
      activity: [{ label: '15 Oct · Football', value: '5.9 km · 1h 0m', url: 'https://intervals.icu/activities/i197749007' }],
      updatedAt: '2026-10-16T11:00:58.741Z',
    },
    goodreads: {
      label: 'Reading',
      profileUrl: 'https://www.goodreads.com/user/show/176915360',
      profilePicture: 'https://images.gr-assets.com/users/1792145984p5/176915360.jpg',
      summary: '',
      activity: [{ label: 'Strange Pictures', value: 'Finished · 11 Oct', url: 'https://www.goodreads.com/book/show/222291395' }],
      updatedAt: '2026-10-16T11:00:58.206Z',
    },
  };

  it('shows the GitHub picture, not a letter, for Training when its picture is empty', async () => {
    axiosMock.onGet(FEED).reply(200, liveFeed);
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    fireEvent.click(await screen.findByRole('button', { name: /next source after GitHub/ }));
    expect(screen.getByRole('img', { name: 'Training' })).toHaveAttribute('src', GITHUB_PIC);
    expect(screen.queryByText('T')).not.toBeInTheDocument();
  });

  it('swaps a source picture that fails to load for the GitHub picture', async () => {
    const feed = { ...liveFeed, intervals: { ...liveFeed.intervals, profilePicture: 'https://example.com/broken.jpg' } };
    axiosMock.onGet(FEED).reply(200, feed);
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    fireEvent.click(await screen.findByRole('button', { name: /next source after GitHub/ }));
    const img = screen.getByRole('img', { name: 'Training' });
    expect(img).toHaveAttribute('src', 'https://example.com/broken.jpg');
    fireEvent.error(img);
    await waitFor(() => expect(screen.getByRole('img', { name: 'Training' })).toHaveAttribute('src', GITHUB_PIC));
  });

  it('shows the source picture and its metrics when the source has no featured item', async () => {
    axiosMock.onGet(FEED).reply(200, feedWithSource);
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    expect(await screen.findByText('Intervals · This week')).toBeInTheDocument();
    expect(screen.getByText('10 km')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'This week\'s metrics' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Intervals' })).toHaveAttribute('src', 'https://example.com/intervals.jpg');
  });

  it('starts on the featured item, toggles to metrics, and keeps them open across cycles', async () => {
    axiosMock.onGet(FEED).reply(200, {
      github: {
        label: 'GitHub',
        profilePicture: 'https://example.com/gh.png',
        activity: [{ label: 'Personal', value: '3 commits', url: '' }],
        featured: { heading: 'Latest PR', title: 'Add a thing', subtitle: 'adamsuk/x #1' },
      },
      goodreads: {
        label: 'Reading',
        profilePicture: 'https://example.com/gr.png',
        activity: [{ label: 'A book', value: 'Reading · 16 Oct', url: '' }],
        featured: { heading: 'Currently reading', title: 'A book', subtitle: 'An author' },
      },
    });
    axiosMock.onGet().reply(200, README_CONTENT);
    render(<Homepage />);
    expect(await screen.findByText('Add a thing')).toBeInTheDocument();
    expect(screen.queryByText('3 commits')).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'This week\'s metrics' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).not.toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByText('3 commits')).toBeInTheDocument();
    expect(screen.queryByText('Add a thing')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Show the next source/ }));
    expect(await screen.findByText('Reading · 16 Oct')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('A book', { selector: 'a, h2' })).toBeInTheDocument();
    expect(screen.queryByText('Reading · 16 Oct')).not.toBeInTheDocument();
  });

  it('shows the pacman loader while the profile is still loading', () => {
    axiosMock.onGet().reply(200, README_CONTENT);
    render(<Homepage />);
    expect(screen.getByTestId('pacman-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('intro-skeleton')).not.toBeInTheDocument();
  });

  it('keeps the introduction and drops the badge catalogues', () => {
    const readme = '# Hi\n\nI build things.\n\n### Tech Stack\n\n![JS](https://img.shields.io/badge/js)\n\n## How to reach me?\n';
    expect(profileIntro(readme)).toBe('# Hi\n\nI build things.');
    expect(profileIntro('# Only an introduction')).toBe('# Only an introduction');
  });

  it('renders markdown content after a successful fetch', async () => {
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    expect(screen.getByTestId('markdown')).toHaveTextContent('Hello World');
    expect(screen.getByRole('region', { name: 'Profile' })).toBeInTheDocument();
  });

  it('falls back to master branch when main branch 404s', async () => {
    axiosMock
      .onGet(/\/main\/README\.md/)
      .reply(404)
      .onGet(/\/master\/README\.md/)
      .reply(200, '# Master branch');

    render(<Homepage />);
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    expect(screen.getByTestId('markdown')).toHaveTextContent('Master branch');
  });

  it('redirects to /404 when both main and master branches fail', async () => {
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(404);
    render(<Homepage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/404'));
  });

  it('shows the preview banner when githubProfile query param is set', async () => {
    mockQuery = { githubProfile: 'testuser' };
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    // Banner is rendered at top and bottom of the page — at least one must exist
    expect(screen.getAllByText(/PREVIEW MODE/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/testuser/).length).toBeGreaterThanOrEqual(1);
  });

  it('does not show preview banner without githubProfile query param', async () => {
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    expect(screen.queryByText(/PREVIEW MODE/)).not.toBeInTheDocument();
  });

  describe('img component', () => {
    let ImgComponent: React.FC<{ src?: string; alt?: string }>;

    beforeEach(async () => {
      axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
      render(<Homepage />);
      await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
      ImgComponent = capturedComponents!.img as React.FC<{ src?: string; alt?: string }>;
    });

    it('passes the custom img component to Markdown', () => {
      expect(capturedComponents?.img).toBeDefined();
    });

    it('decodes literal &amp; entities in badge image src URLs', () => {
      const urlWithAmpEntities = 'https://img.shields.io/badge/python%20-%2314354C.svg?&amp;style=for-the-badge&amp;logo=python&amp;logoColor=white';
      const expectedUrl = 'https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white';

      const { container } = render(<ImgComponent src={urlWithAmpEntities} alt="python" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(expectedUrl);
    });

    it('strips a trailing %22 (URL-encoded double quote) from badge image src URLs', () => {
      const urlWithTrailingQuote = 'https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white%22';
      const expectedUrl = 'https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white';

      const { container } = render(<ImgComponent src={urlWithTrailingQuote} alt="python" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(expectedUrl);
    });

    it('handles a URL with both &amp; entities and a trailing %22', () => {
      const combined = 'https://img.shields.io/badge/python%20-%2314354C.svg?&amp;style=for-the-badge&amp;logo=python&amp;logoColor=white%22';
      const expectedUrl = 'https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white';

      const { container } = render(<ImgComponent src={combined} alt="python" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(expectedUrl);
    });

    it('does not modify clean image src URLs', () => {
      const cleanUrl = 'https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white';

      const { container } = render(<ImgComponent src={cleanUrl} alt="python" />);
      expect(container.querySelector('img')?.getAttribute('src')).toBe(cleanUrl);
    });
  });
});
