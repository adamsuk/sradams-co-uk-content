import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import FormText from '../../../components/sandbox/quiz/FormText';

const defaultProps = {
  questionProps: { inputName: 'name', title: 'What is your name?' },
  renderNextQuestion: jest.fn(),
  output: {},
  setOutput: jest.fn(),
};

describe('FormText', () => {
  beforeEach(() => {
    defaultProps.renderNextQuestion.mockClear();
    (defaultProps.setOutput as jest.Mock).mockClear();
  });

  it('renders the question title', () => {
    render(<FormText {...defaultProps} />);
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
  });

  it('renders a text input', () => {
    render(<FormText {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a Next button', () => {
    render(<FormText {...defaultProps} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls setOutput with the entered value when input changes', () => {
    render(<FormText {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(defaultProps.setOutput).toHaveBeenCalledWith({ name: 'Alice' });
  });

  it('calls renderNextQuestion when Next is clicked', () => {
    render(<FormText {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(defaultProps.renderNextQuestion).toHaveBeenCalledTimes(1);
  });

  it('does not call setOutput when setOutput is not provided', () => {
    const props = { ...defaultProps, setOutput: null };
    render(<FormText {...props} />);
    const input = screen.getByRole('textbox');
    // Should not throw
    fireEvent.change(input, { target: { value: 'Bob' } });
  });
});
