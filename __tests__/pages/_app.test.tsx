import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { initSentry } from '../../helpers/initSentry';

jest.mock('../../helpers/initSentry', () => ({
  initSentry: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '/',
    query: {},
    asPath: '/',
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    push: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

jest.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <header>header</header>,
}));

jest.mock('../../components/NavBar', () => ({
  __esModule: true,
  default: () => <nav>navbar</nav>,
}));

jest.mock('../../components/ScrollArea', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

// Import after mocks so the module-scope initSentry() call is the mock.
// eslint-disable-next-line import/first
import MyApp from '../../pages/_app';

describe('MyApp', () => {
  it('initialises Sentry when the app module loads', () => {
    expect(initSentry).toHaveBeenCalled();
  });

  it('renders the application shell around the page', () => {
    render(
      <MyApp
        Component={() => <div>page body</div>}
        pageProps={{}}
        router={{} as never}
      />,
    );
    expect(screen.getByText('page body')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('navbar')).toBeInTheDocument();
  });
});

function RoutedPage({ crash }: { crash: boolean }) {
  if (crash) throw new Error('page crashed');
  return <div>healthy page</div>;
}

describe('route error recovery', () => {
  it('renders a healthy route after a page throws without remounting the app', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalRouter = useRouter();
    const router = { ...originalRouter, pathname: '/posts/[slug]', asPath: '/posts/broken' };
    jest.mocked(useRouter).mockReturnValue(router);

    try {
      const { rerender } = render(
        <MyApp Component={RoutedPage} pageProps={{ crash: true }} router={{} as never} />,
      );
      const header = screen.getByText('header');
      expect(
        screen.getByText(/Application error: a client-side exception has occurred/i),
      ).toBeInTheDocument();

      // Next updates the route and page props in the existing app on navigation.
      jest.mocked(useRouter).mockReturnValue({ ...router, asPath: '/posts/healthy' });
      rerender(
        <MyApp Component={RoutedPage} pageProps={{ crash: false }} router={{} as never} />,
      );

      expect(screen.getByText('healthy page')).toBeInTheDocument();
      expect(
        screen.queryByText(/Application error: a client-side exception has occurred/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText('header')).toBe(header);
    } finally {
      consoleError.mockRestore();
      jest.mocked(useRouter).mockReturnValue(originalRouter);
    }
  });
});
