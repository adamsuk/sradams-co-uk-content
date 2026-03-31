import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import Homepage from '../../pages/index';

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
    mockPush.mockClear();
    mockQuery = {};
    mockIsReady = true;
    capturedComponents = undefined;
  });

  it('shows a loader while content is not yet ready', () => {
    axiosMock.onGet().reply(200, README_CONTENT);
    render(<Homepage />);
    expect(screen.getByTestId('pacman-loader')).toBeInTheDocument();
  });

  it('renders markdown content after a successful fetch', async () => {
    axiosMock.onGet(/raw\.githubusercontent\.com/).reply(200, README_CONTENT);
    render(<Homepage />);
    await waitFor(() => expect(screen.getByTestId('markdown')).toBeInTheDocument());
    expect(screen.getByTestId('markdown')).toHaveTextContent('Hello World');
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
