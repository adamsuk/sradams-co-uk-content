import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Quiz from '../../../components/sandbox/quiz';

const mockSetSandbox = jest.fn();

describe('Quiz', () => {
  beforeEach(() => {
    mockSetSandbox.mockClear();
  });

  it('renders without crashing with no props', () => {
    render(<Quiz />);
    // The first question (name) should be rendered
    expect(screen.getByText('First Name')).toBeInTheDocument();
  });

  it('renders the first question by default', () => {
    render(<Quiz />);
    expect(screen.getByText('First Name')).toBeInTheDocument();
  });

  it('renders the Next button', () => {
    render(<Quiz />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls setSandbox when input changes', () => {
    render(<Quiz sandbox={{}} setSandbox={mockSetSandbox} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'TestValue' } });
    expect(mockSetSandbox).toHaveBeenCalledWith({ name: 'TestValue' });
  });

  it('renders a specific question when nextQuestion prop is provided', () => {
    render(<Quiz nextQuestion="address" />);
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('displays INPUT and OUTPUT debug pre blocks', () => {
    render(<Quiz sandbox={{ name: 'test' }} />);
    expect(screen.getByText(/INPUT:/)).toBeInTheDocument();
    expect(screen.getByText(/OUTPUT:/)).toBeInTheDocument();
  });
});
