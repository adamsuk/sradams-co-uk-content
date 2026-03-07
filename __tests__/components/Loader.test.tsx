import React from 'react';
import { render, screen } from '@testing-library/react';

import Loader from '../../components/Loader';

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

jest.mock('react-spinners', () => ({
  PacmanLoader: ({ color }: { color?: string }) => (
    <div data-testid="pacman-loader" data-color={color} />
  ),
}));

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    expect(screen.getByTestId('pacman-loader')).toBeInTheDocument();
  });

  it('wraps loader in a centred flex container', () => {
    const { container } = render(<Loader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('passes black color when theme is light', () => {
    render(<Loader />);
    expect(screen.getByTestId('pacman-loader')).toHaveAttribute('data-color', 'black');
  });
});
