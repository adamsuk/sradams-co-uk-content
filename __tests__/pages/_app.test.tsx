import React from 'react';
import { render, screen } from '@testing-library/react';
import { initSentry } from '../../helpers/initSentry';

jest.mock('../../helpers/initSentry', () => ({
  initSentry: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    query: {},
    asPath: '/',
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
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
