import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Header from '../../components/Header';

const mockSetTheme = jest.fn();
let mockTheme = 'light';

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: mockTheme, setTheme: mockSetTheme }),
}));

jest.mock('@headlessui/react', () => ({
  Menu: Object.assign(
    ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
    {
      Button: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
    },
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = 'light';
  });

  it('renders the site name', () => {
    render(<Header />);
    expect(screen.getAllByText('Scott Adams').length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Sandbox')).toBeInTheDocument();
    expect(screen.getByText('CV')).toBeInTheDocument();
  });

  it('nav links point to correct URLs', () => {
    render(<Header />);
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
    expect(screen.getByText('Sandbox').closest('a')).toHaveAttribute('href', '/sandbox');
    expect(screen.getByText('CV').closest('a')).toHaveAttribute('href', '/cv');
  });

  it('renders a dark mode toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
  });

  it('calls setTheme with "dark" when toggling from light', () => {
    render(<Header />);
    const toggleBtn = screen.getByRole('button', { name: /toggle dark mode/i });
    fireEvent.click(toggleBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "light" when toggling from dark', () => {
    mockTheme = 'dark';
    render(<Header />);
    const toggleBtn = screen.getByRole('button', { name: /toggle dark mode/i });
    fireEvent.click(toggleBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('reads theme from localStorage on mount and applies it', () => {
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => 'dark'), setItem: jest.fn() },
      writable: true,
    });
    render(<Header />);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('defaults to light theme when localStorage has no saved theme', () => {
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => null), setItem: jest.fn() },
      writable: true,
    });
    render(<Header />);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
