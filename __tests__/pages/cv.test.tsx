import React from 'react';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import Cv from '../../pages/cv';

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

jest.mock('react-icons/bs', () => ({
  BsPrinterFill: ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} data-testid="print-btn">Print</button>
  ),
  BsChevronDown: () => <span data-testid="chevron-down" />,
  BsChevronUp: () => <span data-testid="chevron-up" />,
}));

const axiosMock = new AxiosMockAdapter(axios);

const mockCvData = [
  {
    name: 'cv.md',
    meta: { title: 'Scott Adams – CV' },
    content: '',
  },
  {
    name: 'tldr.md',
    meta: { title: 'TL;DR' },
    content: 'Senior engineer with 10+ years experience.',
  },
  {
    name: 'profile.md',
    meta: { title: 'Personal Profile' },
    content: 'I am a passionate developer.',
  },
  {
    name: 'experience.md',
    meta: { title: 'Experience', collapsable: true, level: 1 },
    content: 'Work experience here.',
  },
  {
    name: 'skills.md',
    meta: { title: 'Skills', collapsable: false, level: 2 },
    content: 'TypeScript, React, Node.js',
  },
];

describe('Cv', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('shows a loader while data is being fetched', () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    render(<Cv />);
    expect(screen.getByTestId('pacman-loader')).toBeInTheDocument();
  });

  it('renders CV sections after a successful fetch', async () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    render(<Cv />);
    await waitFor(() => expect(screen.getByText('Experience')).toBeInTheDocument());
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('renders the page title from meta', async () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    render(<Cv />);
    await waitFor(() => expect(screen.getByText('Scott Adams – CV')).toBeInTheDocument());
  });

  it('renders TL;DR content', async () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    render(<Cv />);
    // CvSection renders content twice (screen + print), so use getAllByText
    await waitFor(() => {
      expect(screen.getAllByText(/Senior engineer/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows a print button', async () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    render(<Cv />);
    await waitFor(() => expect(screen.getByTestId('print-btn')).toBeInTheDocument());
  });

  it('calls window.print when print button is clicked', async () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    window.print = jest.fn();
    render(<Cv />);
    await waitFor(() => expect(screen.getByTestId('print-btn')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('print-btn'));
    expect(window.print).toHaveBeenCalled();
  });

  it('collapses a collapsable section when its title is clicked', async () => {
    axiosMock.onGet(/\/cv/).reply(200, mockCvData);
    render(<Cv />);
    await waitFor(() => expect(screen.getByText('Experience')).toBeInTheDocument());
    // Initially collapsable=true means it starts collapsed; clicking toggles it open
    const experienceTitle = screen.getByText('Experience');
    fireEvent.click(experienceTitle);
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
  });
});
