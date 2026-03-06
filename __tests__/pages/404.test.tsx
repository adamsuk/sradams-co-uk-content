import React from 'react';
import { render, screen } from '@testing-library/react';

import Custom404 from '../../pages/404';

describe('Custom404', () => {
  it('renders without crashing', () => {
    render(<Custom404 />);
    expect(screen.getByText(/Uh oh/)).toBeInTheDocument();
  });

  it('shows an error message about missing pages', () => {
    render(<Custom404 />);
    expect(screen.getByText(/no page here/i)).toBeInTheDocument();
  });

  it('applies additional className when provided', () => {
    const { container } = render(<Custom404 className="extra-class" />);
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
