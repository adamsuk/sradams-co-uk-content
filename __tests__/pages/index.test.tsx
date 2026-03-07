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

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

const axiosMock = new AxiosMockAdapter(axios);
const README_CONTENT = '# Hello World\n\nThis is a test README.';

describe('Homepage', () => {
  beforeEach(() => {
    axiosMock.reset();
    mockPush.mockClear();
    mockQuery = {};
    mockIsReady = true;
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
});
