import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Header from '../../components/Header';

const mockSetTheme = jest.fn();
let mockTheme = 'light';
let mockPathname = '/';

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    resolvedTheme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: mockPathname }),
}));

describe('Header', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = 'light';
    mockPathname = '/';
  });

  it('renders a single home link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Scott Adams' })).toHaveAttribute('href', '/');
    expect(screen.queryByText('SA')).not.toBeInTheDocument();
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

  it('marks the current page', () => {
    mockPathname = '/blog/[slug]';
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'CV' })).not.toHaveAttribute('aria-current');
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

  it('does not set the theme itself on mount', () => {
    render(<Header />);
    expect(mockSetTheme).not.toHaveBeenCalled();
  });
});
