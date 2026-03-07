import React from 'react';
import { render } from '@testing-library/react';

import Pico8 from '../../../components/sandbox/Pico8';

describe('Pico8', () => {
  it('renders an iframe', () => {
    render(<Pico8 />);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
  });

  it('iframe has the correct title', () => {
    render(<Pico8 />);
    expect(document.querySelector('iframe')).toHaveAttribute('title', 'pico8');
  });

  it('iframe points to the pico8 game URL', () => {
    render(<Pico8 />);
    expect(document.querySelector('iframe')).toHaveAttribute(
      'src',
      'https://adamsuk.github.io/pico8-platformer',
    );
  });
});
