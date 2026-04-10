import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';

import Sandbox from '../../pages/sandbox';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

const mockPush = jest.fn();
let mockQuery: Record<string, string> = {};

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
    pathname: '/sandbox',
    isReady: true,
  }),
}));

jest.mock('react-icons/vsc', () => ({
  VscClose: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="close-btn" onClick={onClick}>
      Close
    </button>
  ),
  VscChevronRight: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="open-btn-lg" onClick={onClick}>
      Open
    </button>
  ),
  VscChevronDown: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="open-btn-sm" onClick={onClick}>
      Open
    </button>
  ),
}));

describe('Sandbox page', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockQuery = {};
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 768,
    });
    mockAxios.get.mockResolvedValue({ data: [] });
  });

  it('renders without crashing', () => {
    render(<Sandbox />);
    expect(screen.getByText(/Under Construction/)).toBeInTheDocument();
  });

  it('renders sandbox items in the sidebar', () => {
    render(<Sandbox />);
    expect(screen.getByText('Pico8 Game')).toBeInTheDocument();
    expect(screen.getByText('Dynamic Quiz')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('renders the first sandbox item (Pico8) by default', () => {
    render(<Sandbox />);
    expect(document.querySelector('iframe')).toBeInTheDocument();
  });

  it('navigates to the correct sandbox when component query param is set', () => {
    mockQuery = { component: 'calculator' };
    render(<Sandbox />);
    // Calculator renders digit buttons
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
  });

  it('calls router.push with the slug when a sidebar item is clicked', () => {
    render(<Sandbox />);
    // Click "Calculator" in the sidebar to trigger changeRouting
    fireEvent.click(screen.getByText('Calculator'));
    expect(mockPush).toHaveBeenCalledWith(
      '/sandbox/?component=calculator',
      undefined,
      { shallow: true },
    );
  });
});
