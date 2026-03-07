import React from 'react';
import { render, screen } from '@testing-library/react';

import NavBar from '../../components/NavBar';

describe('NavBar', () => {
  it('renders all social links', () => {
    render(<NavBar />);
    expect(screen.getByAltText('Github')).toBeInTheDocument();
    expect(screen.getByAltText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByAltText('Email')).toBeInTheDocument();
    expect(screen.getByAltText('Phone')).toBeInTheDocument();
  });

  it('renders a footer element', () => {
    render(<NavBar />);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });

  it('links have correct href attributes', () => {
    render(<NavBar />);
    expect(screen.getByAltText('LinkedIn').closest('a')).toHaveAttribute(
      'href',
      'https://linkedin.com/in/scott-adams-a3b070192',
    );
    expect(screen.getByAltText('Email').closest('a')).toHaveAttribute(
      'href',
      'mailto:sra405@protonmail.com',
    );
    expect(screen.getByAltText('Phone').closest('a')).toHaveAttribute(
      'href',
      'tel:+447840579704',
    );
  });

  it('applies additional className when provided', () => {
    render(<NavBar className="test-class" />);
    const footer = document.querySelector('footer');
    expect(footer).toHaveClass('test-class');
  });
});
